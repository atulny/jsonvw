function json_formatter(options) {

        // Private Fields
        var _defaultOptions = {
            tab: '  ',
            quoteKeys: true,
            collapsible: true,
            hideOriginal: true
        };
        var _settings;
        var _dateObj = new Date();
        var _regexpObj = new RegExp();

        // Private Functions
        var _getRow = function (indent, data, isPropertyContent) {
            var tabs = "";
            for (var i = 0; i < indent && !isPropertyContent; i++) tabs += _settings.tab;
            if (data != null && data.length > 0 && data.charAt(data.length - 1) != "\n")
                data = data + "\n";
            return tabs + data;
        };
        var _formatFunction = function (indent, obj) {
            var tabs = "";
            for (var i = 0; i < indent; i++) tabs += _settings.tab;
            var funcStrArray = obj.toString().split("\n");
            var str = "";
            for (var i = 0; i < funcStrArray.length; i++) {
                str += ((i == 0) ? "" : tabs) + funcStrArray[i] + "\n";
            }
            return str;
        };
        var _formatLiteral = function (literal, quote, comma, indent, isArray, style) {
            if (typeof literal == 'string')
                literal = literal.split("<").join("&lt;").split(">").join("&gt;");
            var str = "<span class='" + style + "'>" + quote + literal + quote + comma + "</span>";
            if (isArray) str = _getRow(indent, str);
            return str;
        };
        var _processObject = function (obj, indent, addComma, isArray, isPropertyContent) {
            var html = "";
            var comma = (addComma) ? "<span class='jsonFormatter-coma'>,</span> " : "";
            var type = typeof obj;
            var clpsHtml = "";
            if ($.isArray(obj)) {
                if (obj.length == 0) {
                    html += _getRow(indent, "<span class='jsonFormatter-arrayBrace'>[ ]</span>" + comma, isPropertyContent);
                } else {
                    clpsHtml = _settings.collapsible ? "<span class='jsonFormatter-expander jsonFormatter-expanded'></span><span class='jsonFormatter-collapsible'>" : "";
                    html += _getRow(indent, "<span class='jsonFormatter-arrayBrace'>[</span>" + clpsHtml, isPropertyContent);
                    for (var i = 0; i < obj.length; i++) {
                        html += _processObject(obj[i], indent + 1, i < (obj.length - 1), true, false);
                    }
                    clpsHtml = _settings.collapsible ? "</span>" : "";
                    html += _getRow(indent, clpsHtml + "<span class='jsonFormatter-arrayBrace'>]</span>" + comma);
                }
            } else if (type == 'object') {
                if (obj == null) {
                    html += _formatLiteral("null", "", comma, indent, isArray, "jsonFormatter-null");
                } else if (obj.constructor == _dateObj.constructor) {
                    html += _formatLiteral("new Date(" + obj.getTime() + ") /*" + obj.toLocaleString() + "*/", "", comma, indent, isArray, "Date");
                } else if (obj.constructor == _regexpObj.constructor) {
                    html += _formatLiteral("new RegExp(" + obj + ")", "", comma, indent, isArray, "RegExp");
                } else {
                    var numProps = 0;
                    for (var prop in obj) numProps++;
                    if (numProps == 0) {
                        html += _getRow(indent, "<span class='jsonFormatter-objectBrace'>{ }</span>" + comma, isPropertyContent);
                    } else {
                        clpsHtml = _settings.collapsible ? "<span class='jsonFormatter-expander jsonFormatter-expanded'></span><span class='jsonFormatter-collapsible'>" : "";
                        html += _getRow(indent, "<span class='jsonFormatter-objectBrace'>{</span>" + clpsHtml, isPropertyContent);
                        var j = 0;
                        for (var prop in obj) {
                            var quote = _settings.quoteKeys ? "\"" : "";
                            html += _getRow(indent + 1, "<span class='jsonFormatter-propertyName'>" + quote + prop + quote + "</span>: " + _processObject(obj[prop], indent + 1, ++j < numProps, false, true));
                        }
                        clpsHtml = _settings.collapsible ? "</span>" : "";
                        html += _getRow(indent, clpsHtml + "<span class='jsonFormatter-objectBrace'>}</span>" + comma);
                    }
                }
            } else if (type == 'number') {
                html += _formatLiteral(obj, "", comma, indent, isArray, "jsonFormatter-number");
            } else if (type == 'boolean') {
                html += _formatLiteral(obj, "", comma, indent, isArray, "jsonFormatter-boolean");
            } else if (type == 'function') {
                if (obj.constructor == _regexpObj.constructor) {
                    html += _formatLiteral("new RegExp(" + obj + ")", "", comma, indent, isArray, "RegExp");
                } else {
                    obj = _formatFunction(indent, obj);
                    html += _formatLiteral(obj, "", comma, indent, isArray, "jsonFormatter-function");
                }
            } else if (type == 'undefined') {
                html += _formatLiteral("undefined", "", comma, indent, isArray, "jsonFormatter-null");
            } else {
                html += _formatLiteral(obj.toString().split("\\").join("\\\\").split('"').join('\\"'), "\"", comma, indent, isArray, "jsonFormatter-string");
            }
            return html;
        };
        var _formatElement = function (json) {
            if(!json){return ""}
         var obj={}
            if (typeof(json)=="object"){
               obj=json
            } else{
                json=json+""

                if (json.trim() == "") json = "\"\"";
                try {
                    obj = eval("[" + json + "]")[0];
                }
                catch (exception) {
                    // Do not format if it is not valid JSON.
                    return "";
                }
            }

            html = _processObject(obj, 0, false, false, false);

            return html
        };
        var _expandImageClicked = function (event) {
            var container = $(this).next();
            if (container.length < 1) return;
            if ($(this).hasClass('jsonFormatter-expanded') == true) {
                container.hide();
                $(this).removeClass('jsonFormatter-expanded').addClass('jsonFormatter-collapsed');
            } else {
                container.show();
                $(this).removeClass('jsonFormatter-collapsed').addClass('jsonFormatter-expanded');
            }
        };
        var _settings = $.extend(_defaultOptions, options||{});

        //--------------------------------------------------------------------------
        function format_json(json,element){


           var html=_formatElement(json);
           html=html?("<PRE class='jsonFormatter-codeContainer'>" + html + "</PRE>"):""
           if (element){
               var original = $(element).wrapInner("<div class='jsonFormatter-original'></div>");

                if (_settings.hideOriginal === true) {
                    $(".jsonFormatter-original", original).hide();
                }
                original.append(html);
          }
          return html
        }
        //            $(element).on('click', '.jsonFormatter-expander', _expandImageClicked};

        return {format:format_json, onToggle:_expandImageClicked}

  }
        // Determine options to use.

if (typeof(_global) == "undefined"){
  window._global=_global={}
}


function init(){

  document.querySelector(".entity-db-list").addEventListener("click",show_entity)
  $(".popup_vals").addClass("popup_hide")
}
function CX(targettable,targetheader,make_table,meta){
    this.targettable=targettable
    this.targetheader=targetheader
    this.make_table=make_table
    this.current={}
    this.meta=meta||{}
}
Object.defineProperty(CX.prototype,"fields",{get:function(){return this.current.fields}})
Object.defineProperty(CX.prototype,"rows",{get:function(){return this.current.rows}})
Object.defineProperty(CX.prototype,"db",{get:function(){return this.current.db}})
Object.defineProperty(CX.prototype,"table",{get:function(){return this.current.table}})

CX.prototype.reset=function(db,table, fields,rows){
  this.current={db:db,table:table,rows:rows||[], fields:fields||[]}
  return this
}
CX.prototype._defaultRenderer=function(_data ){
  let headers=[]
  for (let f of _data.fields){
     headers.push("<th data-name='"+f.field+"'>"+ f.title+"</th>")
    }
  let data=[]
  let rno=0
  for (let r of _data.rows){
      rno++;
      let rdata=[]

       for (let f of _data.fields){
           rdata.push("<td data-name='"+f.field+"'>"+ r[f.field]+"</td>")
       }
     data.push("<tr data-row='"+rno+"'>"+ (rdata.join(""))+"</te>")
    }

    let content= "<table class='table thead-dark table-striped table-bordered table-sm'><thead><tr>"+ (headers.join(""))+"</tr></thead><tbody>"+(data.join(""))+"</tbody></table>"
    $(_data.targettable).html(content)


}

CX.prototype.renderTable=function( ){
  var mkr=this.make_table||this._defaultRenderer
  mkr(this)
}
CX.prototype.renderHeader=function( ){
hdr="<div class='table-caption'>"+ "<span class='db-name'>"+this.current.db+"</span>:<span class='table-name'>"+this.current.table+"</span></div>"
  //$(".container-data").html(alldata)
  $(this.targetheader).html(hdr)
}
CX.prototype.render=function(rows){
  if (rows){
    this.current.rows=rows
  }
  this.renderTable()
  this.renderHeader()
}
CX.prototype.setMeta=function(k,v){
    this.meta[k]=v
    return this
}
CX.prototype.getMeta=function(k,v){
    return this.meta[k]
}


function show_entity(ev){
  var target=ev.target
   if (!target.classList.contains("entity")){
      target=target.parentElement
   }
   if (target.classList.contains("entity") && target.dataset.entity){
      nav_entity(target.dataset.db,target.dataset.entity)
   }

}
function nav_entity(db,entity){
  window.socket_.emit('entityresult', {data: {db:db,entity:entity}});

}

var getformatter=function(){
//onRendered(function(){
//    $(cell.getElement()).sparkline(cell.getValue(), {width:"100%", type:"bar"});
//}
//{title:"Driver", field:"driver", formatter:"tickCross", formatterPrint:printFormatter} //show "YES"/"NO" in the cell when printing
var table=null,jf=json_formatter({ quoteKeys: false})
function set_dims(el,toggler){
//jsonFormatter-codeContainer
   var ch=el.firstElementChild||{}
   var h=el.scrollHeight
   if ( ch.scrollHeight && ch.scrollHeight > h){
     h = ch.scrollHeight
   }
   var w=el.scrollWidth
   if ( ch.scrollWidth && ch.scrollWidth > w){
     w =ch.scrollWidth
   }
      el.style.height=(h+20)+"px"
      el.style.width=(w+20)+"px"
      if (toggler && !$(el).data("_expandrt")){
             $(el).on('click', '.jsonFormatter-expander',  toggler);
             $(el).data("_expandrt","fn")

      }
}
function html_handler(ev){
if (ev.target.classList.contains("cell-html") ){
   var html=$(ev.target.parentNode).data("html")
   $(".html-popup-content").html(html)
   $(".html-popup").removeClass("popup-hide")
   $(".html-popup").popup({autoopen:true,
   onclose:function(){
      $(".html-popup-content").width(200)
      $(".html-popup-content").height(160)

   },
   onopen:function() {
     setTimeout(set_dims,10,document.querySelector(".html-popup-content"))

   }})
   }
}
function json_handler(ev){
   if (ev.target.classList.contains("cell-json") ){
   var js=$(ev.target.parentNode).data("json")
   var cntn=jf.format(js )
   $(".json-popup-content").html(cntn)
   $(".json-popup").removeClass("popup-hide")
   $(".json-popup").popup({autoopen:true,
   onclose:function(){
      $(".json-popup-content").width(200)
      $(".json-popup-content").height(160)

   },
   onopen:function() {
     setTimeout(set_dims,10,document.querySelector(".json-popup-content"), jf.onToggle)

   }})
   }
     //if(table){table.redraw(true)}
}
 function date_formatter(cell, formatterParams, onRendered){
      var v=(cell && cell.getValue)?cell.getValue():cell
      if (typeof(v)=="string"){
        v=new Date(isNaN(v)?v:(+v))
      } else if (typeof(v)=="number"){
         v=new Date(v)
       }
       if (v && v.getTime){
          return v.toISOString()
       }
       return v+""
 }

 function obj_formatter(cell, formatterParams, onRendered){
      var v=(cell && cell.getValue)?cell.getValue():cell
     if(!v){return ""}
     var tp=typeof(v)
     if ((formatterParams && formatterParams.vtype=="json") ||(tp == "object" || (tp == "string" && (v[0]=="{" || v[0]=="[")))){
         if(!$(".container-data").attr("_jsonhandler")){
         document.querySelector(".container-data").addEventListener("click",json_handler)
         $(".container-data").attr("_jsonhandler","json_handler")
         }
       if (tp == "object"){v=JSON.stringify(v)}
       $(cell.getElement()).data("json",v)
       return '<span class="cell-json">{[ ]}</span>'

     }
     else if (tp=="string" && v.indexOf("data:image")==0){
       return '<img class="cell-image" src="'+ v+'" />'

     }
      else if (tp=="string" && v[0]=="<" ){
        $(cell.getElement()).data("html",v)
        if(!$(".container-data").attr("_htmlhandler")){
         document.querySelector(".container-data").addEventListener("click",html_handler)
         $(".container-data").attr("_htmlhandler","_htmlhandler")
         }

       return '<span class="cell-html">&lt;html/&gt;</span>'

     }
     return v
   }
  var o ={
  setTable:function(t){table=t},
    inspect:function(f){
        if (f.type=="object"){
         f.formatter=obj_formatter
       } else if (f.type=="date"){
          f.formatter=date_formatter
       }
   }
  }
 return o

              //$('.jsonFormatterCustom').jsonFormatter({ quoteKeys: false, collapsible: false, hideOriginal: false });
};
function make_table2_(data){
//container-data
var key=data.db+","+data.table
var bodyRect = document.body.getBoundingClientRect(),
    elemRect = document.querySelector(data.targettable).getBoundingClientRect(),
    offset   = elemRect.top - bodyRect.top;
    var ht=((window.innerHeight - offset) - 20)
    if (data.meta.tabulator && data.meta.key !=key){
        data.meta.tabulator=null
    }
    if ( data.meta.tabulator){
    data.meta.tabulator.replaceData(data.rows)
    } else{
             var makeFormatter=getformatter( )

       var opts=data.meta.opts||{}
       for (let f of data.fields){
             makeFormatter.inspect(f)
       }
       var oops={
            height:ht, // set height of table to enable virtual DOM
            data:data.rows, //load initial data into table
            layout:opts.layout||"fitDataStretch", //fit columns to width of table (optional)
            columns:data.fields,
            rowClick:opts.rowClick||function(e, id, data, row){ //trigger an alert message when the row is clicked
                console.log("Row " + id + " Clicked!!!!");
            },
             pagination:"remote", //enable remote pagination
                ajaxURL:"/datapage", //set url for ajax request
                ajaxParams:{token:"ABC123"}, //set any standard parameters to pass with the request
                paginationSize:20, //optional parameter to request a certain number of rows per page
                paginationInitialPage:1, //optional parameter to set the initial page to load
                paginationDataSent:{
                    "page":"pageNo", //change page request parameter to "pageNo"
                } ,
        }
        var table = new Tabulator(data.targettable, oops);
        makeFormatter.setTable(table)
    	data.meta.tabulator=table

    }

	data.meta.key=key
}


function make_table(db,table,rows, fields){
    if (typeof(rows)=="string"){
         rows=JSON.parse(rows)
      }
      if (typeof(fields)=="string"){
          fields=JSON.parse(fields)
      }
    if (!_global.CX){
    _global.CX=new CX(".container-data",".container-data-header",make_table2_)
    }
    _global.CX.reset(db,table, fields).render(rows)


}
function setupSocket(soc){
  window.socket_ = soc
  soc.on('directive', function(msg) {
     if (msg.directive){
       alert(msg.directive)
     }
  });
  soc.on('entitydata', function(msg) {
   make_table(msg.data.db,msg.data.entity,msg.data.rows,msg.data.fields)

      });
}
$( document ).ready(init)
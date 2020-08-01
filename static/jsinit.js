var fns={
        fmk:function(o){
            if (!o.pr){
                var mode=o.mode||(/\.css/.test(url)?"css":"js")
                o.ff=this[mode]
                o.pr=new promise( this.fn.bind(o))
            }
        return o.pr
        },
        fn:function(fn,fn2){

        this.ff(this.url,fn,fn2)
        },
        css:function(url,fn){
                    if (!$('link[href="' + url + '"]').length){
                        $('head').append('<link rel="stylesheet" type="text/css" href="' + url + '">');

                        fn()
                        }
        },
         js:function(url,fn){
                      $.getScript( url, function( data, textStatus, jqxhr ) {
                      fn(data)
                      })

         }
 };

 function then(f,ff){
        if (f && typeof(f)=="function"){
           fns.mk(this).then(f,ff);
        }
        return this
  }
  var pending={p:{},  load:function(url,cb){
                            return this.p[url]||(this.p[url]={url:url,then:then})
                        }
           }


function load(url,f){
   return pending.load(url).then(f)
}


function x(baseurl){
  this.baseurl=baseurl

}
x.prototype={
   load:function(ops){

   },



}
  /*var oo={

    }
    var ph={init:function(inst){},C:{},instutil:Object.create(Array.prototype,{"-1":{get:function(){return null},set:function(v){ this.push(v)}},
    u:(function(){ var d=[{}],pr={__d:[{i:0}],get D(){return this.__d[this.src.__i||0]},ens:function(a){a=a||this.src;
    if(a && !a.__i){
        var i=this.__d.push({})-1;
        Object.defineProperty(a,{"__i":{value:i,enumerable:false,writable:false}})
    }
    return a
    }
    get src(){return this._a||{}}
    ,m:function m(f){
    var i=(this._a||{}).__i
    if (!i && f){i=d.push({})-1;
        Object.defineProperty(this._a,{"__i":{value:i}});
        }
    return d[i||0]},
    reset:function(i){this._a=i;return this},get:function(k){return this.src[k]},set:function(k,v){this.ens();this.src[k]=v},}}
    function m(a){if(!a.__i){Object.defineProperty(a,{"__i":{value:d.push({})-1}})};return a.__i}
    return {meta: function(a){ return d[m(a)] }
    })(),
    ,set:function(i,v){i=i==-1?(this.push(v)-1):i; },p:function(){},add:function(a){this.indexOf(a)<0){this.push(a)}}}),mk:function(k){return this.C[k]||(this.C[k]=Object.create(this.tmplt,{name:{value:k,writable:false}}))},
    tmplt: {name:"",_fn:function(f,a,b){ },add:function(f){return this._fn('add',f)},remove:function(f){return this._fn('remove',f)},
    dispatch:function(a){return this._fn('dispatch',a)}}
    var cb={ init:function(p){this.},ens:function(k){return this._k?this:this.p.mk(this,k) && },reset:function(k){},
    add:function(f,k){    }}
    function callback(){

    }

    function Elwrap(el){
       this.el=el

       this._h={}
    }
}
var u={ele:[window.Element,window.Node].reduce(function(){},{chk:(function(w){var d=w.document,ff={mk:function(){},h:[function isinst(o,v){return v instanceof o},function tp(v,o){return typeof(v)==o}].reduce(function(){},{oo:{o:Object,f:function(){},get o(){return this._o[0]},
mk:function(o,t){Object.create(this,{_o:{value:[o,null,t]}})},
get func(){return this.typ=="function"},m:{nill:{j:function(v){return function(){return v}},
wra:function(){var w={C:{m:Array(100).join(",").split(",").map((it,i)=>[eval("(function i$i(f){return f($i)})")]).reduce(function(m,it,i){},
{ff:String.prototype.replace.bind("(function i$i(f,m){return f($i,m)})",/\$i/g),mk:function(i){var nu=Object.create(this.o,{
"v_":{value:[i,null]}}); this.v.push(nu);return m},fn:function(){f=this.ff(this.i);},v:[],o:{C:{},f:function(){},
s:function(o,v){if(o){o[this.i]=v};return this },
g:function(v,df){return v?v[this.i]:df},valueOf:function(){return this.i},
fa:function(a){return null},get a(){},get i(){return this,v_[i] }}})[],
_:{ky:function(v){}}}}},
get meta(){return this.v_[1]||this.C[this.ky]||this.C["_"])},
reset:function(k,ky,m){this.v_=[k,ky,m];return this},
get ky(){return this.meta.ky(this.v_)},
get value(){return this.meta.v(this.v_)},
get typ(){return this._typ||this.meta.tp(this.v_},

get ctor(){return this._ct||this.meta.ct(this.v_)},
get proto(){return this._proto||this.meta.pr(this.v_)},

}},attrgetter:function(k){var ffn=function(v,df){return v?v[k]:df},return f?function(v){return v}},k:function(v){return v},e:}}},toString:function(){return this.value.name||this.value.toString()},get name(){return this.toString()},get native(){return this.func && }
_o:[Object,
function(v){v._o[2]||typeof(v.value)},function(v){return v._o[3]||typeof(v.value)},;}],fn:function(v){}},tp(){},mk:function(f){return Object.create(this,{fn:{value:f}});return this},f:function(o,v){return this.fn(o,v)}})}},;return function(v,m){})(window);[function(e){return e},function(e){return e},function(e){return d.querySelector(e)},function(f){}],mk:function(it,i){Object.defineProperties(this.o,it.name,{ctor:it,get:function(){}})},o:{get name(){return this._c[0].name},get ctor(){return this._c[0]},isinstance:function(v){init:function(it,i){return Object.create(this,"_ctor",{value:[it,i,it.name]})}}}),wrapel:function(el,m){var inst=this.ele.map((it,i)=>[el instanceof it,i]),c=el ? el.constructor:{};return {el:el,ctor:c.name,ele:this.ele[0]t:typeof(el)}},findel:function(inst){
if (inst._el){

}
}
Elwrap.prototype={
   reset:function( k){
      return this._k=k
   }
   function findel(k){
      if (k==null){
        if (this._par){
        return this._par.findel(this._el)
        }
      }
   },
   addClass:function(){},
   hide:function(){},
   get el(){ this.findel(null) },
   get form(){return this._form},
   get $(){
      return $(this.el)
   },


   onchange:function(ev){

   }
}
    function formwrap(el){


    }
    function get(k){

      return
    },
    formwrap.prototype=new Elwrap(){


    }
    function mk(w,ctor){
       var wr=null,d=w.document;
        function sg(k){
          return {get:function(){return this.get(k)}}

        }
        return function(s){
           if (!d){
              d=w.document
           }
           if (typeof(s)=="string"){
             if (/^[\.\#]/.test(s)){
               el=d.querySelector(s)
             } else{
                el=d.getElementById(s)
             }
           }
           if (!(el && (el.elements || (el.constructor && el.constructor.name=="HTMLFormElement") )){
               el=d.forms[0]

           }
           if(el && (el.elements || (el.constructor && el.constructor.name=="HTMLFormElement")){
              var props={}

              for (let el of el.elements){

              }

           wr=new ctor(el)

           }

        }

    }
    formwrap.get=mk(window,formwrap)
*/

    var handlers={

      formsubmit:function(ev,el){

      },
      inspectdata:function(ev,el){

      },
      resetsel:function(el,f){
            if(!(el && el.classList)){return el}
            el.classList.remove("sel-0")
            el.classList.remove("sel-1")
            if (f!=null){
                el.classList.add("sel-"+(f?1:0))
            }
            return el

      },

     toggleFormOptions:function(ev,el){
            var form=document.querySelector("form")
            var dd={txtels:[]}

            for (let el of form.elements){
              if (el.name=='contenttype'){dd.contenttyp=el.value}
              if (el.name=='typtxt'){dd.typtxt=el.checked}
              if (el.name=='delimiter'){dd.delim=el}
              if (el.classList.contains('txtels')){
                 dd.txtels.push(el.parentNode)
              }
            }

            for (let el of dd.txtels){
                    this.resetsel(el,dd.typtxt)
            }

            if (dd.delim ){
                 this.resetsel(dd.delim.parentNode,dd.contenttyp=='other')
             }
        },
       syncTable:function(){
        var dt=document.querySelector("#data_result table"),
          reppx=/px/
         if (dt){
                    dt.setAttribute("id","data_result_table");
$(document).ready(function(){
          $("#data_result_table").kendoGrid({
            sortable: true,
            filterable: true,
            resizable:true
          });
        });
                   //var grid = $("#data_result_table").data("kendoGrid");

           /*
           dt.setAttribute("id","data_result_table");
            //set column width
            var widths0=[].map.call(dt.querySelectorAll("tbody tr:nth-child(1) td"),(el)=> (+(window.getComputedStyle(el).width.replace(reppx,"")))||0 )
            var widths=[].map.call(dt.tHead.querySelectorAll("th"),(el)=> (+(window.getComputedStyle(el).width.replace(reppx,"")))||0 )

            widths.forEach(function(w,i){
              if (w < widths0[i]){
               w=widths0[i]

              }
               for (let el of dt.querySelectorAll("th:nth-child("+(i+1)+"),td:nth-child("+(i+1)+")")){
                 el.style.minWidth=el.style.width=w+"px"
               }
            });

            dt.classList.add("tableContainer")
            dt.tBodies[0].classList.add("scrollContent")
            dt.tHead.classList.add("fixedHeader")
*/
         }

       }


    }
    function  inspectdata(ev,el){

    }
    function toggle(ev,t){

    }
    setTimeout(function(){
          handlers.syncTable()

         //window.tablemodel = new Tabulator("#data_result_table", {});
         try{
                var el=document.getElementById("data_meta")
                var meta =  JSON.parse(el.innerText.trim())
                el.innerHTML=""
                el.appendChild(renderjson( meta ));
         }catch(e){}

        },1 );
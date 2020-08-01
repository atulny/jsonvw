from quickjs import Function

jsn = """
function inspect(v){
  var t=[v==null?'nill':typeof(v),"primitive"]
  if (t[0]=='object'){
     t[1]=Array.isArray(v)?"array":"object"
  }


}
"""
js = """
function ISODate(v){
  return v
}
function ObjectId(v){
  return v
}
var None=null
var commacleanup=new RegExp(/^\/\*\s*\d+\s*\*\//g)
function parse(data){
    var res={value:data,t:data==null?"nill":typeof(data),error:null}
    res.json=res.t
   if (!data){return res}
    if(res.t=="string"){
    res.value=res.value.trim()
    try{
        res.v=JSON.parse(res.value)

    }catch(  e){
        try{
            var x=null
            //var val=res.value.replace(commacleanup,",")
            eval('x = [ '+res.value+' ]')
            if(x){
                res.v=x[0]
            }
        } catch(  e){ 
          res.error=e.toString()
        }
    }
    if (res.v){
        res.t=typeof(res.v)
        res.json=Array.isArray(res.v)?"array":"object"
    }
   }
     return res
}
"""


jsonparse = Function('parse', js )




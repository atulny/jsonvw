import inspect
import json
import mimetypes
from collections import namedtuple
from quickjs import Function
from werkzeug._compat import string_types
from werkzeug.datastructures import MultiDict, FileStorage

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
 
function parse(data){
    var res={value:data,t:data==null?"nill":typeof(data)}
    res.json=res.t
   if (!data){return res}
    if(res.t=="string"){
    res.value=res.value.trim()
    try{
        res.v=JSON.parse(res.value)
        
    }catch(  e){
        try{
            var x=null
            eval('x = [ '+res.value+' ]')
            if(x){
                res.v=x[0]
            }
        } catch(  e){ }
    }
    if (res.v){
        res.t=typeof(res.v)
        res.json=Array.isArray(res.v)?"array":"object"
    }
   }
     return res
}
"""


class atdict(dict):
    __slots__=()
    meta_=dict()
    _meta_=None
    def __getattr__(self, item):
        return self.g_(item)

    def get(self, item, df=None):
        return self.g_(item, df)

    def g_(self,item,df=None,f=dict.get):
        return f(self,item,df) if  item in self else self.meta.get(item,df)

    def inv(self,f):
        if type(f) is str:
            f=self.get(f)
        if callable(f):
            return f(self)

    @property
    def meta(self):
        return  self._meta_ or self.meta_
    @classmethod
    def mk(cls,meta=None):
        if meta is None:
            return cls
        return type('',(cls,),{"_meta_":meta})

class vprx():
    __slots__=("v_")
    def __init__(self, v=None,k="",df=namedtuple("","t m c")(type(None),{},{})):
        self.v_=[None,"",df]
        self.reset(v=v,k=k)

    def g(self,k=None):
        V = self.v_
        k = V[1]
        v = V[0]
        if k and v is not None:
            f = V[2].m.get(k)
            if not f:
                f = getattr(V[2].t, k)

    def __call__(self,*args,**kwargs):
        f=self.get_a(self.v_)
        if callable(f):
            return f(*args,**kwargs)


    def reset(self, **kwargs):
        v=kwargs.get("value",kwargs.get("v"))
        vv=self.v_
        if v is not None and v is not vv[0]:
            t = type(v)
            vv[0]=v
            tp=vv[2]
            if t is not tp.t:
                vv[1]=""
                tt=tp.c.get(t)
                if tt is None:
                    tp.c[t]=tt=tp._replace(t=t,m={})
                vv[2]=tt

        k = kwargs.get("k", kwargs.get("ky"))
        if k is not None and k is not vv[1]:
            vv[1]=k
        return self

    @property
    def typ(self):
        return self.v_[2].t

    @property
    def ky(self):
        return self.v_[1]
    @classmethod
    def get_a(cls,V):
        k = V[1]
        v = V[0]
        if k and v is not None:
            v = V[2].m.get(k)
            if  v is None:
                v = getattr(V[2].t, k)
        return v

    def __call__(self,*args,**kwargs):

    def __getattr__(self, item):
        return self.get(item)
    def __getitem__(self, item):
        return self.get(item)
    def __setattr__(self, item,v):
          self.set(item,v)
    def __setitem__(self, item,v):
        self.set(item, v)

class wrap():
    def __init__(self,v=None):
        self.v_ = {"origvalue": v}

    def reset(self,v):
        self.v_={"origvalue":v,"typ":type(v)}
        return self
    def __getattr__(self, item):
        return self.get(item)
    def __getitem__(self, item):
        return self.get(item)
    def __setattr__(self, item,v):
          self.set(item,v)
    def __setitem__(self, item,v):
        self.set(item, v)
    def res(self,v,json=None):
        self.set("value",v)
        self.set('typ',type(v))
        self.set('json',json)
        return self

    @property
    def resolved(self):
        return "value" in self.meta

    @property
    def meta(self):return self.v_
    @property
    def val(self,kk=("value","origvalue")):
        return  self.get(kk)
    def get(self,k,df=None):
        m = self.meta
        ky=k
        if isinstance(k,(list,tuple)):
            for a in k:
                if a in m:
                    ky=k
                    break
        if ky is None or ky=="self":
            return self
        return m.get(ky,df)

    def set(self,k,v,wr=None):

        self.meta[k]=v
        return self




def is_json(v):
    try:
        js= json.loads(v.value)
        v.res(js,"array" if isinstance(dict,list) else 'object')
    except ValueError as e:
        v.err=e
    return v




jsonparse = Function('parse', js )
vw=wrap()

def inspect_val(v,meta=None):
    vv=vw.reset(v)
    if vv.typ is str:
        v=v.strip()
        is_json(vv)
        if not vv.resolved:
            vp=jsonparse(vv.value)
            if vp and "v" in vp:
                vv.res(vp["v"],vp.get("json"))

        if  not vv.resolved:
            pass




import magic
import  werkzeug
def get_mimetype(data: bytes) -> str:
    """Get the mimetype from file data."""
    f = magic.Magic(mime=True)
    return f.from_buffer(data)

class FileMultiDict(MultiDict):

    """A special :class:`MultiDict` that has convenience methods to add
    files to it.  This is used for :class:`EnvironBuilder` and generally
    useful for unittesting.
    .. versionadded:: 0.5
    """

    def add_file(self, name, file, filename=None, content_type=None):
        """Adds a new file to the dict.  `file` can be a file name or
        a :class:`file`-like or a :class:`FileStorage` object.
        :param name: the name of the fi eld.
        :param file: a filename or :class:`file`-like object
        :param filename: an optional filename
        :param content_type: an optional content type
        """
        if isinstance(file, FileStorage):
            value = file
        else:
            if isinstance(file, string_types):
                if filename is None:
                    filename = file
                file = open(file, 'rb')
            if filename and content_type is None:
                content_type = mimetypes.guess_type(filename)[0] or \
                    'application/octet-stream'
            value = FileStorage(file, filename, name, content_type)

        self.add(name, value)




# get_mimetype(request.files['YOUR_FILE_KEY'].stream.read(MAX_LENGTH))
#
#
# def upload_file():
#     if request.method == 'POST':
#         file = request.files.get('file')
#         if file:
#             mimetype = file.content_type
#             filename = werkzeug.secure_filename(file.filename)
                get_mimetype(request.files['YOUR_FILE_KEY'].stream.read(MAX_LENGTH))

#             file.save(os.path.join(UPLOAD_FOLDER, filename)
#
#          else:
#             return redirect(url_for('upload'))
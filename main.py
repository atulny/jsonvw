import inspect
import json
import os
import re
from collections import namedtuple, defaultdict
from operator import attrgetter
import pandas as pd
import magic
import werkzeug
from flask import Flask, flash, request, redirect, url_for
from pandas.io.json import json_normalize
from werkzeug.utils import secure_filename
from waitress import serve
from os import path
from js_if import jsonparse

MAX_LENGTH=10000000
UPLOAD_FOLDER = './ff'
DOWNLOAD_FOLDER = "./dnld"
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}
CACHE={}
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
def readfile():
 pass

def get_mimetype(data: bytes) -> str:
    """Get the mimetype from file data."""
    f = magic.Magic(mime=True)
    return f.from_buffer(data)
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

class atdict(dict):
    __slots__=()
    M={}
    def __getattr__(self,item):
        return self.get(item)
    def __setattr__(self,item,v):
        self[item]=v
class file_record_h():
    F=(["file","contenttype","delimiter","content","typtxt"],{},{})
    def __init__(self,s=None):
        self.s_=[s]
    @property
    def mimetype(self,s=None):
        s=self.reset(s).S
        if not s and not s.file:
            return None
        if not "mimetype" in s.meta:
            file = s.file
            s.meta["mimetype1"] = file.content_type
            s.meta["mimetype"] = get_mimetype(file.stream.read(MAX_LENGTH))
        return s.meta["allowed"]

    @property
    def ext(self, s=None):
        file=self.filename
        if file:
            return file.split(".")[-1]
        return ""
    @property
    def allowed(self,s=None):
        m=self.meta(s)
        if m  is None:
            return None
        a=m.get("allowed")
        if a is None:
            f=self.filename(s)
            if f:
               a = allowed_file(f)
            if a is not None:
               m["allowed"] = a
        return a
    def reset(self,s):
        if (s is not None and s and s is not self.S):
           self.s_[0]=s
        return self

    @property
    def file(self):
        s = self.S
        if not s:
            return None
        return s.file
    @property
    def S(self):
        return self.s_[0]
    def meta(self,s=None):
        s=self.reset(s).S
        if not s:
            return None

        if  s.meta is  None:
              s.meta={}
        return s.meta
    def get(self,item,df=None):
        v=self.g(self,item)
        return df if v is None else v

    @classmethod
    def g(cls,s, item):
        m=s.meta()
        fn=cls.F
        p=fn[0]
        if item in m:
            p.append(item)
        if item in p:
            return m.get(item)
        ff=s.file
        if ff:
            f=fn[1].get(item)

            if not f and not fn[1] and ff:
                F=fn[1]
                for k,v in vars(ff).items():
                    if k[0] != "_":
                        F[k]=attrgetter(k)
                f = F.get(item)

            if f :
                return f(ff)
        return None
    def __getitem__(self, item):
        return self.get(item)
    def __getattr__(self, item):
        return self.get(item)
class file_record():
    def __init__(self,file):
        self.file=file
        self.meta={}



    def save(self):
        filename = werkzeug.secure_filename(self.file.filename)
        self.file.save(os.path.join(UPLOAD_FOLDER, filename))


class EceptionHandler():
    def __init__(self):
        self.data=[]

    def add(self,e):
        self.data.append(str(e))


class ddata():
    F=file_record_h()
    def __init__(self,**kwargs):
        self.meta=dict(kwargs)
        self.file=self.meta.pop("file",None)
    @property
    def data(self):
        return self.F.reset(self)

class griddata():

    def __init__(self , data):
        self.exceptionHandler=EceptionHandler()
        self.warp=data
        self.data=None

    def inspect(self):
        res=None
        d = None
        data = self.warp.data.content

        if data:
            if type(data) is str:
                try:
                    res = json.loads(data)
                except Exception as e:
                    self.exceptionHandler.add(e)
                    try:
                        r = jsonparse(data)
                        self.exceptionHandler.add(r.get("error"))
                        res = r.get("v")
                    except Exception as e:
                        self.exceptionHandler.add(e)
            else:
                res=data


        if res is not None:
            if isinstance(res,dict):
                res=[res]

            if isinstance(res,(list,tuple)):
                try:
                    d = json_normalize(res)
                except Exception as e:
                    self.exceptionHandler.add(e)

        if d is not None:
            self.data=d




@app.route('/downloads', methods=['GET', 'POST'])
def downdload_file():
    mode = request.args.get('mode', "csv")
    datakey = request.args.get('datakey', "")
    df=CACHE.get("_")
    filename="dnld."+mode
    downloadfile=path.join(DOWNLOAD_FOLDER, filename)
    if df is not None:
        if mode=="xls":
            df.to_excel(downloadfile)
        else:
            df.to_csv(downloadfile)

        return send_from_directory(DOWNLOAD_FOLDER,filename,as_attachment=True )

    return "error"



@app.route('/', methods=['GET', 'POST'])
def upload_file():
    r={}
    print("start")
    if request.method == 'POST':
        d = dict(typtxt=request.form.get('typtxt'),
                 contenttype=request.form.get('contenttype'),
                 delimiter=request.form.get('delimiter'),
                 content=request.form.get('message')
                 )
        # check if the post request has the file part
        if 'file'   in request.files and request.files['file'] != '':
            print("has file")
            file = request.files['file']
            # if user does not select file, browser also
            # submit an empty part without filename
            if file.filename == '':
                flash('No selected file')
                return redirect(request.url)
            d["file"] = file

        dd=ddata(**d)
        meta =dd.meta.copy()
        if  dd.file:
            ext = dd.data.ext
            if ext:
               if ext=="csv" or ext=="json":
                   filename = dd.file.filename
                   dd.file.save(os.path.join(UPLOAD_FOLDER, filename))
                   if ext=="csv":
                       df=pd.read_csv(path.join(UPLOAD_FOLDER, filename))

                   else:
                       df=pd.read_json(path.join(UPLOAD_FOLDER, filename))

                   meta["columns"]=df.dtypes.apply(lambda x: re.sub('\d+$','',x.name)).to_dict()
                   CACHE["_"]= df
                   r["result"]=df.to_html(index=False)


        else:
            if dd.data.contenttype =="json":
                g=griddata(dd)
                g.inspect()
                if g.data is not None:
                   meta["columns"]=g.data.dtypes.apply(lambda x: x.name).to_dict()
                   meta.pop("content",None)
                   CACHE["_"]= g.data

                   r["result"]=g.data.to_html(index=False)

        r["meta"] = json.dumps(meta)




    ss= """
    <!doctype html>
    <title>View Data</title>
    <head>
    <script type="text/javascript" src="http://caldwell.github.io/renderjson/renderjson.js"> </script>
            <script type="text/javascript" src="https://code.jquery.com/jquery-3.5.1.min.js"> </script>

      <link href="https://kendo.cdn.telerik.com/2020.2.617/styles/kendo.common.min.css" rel="stylesheet" />
    <link href="https://kendo.cdn.telerik.com/2020.2.617/styles/kendo.default.min.css" rel="stylesheet" />
    <script src="https://code.jquery.com/jquery-1.12.3.min.js"></script>
    <script src="https://kendo.cdn.telerik.com/2020.2.617/js/kendo.all.min.js"></script>
    
    <script src="/static/app1.js"> </script>
  <link rel="stylesheet" href="/static/app1.css">
  </head>
    <h1>Upload and View Data</h1>
    <form method=post enctype=multipart/form-data>
       <p>
       <label> Type text <input type ='checkbox' name='typtxt' value=1 onchange="toggle()"/></label>
<label>Type <select class="txtels" name="contenttype" onchange="toggle(this)">
       <option value='json'>Json</option>
              <option value='csv'>comma delimeted data</option>
              <option value='tsv'>tab delimeted data</option>
              <option value='other'>delimeted data</option>

       </select></label>
                     <label>delimiter <input name='delimiter' size=2 class="txtels" value="," ></label>

       </p>
<textarea name="message" rows="8" cols="50"  onchange="inspectdata(this)">
</textarea>
<hr/>
     <label> Upload file <br/><input type="file" id="file" name="file"/></label>
<hr/>
<div style="background:#ccc;margin:5px 0;padding:4px";">
      <input type=submit value="Upload" />
</div>
     </form>
     <h4>Meta Info</h4>
    <p id="data_meta">
           $meta
        </p>
    <hr/>
     <h4>Data</h4>
     <div class="downlinks">
     <a href="/downloads?mode=csv" download="csv">
          <img src="/static/downloadcsv.png" alt="csv" width="24" height="24">
        </a>
     <a href="/downloads?mode=xls" download="xls">
          <img src="/static/downloadxls.png" alt="csv" width="24" height="24">
        </a>   
        </div>
     <div id="data_result" class="tableContainer">
     $result
     </div>   
        
     """
    ss=re.sub('\$(\w+)',lambda m:str(r.get(m.group(1),'')),ss)
    print("end")

    return ss

import click

#from flask_socketio import SocketIO,emit

from flask import send_from_directory
#socketio = SocketIO(app)

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'],
                               filename)
@click.option("--port", "-p", default=5000, help="listening port")
def run(port):
    #app.run(debug=True, port=port)
    #RuntimeError: The session is unavailable because no secret key was set.  Set the secret_key on the application to something unique and secret.
    app.secret_key="i am bad"
    serve(app)
    #socketio.run(app)
    pass


if __name__ == "__main__":
    run(5000)
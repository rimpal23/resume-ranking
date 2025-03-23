import mysql.connector
from dotenv import load_dotenv
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
from utils.extract_text import extract_text_from_pdf, extract_text_from_docx
from models.resume_ranking import rank_resume

load_dotenv() #load db credentials from .env file

#setup db
dbconfig = {
   "host": os.getenv("DB_HOST"),
   "user":os.getenv("DB_USER"),
   "password":os.getenv("DB_PASSWORD"),
   "database":os.getenv("DB_NAME")
}

def connection():
   return mysql.connector.connect(**dbconfig)

app = Flask(__name__) #initialize flask
CORS(app) #allows frontend on a different port to communicate with API 

FOLDER = "uploads" #resumes are stored in this folder
os.makedirs(FOLDER,exist_ok=True) #make sure folder exists

@app.route('/favicon.ico')
def favicon():
   return send_from_directory(".", "favicon.ico", mimetype="image/vnd.microsoft.icon")

@app.route("/rank", methods=['POST']) #API endpoint /rank that takes post req 
def rankresume_api():
      jobdesc = request.form["job_desc"]
      resumefiles = request.files.getlist("resumes")
      resumes = []
      file_names=[]
      for file in resumefiles:
        file_path = os.path.join(FOLDER, file.filename)
        file.save(file_path) #saves every file in uploads folder
        file_names.append(file.filename)
        if file.filename.endswith(".pdf"):
          resumes.append(extract_text_from_pdf(file_path))
        if file.filename.endswith(".docx"):
          resumes.append(extract_text_from_docx(file_path))
      rankedresumes = rank_resume(jobdesc, resumes)
      
      conn = connection()
      cursor = conn.cursor()
      for i,(_,score) in enumerate(rankedresumes):
         cursor.execute("INSERT INTO resumerankings (job_desc,resume_name,score) VALUES(%s,%s,%s)",
                        (jobdesc,file_names[i],round(score,2)))
      conn.commit()
      cursor.close()
      conn.close()
      
      resumefile = dict(zip(resumes,file_names))
      #returning JSON response
      response = [{"rank": i+1, "resume" : resumefile.get(resumetxt,"Unknown"), "score":round(score,2)} for i,(resumetxt,score) in enumerate(rankedresumes)]
      return jsonify(response)

if __name__ == "__main__":
    app.run(debug=True)
Resume Ranking System allows you to rank resumes based on their similarity to job description. It used NLP to extract text from files, preprocess them and calculate similarity score using TF-IDF Vectorizer and cosine similarity. The ranked results are returned and stored in MySQL db.

Tech Stack:

- Frontend: HTML, CSS, JS
- Backend: Flask
- Text Extraction - PDFMiner, python-docx
- Database: MySQL
- NLP and Text Preprocessing: Scikit-learn
- CORS

Required:

- Python 3.x
- MySQL server
- dependencies

Setup and run project:

- Clone repo: git clone url
- cd into the project directory
- install dependencies using pip install -r requirements.txt
- Setup MySQL and add below credentials to .env file.
  DB_HOST=localhost
  DB_USER=root
  DB_PASSWORD=password
  DB_NAME=resume_ranking_db
  Make sure db resume and table resumerankings is created (db.sql reference file)
- Run flask: python app.py
  (API endpoint POST/rank accepts job desc and resume files and returns the results. I used POSTMAN to test endpoint at http://127.0.0.1:5000/rank)
- Run frontend (I used VSC and used live server running at http://127.0.0.1:5500)

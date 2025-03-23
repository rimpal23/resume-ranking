from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from models.text_preprocess import preprocess_txt

def rank_resume(jobdesc, resumes):
    jobdesc = preprocess_txt(jobdesc)
    processed_resumes = [preprocess_txt(resume) for resume in resumes]
    print(f"Processed Resumes: {len(processed_resumes)}")  
    vector = TfidfVectorizer(ngram_range=(1,2),use_idf=True, stop_words=None) #model to compare how frequently word appears in a doc vs in all docs.
    totaltexts = [jobdesc]+processed_resumes # combining both in one list
    matrix = vector.fit_transform(totaltexts) #converts text to vector
    similarity = cosine_similarity(matrix[0:1],matrix[1:]).flatten() #determine how similar the vector for job desc and for resumes is. 
    # converts the similarity score to 1D list
    rank_resume = sorted(zip(resumes,similarity),key=lambda x:x[1], reverse=True) # sorting in desc order of similarity
    return rank_resume


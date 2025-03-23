import nltk, re
import ssl
try:
    _create_unverified_https_context = ssl._create_unverified_context
    ssl._create_default_https_context = _create_unverified_https_context
except AttributeError:
    pass

from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')
nltk.download('punkt_tab')

stop_words = set(stopwords.words('english'))
def preprocess_txt(text):
    text=text.lower()
    text = re.sub(r'\W+',' ',text) #matches any non-word character and replaces with space
    tokens = word_tokenize(text)
    tokens = [t for t in tokens if t not in stop_words]
    # goes through each word in token and includes it in the list if the word is not in list of all the english stopwords
    l = WordNetLemmatizer() #reduced word to its base form
    tokens = [l.lemmatize(t) for t in tokens]
    return " ".join(tokens)

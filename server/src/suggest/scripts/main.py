from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
import pandas as pd

data = pd.read_csv("data.csv")

df = pd.DataFrame(data)

tfidf_vectorizer = TfidfVectorizer()
tfidf_matrix = tfidf_vectorizer.fit_transform(df['description'])

similarities = cosine_similarity(tfidf_matrix, tfidf_matrix)

new_description = "CCCD"

new_description_vector = tfidf_vectorizer.transform([new_description])

similarities_new = cosine_similarity(new_description_vector, tfidf_matrix)

n_similar_items = 2

similar_items_indices = similarities_new.argsort(axis=1).squeeze()[-n_similar_items:][::-1]

similar_items_ids = df.loc[similar_items_indices, 'itemId'].tolist()

print("Các itemId được đề xuất dựa trên mô tả đã nhập:")

print(similar_items_ids)
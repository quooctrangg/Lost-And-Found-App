from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
import pandas as pd
import sys
import os

def suggest_items_based_on_description(descriptions):
    current_dir = os.path.dirname(__file__)
    data = pd.read_csv(os.path.join(current_dir, 'data.csv'))
    df = pd.DataFrame(data)

    tfidf_vectorizer = TfidfVectorizer()
    tfidf_matrix = tfidf_vectorizer.fit_transform(df['description'])

    new_description_matrix = tfidf_vectorizer.transform(descriptions)
    similarities_new = cosine_similarity(new_description_matrix, tfidf_matrix)

    n_similar_items = 2
    similar_items_indices = similarities_new.argsort(axis=1)[:, -n_similar_items:][:, ::-1]

    suggested_items = []
    for indices in similar_items_indices:
        similar_items_ids = df.loc[indices, 'itemId'].tolist()
        suggested_items.append(similar_items_ids)

    return suggested_items

if __name__ == "__main__":
    descriptions = sys.argv[1:]
    suggested_items = suggest_items_based_on_description(descriptions)
    print(suggested_items)
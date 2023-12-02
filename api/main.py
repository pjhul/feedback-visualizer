from typing import List
from fastapi import FastAPI, UploadFile, File
from openai import OpenAI
import pandas as pd
from qdrant_client import QdrantClient
from qdrant_client.http.models import Distance, PointStruct, VectorParams
import uuid
import io
import umap

oai = OpenAI()
app = FastAPI()
qdrant = QdrantClient("localhost", port=6333)

try:
    qdrant.create_collection(
        collection_name="test_collection",
        vectors_config=VectorParams(size=1536, distance=Distance.DOT),
    )
except:
    print("Collection already exists")
    pass

def get_embedding(text, model="text-embedding-ada-002"):
   text = text.replace("\n", " ")
   return oai.embeddings.create(input = [text], model=model).data[0].embedding

@app.post("/embed")
async def embed(files: List[UploadFile]):
    session = uuid.uuid4()

    combined_df = pd.DataFrame()  # Create a new DataFrame to store combined data

    for file in files:
        contents = await file.read()
        df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
        combined_df = pd.concat([combined_df, df], ignore_index=True)  # Concatenate dataframes

        # df['embedding'] = df['Text'].apply(get_embedding)

    # df = pd.read_csv('archive/Reviews.csv')
    first_100 = combined_df.head(100)

    first_100['embedding'] = first_100['Text'].apply(get_embedding)

    # qdrant.upsert(
    #     collection_name="test_collection",
    #     points=[
    #         PointStruct(id=index, vector=row['embedding'], payload={"text": row['Text'], "session": session, "score": row['Score']})
    #         for index, row in first_100.iterrows()
    #     ]
    # )

    reducer = umap.UMAP(n_components=3)

    embedding = reducer.fit_transform(first_100['embedding'].tolist())

    first_100['x'] = embedding[:, 0]
    first_100['y'] = embedding[:, 1]
    first_100['z'] = embedding[:, 2]

    # Remove the "embedding" column
    first_100 = first_100.drop(columns=['embedding'])

    return first_100.to_dict(orient='records')


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=80)

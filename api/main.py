from typing import List
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from openai import AsyncOpenAI
import pandas as pd
import numpy as np
import uuid
import io
import umap
import asyncio

oai = AsyncOpenAI()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

async def get_embedding(texts, model="text-embedding-ada-002"):
    texts = [text.replace("\n", " ") for text in texts]
    response = await oai.embeddings.create(input=texts, model=model)
    return [embedding.embedding for embedding in response.data]

models = {}

@app.post("/embed")
async def embed(files: List[UploadFile]):
    session = uuid.uuid4()
    combined_df = pd.DataFrame()

    for file in files:
        contents = await file.read()
        df = pd.read_csv(io.StringIO(contents.decode('utf-8')), error_bad_lines=False)
        combined_df = pd.concat([combined_df, df], ignore_index=True)

    combined_df['Combined'] = combined_df.apply(lambda row: ' '.join(row.astype(str)), axis=1)

    # Process in batches of 100
    batch_size = 100
    tasks = []
    for i in range(0, len(combined_df), batch_size):
        batch = combined_df['Combined'][i:i+batch_size].tolist()
        task = asyncio.ensure_future(get_embedding(batch))
        tasks.append(task)

    embeddings = await asyncio.gather(*tasks)
    embeddings = [item for sublist in embeddings for item in sublist]

    combined_df['embedding'] = embeddings

    # UMAP dimensionality reduction
    reducer = umap.UMAP(n_components=2)
    embedding = reducer.fit_transform(list(combined_df['embedding']))

    models[session] = reducer

    combined_df['x'] = embedding[:, 0]
    combined_df['y'] = embedding[:, 1]

    combined_df = combined_df.replace([np.inf, -np.inf], np.nan).fillna(0)

    combined_df = combined_df.round(3)

    # Remove the "embedding" and "Combined" columns
    combined_df = combined_df.drop(columns=['embedding', 'Combined'])

    return {
        'session': session,
        'data': combined_df.to_dict(orient='records')
    }

@app.get("/search")
async def search(session: uuid.UUID, query: str):
    reducer = models[session]
    query_embedding = await get_embedding([query])
    query_embedding = reducer.transform(query_embedding)
    return query_embedding[0].tolist()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=80)


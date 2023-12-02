from fastapi import FastAPI
from openai import OpenAI
import pandas as pd
import numpy as np

client = OpenAI()
app = FastAPI()

def get_embedding(text, model="text-embedding-ada-002"):
   text = text.replace("\n", " ")
   return client.embeddings.create(input = [text], model=model).data[0].embedding

@app.post("/embed")
async def embed():
    df = pd.read_csv('archive/Reviews.csv')
    first_100 = df.head(100)

    first_100['embedding'] = first_100['Text'].apply(get_embedding)

    print(first_100.head())

    return {"message": "This is the embed endpoint"}


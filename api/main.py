from fastapi import FastAPI

app = FastAPI()

@app.post("/embed")
async def embed():
    return {"message": "This is the embed endpoint"}


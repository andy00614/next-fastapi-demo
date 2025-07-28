from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import api_router
from app.db.database import engine
from app.models import task

task.Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Task Manager API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "AI Task Manager API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
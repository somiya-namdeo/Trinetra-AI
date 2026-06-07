from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.api import router as api_router

app = FastAPI(
    title="Trinetra-AI Backend",
    description="AI-Powered Emergency Intelligence & Response Platform API",
    version="1.0.0"
)

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://trinetra-ai-eight.vercel.app/",
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

@app.get("/")
def read_root():
    return {
        "message": "Trinetra AI API is running",
        "status": "healthy"
    }

from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_memory_ai():
    return []

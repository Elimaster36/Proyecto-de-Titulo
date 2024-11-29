from typing import List
from fastapi import APIRouter, HTTPException
from .news_service import get_news_from_chile
from .schemas import News

router = APIRouter()

@router.get("/news/", response_model=List[News])
def read_news():
    news = get_news_from_chile()
    if not news:
        raise HTTPException(status_code=404, detail="No se encontraron noticias")
    return news



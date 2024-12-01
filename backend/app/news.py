from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.models import Noticia
from app.schemas import News
from app.dependencies import get_db
from app.news_service import get_news_from_chile, save_news_to_db

router = APIRouter()

@router.get("/news/", response_model=List[News])
def read_news(db: Session = Depends(get_db)):
    news = db.query(Noticia).all()
    return news  # Devuelve una lista vacía si no hay noticias


@router.post("/news/")
def fetch_and_store_news(db: Session = Depends(get_db)):
    news_data = get_news_from_chile()
    save_news_to_db(news_data, db)
    return {"message": "Noticias actualizadas"}








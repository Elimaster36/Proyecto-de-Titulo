import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.models import Feed, User, Noticia
from app.schemas import FeedCreate, Feed
from app.dependencies import get_db
from app.news_service import save_feed_to_db

router = APIRouter()

@router.post("/feeds/", response_model=Feed)
def create_feed(feed: FeedCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.firebase_id == feed.usuario_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    noticia = db.query(Noticia).filter(Noticia.id == feed.noticia_id).first()
    if not noticia:
        raise HTTPException(status_code=404, detail="Noticia no encontrada")

    existing_feed = db.query(Feed).filter(
    Feed.usuario_id == feed.usuario_id,
    Feed.noticia_id == feed.noticia_id
    ).first()
    if existing_feed:
        raise HTTPException(status_code=400, detail="El feed ya existe")

    new_feed = save_feed_to_db(feed.usuario_id, feed.noticia_id, db)
    return new_feed


@router.get("/feeds/", response_model=List[Feed])
def read_feeds(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    feeds = db.query(Feed).offset(skip).limit(limit).all()
    return feeds

@router.get("/user-feeds/{usuario_id}", response_model=List[Feed])
def read_user_feeds(usuario_id: str, db: Session = Depends(get_db)):
    feeds = db.query(Feed).filter(Feed.usuario_id == usuario_id).all()
    return feeds

@router.post("/feeds/{feed_id}/mark-as-read")
def mark_as_read(feed_id: int, db: Session = Depends(get_db)):
    feed = db.query(Feed).filter(Feed.id == feed_id).first()
    if not feed:
        raise HTTPException(status_code=404, detail="Feed no encontrado")
    feed.fecha_vista = datetime.utcnow()
    db.commit()
    return {"message": "Feed marcado como leído"}


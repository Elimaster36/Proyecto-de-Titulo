from datetime import datetime, timezone
import requests
from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models import Noticia

NEWSDATA_API_KEY = "pub_60836631579feccaff9332fcc0e8d953be308"  # Reemplaza con tu API Key

def get_news_from_chile():
    url = f"https://newsdata.io/api/1/news?apikey={NEWSDATA_API_KEY}&country=cl"
    try:
        response = requests.get(url)
        response.raise_for_status()  # Lanza una excepción para errores HTTP
        news_data = response.json()
        return news_data.get("results", [])
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener noticias: {str(e)}")

def save_news_to_db(news_list: list, db: Session):
    for news in news_list:
        # Verificar si la noticia ya existe por su URL
        existing_news = db.query(Noticia).filter_by(url=news["link"]).first()
        if existing_news:
            continue  # Saltar si ya existe

        # Intentar procesar la fecha de publicación
        try:
            pub_date = datetime.strptime(news.get("pubDate"), "%Y-%m-%d %H:%M:%S")
        except (TypeError, ValueError):
            pub_date = None

        # Crear el objeto de noticia
        noticia = Noticia(
            title=news["title"],
            description=news["description"],
            url=news["link"],
            pub_date=pub_date,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )

        # Guardar en la base de datos
        db.add(noticia)

    # Confirmar los cambios en la base de datos
    db.commit()

from app.models import Feed
from sqlalchemy.orm import Session

def save_feed_to_db(usuario_id: str, noticia_id: int, db: Session):
    new_feed = Feed(
        usuario_id=usuario_id,
        noticia_id=noticia_id,
        fecha_vista=datetime.now(),
        creado_at=datetime.now()
    )
    db.add(new_feed)
    db.commit()
    db.refresh(new_feed)
    return new_feed








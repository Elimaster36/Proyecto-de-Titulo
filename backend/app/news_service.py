import requests
from fastapi import HTTPException

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



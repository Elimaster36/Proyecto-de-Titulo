from fastapi import FastAPI
from ui_settings import *    # Asegúrate de que el módulo está en la carpeta correcta
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8100"],  # Puedes especificar tus dominios aquí
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.dependencies import engine, Base, get_db
from app.users import router as users_router
from app.user_preferences import router as preferences_router
import uvicorn
import firebase_admin
from firebase_admin import credentials
from passlib.context import CryptContext

app = FastAPI()

# Inicializa Firebase Admin SDK una vez
cred = credentials.Certificate("app/firebase-key.json")
firebase_admin.initialize_app(cred)

# Configurar CryptContext
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Crear todas las tablas en la base de datos
Base.metadata.create_all(bind=engine)

@app.middleware("http")
async def db_session_middleware(request: Request, call_next):
    request.state.db = get_db()
    response = await call_next(request)
    try:
        request.state.db.close()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    return response

# Configuración de CORS para permitir las solicitudes desde tu frontend
origins = [
    "http://localhost:8100",  # URL de tu aplicación Angular
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(users_router, prefix="/api/v1")
app.include_router(preferences_router, prefix="/api/v1")

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)





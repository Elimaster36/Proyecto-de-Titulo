from fastapi import FastAPI, Request, HTTPException
from starlette.middleware.cors import CORSMiddleware
from app.dependencies import get_db
from app import agenda, users, quien_soy
import uvicorn

app = FastAPI()

@app.middleware("http")
async def db_session_middleware(request: Request, call_next):
    request.state.db = get_db()
    response = await call_next(request)
    try:
        request.state.db.close()  # Usamos close en lugar de remove
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    return response

app.include_router(users.router, prefix="/api/v1")
app.include_router(quien_soy.router, prefix="/api/v1")
app.include_router(agenda.router, prefix="/api/v1")


# Configuración de CORS para permitir las solicitudes desde tu frontend
origins = [
    "http://localhost:8100",  # URL de tu aplicación Angular
]

# Configuración CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permitir todas las fuentes, ajusta según tus necesidades
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)




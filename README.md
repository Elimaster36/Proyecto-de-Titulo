# SimplicityPhone

SimplicityPhone es una aplicación diseñada para reducir el aislamiento digital de los adultos mayores mediante una interfaz simplificada y accesible, con funcionalidades como botones de emergencia, personalización de interfaz y agenda de recordatorios.

---

## 🚀 Requisitos previos

Antes de comenzar, asegúrate de tener lo siguiente instalado en tu sistema:

- **Node.js** (versión 16 o superior) y **npm** (v8 o superior). Puedes descargarlo desde [Node.js Official Site](https://nodejs.org/).
- **Ionic CLI**: Instalado globalmente. (`npm install -g @ionic/cli`)
- **Python** (versión 3.9 o superior) para el backend.
- **FastAPI** y las dependencias necesarias para el backend. (`pip install fastapi uvicorn psycopg2-binary`)
- **PostgreSQL** como base de datos. Configura una instancia y asegúrate de que esté corriendo.
- **Firebase Project**: Configurado para la autenticación de usuarios.
- **NewsData.io API Key**: Necesaria para obtener noticias.

---

## Estructura del proyecto
SimplicityPhone/ ├── frontend/ # Aplicación móvil en Ionic Angular ├── backend/ # API desarrollada con FastAPI ├── README.md # Instrucciones y documentación

---

## Instrucciones de instalación

### 1. Clonar el repositorio
bash
´´´
git clone https://github.com/Elimaster36/Proyecto-de-Titulo.git
cd Proyecto-de-Titulo
´´´
### Configurar el Frontend
- *Navega al directorio del frontend*:
cd frontend
- *Instala las dependencias de Ionic*:
npm install
- *Ejecuta el servidor de desarrollo*:
ionic serve
### Configurar el Backend
cd ../backend
- *Crea un entorno virtual (opcional pero recomendado)*:
python -m venv venv
source venv/Scripts/activate en git bash
- *Instala las dependencias*:
pip install -r requirements.txt
- *Ejecuta el servidor*:
uvicorn main:app --reload


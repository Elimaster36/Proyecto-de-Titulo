import uuid
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models import User, QuienSoy  # Ajusta las importaciones según tu estructura de proyecto

# Configuración de la base de datos de prueba (por ejemplo, SQLite en memoria)
DATABASE_URL = "sqlite:///:memory:"  # o la URL de tu base de datos de prueba
engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Crear las tablas necesarias antes de las pruebas
@pytest.fixture(scope="module")
def setup_db():
    # Crea las tablas en la base de datos en memoria
    User.metadata.create_all(bind=engine)
    QuienSoy.metadata.create_all(bind=engine)

    yield

    # Eliminar las tablas después de las pruebas
    User.metadata.drop_all(bind=engine)
    QuienSoy.metadata.drop_all(bind=engine)

# Test para la actualización de un registro en QuienSoy
@pytest.fixture
def db_session(setup_db):
    # Crea una sesión de base de datos para cada prueba
    session = SessionLocal()
    yield session
    session.close()

def test_create_quien_soy(db_session):
    # Crea un usuario de prueba con un correo electrónico único
    user_email = "createuser@example.com"
    user = User(name="Create User", email=user_email, password="password", firebase_id=str(uuid.uuid4()))
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    # Crea un registro de 'QuienSoy' asociado al usuario
    quien_soy = QuienSoy(
        user_firebase_id=user.firebase_id,  # Asegúrate de usar el campo correcto
        full_name="Create User",
        photo="createphoto.jpg",  # Foto de prueba
        age=25,
        address="Test Address"
    )
    db_session.add(quien_soy)
    db_session.commit()

    # Verifica si el registro fue creado correctamente
    db_session.refresh(quien_soy)

    # Asegúrate de que el registro tenga los valores correctos
    assert quien_soy.full_name == "Create User"
    assert quien_soy.age == 25
    assert quien_soy.address == "Test Address"
    assert quien_soy.photo == "createphoto.jpg"
    assert quien_soy.user_firebase_id == user.firebase_id

    # Verifica si el ID fue asignado (autoincremental en la base de datos)
    assert quien_soy.id is not None


def test_update_quien_soy(db_session):
    # Crea un usuario de prueba con un correo electrónico único
    user_email = "testuser@example.com"
    user = User(name="Test User", email=user_email, password="password", firebase_id=str(uuid.uuid4()))
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    # Crea un registro de 'QuienSoy' asociado al usuario
    quien_soy = QuienSoy(
    user_firebase_id=user.firebase_id,  # Usar el firebase_id del usuario
    full_name="Test User",
    photo="testfoto.jpg",  # Asegúrate de que la foto sea válida si es necesario
    age=30,
    address="Test Address"
    )
    db_session.add(quien_soy)
    db_session.commit()

    # Actualiza el registro de 'QuienSoy'
    quien_soy.nombre_completo = "Updated Test User"
    quien_soy.edad = 31
    db_session.commit()

    # Verifica que la actualización fue exitosa
    updated_quien_soy = db_session.query(QuienSoy).filter_by(user_firebase_id=user.firebase_id).first()
    assert updated_quien_soy.nombre_completo == "Updated Test User"
    assert updated_quien_soy.edad == 31










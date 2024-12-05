import uuid
import pytest
from datetime import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models import User, Agenda  # Ajusta las importaciones según tu estructura de proyecto

# Configuración de la base de datos de prueba (por ejemplo, SQLite en memoria)
DATABASE_URL = "sqlite:///:memory:"  # o la URL de tu base de datos de prueba
engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Crear las tablas necesarias antes de las pruebas
@pytest.fixture(scope="module")
def setup_db():
    # Crea las tablas en la base de datos en memoria
    User.metadata.create_all(bind=engine)
    Agenda.metadata.create_all(bind=engine)

    yield

    # Eliminar las tablas después de las pruebas
    User.metadata.drop_all(bind=engine)
    Agenda.metadata.drop_all(bind=engine)

# Test para la creación de una agenda
@pytest.fixture
def db_session(setup_db):
    # Crea una sesión de base de datos para cada prueba
    session = SessionLocal()
    yield session
    session.close()

def test_create_agenda(db_session):
    # Crea un usuario de prueba con un correo electrónico único
    user_email = "createuser@example.com"
    user = User(name="Create User", email=user_email, password="password", firebase_id=str(uuid.uuid4()))
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    # Crea un registro de 'Agenda' asociado al usuario
    agenda_datetime = datetime.strptime("2024-12-04 12:00:00", "%Y-%m-%d %H:%M:%S")
    agenda = Agenda(
        title="Test Agenda",
        content="Test Content",
        datetime=agenda_datetime,  # Convertir a objeto datetime
        notification=True,
        firebase_id=user.firebase_id  # Asegúrate de usar el campo correcto
    )
    db_session.add(agenda)
    db_session.commit()

    # Verifica si el registro fue creado correctamente
    db_session.refresh(agenda)

    # Asegúrate de que el registro tenga los valores correctos
    assert agenda.title == "Test Agenda"
    assert agenda.content == "Test Content"
    assert agenda.datetime == agenda_datetime  # Comparar con objeto datetime
    assert agenda.notification is True
    assert agenda.firebase_id == user.firebase_id

    # Verifica si el ID fue asignado (autoincremental en la base de datos)
    assert agenda.id is not None

def test_update_agenda(db_session):
    # Crea un usuario de prueba con un correo electrónico único
    user_email = "testuser@example.com"
    user = User(name="Test User", email=user_email, password="password", firebase_id=str(uuid.uuid4()))
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    # Crea un registro de 'Agenda' asociado al usuario
    agenda_datetime = datetime.strptime("2024-12-04 12:00:00", "%Y-%m-%d %H:%M:%S")
    agenda = Agenda(
        title="Initial Agenda",
        content="Initial Content",
        datetime=agenda_datetime,  # Convertir a objeto datetime
        notification=False,
        firebase_id=user.firebase_id  # Usar el firebase_id del usuario
    )
    db_session.add(agenda)
    db_session.commit()
    db_session.refresh(agenda)

    # Actualiza el registro de 'Agenda'
    updated_datetime = datetime.strptime("2024-12-05 12:00:00", "%Y-%m-%d %H:%M:%S")
    agenda.title = "Updated Agenda"
    agenda.content = "Updated Content"
    agenda.datetime = updated_datetime  # Convertir a objeto datetime
    agenda.notification = True
    db_session.commit()

    # Verifica que la actualización fue exitosa
    updated_agenda = db_session.query(Agenda).filter_by(firebase_id=user.firebase_id).first()
    assert updated_agenda.title == "Updated Agenda"
    assert updated_agenda.content == "Updated Content"
    assert updated_agenda.datetime == updated_datetime  # Comparar con objeto datetime
    assert updated_agenda.notification is True

# Prueba para leer las agendas
def test_read_agendas(db_session):

    # Crea un usuario de prueba con un correo electrónico único
    user_email = "testread@example.com"
    user = User(name="Test Read User", email=user_email, password="password", firebase_id=str(uuid.uuid4()))
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    # Crea varios registros de 'Agenda' asociados al usuario
    agenda_datetime_1 = datetime.strptime("2024-12-04 12:00:00", "%Y-%m-%d %H:%M:%S")
    agenda_datetime_2 = datetime.strptime("2024-12-05 13:00:00", "%Y-%m-%d %H:%M:%S")
    agendas = [
        Agenda(
            title="Read Agenda 1",
            content="Read Content 1",
            datetime=agenda_datetime_1,
            notification=True,
            firebase_id=user.firebase_id
        ),
        Agenda(
            title="Read Agenda 2",
            content="Read Content 2",
            datetime=agenda_datetime_2,
            notification=False,
            firebase_id=user.firebase_id
        )
    ]

    db_session.bulk_save_objects(agendas)
    db_session.commit()

    # Consulta todas las agendas del usuario
    user_agendas = db_session.query(Agenda).filter_by(firebase_id=user.firebase_id).all()
    
    # Verifica que se han recuperado correctamente
    assert len(user_agendas) == 2
    assert user_agendas[0].title == "Read Agenda 1"
    assert user_agendas[1].title == "Read Agenda 2"
    assert user_agendas[0].content == "Read Content 1"
    assert user_agendas[1].content == "Read Content 2"
    assert user_agendas[0].datetime == agenda_datetime_1
    assert user_agendas[1].datetime == agenda_datetime_2

# Prueba para eliminar una agenda
def test_delete_agenda(db_session):
    # Crea un usuario de prueba con un correo electrónico único
    user_email = "deletetestuser@example.com"
    user = User(name="Delete Test User", email=user_email, password="password", firebase_id=str(uuid.uuid4()))
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    # Crea un registro de 'Agenda' asociado al usuario
    agenda_datetime = datetime.strptime("2024-12-04 12:00:00", "%Y-%m-%d %H:%M:%S")
    agenda = Agenda(
        title="Delete Test Agenda",
        content="Delete Test Content",
        datetime=agenda_datetime,
        notification=False,
        firebase_id=user.firebase_id  # Usar el firebase_id del usuario
    )
    db_session.add(agenda)
    db_session.commit()
    db_session.refresh(agenda)

    # Elimina el registro de 'Agenda'
    db_session.delete(agenda)
    db_session.commit()

    # Verifica que la eliminación fue exitosa
    deleted_agenda = db_session.query(Agenda).filter_by(firebase_id=user.firebase_id, id=agenda.id).first()
    assert deleted_agenda is None












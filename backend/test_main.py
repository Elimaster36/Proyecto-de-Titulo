import uuid
from fastapi.testclient import TestClient
from main import app  # Ajusta según la estructura de tu proyecto
from unittest.mock import patch

client = TestClient(app)

@patch("firebase_admin.auth.verify_id_token")
def test_register(mock_verify_id_token):
    # Configura el mock para que devuelva un token decodificado válido
    mock_verify_id_token.return_value = {"uid": str(uuid.uuid4())}

    unique_email = f"testuser{uuid.uuid4()}@gmail.com"
    response = client.post("/api/v1/register", json={
        "name": "Test User5",
        "email": unique_email,
        "password": "test5password",
        "idToken": "mocked_id_token"
    })
    assert response.status_code == 200
    assert response.json()["message"] == "User created successfully"

@patch("firebase_admin.auth.verify_id_token")
def test_login(mock_verify_id_token):
    # Configura el mock para que devuelva un token decodificado válido
    mock_verify_id_token.return_value = {"uid": "test_firebase_uid"}

    response = client.post("/api/v1/login", json={
        "email": "testuser@gmail.com",
        "password": "testpassword",
        "idToken": "mocked_id_token"
    })
    assert response.status_code == 200
    assert "user_id" in response.json()
    assert "email" in response.json()

@patch("firebase_admin.auth.verify_id_token")
def test_register_invalid_token(mock_verify_id_token):
    mock_verify_id_token.side_effect = Exception("Invalid token")

    response = client.post("/api/v1/register", json={
        "name": "Test User",
        "email": "testuser@gmail.com",
        "password": "testpassword",
        "idToken": "mocked_invalid_token"
    })
    assert response.status_code == 400
    assert response.json() == {"detail": "Invalid Firebase ID token"}

@patch("firebase_admin.auth.verify_id_token")
def test_register_db_error(mock_verify_id_token):
    mock_verify_id_token.return_value = {"uid": str(uuid.uuid4())}

    with patch("app.dependencies.SessionLocal") as mock_session:
        mock_db_instance = mock_session.return_value
        mock_db_instance.commit.side_effect = Exception("DB Error")

        response = client.post("/api/v1/register", json={
            "name": "Test User3",
            "email": f"unique{uuid.uuid4()}@gmail.com",
            "password": "test3password",
            "idToken": "mocked_id_token"
        })
        assert response.status_code == 500
        assert "DB Error" in response.json()["detail"]

@patch("firebase_admin.auth.verify_id_token")
def test_login_invalid_token(mock_verify_id_token):
    mock_verify_id_token.side_effect = Exception("Invalid token")

    response = client.post("/api/v1/login", json={
        "email": "testuser@gmail.com",
        "password": "testpassword",
        "idToken": "mocked_invalid_token"
    })
    assert response.status_code == 400
    assert response.json() == {"detail": "Invalid Firebase ID token"}

@patch("firebase_admin.auth.verify_id_token")
def test_login_invalid_credentials(mock_verify_id_token):
    mock_verify_id_token.return_value = {"uid": "test_firebase_uid"}

    response = client.post("/api/v1/login", json={
        "email": "wrongemail@gmail.com",
        "password": "wrongpassword",
        "idToken": "mocked_id_token"
    })
    assert response.status_code == 400
    assert response.json() == {"detail": "Invalid email or password"}






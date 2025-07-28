import pytest
import pytest_asyncio
import uuid
from typing import AsyncGenerator
from httpx import AsyncClient, ASGITransport
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from app.main import app
from app.db.base import Base
from app.db.session import get_db
from app.core.dependencies import get_current_user

# Import all models to ensure they are registered with Base.metadata
from app.db.models.user import User
from app.db.models.goal import Goal
from app.db.models.log import FoodLog

# --- 1. Database Engine Fixture (runs once per test session) ---
@pytest.fixture(scope="session")
def db_engine():
    """Creates a fresh in-memory SQLite database engine for the entire test session."""
    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
    Base.metadata.create_all(bind=engine)
    yield engine

# --- 2. Database Session Fixture (runs for each test function) ---
@pytest.fixture(scope="function")
def db_session(db_engine):
    """Provides a clean, transaction-managed database session for each test."""
    connection = db_engine.connect()
    transaction = connection.begin()
    session = sessionmaker(autocommit=False, autoflush=False, bind=connection)()
    yield session
    session.close()
    transaction.rollback()
    connection.close()

# --- 3. Mock User Fixture (runs for each test function) ---
@pytest.fixture(scope="function")
def mock_user(db_session: Session) -> User:
    """Creates and saves a single mock user for a test, then returns it."""
    user = User(id=1, email="test@example.com", supabase_user_id=uuid.uuid4())
    db_session.add(user)
    db_session.commit()
    return user

# --- 4. Main Test Client Fixture ---
@pytest_asyncio.fixture
async def test_client(db_session: Session, mock_user: User) -> AsyncGenerator[AsyncClient, None]:
    """
    Creates a test client with mocked dependencies for the database and authentication.
    This is the main fixture that our tests will use.
    """
    def override_get_db():
        """This override provides the clean db_session to the app."""
        yield db_session

    def override_get_current_user():
        """This override provides the single mock_user to the app."""
        return mock_user

    # Apply the overrides to our FastAPI app
    app.dependency_overrides[get_db] = override_get_db
    app.dependency_overrides[get_current_user] = override_get_current_user

    # Create and yield the test client
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        yield client
    
    # Clean up the overrides after the test is finished
    app.dependency_overrides.clear()
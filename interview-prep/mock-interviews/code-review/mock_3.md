# Mock Code Review 3: Database Schema & Queries

## Scenario Context
**Company:** Casium
**Task:** Reviewing database models and query optimization for immigration case management
**Code Author:** Full-stack engineer working on case tracking system
**Your Role:** AI Product Engineer conducting code review
**Target Score:** 8.5+/10

## Woven Assessment Format Guidelines
✅ **Inline comments are perfectly fine** - use your professional judgment
✅ **No specific format required** - standard GitHub PR review approach
✅ **Focus on quality over format** - clear, actionable, professional feedback
✅ **Use both inline AND general comments** as needed

## Code Under Review

```python
from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Boolean, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
from datetime import datetime
import os

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    email = Column(String(255), unique=True)
    password_hash = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)

    cases = relationship("Case", back_populates="user")

class Case(Base):
    __tablename__ = 'cases'

    id = Column(String(36), primary_key=True)  # UUID
    user_id = Column(Integer, ForeignKey('users.id'))
    case_type = Column(String(50))  # H1B, L1, O1, etc.
    status = Column(String(20))  # draft, submitted, approved, denied
    priority = Column(String(10), default='normal')  # low, normal, high, urgent
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="cases")
    documents = relationship("Document", back_populates="case")
    timeline_events = relationship("TimelineEvent", back_populates="case")

class Document(Base):
    __tablename__ = 'documents'

    id = Column(String(36), primary_key=True)  # UUID
    case_id = Column(String(36), ForeignKey('cases.id'))
    filename = Column(String(500))
    original_filename = Column(Text)
    file_path = Column(Text)
    file_size = Column(Integer)
    content_type = Column(String(100))
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    processed = Column(Boolean, default=False)
    extracted_data = Column(Text)  # JSON string

    case = relationship("Case", back_populates="documents")

class TimelineEvent(Base):
    __tablename__ = 'timeline_events'

    id = Column(Integer, primary_key=True)
    case_id = Column(String(36), ForeignKey('cases.id'))
    event_type = Column(String(50))
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    metadata = Column(Text)  # JSON string

    case = relationship("Case", back_populates="timeline_events")

# Database connection and queries
DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://user:pass@localhost/casium')
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_user_cases(user_id: int, status: str = None):
    """Get all cases for a user, optionally filtered by status"""
    session = SessionLocal()
    try:
        query = session.query(Case).filter(Case.user_id == user_id)
        if status:
            query = query.filter(Case.status == status)
        cases = query.all()
        return cases
    finally:
        session.close()

def get_case_with_documents(case_id: str, user_id: int):
    """Get case details with all documents"""
    session = SessionLocal()
    try:
        case = session.query(Case).filter(
            Case.id == case_id,
            Case.user_id == user_id
        ).first()

        if case:
            # Load documents separately
            documents = session.query(Document).filter(
                Document.case_id == case_id
            ).all()
            case.documents = documents

        return case
    finally:
        session.close()

def update_case_status(case_id: str, user_id: int, new_status: str, description: str):
    """Update case status and add timeline event"""
    session = SessionLocal()
    try:
        case = session.query(Case).filter(
            Case.id == case_id,
            Case.user_id == user_id
        ).first()

        if not case:
            return None

        case.status = new_status
        case.updated_at = datetime.utcnow()

        # Add timeline event
        event = TimelineEvent(
            case_id=case_id,
            event_type='status_change',
            description=description,
            metadata=f'{{"old_status": "{case.status}", "new_status": "{new_status}"}}'
        )
        session.add(event)
        session.commit()
        return case
    except Exception as e:
        session.rollback()
        raise e
    finally:
        session.close()

def search_cases(user_id: int, search_term: str, limit: int = 50):
    """Search cases by various criteria"""
    session = SessionLocal()
    try:
        cases = session.query(Case).filter(
            Case.user_id == user_id,
            Case.case_type.contains(search_term) |
            Case.status.contains(search_term)
        ).limit(limit).all()
        return cases
    finally:
        session.close()
```

---

## YOUR CODE REVIEW (Target: 8.5+/10)

**Format Options:**
- ✅ Add inline comments directly in the code above
- ✅ Write general review comments below
- ✅ Use both approaches (recommended)

### Overall Assessment


### Critical Issues


### Database Design Issues


### Performance & Query Optimization


### Security Concerns


### Code Quality & Best Practices


### Priority-Ordered Issues
**🚨 CRITICAL:**


**⚠️ HIGH PRIORITY:**


**📋 MEDIUM PRIORITY:**


---

**Go ahead and review this! Use whatever format feels natural - inline comments, structured feedback, or both. Let's aim for 8.5+/10!**
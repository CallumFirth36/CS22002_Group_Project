

from datetime import datetime
from extensions import db


class User(db.Model):
    """
    Represents an admin (creator) account.
    Guests are not stored — they interact without authentication.
    """
    __tablename__ = "users"

    id            = db.Column(db.Integer, primary_key=True)
    username      = db.Column(db.String(30), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False) 
    role          = db.Column(db.String(10), nullable=False, default="admin")
    created_at    = db.Column(db.DateTime, default=datetime.utcnow)

    # one admin owns many quizzes
    quizzes = db.relationship("Quiz", back_populates="owner", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id":         self.id,
            "username":   self.username,
            "role":       self.role,
            "created_at": self.created_at.isoformat(),
        }


class Quiz(db.Model):
    """
    A quiz created by an admin.
    Matches the JSON schema in the design document:
      { quiz_id, category, owner }
    """
    __tablename__ = "quizzes"

    id         = db.Column(db.Integer, primary_key=True)
    category   = db.Column(db.String(100), nullable=False)
    owner_id   = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    owner     = db.relationship("User", back_populates="quizzes")
    questions = db.relationship("Question", back_populates="quiz",
                                cascade="all, delete-orphan", order_by="Question.id")

    def to_dict(self):
        return {
            "quiz_id":  self.id,
            "category": self.category,
            "owner":    self.owner_id,
        }


class Question(db.Model):
    """
    A single question inside a quiz.
    Matches the JSON schema in the design document:
      { quiz_id, id, text, option, answer, image }
    """
    __tablename__ = "questions"

    id      = db.Column(db.Integer, primary_key=True)
    quiz_id = db.Column(db.Integer, db.ForeignKey("quizzes.id"), nullable=False)
    text    = db.Column(db.String(500), nullable=False)
    # options stored as a JSON array  ["1","2","3","4"]
    options = db.Column(db.JSON, nullable=False)
    answer  = db.Column(db.String(200), nullable=False)
    image   = db.Column(db.String(500), nullable=True)   

    quiz = db.relationship("Quiz", back_populates="questions")

    def to_dict(self):
        return {
            "quiz_id": self.quiz_id,
            "id":      self.id,
            "text":    self.text,
            "option":  self.options,
            "answer":  self.answer,
            "image":   self.image,
        }

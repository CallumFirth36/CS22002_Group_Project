from app import app
from models import db, Quiz, Question, Answer



with app.app_context():
    db.create_all()
    print("Database tables created successfully!")
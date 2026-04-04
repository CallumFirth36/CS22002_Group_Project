from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Quiz(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)

    questions = db.relationship("Question", backref="quiz", cascade="all, delete")


class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    quiz_id = db.Column(db.Integer, db.ForeignKey("quiz.id"), nullable=False)

    question_text = db.Column(db.String(500), nullable=False)
    image_url = db.Column(db.String(500))
    correct_answer_index = db.Column(db.Integer, nullable=False)

    answers = db.relationship("Answer", backref="question", cascade="all, delete")


class Answer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(db.Integer, db.ForeignKey("question.id"), nullable=False)

    answer_text = db.Column(db.String(300), nullable=False)
    answer_index = db.Column(db.Integer, nullable=False)
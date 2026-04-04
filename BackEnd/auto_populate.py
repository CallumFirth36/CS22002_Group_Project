from app import app
from models import db, Quiz, Question, Answer

with app.app_context():

    quiz = Quiz(title="Test Title")
    db.session.add(quiz)
    db.session.commit()

    # Q1
    q1 = Question(
        quiz_id=quiz.id,
        question_text="What is 4+4?",
        image_url="https://placehold.co/300x200",
        correct_answer_index=3
    )
    db.session.add(q1)
    db.session.commit()

    answers1 = ["1", "5", "9", "8"]
    for i, text in enumerate(answers1):
        db.session.add(Answer(question_id=q1.id, answer_text=text, answer_index=i))

    # Q2
    q2 = Question(
        quiz_id=quiz.id,
        question_text="What is the capital of the UK?",
        image_url="https://placehold.co/300x200",
        correct_answer_index=0
    )
    db.session.add(q2)
    db.session.commit()

    answers2 = ["London", "Manchester", "Liverpool", "Brighton"]
    for i, text in enumerate(answers2):
        db.session.add(Answer(question_id=q2.id, answer_text=text, answer_index=i))

    # Q3
    q3 = Question(
        quiz_id=quiz.id,
        question_text="What is the Red Planet?",
        image_url="https://placehold.co/300x200",
        correct_answer_index=1
    )
    db.session.add(q3)
    db.session.commit()

    answers3 = ["Earth", "Mars", "Venus", "Jupiter"]
    for i, text in enumerate(answers3):
        db.session.add(Answer(question_id=q3.id, answer_text=text, answer_index=i))

    db.session.commit()

    print("Quiz populated successfully!")
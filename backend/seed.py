from app import app
from models import db, Quiz, Question, Answer, User

with app.app_context():
    db.drop_all()
    db.create_all()

    # Create default admin
    admin = User(account_number="admin", role="admin")
    admin.set_password("admin123")
    db.session.add(admin)
    db.session.commit()   # <-- THIS WAS MISSING

    # Create quiz (NOW assigned to admin)
    quiz = Quiz(title="Test Title", user_id=admin.id)
    db.session.add(quiz)
    db.session.commit()

    # Questions
    questions = [
        {
            "image": "https://placehold.co/300x200",
            "question": "What is 4+4?",
            "answers": ["1", "5", "9", "8"],
            "correct": 3
        },
        {
            "image": "https://placehold.co/300x200",
            "question": "What is the capital of the UK?",
            "answers": ["London", "Manchester", "Liverpool", "Brighton"],
            "correct": 0
        },
        {
            "image": "https://placehold.co/300x200",
            "question": "What is the Red Planet?",
            "answers": ["Earth", "Mars", "Venus", "Jupiter"],
            "correct": 1
        }
    ]

    for q in questions:
        question = Question(
            quiz_id=quiz.id,
            question_text=q["question"],
            image_url=q["image"],
            correct_answer_index=q["correct"]
        )
        db.session.add(question)
        db.session.commit()

        for i, text in enumerate(q["answers"]):
            ans = Answer(
                question_id=question.id,
                answer_text=text,
                answer_index=i
            )
            db.session.add(ans)

    db.session.commit()

    print("Database seeded successfully!")

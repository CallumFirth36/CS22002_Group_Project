from flask import Flask, jsonify, request, render_template
from flask_restful import Api, Resource

app = Flask(__name__)

# Database config
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///quiz.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Import models AFTER app is created
from models import db, Quiz, Question, Answer, User

db.init_app(app)
api = Api(app)

# ---------------------------
# Serve Frontend (SPA)
# ---------------------------
@app.route("/")
def index():
    return render_template("index.html")

# ---------------------------
# ACCOUNT ENDPOINTS
# ---------------------------

@app.post("/api/accounts")
def create_account():
    data = request.json
    if not data or "account_number" not in data or "password" not in data:
        return {"error": "Missing account_number or password"}, 400

    if User.query.filter_by(account_number=data["account_number"]).first():
        return {"error": "Account number already exists"}, 400

    user = User(
        account_number=data["account_number"],
        role=data.get("role", "user")
    )
    user.set_password(data["password"])

    db.session.add(user)
    db.session.commit()

    return {"message": "Account created", "id": user.id}, 201


@app.post("/api/login")
def login():
    data = request.json

    # DEBUG LOGGING — this tells us EXACTLY what the frontend is sending
    print("DATA RECEIVED:", data)

    if not data or "account_number" not in data or "password" not in data:
        return {"error": "Missing credentials"}, 400

    user = User.query.filter_by(account_number=data["account_number"]).first()
    print("USER FOUND:", user)

    if not user or not user.check_password(data["password"]):
        return {"error": "Invalid account number or password"}, 401

    return {
        "message": "Login successful",
        "id": user.id,
        "role": user.role
    }

# ---------------------------
# REST API
# ---------------------------

class QuizListAPI(Resource):
    def get(self):
        quizzes = Quiz.query.all()
        return jsonify([{"id": q.id, "title": q.title} for q in quizzes])

    def post(self):
        data = request.json
        if not data or "title" not in data:
            return {"error": "Missing required field: title"}, 400

        new_quiz = Quiz(title=data["title"])
        db.session.add(new_quiz)
        db.session.commit()

        return {"message": "Quiz created", "id": new_quiz.id}, 201


class QuizAPI(Resource):
    def get(self, quiz_id):
        quiz = Quiz.query.get(quiz_id)
        if not quiz:
            return {"error": "Quiz not found"}, 404

        result = {
            "title": quiz.title,
            "questions": []
        }

        for q in quiz.questions:
            answers = [
                a.answer_text
                for a in sorted(q.answers, key=lambda x: x.answer_index)
            ]

            result["questions"].append({
                "image": q.image_url,
                "question": q.question_text,
                "answers": answers,
                "correct": q.correct_answer_index
            })

        return jsonify(result)

    def put(self, quiz_id):
        quiz = Quiz.query.get(quiz_id)
        if not quiz:
            return {"error": "Quiz not found"}, 404

        data = request.json
        if "title" not in data:
            return {"error": "Missing required field: title"}, 400

        quiz.title = data["title"]
        db.session.commit()

        return {"message": "Quiz updated successfully"}

    def delete(self, quiz_id):
        quiz = Quiz.query.get(quiz_id)
        if not quiz:
            return {"error": "Quiz not found"}, 404

        db.session.delete(quiz)
        db.session.commit()

        return {"message": "Quiz deleted successfully"}


class QuestionListAPI(Resource):
    def post(self, quiz_id):
        quiz = Quiz.query.get(quiz_id)
        if not quiz:
            return {"error": "Quiz not found"}, 404

        data = request.json
        required = ["question", "image", "answers", "correct"]
        if not all(k in data for k in required):
            return {"error": "Missing required fields"}, 400

        q = Question(
            quiz_id=quiz.id,
            question_text=data["question"],
            image_url=data["image"],
            correct_answer_index=data["correct"]
        )
        db.session.add(q)
        db.session.commit()

        for i, text in enumerate(data["answers"]):
            ans = Answer(
                question_id=q.id,
                answer_text=text,
                answer_index=i
            )
            db.session.add(ans)

        db.session.commit()

        return {"message": "Question added", "id": q.id}, 201


class QuestionAPI(Resource):
    def put(self, quiz_id, question_id):
        question = Question.query.get(question_id)
        if not question or question.quiz_id != quiz_id:
            return {"error": "Question not found"}, 404

        data = request.json
        required = ["question", "image", "answers", "correct"]
        if not all(k in data for k in required):
            return {"error": "Missing required fields"}, 400

        question.question_text = data["question"]
        question.image_url = data["image"]
        question.correct_answer_index = data["correct"]

        Answer.query.filter_by(question_id=question_id).delete()

        for i, text in enumerate(data["answers"]):
            db.session.add(Answer(
                question_id=question_id,
                answer_text=text,
                answer_index=i
            ))

        db.session.commit()

        return {"message": "Question updated successfully"}

    def delete(self, quiz_id, question_id):
        question = Question.query.get(question_id)
        if not question or question.quiz_id != quiz_id:
            return {"error": "Question not found"}, 404

        db.session.delete(question)
        db.session.commit()

        return {"message": "Question deleted successfully"}


# Register API routes
api.add_resource(QuizListAPI, "/api/quizzes")
api.add_resource(QuizAPI, "/api/quizzes/<int:quiz_id>")
api.add_resource(QuestionListAPI, "/api/quizzes/<int:quiz_id>/questions")
api.add_resource(QuestionAPI, "/api/quizzes/<int:quiz_id>/questions/<int:question_id>")


# Run app
if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)

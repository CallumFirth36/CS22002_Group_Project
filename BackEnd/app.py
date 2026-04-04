from flask import Flask
from flask_restful import Api
from flask_restful import Resource
from flask import jsonify, request
from models import Quiz, Question, Answer

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///quiz.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)
api = Api(app)


@app.route("/")
def home():
    return "Quiz API Running!"

# Get, Post - Quiz List
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

# Get, Put, Delete - QuizAPI
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

# Post - Question List
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

# Put, Delete - Single Question
class QuestionAPI(Resource):
    def put(self, quiz_id, question_id):
        question = Question.query.get(question_id)
        if not question or question.quiz_id != quiz_id:
            return {"error": "Question not found"}, 404

        data = request.json
        required = ["question", "image", "answers", "correct"]
        if not all(k in data for k in required):
            return {"error": "Missing required fields"}, 400

        # Update question
        question.question_text = data["question"]
        question.image_url = data["image"]
        question.correct_answer_index = data["correct"]

        # Delete old answers
        Answer.query.filter_by(question_id=question_id).delete()

        # Add new answers
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




api.add_resource(QuizListAPI, "/api/quizzes")
api.add_resource(QuizAPI, "/api/quizzes/<int:quiz_id>")
api.add_resource(QuestionListAPI, "/api/quizzes/<int:quiz_id>/questions")
api.add_resource(QuestionAPI, "/api/quizzes/<int:quiz_id>/questions/<int:question_id>")







if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
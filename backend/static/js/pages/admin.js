import { AdminHeader } from "../components/AdminHeader.js";
import { QuestionList } from "../components/QuestionList.js";
import { CategorySelector } from "../components/CategorySelector.js";
import { AnswerOptionsEditor } from "../components/AnswerOptionsEditor.js";
import { ImagePickerGrid } from "../components/ImagePickerGrid.js";

const CATEGORY_OPTIONS = ["Cat 1", "Cat 2", "Cat 3"];

const IMAGE_OPTIONS = Array.from({ length: 9 }, (_, index) => {
    const imageNumber = index + 1;
    return `https://placehold.co/320x200/e0e0e0/4b4b4b?text=Image+${imageNumber}`;
});

function createQuestion() {
    return {
        category: CATEGORY_OPTIONS[0],
        questionText: "",
        answers: ["", "", "", ""],
        correctAnswerIndex: null,
        selectedImageIndex: null
    };
}

export function AdminPage() {
    const app = document.getElementById("app");

    let currentQuestionIndex = 0;
    const questions = [createQuestion()];

    function updateQuestion(updater, shouldRender = true) {
        updater(questions[currentQuestionIndex]);
        if (shouldRender) {
            render();
        }
    }

    function render() {
        app.innerHTML = "";
        app.className = "admin-page";

        const header = AdminHeader();
        app.appendChild(header);

        const content = document.createElement("div");
        content.classList.add("admin-content");

        const listPanel = QuestionList(
            questions,
            currentQuestionIndex,
            (index) => {
                currentQuestionIndex = index;
                render();
            },
            () => {
                questions.push(createQuestion());
                currentQuestionIndex = questions.length - 1;
                render();
            },
            () => {
                if (questions.length <= 1) {
                    return;
                }

                questions.splice(currentQuestionIndex, 1);
                if (currentQuestionIndex >= questions.length) {
                    currentQuestionIndex = questions.length - 1;
                }
                render();
            }
        );

        const editorPanel = document.createElement("section");
        editorPanel.classList.add("admin-editor");

        const currentQuestion = questions[currentQuestionIndex];

        const heading = document.createElement("h2");
        heading.classList.add("admin-editor__title");
        heading.textContent = `Question ${currentQuestionIndex + 1}`;

        const categorySelector = CategorySelector(
            CATEGORY_OPTIONS,
            currentQuestion.category,
            (category) => updateQuestion((q) => {
                q.category = category;
            })
        );

        const questionSection = document.createElement("section");
        questionSection.classList.add("admin-form__section");

        const questionLabel = document.createElement("h4");
        questionLabel.classList.add("admin-form__label");
        questionLabel.textContent = "Write Question";

        const questionInput = document.createElement("input");
        questionInput.type = "text";
        questionInput.classList.add("admin-input", "admin-question-input");
        questionInput.placeholder = "Question here";
        questionInput.value = currentQuestion.questionText;
        questionInput.addEventListener("input", (event) => updateQuestion((q) => {
            q.questionText = event.target.value;
        }, false));

        questionSection.appendChild(questionLabel);
        questionSection.appendChild(questionInput);

        const answersSection = AnswerOptionsEditor(
            currentQuestion.answers,
            currentQuestion.correctAnswerIndex,
            (answerIndex, value) => updateQuestion((q) => {
                q.answers[answerIndex] = value;
            }, false),
            (answerIndex) => updateQuestion((q) => {
                q.correctAnswerIndex = answerIndex;
            })
        );

        const imagesSection = ImagePickerGrid(
            IMAGE_OPTIONS,
            currentQuestion.selectedImageIndex,
            (imageIndex) => updateQuestion((q) => {
                q.selectedImageIndex = imageIndex;
            })
        );

        const finishButton = document.createElement("button");
        finishButton.type = "button";
        finishButton.classList.add("admin-finish-btn");
        finishButton.textContent = "Finish Question";
        finishButton.addEventListener("click", () => {
            const currentQuestionOutput = {
                question: currentQuestionIndex + 1,
                category: currentQuestion.category,
                text: currentQuestion.questionText,
                answers: currentQuestion.answers,
                correctAnswerIndex: currentQuestion.correctAnswerIndex,
                image: IMAGE_OPTIONS[currentQuestion.selectedImageIndex] ?? null,
                selectedImageIndex: currentQuestion.selectedImageIndex
            };

            console.log("Finished question:", currentQuestionOutput);

            if (currentQuestionIndex < questions.length - 1) {
                currentQuestionIndex += 1;
                render();
                return;
            }

            const readyQuestions = questions.map((question, index) => ({
                question: index + 1,
                category: question.category,
                text: question.questionText,
                answers: question.answers,
                correctAnswerIndex: question.correctAnswerIndex,
                image: IMAGE_OPTIONS[question.selectedImageIndex] ?? null
            }));

            console.log("Quiz draft:", readyQuestions);
            window.alert("Question saved. Check console for output.");
        });

        editorPanel.appendChild(heading);
        editorPanel.appendChild(categorySelector);
        editorPanel.appendChild(questionSection);
        editorPanel.appendChild(answersSection);
        editorPanel.appendChild(imagesSection);
        editorPanel.appendChild(finishButton);

        content.appendChild(listPanel);
        content.appendChild(editorPanel);
        app.appendChild(content);
    }

    render();
}

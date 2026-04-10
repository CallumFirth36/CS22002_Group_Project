/*
    Admin Page

    USE: The JavaScript used for the admin page
    AUTHOR: Bailey Clark
    DATE: 10/04/2026
*/
import { AdminHeader } from "../components/AdminHeader.js";
import { QuestionList } from "../components/questionList.js";
import { CategorySelector } from "../components/CategorySelector.js";
import { AnswerOptionsEditor } from "../components/AnswerOptionsEditor.js";
import { ImagePickerGrid } from "../components/ImagePickerGrid.js";
import { navigate } from "../main.js";

const CATEGORY_OPTIONS = ["Pokemon", "Anime", "Rick and Morty"];

const IMAGE_OPTIONS = Array.from({ length: 9 }, (_, index) => {
    const imageNumber = index + 1;
    return `https://placehold.co/320x200/e0e0e0/4b4b4b?text=Image+${imageNumber}`;
});

const POKEMON_LIST_LIMIT = 1025;
const DEFAULT_POKEMON_PREVIEW_COUNT = 40;
const JIKAN_ANIME_PAGES = 3;
const JIKAN_PAGE_LIMIT = 25;
const RICK_MORTY_PAGES = 3;

function getPokemonArtworkUrl(id) {
    // Use official artwork endpoint for more consistent image quality.
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

async function fetchPokemonImages() {
    const listResponse = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${POKEMON_LIST_LIMIT}`);
    if (!listResponse.ok) {
        throw new Error("Failed to fetch Pokemon list");
    }

    const listData = await listResponse.json();
    return listData.results
        .map((pokemon) => {
            // PokeAPI list endpoint gives IDs inside the resource URL.
            const match = pokemon.url.match(/\/pokemon\/(\d+)\/?$/);
            if (!match) {
                return null;
            }
            const id = Number(match[1]);
            return {
                id,
                name: pokemon.name,
                url: getPokemonArtworkUrl(id)
            };
        })
        .filter(Boolean);
}

async function fetchAnimeImages() {
    const requests = Array.from({ length: JIKAN_ANIME_PAGES }, (_, index) => {
        const page = index + 1;
        return fetch(`https://api.jikan.moe/v4/top/anime?page=${page}&limit=${JIKAN_PAGE_LIMIT}`);
    });
    const responses = await Promise.all(requests);

    for (const response of responses) {
        if (!response.ok) {
            throw new Error("Failed to fetch anime list");
        }
    }

    const payloads = await Promise.all(responses.map((response) => response.json()));
    return payloads
        .flatMap((payload) => payload?.data || [])
        .map((anime) => ({
            id: anime.mal_id,
            name: anime.title,
            url: anime.images?.jpg?.image_url || anime.images?.webp?.image_url || null
        }))
        .filter((anime) => anime.url);
}

async function fetchRickAndMortyImages() {
    const requests = Array.from({ length: RICK_MORTY_PAGES }, (_, index) => {
        const page = index + 1;
        return fetch(`https://rickandmortyapi.com/api/character?page=${page}`);
    });
    const responses = await Promise.all(requests);

    for (const response of responses) {
        if (!response.ok) {
            throw new Error("Failed to fetch Rick and Morty characters");
        }
    }

    const payloads = await Promise.all(responses.map((response) => response.json()));
    return payloads
        .flatMap((payload) => payload?.results || [])
        .map((character) => ({
            id: character.id,
            name: character.name,
            url: character.image
        }))
        .filter((character) => character.url);
}

function createQuestion() {
    // Shared default shape used for both initial and newly added questions.
    return {
        category: CATEGORY_OPTIONS[0],
        questionText: "",
        answers: ["", "", "", ""],
        correctAnswerIndex: null,
        selectedImageUrl: null
    };
}

export function AdminPage() {
    const app = document.getElementById("app");
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id;

    let currentQuestionIndex = 0;
    const questions = [createQuestion()];
    let quizTitle = "Untitled Quiz";
    let isSubmitting = false;
    const categoryImages = {
        Pokemon: [],
        Anime: [],
        "Rick and Morty": []
    };
    let isPokemonLoading = false;
    let pokemonLoadError = "";
    let isAnimeLoading = false;
    let animeLoadError = "";
    let isRickAndMortyLoading = false;
    let rickAndMortyLoadError = "";
    let pokemonSearchQuery = "";
    let animeSearchQuery = "";
    let rickAndMortySearchQuery = "";

    function updateQuestion(updater, shouldRender = true) {
        // Centralized state mutation for current question.
        updater(questions[currentQuestionIndex]);
        if (shouldRender) {
            render();
        }
    }

    async function ensurePokemonImagesLoaded() {
        // Skip repeat fetches once data exists or request is already in-flight.
        if (categoryImages.Pokemon.length || isPokemonLoading) {
            return;
        }

        isPokemonLoading = true;
        pokemonLoadError = "";
        render();

        try {
            categoryImages.Pokemon = await fetchPokemonImages();
        } catch (error) {
            console.error("Failed loading Pokemon images:", error);
            pokemonLoadError = "Unable to load Pokemon images right now.";
        } finally {
            isPokemonLoading = false;
            render();
        }
    }

    async function ensureAnimeImagesLoaded() {
        if (categoryImages.Anime.length || isAnimeLoading) {
            return;
        }

        isAnimeLoading = true;
        animeLoadError = "";
        render();

        try {
            categoryImages.Anime = await fetchAnimeImages();
        } catch (error) {
            console.error("Failed loading anime images:", error);
            animeLoadError = "Unable to load Anime images right now.";
        } finally {
            isAnimeLoading = false;
            render();
        }
    }

    async function ensureRickAndMortyImagesLoaded() {
        if (categoryImages["Rick and Morty"].length || isRickAndMortyLoading) {
            return;
        }

        isRickAndMortyLoading = true;
        rickAndMortyLoadError = "";
        render();

        try {
            categoryImages["Rick and Morty"] = await fetchRickAndMortyImages();
        } catch (error) {
            console.error("Failed loading Rick and Morty images:", error);
            rickAndMortyLoadError = "Unable to load Rick and Morty images right now.";
        } finally {
            isRickAndMortyLoading = false;
            render();
        }
    }

    function setQuestionCount(nextCount) {
        // Keep at least one question so editor always has a target.
        const targetCount = Math.max(1, nextCount);
        if (targetCount === questions.length) {
            return;
        }

        if (targetCount > questions.length) {
            const questionsToAdd = targetCount - questions.length;
            for (let i = 0; i < questionsToAdd; i += 1) {
                questions.push(createQuestion());
            }
        } else {
            questions.splice(targetCount);
            if (currentQuestionIndex >= questions.length) {
                currentQuestionIndex = questions.length - 1;
            }
        }

        render();
    }

    function getImagesForCategory(category) {
        if (category === "Pokemon") {
            return categoryImages.Pokemon;
        }
        if (category === "Anime") {
            return categoryImages.Anime;
        }
        if (category === "Rick and Morty") {
            return categoryImages["Rick and Morty"];
        }
        return IMAGE_OPTIONS;
    }

    function getImageStatusForCategory(category) {
        // Return contextual loading/empty/error text for image picker panel.
        if (category === "Pokemon") {
            if (isPokemonLoading) {
                return "Loading Pokemon images...";
            }
            if (pokemonLoadError) {
                return pokemonLoadError;
            }
            if (!categoryImages.Pokemon.length) {
                return "No Pokemon images available.";
            }
            return "";
        }
        if (category === "Anime") {
            if (isAnimeLoading) {
                return "Loading Anime images...";
            }
            if (animeLoadError) {
                return animeLoadError;
            }
            if (!categoryImages.Anime.length) {
                return "No Anime images available.";
            }
            return "";
        }
        if (category === "Rick and Morty") {
            if (isRickAndMortyLoading) {
                return "Loading Rick and Morty images...";
            }
            if (rickAndMortyLoadError) {
                return rickAndMortyLoadError;
            }
            if (!categoryImages["Rick and Morty"].length) {
                return "No Rick and Morty images available.";
            }
            return "";
        }
        return "";
    }

    function getSearchConfigForCategory(category) {
        // Search config is category-specific so query state is preserved per tab.
        if (category === "Pokemon") {
            return {
                value: pokemonSearchQuery,
                maxDefaultResults: DEFAULT_POKEMON_PREVIEW_COUNT,
                placeholder: "Search Pokemon by name (e.g. pika, char)",
                onChange: (value) => {
                    pokemonSearchQuery = value;
                },
                getSearchText: (pokemon) => pokemon.name
            };
        }
        if (category === "Anime") {
            return {
                value: animeSearchQuery,
                maxDefaultResults: DEFAULT_POKEMON_PREVIEW_COUNT,
                placeholder: "Search Anime by title (e.g. naruto, one piece)",
                onChange: (value) => {
                    animeSearchQuery = value;
                },
                getSearchText: (anime) => anime.name
            };
        }
        if (category === "Rick and Morty") {
            return {
                value: rickAndMortySearchQuery,
                maxDefaultResults: DEFAULT_POKEMON_PREVIEW_COUNT,
                placeholder: "Search character by name (e.g. Rick, Morty)",
                onChange: (value) => {
                    rickAndMortySearchQuery = value;
                },
                getSearchText: (character) => character.name
            };
        }
        return null;
    }

    function validateQuestions() {
        // Validate all data client-side before calling save APIs.
        if (!quizTitle.trim()) {
            return "Quiz title is required.";
        }

        for (let i = 0; i < questions.length; i += 1) {
            const question = questions[i];
            if (!question.questionText.trim()) {
                return `Question ${i + 1} text is required.`;
            }
            if (!question.selectedImageUrl) {
                return `Question ${i + 1} needs an image selected.`;
            }
            if (question.correctAnswerIndex === null || question.correctAnswerIndex === undefined) {
                return `Question ${i + 1} needs a correct answer selected.`;
            }

            const hasInvalidAnswer = question.answers.some((answer) => !String(answer).trim());
            if (hasInvalidAnswer) {
                return `Question ${i + 1} needs all 4 answers filled in.`;
            }
        }

        return null;
    }

    async function submitQuiz() {
        const validationError = validateQuestions();
        if (validationError) {
            window.alert(validationError);
            return;
        }

        isSubmitting = true;
        render();

        try {
            // First create the quiz shell, then post each question under it.
            const createQuizResponse = await fetch("/api/quizzes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: quizTitle.trim(),user_id: userId})
            });
            const createQuizData = await createQuizResponse.json();

            if (!createQuizResponse.ok || createQuizData.error || !createQuizData.id) {
                throw new Error(createQuizData.error || "Failed to create quiz.");
            }

            const quizId = createQuizData.id;
            for (const question of questions) {
                // Trim values before submit to avoid whitespace-only entries.
                const payload = {
                    question: question.questionText.trim(),
                    image: question.selectedImageUrl,
                    answers: question.answers.map((answer) => String(answer).trim()),
                    correct: question.correctAnswerIndex
                };

                const questionResponse = await fetch(`/api/quizzes/${quizId}/questions`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
                const questionData = await questionResponse.json();

                if (!questionResponse.ok || questionData.error) {
                    throw new Error(questionData.error || "Failed to save a question.");
                }
            }

            window.alert(`Quiz saved successfully (ID: ${quizId}).`);
            console.log("Saved quiz:", {
                id: quizId,
                title: quizTitle.trim(),
                questions
            });
        } catch (error) {
            console.error("Quiz submit failed:", error);
            window.alert(`Failed to save quiz: ${error.message}`);
        } finally {
            isSubmitting = false;
            render();
        }
    }

    function render() {
        // Full rerender keeps UI in sync with simple local state variables.
        app.innerHTML = "";
        app.className = "admin-page";

        const header = AdminHeader();
        const headerHomeButton = header.querySelector(".admin-header__home");
        headerHomeButton.addEventListener("click", () => {
            navigate("menu");
        });
        const headerUserButton = header.querySelector(".admin-header__user");
        headerUserButton.addEventListener("click", () => {
            const popup = document.createElement("div");
            popup.classList.add("logout_popup");

            popup.innerHTML = `
                <div class="logout_box">
                    <p>Log out?</p>
                    <button id="yesLogout">Yes</button>
                    <button id="noLogout">No</button>
                </div>
            `;

            document.body.appendChild(popup);

            document.getElementById("yesLogout").addEventListener("click", () => {
                localStorage.removeItem("user");
                navigate("login");
                popup.remove();
            });

            document.getElementById("noLogout").addEventListener("click", () => {
                popup.remove();
            });
        });

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
                // Remove current question and move selection if needed.
                if (questions.length <= 1) {
                    return;
                }

                questions.splice(currentQuestionIndex, 1);
                if (currentQuestionIndex >= questions.length) {
                    currentQuestionIndex = questions.length - 1;
                }
                render();
            },
            (nextCount) => {
                setQuestionCount(nextCount);
            }
        );

        const editorPanel = document.createElement("section");
        editorPanel.classList.add("admin-editor");

        const currentQuestion = questions[currentQuestionIndex];

        const heading = document.createElement("h2");
        heading.classList.add("admin-editor__title");
        heading.textContent = `Question ${currentQuestionIndex + 1}`;

        const titleSection = document.createElement("section");
        titleSection.classList.add("admin-form__section");

        const titleLabel = document.createElement("h4");
        titleLabel.classList.add("admin-form__label");
        titleLabel.textContent = "Quiz Title";

        const titleInput = document.createElement("input");
        titleInput.type = "text";
        titleInput.classList.add("admin-input");
        titleInput.placeholder = "Enter quiz title";
        titleInput.value = quizTitle;
        titleInput.addEventListener("input", (event) => {
            quizTitle = event.target.value;
        });

        titleSection.appendChild(titleLabel);
        titleSection.appendChild(titleInput);

        const categorySelector = CategorySelector(
            CATEGORY_OPTIONS,
            currentQuestion.category,
            (category) => updateQuestion((q) => {
                q.category = category;
                q.selectedImageUrl = null;
                // Lazy-load assets only when category is actually selected.
                if (category === "Pokemon") {
                    ensurePokemonImagesLoaded();
                }
                if (category === "Anime") {
                    ensureAnimeImagesLoaded();
                }
                if (category === "Rick and Morty") {
                    ensureRickAndMortyImagesLoaded();
                }
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

        const currentImages = getImagesForCategory(currentQuestion.category);
        const imagesSection = ImagePickerGrid(
            currentImages,
            currentQuestion.selectedImageUrl,
            (imageUrl) => updateQuestion((q) => {
                q.selectedImageUrl = imageUrl;
            }),
            getImageStatusForCategory(currentQuestion.category),
            getSearchConfigForCategory(currentQuestion.category)
        );

        const finishButton = document.createElement("button");
        finishButton.type = "button";
        finishButton.classList.add("admin-finish-btn");
        finishButton.textContent = "Finish Question";
        finishButton.addEventListener("click", () => {
            // Console draft is useful for manual QA while building quizzes.
            const currentQuestionOutput = {
                question: currentQuestionIndex + 1,
                category: currentQuestion.category,
                text: currentQuestion.questionText,
                answers: currentQuestion.answers,
                correctAnswerIndex: currentQuestion.correctAnswerIndex,
                image: currentQuestion.selectedImageUrl
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
                image: question.selectedImageUrl
            }));

            console.log("Quiz draft:", readyQuestions);
            window.alert("Question saved. Check console for output.");
        });

        const submitButton = document.createElement("button");
        submitButton.type = "button";
        submitButton.classList.add("admin-finish-btn");
        submitButton.textContent = isSubmitting ? "Submitting..." : "Submit Quiz";
        submitButton.disabled = isSubmitting;
        submitButton.addEventListener("click", submitQuiz);

        editorPanel.appendChild(heading);
        editorPanel.appendChild(titleSection);
        editorPanel.appendChild(categorySelector);
        editorPanel.appendChild(questionSection);
        editorPanel.appendChild(answersSection);
        editorPanel.appendChild(imagesSection);
        editorPanel.appendChild(finishButton);
        editorPanel.appendChild(submitButton);

        content.appendChild(listPanel);
        content.appendChild(editorPanel);
        app.appendChild(content);
    }

    ensurePokemonImagesLoaded();
    render();
}

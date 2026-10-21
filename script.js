
/* ---------- Quiz Questions ---------- */

const questions = [
    {
        type: "single",
        category: "SINGLE CHOICE",
        question: "What does HTML stand for?",
        instruction: "Select one correct answer.",
        options: [
            "Hyper Text Markup Language",
            "High Transfer Machine Language",
            "Hyperlink Text Management Language",
            "Home Tool Markup Language"
        ],
        answer: 0,
        explanation: "HTML stands for HyperText Markup Language."
    },
    {
        type: "single",
        category: "SINGLE CHOICE",
        question: "Which language is used to style a web page?",
        instruction: "Select one correct answer.",
        options: ["Python", "CSS", "SQL", "Java"],
        answer: 1,
        explanation: "CSS controls the colors, layout, spacing and appearance of web pages."
    },
    {
        type: "multi",
        category: "MULTI SELECT",
        question: "Which of these are programming languages?",
        instruction: "Select all correct answers.",
        options: ["Python", "HTML", "Java", "JavaScript"],
        answer: [0, 2, 3],
        explanation: "Python, Java and JavaScript are programming languages. HTML is a markup language."
    },
    {
        type: "fill",
        category: "FILL IN THE BLANK",
        question: "Which keyword declares a variable in JavaScript that can be reassigned?",
        instruction: "Type the missing keyword.",
        answer: ["let"],
        explanation: "The let keyword declares a block-scoped variable that can be reassigned."
    },
    {
        type: "single",
        category: "SINGLE CHOICE",
        question: "Which HTML tag creates a hyperlink?",
        instruction: "Select one correct answer.",
        options: ["<link>", "<href>", "<a>", "<url>"],
        answer: 2,
        explanation: "The <a> (anchor) element creates a hyperlink."
    },
    {
        type: "multi",
        category: "MULTI SELECT",
        question: "Which of these are valid CSS ways to specify a color?",
        instruction: "Select all correct answers.",
        options: ["red", "#ff0000", "rgb(255, 0, 0)", "color(255)"],
        answer: [0, 1, 2],
        explanation: "CSS supports named colors, hexadecimal colors and RGB color values."
    },
    {
        type: "single",
        category: "SINGLE CHOICE",
        question: "Which symbol is commonly used for a single-line comment in JavaScript?",
        instruction: "Select one correct answer.",
        options: ["<!-- -->", "//", "**", "##"],
        answer: 1,
        explanation: "JavaScript uses // for single-line comments."
    },
    {
        type: "fill",
        category: "FILL IN THE BLANK",
        question: "Which method writes a message to the browser console?",
        instruction: "Type the method name without parentheses.",
        answer: ["console.log", "console.log()"],
        explanation: "console.log() outputs a message to the browser's developer console."
    },
    {
        type: "multi",
        category: "MULTI SELECT",
        question: "Which of these are commonly used for front-end web development?",
        instruction: "Select all correct answers.",
        options: ["HTML", "CSS", "JavaScript", "SQL"],
        answer: [0, 1, 2],
        explanation: "HTML, CSS and JavaScript are core front-end technologies. SQL is used to query databases."
    },
    {
        type: "single",
        category: "SINGLE CHOICE",
        question: "Which JavaScript method selects an element by its ID?",
        instruction: "Select one correct answer.",
        options: [
            "document.queryID()",
            "document.getElementById()",
            "document.selectID()",
            "document.findElement()"
        ],
        answer: 1,
        explanation: "document.getElementById() returns an element matching the supplied ID."
    }
];

/* ---------- DOM Elements ---------- */

const welcomeScreen = document.getElementById("welcome-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultsScreen = document.getElementById("results-screen");

const beginButton = document.getElementById("begin-btn");
const quitButton = document.getElementById("quit-btn");
const submitButton = document.getElementById("submit-btn");
const nextButton = document.getElementById("next-btn");
const retryButton = document.getElementById("retry-btn");

const questionType = document.getElementById("question-type");
const questionCounter = document.getElementById("question-counter");
const questionNumber = document.getElementById("question-number");
const questionText = document.getElementById("question-text");
const questionInstruction = document.getElementById("question-instruction");

const progressTrack = document.getElementById("progress-track");
const progressFill = document.getElementById("progress-fill");
const optionsList = document.getElementById("options-list");

const fillAnswer = document.getElementById("fill-answer");
const fillInput = document.getElementById("fill-input");
const feedback = document.getElementById("feedback");

const resultIcon = document.getElementById("result-icon");
const resultHeading = document.getElementById("result-heading");
const resultMessage = document.getElementById("result-message");
const scoreValue = document.getElementById("score-value");
const correctCount = document.getElementById("correct-count");
const incorrectCount = document.getElementById("incorrect-count");
const pointsCount = document.getElementById("points-count");
const reviewList = document.getElementById("review-list");

/* ---------- Quiz State ---------- */

let currentQuestionIndex = 0;
let selectedAnswers = [];
let userResults = [];
let answered = false;
let quizFinished = false;

/* ---------- Start and Reset ---------- */

function startQuiz() {
    currentQuestionIndex = 0;
    selectedAnswers = [];
    userResults = [];
    answered = false;
    quizFinished = false;

    showScreen("quiz");
    renderQuestion();
}

function showScreen(screen) {
    welcomeScreen.classList.toggle("hidden", screen !== "welcome");
    quizScreen.classList.toggle("hidden", screen !== "quiz");
    resultsScreen.classList.toggle("hidden", screen !== "results");

    window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ---------- Render Question ---------- */

function renderQuestion() {
    const question = questions[currentQuestionIndex];

    selectedAnswers = [];
    answered = false;

    questionType.textContent = question.category;

    questionCounter.textContent =
        `QUESTION ${String(currentQuestionIndex + 1).padStart(2, "0")} / ${questions.length}`;

    questionNumber.textContent =
        `QUESTION ${String(currentQuestionIndex + 1).padStart(2, "0")}`;

    questionText.textContent = question.question;
    questionInstruction.textContent = question.instruction;

    const progress = (currentQuestionIndex / questions.length) * 100;
    progressFill.style.width = `${progress}%`;
    progressTrack.setAttribute("aria-valuenow", currentQuestionIndex);

    optionsList.replaceChildren();
    feedback.className = "feedback hidden";
    feedback.textContent = "";

    fillInput.value = "";
    fillInput.disabled = false;

    const isFillQuestion = question.type === "fill";

    fillAnswer.classList.toggle("hidden", !isFillQuestion);
    optionsList.classList.toggle("hidden", isFillQuestion);

    if (isFillQuestion) {
        fillInput.setAttribute("aria-label", question.instruction);
    } else {
        renderOptions(question);
    }

    submitButton.classList.remove("hidden");
    nextButton.classList.add("hidden");

    submitButton.disabled = false;
    submitButton.textContent = "Check Answer";
    nextButton.textContent =
        currentQuestionIndex === questions.length - 1
            ? "See Results →"
            : "Next Question →";
}

/* ---------- Render Multiple-Choice Options ---------- */

function renderOptions(question) {
    question.options.forEach((optionText, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "option";

        const marker = document.createElement("span");
        marker.className = "option-marker";
        marker.textContent = question.type === "multi"
            ? "+"
            : String.fromCharCode(65 + index);

        const text = document.createElement("span");
        text.className = "option-text";
        text.textContent = optionText;

        button.append(marker, text);

        button.setAttribute("aria-pressed", "false");

        button.addEventListener("click", () => {
            selectOption(index, button, question.type);
        });

        optionsList.appendChild(button);
    });
}

/* ---------- Select an Answer ---------- */

function selectOption(index, button, type) {
    if (answered) return;

    if (type === "single") {
        selectedAnswers = [index];

        optionsList.querySelectorAll(".option").forEach((option) => {
            option.classList.remove("selected");
            option.setAttribute("aria-pressed", "false");
            option.querySelector(".option-marker").textContent =
                String.fromCharCode(65 + [...optionsList.children].indexOf(option));
        });

        button.classList.add("selected");
        button.setAttribute("aria-pressed", "true");
        button.querySelector(".option-marker").textContent = "✓";
    } else {
        if (selectedAnswers.includes(index)) {
            selectedAnswers = selectedAnswers.filter(item => item !== index);
            button.classList.remove("selected");
            button.setAttribute("aria-pressed", "false");
            button.querySelector(".option-marker").textContent = "+";
        } else {
            selectedAnswers.push(index);
            button.classList.add("selected");
            button.setAttribute("aria-pressed", "true");
            button.querySelector(".option-marker").textContent = "✓";
        }
    }
}

/* ---------- Submit and Check Answer ---------- */

function checkAnswer() {
    if (answered || quizFinished) return;

    const question = questions[currentQuestionIndex];

    let userAnswer;

    if (question.type === "fill") {
        userAnswer = fillInput.value.trim();

        if (!userAnswer) {
            showFeedback("Please enter your answer before continuing.", false);
            return;
        }
    } else {
        if (selectedAnswers.length === 0) {
            showFeedback("Please select an answer before continuing.", false);
            return;
        }

        userAnswer = [...selectedAnswers];
    }

    const correct = isCorrectAnswer(question, userAnswer);

    answered = true;

    userResults[currentQuestionIndex] = {
        userAnswer,
        correct
    };

    // Lock inputs after checking the answer
    optionsList.querySelectorAll(".option").forEach((option) => {
        option.disabled = true;
    });

    fillInput.disabled = true;

    const correctAnswerText = getAnswerText(question, question.answer);

    if (correct) {
        showFeedback(`Correct! ${question.explanation}`, true);
    } else {
        showFeedback(
            `Not quite. Correct answer: ${correctAnswerText}. ${question.explanation}`,
            false
        );
    }

    submitButton.classList.add("hidden");
    nextButton.classList.remove("hidden");

    progressFill.style.width =
        `${((currentQuestionIndex + 1) / questions.length) * 100}%`;

    progressTrack.setAttribute("aria-valuenow", currentQuestionIndex + 1);
}

/* ---------- Answer Validation ---------- */

function isCorrectAnswer(question, userAnswer) {
    if (question.type === "fill") {
        const normalize = value => value
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "");

        return question.answer.some(
            accepted => normalize(accepted) === normalize(userAnswer)
        );
    }

    if (question.type === "single") {
        return userAnswer[0] === question.answer;
    }

    // Multi-select: every correct option must be selected,
    // and no incorrect options may be selected.
    const selected = [...userAnswer].sort((a, b) => a - b);
    const correct = [...question.answer].sort((a, b) => a - b);

    return selected.length === correct.length &&
        selected.every((value, index) => value === correct[index]);
}

/* ---------- Feedback ---------- */

function showFeedback(message, isCorrect) {
    feedback.className = `feedback ${isCorrect ? "correct" : "incorrect"}`;
    feedback.textContent = message;
}

/* ---------- Answer Formatting ---------- */

function getAnswerText(question, answer) {
    if (question.type === "fill") {
        return question.answer.join(" or ");
    }

    if (question.type === "single") {
        return question.options[answer];
    }

    return answer.map(index => question.options[index]).join(", ");
}

function getUserAnswerText(question, answer) {
    if (answer === undefined || answer === null ||
        (Array.isArray(answer) && answer.length === 0) ||
        answer === "") {
        return "Not answered";
    }

    if (question.type === "fill") {
        return answer;
    }

    if (question.type === "single") {
        return question.options[answer[0]];
    }

    return answer.map(index => question.options[index]).join(", ");
}

/* ---------- Next Question ---------- */

function goToNextQuestion() {
    if (!answered || quizFinished) return;

    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        renderQuestion();
    } else {
        showResults();
    }
}

/* ---------- Calculate and Display Results ---------- */

function showResults() {
    quizFinished = true;

    const correct = userResults.filter(result => result?.correct).length;
    const incorrect = questions.length - correct;
    const score = Math.round((correct / questions.length) * 100);

    scoreValue.textContent = `${score}%`;
    correctCount.textContent = correct;
    incorrectCount.textContent = incorrect;
    pointsCount.textContent = `${correct * 10}/100`;

    if (score === 100) {
        resultIcon.textContent = "🏆";
        resultHeading.textContent = "Perfect score!";
        resultMessage.textContent = "Amazing work! You answered every question correctly.";
    } else if (score >= 70) {
        resultIcon.textContent = "🎉";
        resultHeading.textContent = "Well done!";
        resultMessage.textContent = "Great job! You have a strong understanding of these topics.";
    } else if (score >= 40) {
        resultIcon.textContent = "🌱";
        resultHeading.textContent = "Good effort!";
        resultMessage.textContent = "You're making progress. Review your answers and try again.";
    } else {
        resultIcon.textContent = "💪";
        resultHeading.textContent = "Keep learning!";
        resultMessage.textContent = "Every attempt helps you improve. Give it another try!";
    }

    renderReview();

    progressFill.style.width = "100%";
    progressTrack.setAttribute("aria-valuenow", questions.length);

    showScreen("results");
}

/* ---------- Review Answers ---------- */

function renderReview() {
    reviewList.replaceChildren();

    questions.forEach((question, index) => {
        const result = userResults[index];
        const correct = result?.correct ?? false;

        const item = document.createElement("article");
        item.className = `review-item ${correct ? "review-correct" : "review-incorrect"}`;

        const status = document.createElement("p");
        status.className = "review-status";
        status.textContent = correct ? "✓ CORRECT" : "✗ INCORRECT";

        const title = document.createElement("p");
        title.className = "review-question";
        title.textContent = `${index + 1}. ${question.question}`;

        const yourAnswer = document.createElement("p");
        yourAnswer.className = "review-answer";

        const yourLabel = document.createElement("strong");
        yourLabel.textContent = "Your answer: ";

        yourAnswer.append(
            yourLabel,
            document.createTextNode(
                getUserAnswerText(question, result?.userAnswer)
            )
        );

        const correctAnswer = document.createElement("p");
        correctAnswer.className = "review-answer";

        const correctLabel = document.createElement("strong");
        correctLabel.textContent = "Correct answer: ";

        correctAnswer.append(
            correctLabel,
            document.createTextNode(
                getAnswerText(question, question.answer)
            )
        );

        item.append(status, title, yourAnswer, correctAnswer);
        reviewList.appendChild(item);
    });
}

/* ---------- Quit and Retry ---------- */

function quitQuiz() {
    const shouldQuit = window.confirm(
        "Are you sure you want to end this quiz and see your current score?"
    );

    if (shouldQuit) {
        showResults();
    }
}

function retryQuiz() {
    startQuiz();
}

/* ---------- Event Listeners ---------- */

beginButton.addEventListener("click", startQuiz);
submitButton.addEventListener("click", checkAnswer);
nextButton.addEventListener("click", goToNextQuestion);
quitButton.addEventListener("click", quitQuiz);
retryButton.addEventListener("click", retryQuiz);

// Allow Enter to submit a fill-in-the-blank answer.
fillInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !answered) {
        event.preventDefault();
        checkAnswer();
    }
});

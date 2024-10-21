let questions = []; // Store questions and votes
let currentQuestion = null; // Store the currently selected question

// Add Question Form
const questionForm = document.getElementById('question-form');
const questionsList = document.getElementById('questions-list');
const rightPane = document.getElementById('question-form-section');
const searchBox = document.getElementById('search-box');

// Submit question and append to left pane
questionForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const subject = document.getElementById('subject').value;
    const question = document.getElementById('question').value;

    // Create new question object
    const newQuestion = {
        subject,
        question,
        votes: 0,
        responses: [],
    };

    questions.push(newQuestion);
    displayQuestions(questions);

    // Reset form
    questionForm.reset();
});

// Display questions in left pane
function displayQuestions(questionsToDisplay) {
    questionsList.innerHTML = '';
    questionsToDisplay
        .sort((a, b) => b.votes - a.votes)
        .forEach((q, index) => {
            const li = document.createElement('li');
            li.classList.add('question-item');
            li.innerHTML = `
                <span>${q.subject} (${q.votes} votes)</span>
                <div class="vote-btn">
                    <button onclick="upVote(${index})">Upvote</button>
                    <button onclick="downVote(${index})">Downvote</button>
                </div>`;
            
            li.addEventListener('click', () => displayQuestion(index));
            questionsList.appendChild(li);
        });
}

// Display selected question and response form
function displayQuestion(index) {
    currentQuestion = questions[index];
    rightPane.innerHTML = `
        <h2>${currentQuestion.subject}</h2>
        <p>${currentQuestion.question}</p>
        <form id="response-form">
            <label for="name">Name</label>
            <input type="text" id="name" required>
            <label for="comment">Comment</label>
            <textarea id="comment" rows="4" required></textarea>
            <button type="submit">Submit Response</button>
        </form>
        <h3>Previous Responses:</h3>
        <ul id="response-list"></ul>
        <button id="resolve-btn">Resolve</button>
    `;

    const responseForm = document.getElementById('response-form');
    responseForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addResponse(index);
    });

    document.getElementById('resolve-btn').addEventListener('click', () => {
        resolveQuestion(index);
    });

    displayResponses(index);
}

// Add a response to the question
function addResponse(index) {
    const name = document.getElementById('name').value;
    const comment = document.getElementById('comment').value;

    questions[index].responses.push({ name, comment, votes: 0 });
    displayResponses(index);
}

// Display responses
function displayResponses(index) {
    const responseList = document.getElementById('response-list');
    responseList.innerHTML = '';

    questions[index].responses.forEach((response) => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${response.name}:</strong> ${response.comment}`;
        responseList.appendChild(li);
    });
}

// Resolve a question
function resolveQuestion(index) {
    questions.splice(index, 1); // Remove question
    rightPane.innerHTML = `<h2>Welcome to Discussion Portal !</h2>`;
    displayQuestions(questions);
}

// Search functionality
searchBox.addEventListener('input', function () {
    const searchTerm = searchBox.value.toLowerCase();
    const filteredQuestions = questions.filter((q) =>
        q.subject.toLowerCase().includes(searchTerm)
    );
    displayQuestions(filteredQuestions);
});

// Upvote a question
function upVote(index) {
    questions[index].votes++;
    displayQuestions(questions);
}

// Downvote a question
function downVote(index) {
    questions[index].votes--;
    displayQuestions(questions);
}

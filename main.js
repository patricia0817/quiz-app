const startContainer = document.querySelector('.container__start') || '';
const questionsContainer =
  document.querySelector('.container__questions') || '';
const finishContainer = document.querySelector('.container__finish') || '';
const startButton = document.querySelector('[data-name="start-quiz"]') || '';
const nextQuestion =
  document.querySelector('.container__questions__submit__form') || '';
const answers = Array.from(
  document.querySelectorAll('[data-name="answer"] label')
);
const correctAnswerStatisticsContainer = document.querySelector(
  '[data-name="correctAnswers"]'
);
const elapsedTimeContainer = document.querySelector(
  '[data-name="elapsedTime"]'
);
const finishStatusContainer = document.querySelector(
  '[data-name="quizStatus"]'
);
let elapsedTime = 0;
let correctAnswers = 0;
let index = 0;
let dataResponse;
let interval;

startButton.addEventListener('click', handleStartButton);
nextQuestion.addEventListener('click', e => {
  e.preventDefault();
  handleNextQuestion();
});
answers.forEach(item => {
  item.addEventListener('click', e => {
    handleAnswer(dataResponse[index], e);
  });
});
const url = `https://opentdb.com/api.php?amount=4&type=multiple`;

document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
    fetch(url).then(response => {
      response.json().then(data => {
        dataResponse = data.results;
        enableStart();
      });
    });
  }
};

function enableStart() {
  startButton.removeAttribute('disabled');
  startButton.value = 'Start';
  interval = setInterval(() => {
    elapsedTime++;
  }, 1000);
}

function handleStartButton() {
  startContainer.style = 'display: none';
  questionsContainer.style = 'display: block';
  updateUI(dataResponse, index);
}

function updateUI(dataResponse, index) {
  const questionData = dataResponse[index];

  const question = document.querySelector('[data-name="question"]') || '';

  const questionValue = questionData.question;
  const min = 0;
  const max = questionData['incorrect_answers'].length;
  let rand = Math.random();
  let i = Math.floor(rand * (max - min + 1)) + min;
  let answersValues = [...questionData['incorrect_answers']];
  answersValues.splice(i, 0, questionData['correct_answer']);
  question.textContent = questionValue;
  answers.forEach((item, index) => {
    item.textContent = answersValues[index];
  });
  nextQuestion.setAttribute('disabled', true);
}

function handleAnswer(questionData, e) {
  nextQuestion.removeAttribute('disabled');
  const answerValue = e.target.textContent;
  if (answerValue === questionData['correct_answer']) {
    correctAnswers++;
  }
}

function handleNextQuestion() {
  index++;
  if (index < dataResponse.length) {
    answers.forEach(item => {
      item.previousElementSibling.checked = false;
    });
    updateUI(dataResponse, index);
    if (index === dataResponse.length - 1) {
      nextQuestion.value = 'Finish';
      nextQuestion.removeEventListener('click', handleNextQuestion);
      nextQuestion.addEventListener('click', handleFinish);
    }
  }
}

function handleFinish() {
  questionsContainer.style = 'display: none';
  finishContainer.style = 'display: block';
  clearInterval(interval);
  correctAnswerStatisticsContainer.textContent = correctAnswers;
  elapsedTimeContainer.textContent = elapsedTime;
  correctAnswers >= dataResponse.length / 2
    ? (finishStatusContainer.textContent = 'Passed!')
    : (finishStatusContainer.textContent = 'Failed!');
  const retakeQuiz = document.querySelector('[data-name="restart"]');
  retakeQuiz.addEventListener('click', handleTakeAnotherQuiz);
}

function handleTakeAnotherQuiz() {
  location.reload();
}

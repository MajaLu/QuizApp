// https://opentdb.com/api.php?amount=10

const _question = document.getElementById('question');
const _options = document.querySelector('.quiz-options');
const _correctScore = document.getElementById('correct-score');
const _totalQuestions = document.getElementById('total-question');
const _checkBtn = document.getElementById('check-answer');
const _playAgainBtn = document.getElementById('play-again');
const _result = document.getElementById('result');

let correctAnswer = "", correctScore = askedCount = 0, totalQuestions = 10;

// Event Listeners
function eventListeners(){
    _checkBtn.addEventListener('click', checkAnswer);
    _playAgainBtn.addEventListener('click', restartQuiz);
}


document.addEventListener('DOMContentLoaded', () => {
    loadQuestion();
    eventListeners();
    _totalQuestions.textContent = totalQuestions;
    _correctScore.textContent = correctScore;
});



async function loadQuestion(){
    const APIUrl = 'https://opentdb.com/api.php?amount=1';
    const result = await fetch(`${APIUrl}`);
    const data = await result.json();
    _result.innerHTML = "";
    // console.log(data.results[0]);
    showQuestion(data.results[0]);
}


//Display question and options
function showQuestion(data){
    _checkBtn.disabled = false;
    correctAnswer = data.correct_answer;
    let incorrectAnswer = data.incorrect_answers;
    let optionsList = incorrectAnswer;
    optionsList.splice(Math.floor(Math.random() * (incorrectAnswer.length + 1)), 0, correctAnswer);//Inserting correct answer random in the list

    _question.innerHTML = `${data.question} <br> <span class="category">${data.category} </span>`;
    _options.innerHTML = `
        ${optionsList.map((option, index) => `
            <li> ${index + 1}. <span> ${option} </span> </li>
        `).join('')}
    `;

    selectOption();

}


// Options Selection
function selectOption(){
    _options.querySelectorAll('li').forEach((option) => {
        option.addEventListener('click', () => {
            if(_options.querySelector('.selected')){
                const activeOption = _options.querySelector('.selected');
                activeOption.classList.remove('selected');
            }
            option.classList.add('selected');
        });
    });
    console.log(correctAnswer);
}


// Answer Check
function checkAnswer(){
   _checkBtn.disabled = true;
   if(_options.querySelector('.selected')){
        let selectedAnswer = _options.querySelector('.selected span').textContent;
        if(selectedAnswer.trim() == HTMLDecode(correctAnswer)){
            correctScore++;
            _result.innerHTML = `<p> <i class = "fas fa-check"></i>Correct Answer! </p>`;
        } 
        else {
            _result.innerHTML = `<p> <i class = "fas fa-times"></i>Wrong Answer! </p> <p><small><b>Correct Answer: </b> ${correctAnswer}</small></p>`;
        }
        checkCount();
    } else {
        _result.innerHTML = `<p><i class = "fas fa-question"></i>Please select an option! </p>`;
        _checkBtn.disabled = false;
    }
}

// Convert html entities into normal text of correct answer if there is any
function HTMLDecode(textString){
    let doc = new DOMParser().parseFromString(textString, "text/html");
    return doc.documentElement.textContent;
}


function checkCount(){
    askedCount++;
    setCount();
    if(askedCount == totalQuestions){
        _result.innerHTML += `<p> Your Score is ${correctScore}. </p>`;
        _playAgainBtn.style.display = "block";
        _checkBtn.style.display = "none";
    }
    else {
        setTimeout(() => {
            loadQuestion();
        }, 300);
    }
}

function setCount(){
    _totalQuestions.textContent = totalQuestions;
    _correctScore.textContent = correctScore;
}

function restartQuiz(){
    correctScore = askedCount = 0;
    _playAgainBtn.style.display = "none";
    _checkBtn.style.display = "block";
    _checkBtn.disabled = false;
    setCount();
    loadQuestion();
}



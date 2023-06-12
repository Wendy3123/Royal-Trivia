const form = document.querySelector('form')
const firstPage = document.getElementById('firstPage')
const topicChoicesPage = document.getElementById('topicChoicePage')
const quizPage = document.getElementById('quizPage')
const choicelinks = document.querySelectorAll('.choicelink')
let questionArray;  
let currentIndex = 0;
let score = 0;
let nextButton = document.getElementById('nextButton')
let answerchoice = document.querySelectorAll('.choice')
let resultPage = document.getElementById('resultPage')

function handleSubmit(e){
    e.preventDefault()
    let username = document.getElementById('PlayerNameInput').value 
    localStorage.setItem('playerName',username)
    firstPage.classList.add('hidden')
    topicChoicesPage.classList.remove('hidden')
}

function chooseTopic(e){
    console.log(e.target.id)
    quizPage.classList.remove('hidden')
    topicChoicesPage.classList.add('hidden')
    fetchQuestions(e.target.id)
}

function fetchQuestions(category){
    fetch(`https://the-trivia-api.com/v2/questions?categories=${category}`)
    .then((response)=>{
        return response.json()
    })
    .then((data)=>{
        console.log(data)
        questionArray = data
        DisplayQuestion()
    })
}

function DisplayQuestion(){
    if(currentIndex === 9){
       nextButton.textContent = 'Finish'
    }
    const question = questionArray[currentIndex]
    let h2Question = document.getElementById('displayQuestion')
    h2Question.textContent = question.question.text
    let answerArray = question.incorrectAnswers
    answerArray.push(question.correctAnswer)
    for(let i=0;i<answerchoice.length;i++){
        answerchoice[i].textContent = answerArray[i]
        answerchoice[i].addEventListener('click', handleUserChoice)
    }
}

function handleUserChoice(e){
    console.log(e.target.textContent)
    let userChoice = e.target.textContent.trim()
    //check if answer is correct
    if(userChoice === questionArray[currentIndex].correctAnswer){
        score+=10
        e.target.classList.add('correct')
    }
    else{
        e.target.classList.add('incorrect')
    }
    //if correct score +10 
    //change all incorrect answers to red
    //chnage correct answer to green
}

function resetChoices(){
    for(let i=0;i<answerchoice.length;i++){
        answerchoice[i].classList.remove('correct','incorrect')
    }
}

function nextQuestion(){
    if(currentIndex <=8){
        currentIndex +=1
        resetChoices()
        DisplayQuestion()
    }
    else{
        resultPage.classList.remove('hidden')
        quizPage.classList.add('hidden')
        let displayScore = document.getElementById('displayScore')
        displayScore.textContent = score
    }
}


for(let i = 0; i <choicelinks.length; i++){
    choicelinks[i].addEventListener('click',chooseTopic)
}


form.addEventListener('submit',handleSubmit)
nextButton.addEventListener('click',nextQuestion)


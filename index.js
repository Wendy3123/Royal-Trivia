const form = document.querySelector('form')
const firstPage = document.getElementById('firstPage')
const topicChoicesPage = document.getElementById('topicChoicePage')
const quizPage = document.getElementById('quizPage')
const choicelinks = document.querySelectorAll('.choicelink')

function handleSubmit(e){
    e.preventDefault()
    let username = document.getElementById('PlayerNameInput').value 
    localStorage.setItem('playerName',username)
    firstPage.classList.add('hidden')
    topicChoicesPage.classList.remove('hidden')
}

function startQuiz(e){
    console.log(e.target)
}

for(let i = 0; i <choicelinks.length; i++){
    choicelinks[i].addEventListener('click',startQuiz)
}

form.addEventListener('submit',handleSubmit)


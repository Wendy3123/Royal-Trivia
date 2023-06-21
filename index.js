const form = document.querySelector('form')     //form loop for playername entering and submitting
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
let username = document.getElementById('PlayerNameInput');
let loserText = document.getElementById('loserText');
let winnerText = document.getElementById('winnerText')
let closedGiftbox = document.getElementById('closedGiftbox')
let loserGift1 = document.getElementById('loserGift1')
let ultimateGift = document.getElementById('ultimateGift')


function handleSubmit(e) {
    e.preventDefault()                              //prevents the page from automatically refreshing and returning to the first page everytiem u click submit
    username = document.getElementById('PlayerNameInput').value         //the var username set equal to the value(anything you type in the string as name)
    localStorage.setItem('playerName', username)                //stores the username in a local storage
    firstPage.classList.add('hidden')                       //hides the first page after lets begin button is clicked
    topicChoicesPage.classList.remove('hidden')             //removes the hidden for the topic choice page so it displays after the first page hides
    let music = document.getElementById('mainMusic')
    music.play()
}

function chooseTopic(e) {
    console.log(score)
    console.log(e.target.id)                        //jsut checking what the target id is
    quizPage.classList.remove('hidden')                //remove the hidden class and shows the quiz page
    topicChoicesPage.classList.add('hidden')           //hides the topic choice page once the topic is selected then goes to the quiz page
    fetchQuestions(e.target.id)                       //calls the fetch questions api with the specific e.target.id the user clicks on
}

function fetchQuestions(category) { 
    fetch(`https://the-trivia-api.com/v2/questions?categories=${category}`)     //copy paste the fetch from api website and i added ${category} so it can be specific to our quiz topics
        .then((response) => {
            return response.json()                         //returns js language to json so its converted
        })
        .then((data) => {
            console.log(data)
            questionArray = data                        //this is all the data thats already included with the api such as(questions,incorrect answers, and even level difficulty but we won't be using that)
            DisplayQuestion()                              //call the displayQuestion() function
        })
}

function DisplayQuestion() {
    if (currentIndex === 9) {                                   //if we are at question 9, we change the text content in "next" button into a "finish" button
        nextButton.textContent = 'Finish'
    }
    const question = questionArray[currentIndex]              //getting the questions from api set a new var equal to questionarray which we previously assigned the api data to
    let h2Question = document.getElementById('displayQuestion')     //display the question in our h2 tag in html under quiz page
    h2Question.textContent = question.question.text           //we now want our textcontent in h2tag to be equal to the questions in the api so we use question from our var we just created then do .question.text (in the front page of api
     // we can see it under those names it was alrdy given) Ex: "question":{
    //                                                              "text": "blah blah random question?"  }   ==>we can we we have to select their questions then text after so that the question in thier text shows up in our h2Question.textcontent
    let answerArray = question.incorrectAnswers                 //now to get all the answer choices (4 choices total) ; so same as above we do our var question then .incorrectAnswers is their given array with 3 incorrect answer
    let randomIndex = Math.floor(Math.random()*4)
    answerArray.splice(randomIndex,0,question.correctAnswer)                   //now we want to push(aka add to the last index) the correct answer so now we have 3 incorretcs and 1 correct at the end
    for (let i = 0; i < answerchoice.length; i++) {             //set the array length to index=3 because there are 4 choices total
        answerchoice[i].textContent = answerArray[i]            //add the correct answer text content into the 4 choices. so now it will print the actual text from the api such as "example1" "answer2" "answer3" "answer4"
        answerchoice[i].addEventListener('click', handleUserChoice)         //now for each choice in array that we click on there will be a function handleUserChoice() that runs after the click
    }
}

function handleUserChoice(e) {
    console.log(e.target.textContent)               //checking the target.textContent 
    let userChoice = e.target.textContent.trim()       //trim() makes sure the answer doesnt count any blank spaces
    //set the userChoice to which ever answer the user clicks on excluding the white space that may interfere with answer
    if (userChoice === questionArray[currentIndex].correctAnswer.trim()) {
        score += 10                                 //if the user answer choice is correct add 10 points to score and add class list of 'correct' which you can see in css means change the background color to green
        e.target.classList.add('correct')  
        let winmusic = document.getElementById('winMusic')      //define a var equal to the correct answer audio
        winmusic.play()                              //.play() is a built in function you can use for audio
        winmusic.playbackRate = 1.8;                //adjust the speed of the audio to make it faster/slower in our case, faster
    }
    else {
        e.target.classList.add('incorrect')     //if user is incorrect no points are added and the class list incorrect is added and in css we can see that the .incorrect class changes background color to red
        let losemusic = document.getElementById('loseMusic')        //define a var equal to the incorrect answer audio
        losemusic.play()                            //.play() is a built in function you can use for audio
        losemusic.playbackRate = 3;             //adjust the speed of the audio to make it faster/slower in our case, faster
    }
    for(let i = 0;i<answerchoice.length;i++){
        answerchoice[i].disabled = true          //.disabled set to true can be used with buttons so that we disable all other answer choice buttons after selecting our choice
    }
    //if correct score +10 
    //change all incorrect answers to red
    //chnage correct answer to green
}

function resetChoices() {
    for (let i = 0; i < answerchoice.length; i++) {     
        answerchoice[i].classList.remove('correct', 'incorrect')
        answerchoice[i].disabled=false                          //.disabled set to false so we can select an option again for a new question
    }                     //this function resets the answer choices back to how it was by removing either the red/green background color from the incorrect and correct css class

}

function nextQuestion() {
    if (currentIndex <= 8) {        //if we are on current index 8 or less (aka question 9 or less)
        currentIndex += 1               //add 1 to index choice
        resetChoices()      //everytime we click the next button we reset the backgrounds by removing the .correct or .incorrect css class
        DisplayQuestion()       //everytiem we click next we display new question and new 4 answer choices
    }
    else {                                           //if we are finished with last question  
        resultPage.classList.remove('hidden')        //then show and remove the hidden class for the results page
        quizPage.classList.add('hidden')            //we want to hide the quiz page now that we finished
        resultPageFeedback()                    //call the display result feedback after the result page is displayed so it can print the winner/loser text through the resultPageFeedback() function
        let displayScore = document.getElementById('displayScore')     //set a new variable to display score
        displayScore.textContent = score                //set this new variable equal to our score variable we have above that keeps track of our points throughout the quiz and make sure its .textContent to show the score
        let UserNamesentence = document.getElementById('UserNamesentence')      //create variable to equal the span id we created in html
        UserNamesentence.textContent = username;                //set that variable now equal to the username varirable which is what the player enters in
    }                                                           //before they press lets begin! button
}

function resultPageFeedback(){                              //function to show loser text or winner text
    if (score < 100){                                       //if score is less than 100 then we remove the hidden class and display the loser text
        loserText.classList.remove('hidden')
    }
    else{
        winnerText.classList.remove('hidden')               //else if score === 100 then we remove hidden class and display winner text
    }
}

function showGifts(){                               //show whats inside gift box function()
    console.log("show gifts")
    closedGiftbox.classList.add('hidden')
    if(score < 100){                                    //if score is not 100 display loser gift
        loserGift1.classList.remove('hidden')
    }
    else{
        ultimateGift.classList.remove('hidden')            //if score is 100 display winner gift 
    }
}


for (let i = 0; i < choicelinks.length; i++) {              //array going through the four possible quiz topics
    choicelinks[i].addEventListener('click', chooseTopic)      //when you click the topic of choice the function chooseTopic() runs
}


form.addEventListener('submit', handleSubmit)               //once we click the lets begin button (form) then it runs the function handleSubmit()
nextButton.addEventListener('click', nextQuestion)          //everytime we click the next button the nextQuestion() function runs
closedGiftbox.addEventListener('click',showGifts)           //when u click on the gift box it will hide the img then show the img behind it


// word correctness

const startButton = document.querySelector('.upload__button')
const recordInput = document.querySelector('.record')
const exampleInput = document.querySelector('.example')


//results info

const closeButton =document.querySelector('.result__close_button')
const results = document.querySelector(".result")
const timeLeft = document.querySelector("#time__left")
const cpmValue = document.querySelector("#cpm")
const wpmValue = document.querySelector("#wpm")

// variable foe word correctness
let activeId
let activeWord

//variable for gametime countdown
let pressCounter  = true
const gameTime = 60 //in seconds

//test score
let cpm = 0
let wpm  = 0

// function to shuffle words array
function shuffle(array){
    for(let i = array.length -1; i>0 ; i--) {
        const j = Math.floor(Math.random()* i)
        const temp = array[i]
        array[i] = array [j]
        array [j]= temp;
    }
}
// initial conditions - excercise text load, first word highlited,  variables reset :

function wordlistUpload(){
    shuffle(words)
    const htmlText = words.map((word, i) => `<span class="example__word" id="word${i}">${word}</span>`)
    exampleInput.innerHTML = htmlText.join(' ')
    activeId = 0
    activeWord = exampleInput.querySelector(`#word${activeId}`)
    activeWord.classList.add('active')
}


// gametime countdown
function countdown(gameTime){
    const now = Date.now()
    const then = now + gameTime*1000

    const counter = setInterval((gameTime)=> {
        const secondsLeft = Math.round((then - Date.now())/1000);
        if(secondsLeft<0){
            clearInterval(counter)
            return
        }
        timeLeft.innerHTML=secondsLeft;
    },1000);
    setTimeout(resultsLoad, gameTime*1000)
}

// function to show results and score data
function resultsLoad(){
    results.classList.add('visible')
    wpmValue.innerHTML = `${wpm} wpm <span class="result__cathegory-details">(word per minute)</span>`
    cpmValue.innerHTML = `${cpm} cpm <span class="result__cathegory-details">(characters per minute)</span>`

}

//word and letter correctness verification
function spellingCheck(e){

    //countdown start
    if(pressCounter === true){countdown(gameTime)}
    pressCounter = false;

    // variables - array from recorded word and excercice word
    const excerciseWord = Array.from(words[activeId])
    const recordedWord = Array.from(recordInput.value)

    // word correctness - when space is pressed and minimum one letter recorded
    if(e.keyCode===32 && recordInput.value.trim().length > 0){
        activeWord.innerHTML=words[activeId]
        // - remove 'acitve' class from previous word
        activeWord.classList.remove('active')
        // - add 'correct'/ 'fail' class to previous word
        const status = excerciseWord.map((el, i)=> el===recordedWord[i]? 0 : 1 ).reduce((acc, curr)=>acc+curr)

        //word formatig
        //1.if word recorded is different then excercise sample - add class "fail"
        // if word recorded the same as in excercise - add class "pass" and increment score variables
        if(status>0 || excerciseWord.length != recordedWord.length-1)
            {activeWord.classList.add('fail')
        }else{
            activeWord.classList.add('pass')
             cpm = cpm + excerciseWord.length
             wpm = wpm + 1}

        // - increment activeId
        activeId=activeId+1

        // - add 'active' class to next word
        activeWord = exampleInput.querySelector(`#word${activeId}`)
        activeWord.classList.add('active')
        recordInput.value=""

    }else{
        // compare input word with current word
        let rest = excerciseWord.slice(recordedWord.length).join('')
        let splited = excerciseWord.slice(0, recordedWord.length)

        // add 'correct' / 'fail' class to each letter
        const letter = splited.map((lett, i)=> lett === recordedWord[i] ? `<span class="correct">${lett}</span>` : `<span class="incorrect">${lett}</span>`)
        activeWord.innerHTML = letter.join('')+`<span>${rest}</span>`
    }
}

// reset values and generate new excercise when result cloaser button pressed
function resultClose(){
    results.classList.remove('visible')
    pressCounter = true
    recordInput.value=""
    timeLeft.innerHTML=gameTime+' sec';
    cpm = 0
    wpm = 0
    wordlistUpload()

}

startButton.addEventListener('click', wordlistUpload)
window.addEventListener('load', wordlistUpload)
recordInput.addEventListener('keyup', spellingCheck)
closeButton.addEventListener('click', resultClose)

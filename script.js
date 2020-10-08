const startButton = document.querySelector('.upload__button')
const recordInput = document.querySelector('.record')
const exampleInput = document.querySelector('.example')

//results info

const closeButton =document.querySelector('.result__close_button')
const results = document.querySelector(".result")
const timeLeft = document.querySelector("#time__left")

let pressCounter  = true
const gameTime = 10


// variable words is defined in words.js file.
// it use 'var' so is scoped to window object.
let activeId
let activeWord

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
    return activeWord
}


function countdown(gameTime){
    const now = Date.now()
    const then = now + gameTime*1000


    countdown = setInterval((gameTime)=> {
        const secondsLeft = Math.round((then - Date.now())/1000);
        if(secondsLeft<0){
            clearInterval(countdown)
            return
        }
        timeLeft.innerHTML=secondsLeft;
    },1000);
    setTimeout(resultsLoad, gameTime*1000)
}


function resultsLoad(){
    results.classList.add('visible')

}

function spellingCheck(e){
    if(pressCounter === true){countdown(gameTime)}
    pressCounter = false;

    // if user clicks space and word length in input > 0 (use trim() to remove empty string eg. " "), then

    const excerciseWord = Array.from(words[activeId])
    const recordedWord = Array.from(recordInput.value)

    if(e.keyCode===32 && recordInput.value.trim().length > 0){
        activeWord.innerHTML=words[activeId]
        // - remove 'acitve' class from previous word
        activeWord.classList.remove('active')
        // - add 'correct'/ 'fail' class to previous word
        const status = excerciseWord.map((el, i)=> el===recordedWord[i]? 0 : 1 ).reduce((acc, curr)=>acc+curr)
        if(status>0 || excerciseWord.length != recordedWord.length-1)
            {activeWord.classList.add('fail')}
             else{activeWord.classList.add('pass')}

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


function resultClose(){
    results.classList.remove('visible')
    pressCounter = true;
    recordInput.value="";
    activeWord.innerHTML="";
    wordlistUpload()
}

startButton.addEventListener('click', wordlistUpload)
recordInput.addEventListener('keyup', spellingCheck)
closeButton.addEventListener('click', resultClose)


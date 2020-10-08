const startButton = document.querySelector('.upload__button')
const recordInput = document.querySelector('.record')
const exampleInput = document.querySelector('.example')

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

function spellingCheck(e){
    // if user clicks space and word length in input > 0 (use trim() to remove empty string eg. " "), then

    const excerciseWord = Array.from(words[activeId])
    const recordedWord = Array.from(recordInput.value)

    if(e.keyCode===32 && recordInput.value.trim().length > 0){
        // - remove 'acitve' class from previous word
        activeWord.classList.remove('active')
        activeWord.innerHTML=words[activeId]
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
        const status = recordedWord.map((el, i)=> el===excerciseWord[i]? 0 : 1 )
        let rest = excerciseWord.slice(recordedWord.length).join('')
        let splited = excerciseWord.slice(0, recordedWord.length)
        const letter = splited.map((lett, i)=> lett === recordedWord[i] ? `<span class="correct">${lett}</span>` : `<span class="incorrect">${lett}</span>`)
        console.log(letter)
        // add 'correct' / 'fail' class to each letter
        activeWord.innerHTML = letter.join('')+`<span>${rest}</span>`
    }
}




startButton.addEventListener('click', wordlistUpload)
recordInput.addEventListener('keyup', spellingCheck)


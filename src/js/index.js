let generatedStr, dashedStr = [], listOFGeneratedStr = [];

const hangmanProp = {
    alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
    intro:document.querySelector("#intro"),
    game:document.querySelector("#game"),
    makeGameTemplate(){
        document.querySelector("#game").innerHTML = `
            <div id="imgBox"></div>
            <div id="guessBox"></div>
            <div id="letterBox"></div>
        `
    },
    makeKeyBoard(){
        const alphabet = this.alphabet;
        document.querySelector("#letterBox").innerHTML = "";
        alphabet.forEach((letter,idx)=>{
            const btn = document.createElement("button");
            btn.classList.add("letter");
            btn.innerText = letter;
            document.querySelector("#letterBox").appendChild(btn);
        })
    },
};

const display = ({intro,game})=>{
    // this function sets the display settings 
    intro.style.display = "none";
    game.style.display = "block";
};

function hints(){
    //This ffunction provides hint of what to guess.
    const hintText = document.createElement("p")
    hintText.classList.add("hint")
    hintText.innerHTML = `Hint : Guess the  <strong id="hint"> </strong>`
    document.querySelector("#game").prepend(hintText);
    document.querySelector("#hint").innerText = categoryStr[categoryIndex];
};

function getStr(){
    categoryIndex = Math.floor(Math.random() * categoryStr.length);
    const listOfStrs = category[categoryIndex];
    return listOfStrs[Math.floor(Math.random() * listOfStrs.length)];  
};

const displayGuessBox = (guess) => {
    if(guess){
        const guessBox = document.querySelector("#guessBox");
        guessBox.innerHTML = "";
        for(let i=0;i<guess.length;i++){
            const p = document.createElement("p");
            if(guess[i] === " "){
                p.classList.add("space")
                p.innerText = "_"
            }
            else {
                p.innerText = guess[i];
                p.classList.add("guess");
            }
            guessBox.appendChild(p);
        }
    }
};

function displayImg(){
    // This function displays the image that shows on the screen once the game loads.
    const imgBox = document.querySelector("#imgBox");
    img = document.createElement("img");
    img.setAttribute("src","./assets/empty-gallowspaper.png");
    imgBox.appendChild(img);
};

function generateStr(){
    // Get the random string and then use it to display a string of dashes with same lenght;
    generatedStr = getStr().toUpperCase();
    listOFGeneratedStr.push(generatedStr);
    for(let i=0;i<generatedStr.length;i++){
        if(generatedStr[i] === " "){
            dashedStr.push(" ");
        }
        else {
            dashedStr.push("-");
        }
    }
    displayGuessBox(dashedStr);
};

function changeImg(idx){
    const imgBox = document.querySelector("#imgBox");
    el = imgBox.querySelector("img");
    el.setAttribute("src",`${allHangManImages[idx]}`)   
};

function disableAllBtns(){
    const allBtns = document.querySelectorAll(".letter");
    for(let btn of allBtns){
        btn.setAttribute("disabled","disabled");
    }
};

const gameover = () =>{
    const imgBox = document.querySelector("#imgBox");
    imgBox.querySelector("img").setAttribute("src","./assets/you-losepaper.png");
    disableAllBtns();
    youLose();

    setTimeout(()=>{
        backHome();
    },2500)
};

function youLose(){
    const eachGuess = document.querySelectorAll(".guess");
    for(let i = 0;i<generatedStr.length;i++){
        setTimeout(()=>{
            if(eachGuess[i].innerText = "-"){
                eachGuess[i].innerText = generatedStr[i];
            }
        },1000)
    }
    setTimeout(()=>{
        document.querySelector(".hint").innerText = `The ${categoryStr[categoryIndex]} is ${generatedStr}`
        const backBtn = document.createElement("button");
        backBtn.classList.add("back");
        backBtn.innerText = "BACK"
        document.querySelector("body").appendChild(backBtn);

    },2000)
};

function updateWinning(){
    const imgBox = document.querySelector("#imgBox");
    disableAllBtns();
    setTimeout(()=>{
        imgBox.querySelector("img").setAttribute("src","./assets/you-winpaper.png")
        setTimeout(()=>{
            const nextBtn = document.createElement("button");
            nextBtn.classList.add("next");
            nextBtn.innerText = "NEXT"
            document.querySelector("body").appendChild(nextBtn);
            nextStage();
        },2000)
    },1000)  
};

const createGameLogic = () => {
    const btns = document.querySelectorAll(".letter");
    for(let btn of btns){
        btn.addEventListener("click",function(e){
            const p = document.querySelectorAll("#guessBox p");
            let text = e.target.innerText;

            // CONDITION LOGIC
            // 1- check if the user's choice occurs and if  there are multiple occurence of the user's choice
            if(generatedStr.includes(text) && !dashedStr.includes(text)){
                let startIdx = 0;
                let index;
                let indices = [];
                let result = dashedStr.join("");
                while((index = generatedStr.indexOf(text,startIdx)) > -1){
                    indices.push(index);
                    startIdx = index + 1;
                };
                for(let i of indices){
                    dashedStr[i] = result[i].replace("-",text);
                    p[i].innerText = dashedStr[i];
                }
                e.target.setAttribute("disabled","disabled")
            }

            // 2- check if the user's choice is a wrong one and update the number of missed choice;

            else if(!generatedStr.includes(text)){
                wrongChoice+=1;
                if(wrongChoice < 5){
                    changeImg(wrongChoice);
                }
                else {
                    gameover();
                }
            }
            // update winning
            if(generatedStr === dashedStr.join("")){
                updateWinning();
            }

        })
    }
};

const nextStage = () => {
    const btn = document.querySelector('.next');
    btn.addEventListener("click",(e)=>{
        refresh(e.target);

        setTimeout(()=>{
            document.querySelector("#game").innerHTML = "";

            setTimeout(()=>{
                events();
            },1500)
        },1000);

    });
};

const backHome = () =>{
    const btn = document.querySelector(".back");
    btn.addEventListener("click",(e)=>{
        refresh(e.target);

        setTimeout(()=>{
            document.querySelector("#game").innerHTML = "";

            setTimeout(()=>{

                document.querySelector("#intro").style.display = "block";

            },2000)
        },1000);
    });
};

const refresh = (btn) => {
    setTimeout(()=>{
        document.body.removeChild(btn);
        generatedStr = "";
        dashedStr = [];
        listOFGeneratedStr = [];
        wrongChoice = -1;
    },1000);   
};

const playBtn = document.querySelector("#playBtn");

const events = ()=>{
    setTimeout(()=>{
        display(hangmanProp)

        setTimeout(()=>{

            hangmanProp.makeGameTemplate();

            setTimeout(()=>{

                displayImg();
                generateStr();

                setTimeout(()=>{

                    hints();
                    hangmanProp.makeKeyBoard();

                    setTimeout(()=>{

                        createGameLogic();

                    },1800)
                },1500)
            },900)
        },600)
    },300)
};

playBtn.addEventListener("click",events)

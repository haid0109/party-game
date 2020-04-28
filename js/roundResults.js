let verdict = document.getElementById("verdict");
let rightAnswer = document.getElementById("rightAnswer");
let verdictImg = document.getElementById("verdictImg");
const playerName = new URLSearchParams(window.location.search).get("name");
let roundNum = new URLSearchParams(window.location.search).get("round");
let lastRound = null;
let newUrlParam = null;

function getRoundResults(){
    fetch(`http://localhost:9423/game/current/getRoundResults/${roundNum}/${playerName}`)
    .then((resp) => {
        if(resp.status == 200){
            verdict.innerHTML = "your answer was correct!";
            verdictImg.src = "../img/correct.png";
        }
        else{
            verdict.innerHTML = "your answer was wrong!";
            resp.text().then((correctAnswer) => {
                rightAnswer.innerHTML = "right answer: " + correctAnswer;
                verdictImg.src = "../img/wrong.png";
            });
        }
    })
    .catch((error) => {console.error('Error: ', error);});
}

function checkIfLastRound(){
    fetch('http://localhost:9423/game/current/checkIfLastRound/' + roundNum)
    .then((resp) => {
        if(resp.status == 403){return alert("something went wrong!");}
        if(resp.status == 200){return lastRound = true;}
    })
    .catch((error) => {console.error('Error: ', error);});
}

function nextPage(){
    if(lastRound){window.location.href = "gameResults.html";}
    else{
        let newRoundNum = roundNum;
        let UrlParams = new URLSearchParams(window.location.search);
        UrlParams.set("round", ++newRoundNum);
        newUrlParam = "?" + UrlParams;
        window.location.href =  "playerGuess.html" + newUrlParam;
    }
}

function checkIfNewGameStarted(){
    fetch('http://localhost:9423/game/current/playerExist/' + playerName)
    .then((resp) => {
        if(resp.status == 404){
            window.location.href = "index.html" + "?newGame=true";
        }
    })
    .catch((error) => {console.error('Error: ', error);});
}

window.addEventListener("load", () => {
    checkIfLastRound();
    getRoundResults();
    checkIfNewGameStarted();
    setInterval( checkIfNewGameStarted, 5000);
});
document.getElementById("nextPage").addEventListener("click", nextPage);

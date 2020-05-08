const secretKey = new URLSearchParams(window.location.search).get("secretKey");
const gameCode = new URLSearchParams(window.location.search).get("code");
let roundNum = new URLSearchParams(window.location.search).get("round");
let verdict = document.getElementById("verdict");
let rightAnswer = document.getElementById("rightAnswer");
let verdictImg = document.getElementById("verdictImg");
let lastRound = false;
let newUrlParam = null;

async function checkIfPlayerAndGameExist(){
    await fetch(`http://localhost:9423/game/player/exist/${gameCode}/${secretKey}`)
    .then((resp) => {
        if(resp.status == 404){window.location.href = "index.html" + "?kicked=gameNull";}
        if(resp.status == 403){window.location.href = "index.html" + "?kicked=playerNull";}
    })
    .catch((error) => {console.error('Error: ', error);});
}

async function checkIfRoundExist(){
    await fetch(`http://localhost:9423/game/round/exist/${gameCode}/${roundNum}`)
    .then((resp) => {
        if(resp.status == 404){window.location.href = "index.html" + "?kicked=gameNull";}
        if(resp.status == 403){window.location.href = "index.html" + "?kicked=roundNull";}
    })
    .catch((error) => {console.error('Error: ', error);});
}

async function checkIfLastRound(){
    await fetch(`http://localhost:9423/game/round/last/${gameCode}`)
    .then((resp) => {
        if(resp.status == 200){lastRound = true;}
        else if(resp.status == 404){alert("something went wrong!");}
    })
    .catch((error) => {console.error('Error: ', error);});
}

function getRoundResults(){
    fetch(`http://localhost:9423/game/round/results/${gameCode}/${secretKey}`)
    .then((resp) => {
        if(resp.status == 200){
            verdict.innerHTML = "your answer was correct!";
            verdictImg.src = "../img/correct.png";
        }
        else if(resp.status == 403){
            verdict.innerHTML = "your answer was wrong!";
            resp.text().then((correctAnswer) => {
                rightAnswer.innerHTML = "right answer: " + correctAnswer;
                verdictImg.src = "../img/wrong.png";
            });
        }
        else{alert("something went wrong!");}
    })
    .catch((error) => {console.error('Error: ', error);});
}

function nextPage(){
    if(lastRound){window.location.href = "gameResults.html" + window.location.search;}

    fetch(`http://localhost:9423/game/round/next/${gameCode}/${roundNum}`,
    {
        method:"PUT",
    })
    .then((resp) => {
        if(resp.status == 200 || resp.status == 403 || resp.status == 400){
            let newRoundNum = roundNum;
            let UrlParams = new URLSearchParams(window.location.search);
            UrlParams.set("round", ++newRoundNum);
            newUrlParam = "?" + UrlParams;
            window.location.href =  "playerGuess.html" + newUrlParam;
        }
        else{alert("something went wrong!");}
    })
    .catch((error) => { console.error('Error:', error); });
}

window.addEventListener("load", async () => {
    await checkIfPlayerAndGameExist();
    await checkIfRoundExist();
    await checkIfLastRound();
    getRoundResults();
});
document.getElementById("nextPage").addEventListener("click", nextPage);

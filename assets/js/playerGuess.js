const playerName = new URLSearchParams(window.location.search).get("name");
let roundNum = new URLSearchParams(window.location.search).get("round");
let newUrlParam = null;
let audioPlayer = document.getElementById("player");

async function setRoundData(){
    document.getElementById("roundTitle").innerHTML = "Round " + roundNum;

    let newRoundNum = roundNum;
    let UrlParams = new URLSearchParams(window.location.search);
    
    UrlParams.set("round", ++newRoundNum);
    newUrlParam = "?" + UrlParams;
}

async function setAudioData(){
    //gets audio and sets it to the audio tag
    await fetch('http://localhost:9423/game/current/roundAudio/' + roundNum)
    .then((resp) => {
        console.log("get round audio: ", resp.status);
        resp.blob().then((audioData) => {
            audioPlayer.src = URL.createObjectURL(audioData);
        });
    })
    .catch((error) => { console.error('Error:', error); });

    //gets audio speed and sets it to the audio tag playrate
    await fetch('http://localhost:9423/game/current/roundAudioSpeed/' + roundNum)
    .then((resp) => {
        console.log("get round audio speed: ", resp.status);
        resp.json().then((audioSpeedObj) => {
            audioPlayer.playbackRate = audioSpeedObj.speed;
        });
    })
    .catch((error) => {console.error('Error: ', error);});
}

async function saveTheGuess(){
    await fetch('http://localhost:9423/game/current/saveTheGuess', {
        method:"POST",
        body: {
            playerGuess: document.getElementById("playerGuess").value,
        }
    })
    .catch((error) => { console.error('Error:', error); });
}


async function guessCheck(){
    await fetch('http://localhost:9423/game/current/question')
    .then((response) => {
        return response.json();
    })
    .then((guessChecker) => {
        let playersGuess = document.getElementById("playerGuess").value;
        let correctAnswer = guessChecker.correctAnswer;
        let highscore = 0;
        if(playersGuess == correctAnswer) {
            document.getElementById("test") = highscore++;;
        } else {
            document.getElementById("test") = highscore;
        }
    })
    .catch((error) => { console.error('Error:', error); });
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
    setRoundData();
    setAudioData();
    checkIfNewGameStarted();
    setInterval(checkIfNewGameStarted, 5000);
});
document.getElementById("makeAGuess").addEventListener("click", async function(){
    saveTheGuess();
    window.location.href = "awaitingAnswers.html" + newUrlParam
});

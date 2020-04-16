const playerName = new URLSearchParams(window.location.search).get("name");
let roundNum = new URLSearchParams(window.location.search).get("round");
let audioPlayer = document.getElementById("player");

async function setData(){
    //displays the round number
    document.getElementById("roundTitle").innerHTML = "Round " + roundNum;

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

function saveTheGuess(){
    guessDataObj = {
        playerName: playerName,
        roundNum: roundNum,
        guess: document.getElementById("playerGuess").value,
    }

    fetch('http://localhost:9423/game/current/saveTheGuess', {
        method:"POST",  
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(guessDataObj)
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
    setData();
    checkIfNewGameStarted();
    setInterval(checkIfNewGameStarted, 5000);
});

document.getElementById("makeAGuess").addEventListener("click", function(){
    saveTheGuess();
    window.location.href = "awaitingAnswers.html" + window.location.search;
});

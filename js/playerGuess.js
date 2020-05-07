const secretKey = new URLSearchParams(window.location.search).get("secretKey");
const gameCode = new URLSearchParams(window.location.search).get("code");
let roundNum = new URLSearchParams(window.location.search).get("round");
let audioPlayer = document.getElementById("player");

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

async function setData(){
    //displays the round number
    document.getElementById("roundTitle").innerHTML = "Round " + roundNum;

    //gets audio and sets it to the audio tag
    await fetch(`http://localhost:9423/game/round/audio/data/${gameCode}`)
    .then((resp) => {
        if(resp.status == 404){return alert("something went wrong!");}
        resp.blob().then((audioData) => {
            audioPlayer.src = URL.createObjectURL(audioData);
        });
    })
    .catch((error) => { console.error('Error:', error); });

    //gets audio speed and sets it to the audio tag playrate
    fetch(`http://localhost:9423/game/round/audio/metaData/${gameCode}`)
    .then((resp) => {
        if(resp.status == 404){return alert("something went wrong!");}
        resp.json().then((metaDataObj) => {
            audioPlayer.playbackRate = metaDataObj.speed;
        });
    })
    .catch((error) => {console.error('Error: ', error);});
}

function saveTheGuess(){
    let guess = document.getElementById("guess").value;
    if(!guess)
    {
        alert("you need to write a guess");
        return;
    }

    fetch(`http://localhost:9423/game/player/saveGuess/${gameCode}/${secretKey}`, {
        method:"PUT",  
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({guess: guess})
    })
    .catch((error) => { console.error('Error:', error); });
    window.location.href = "awaitingAnswers.html" + window.location.search;
}

window.addEventListener("load", async () => {
    await checkIfPlayerAndGameExist();
    await checkIfRoundExist();
    setData();
});
document.getElementById("answer").addEventListener("click", saveTheGuess);

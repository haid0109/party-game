const secretKey = new URLSearchParams(window.location.search).get("secretKey");
const gameCode = new URLSearchParams(window.location.search).get("code");
let uploadAudioBtn = document.getElementById("uploadAudioBtn");
let startGameBtn = document.getElementById("startGameBtn")

async function checkIfPlayerAndGameExist(){
    await fetch(`http://localhost:9423/game/player/exist/${gameCode}/${secretKey}`)
    .then((resp) => {
        if(resp.status == 404){window.location.href = "index.html" + "?kicked=gameNull";}
        if(resp.status == 403){window.location.href = "index.html" + "?kicked=playerNull";}
    })
    .catch((error) => {console.error('Error: ', error);});
}

function checkIfAudioWasUploaded(){
    try{
        let previousPage = new URL(document.referrer);
        if(previousPage.pathname == "/upload.html"){startGameBtn.style.display = "block";}
    }catch(error){}
}

function displayPlayers(){
    fetch(`http://localhost:9423/game/players/${gameCode}`)
    .then((resp) => {return resp.json()})
    .then((playersObj) => {
        let statusColor = null
        let players = playersObj.playersArray;
        var elements = players.map(player => {
            if(player.playerReady){ statusColor = "green"}
            else{ statusColor = "red"}
            return `
            <div class="playerWrapper">
                <div class="statusMarker" style="background-color: ${statusColor};"></div>
                <div>${player.name}</div>
            </div >`;
            
        }).join("");
        document.getElementById("playersList").innerHTML = elements;
    })
    .catch((error) => { console.error('Error:', error); });
}

function checkIfGameStarted(){
    fetch(`http://localhost:9423/game/state/${gameCode}`)
    .then((resp) => {
        resp.json().then((gameStateObj) => {
            if(gameStateObj.state == "in progress"){
                window.location.href = "playerGuess.html" + window.location.search + "&round=1";
            }
        });
    })
    .catch((error) => {console.error('Error: ', error);});
}

function startGame(){
    fetch(`http://localhost:9423/game/start/${gameCode}`,
    {
        method:"PUT",
    })
    .then((resp) => {
        if(resp.status == 404){return alert("all players must be ready to start the game");}
        window.location.href = "playerGuess.html" + window.location.search + "&round=1";
    })
    .catch((error) => { console.error('Error:', error); });  
}

window.addEventListener("load", async () => {
    //runs functions once, before the setInterval starts
    await checkIfPlayerAndGameExist();
    checkIfAudioWasUploaded();
    displayPlayers();
    checkIfGameStarted();
    setInterval(() => {
        displayPlayers();
        checkIfGameStarted();
    }, 5000);
});
uploadAudioBtn.addEventListener("click", () => window.location.href = "upload.html" + window.location.search);
startGameBtn.addEventListener("click", () => startGame());

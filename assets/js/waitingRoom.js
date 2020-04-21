let uploadAutioBtn = document.getElementById("uploadAudioBtn");
let startGameBtn = document.getElementById("startGameBtn")
const playerName = new URLSearchParams(window.location.search).get("name");

function checkIfUploadedAudio(){
    let previousPage = new URL(document.referrer);
    if(previousPage.pathname == "/upload.html"){startGameBtn.style.display = "block";}
}

async function displayPlayersInColumn1(){
    await fetch('http://localhost:9423/game/current')
    .then((resp) => {return resp.json()})
    .then((game) => {
        let statusColor = null
        let players = game.players;
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

async function checkGameState(){
    await fetch('http://localhost:9423/game/current/state')
    .then((resp) => {
        resp.json().then((gameState) => {
            if(gameState.state == "in progress"){
                window.location.href = "playerGuess.html" + window.location.search + "&round=1";
            }
        });
    })
    .catch((error) => {console.error('Error: ', error);});
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

function startGame(){
    fetch('http://localhost:9423/game/current/start',
    {
        method:"POST",
    })
    .then((response) => {
        if(response.status == 404)
        {
            alert("all players must be ready to start the game");
            return;
        }
        window.location.href = "playerGuess.html" + window.location.search + "&round=1";
    })
    .catch((error) => { console.error('Error:', error); });  
}

window.addEventListener("load", () => {
    //runs functions once, before the setInterval starts 
    checkIfUploadedAudio();
    displayPlayersInColumn1();
    checkGameState();
    checkIfNewGameStarted();
    setInterval(() => {
        displayPlayersInColumn1();
        checkGameState();
        checkIfNewGameStarted();
    }, 5000)
});
uploadAutioBtn.addEventListener("click", () => window.location.href = "upload.html" + window.location.search);
startGameBtn.addEventListener("click", () => startGame());

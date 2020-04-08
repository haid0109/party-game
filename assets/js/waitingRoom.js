const playerName = new URLSearchParams(window.location.search).get("name");
async function displayPlayersInColumn1(){
    await fetch('http://localhost:9423/game/current')
    .then((resp) => {return resp.json()})
    .then((game) => {
        let playerCount = 1;
        let players = game.players;
        var elements = players.map(player => {
            if(player.playerReady == true){
                return `<div class="player-wrapper">
                <img src = "" alt = "">
                <div class="player-text">
                    <p>player ${playerCount++}</p>
                    <p>${player.name}</p>
                </div>
                <div class="ready-wrapper">
                    <div id="ready-marker" style="background-color: green;"></div>
                </div>                       
            </div >`;   
            }
            if(!player.playerReady){
                return `<div class="player-wrapper">
                <img src = "" alt = "">
                <div class="player-text">
                    <p>player ${playerCount++}</p>
                    <p>${player.name}</p>
                </div>
                <div class="ready-wrapper">
                    <div id="ready-marker" style="background-color: red;"></div>
                </div>                       
            </div >`; 
            }
            
        }).join("");
        document.getElementById("col-1").innerHTML = elements;
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
    displayPlayersInColumn1();
    checkGameState();
    checkIfNewGameStarted();
    setInterval(() => {
        displayPlayersInColumn1();
        checkGameState();
        checkIfNewGameStarted();
    }, 5000)
});
document.getElementById("beginBtn").addEventListener("click", () => window.location.href = "upload.html" + window.location.search);
document.getElementById("startGame").addEventListener("click", () => startGame());

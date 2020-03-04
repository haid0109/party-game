async function displayPlayersInColumn1(){
    await fetch('http://localhost:9423/game/current')
    .then((resp) => {return resp.json()})
    .then((game) => {
        let playerCount = 1;
        let players = game.players;
        var elements = players.map(player => {
            return `<div class="player-wrapper">
                <img src = "" alt = "">
                <div class="player-text">
                    <p>player ${playerCount++}</p>
                    <p>${player.name}</p>
                </div>
                <div class="ready-wrapper">
                    <div class="ready-marker"></div>
                </div>                       
            </div >`;
        }).join("");
        document.getElementById("col-1").innerHTML = elements;
    })
    .catch((error) => { console.error('Error:', error); });
}

async function startGame(){
    await fetch('http://localhost:9423/game/current/start',
    {
        method:"POST",
    })
    .then((response) => {
        if(response.status == 404)
        {
            alert("something went wrong");
            return;
        }
        window.location.href = "playerGuess.html" + window.location.search + "&round=1dasdasda";
    })
    .catch((error) => { console.error('Error:', error); });  
}

window.addEventListener("load", () => displayPlayersInColumn1(), false);
window.addEventListener("load", () => setInterval(displayPlayersInColumn1, 5000));
document.getElementById("beginBtn").addEventListener("click", () => window.location.href = "upload.html" + window.location.search);
document.getElementById("startGame").addEventListener("click", () => startGame());

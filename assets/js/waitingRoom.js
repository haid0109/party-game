function displayPlayersInColumn1(){
    fetch('http://localhost:9423/game/current')
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
            </div >`;
        }).join("");
        document.getElementById("col-1").innerHTML = elements;
    })
    .catch((error) => { console.error('Error:', error); });
}

window.addEventListener("load", displayPlayersInColumn1);
window.addEventListener("load", () => setInterval(displayPlayersInColumn1, 5000));
window.addEventListener("click", () => window.location.href = "upload.html");
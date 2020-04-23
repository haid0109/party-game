let scoreboard = document.getElementById("scoreboard");
const playerName = new URLSearchParams(window.location.search).get("name");

function showPlayerScores(playersArr){
    let elements = playersArr.map(player => {
        if(!player.score){player.score = 0;}
        return `
        <div class="playerWrapper">
            <p>${player.name}</p>
            <p>score: ${player.score}</p>                    
        </div >`;   
    }).join("");
    scoreboard.innerHTML = elements;
}

function getPlayerScores(){
    fetch('http://localhost:9423/game/current/showPlayerScores')
    .then((resp) => {
        if(resp.status != 200){return alert("something went wrong!");}
        resp.json().then((playersObj) => {
            showPlayerScores(playersObj.players);
        });
    })
    .catch((error) => {console.error('Error: ', error);});
}

window.addEventListener("load", () => {
    getPlayerScores();
    setInterval(getPlayerScores, 1000);
});
document.getElementById("backToStart").addEventListener("click", () => {window.location.href =  "index.html";});

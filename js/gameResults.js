const secretKey = new URLSearchParams(window.location.search).get("secretKey");
const gameCode = new URLSearchParams(window.location.search).get("code");
let scoreboard = document.getElementById("scoreboard");

async function playerIsDone(){
    await fetch(`http://localhost:9423/game/player/done/${gameCode}/${secretKey}`,
    {
        method:"PUT",
    })
    .then((resp) => {
        if(resp.status != 200){alert("something went wrong!");}
    })
    .catch((error) => { console.error('Error:', error); });

    fetch(`http://localhost:9423/game/over/${gameCode}`,
    {
        method:"DELETE",
    })
    .then((resp) => {
        if(resp.status != 200){alert("something went wrong!");}
    })
    .catch((error) => { console.error('Error:', error); });
}

function showPlayerScores(playersArr){
    let elements = playersArr.map(player => {
        return `
        <div class="playerWrapper">
            <p>${player.name}</p>
            <p>score: ${player.score}</p>                    
        </div >`;   
    }).join("");
    scoreboard.innerHTML = elements;
}

function getPlayerScores(){
    fetch(`http://localhost:9423/game/players/scores/${gameCode}`)
    .then((resp) => {
        if(resp.status != 200){return alert("something went wrong!");}
        resp.json().then((namesAndScoresArr) => {
            showPlayerScores(namesAndScoresArr);
        });
    })
    .catch((error) => {console.error('Error: ', error);});
}

window.addEventListener("load", () => {
    playerIsDone();
    getPlayerScores();
    setInterval(getPlayerScores, 1000);
});
document.getElementById("backToStart").addEventListener("click", () => {window.location.href =  "index.html";});

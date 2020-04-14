function playerKicked(){
    let newGame = new URLSearchParams(window.location.search).get("newGame");
    if(newGame){ 
        alert("A new game was started, and you were therefore kicked");
        window.location.href = "index.html"
    }
}

async function checkGameStatus(){
    let status;
    await fetch('http://localhost:9423/game/current')
    .then((resp) => status = resp.status)
    .catch((error) => { console.error('Error:', error); });
    if(status == 200){
        document.getElementById("newGame").style.display = "none";
        document.getElementById("joinGame").style.display = "block";
        document.getElementById("message").innerHTML = "Game is in preround. Join game?";
    }
    else if(status == 403){
        document.getElementById("joinGame").style.display = "none";
        document.getElementById("newGame").style.display = "block";
        document.getElementById("message").innerHTML = "Can't join the game. Start new game?";
    }
    else{
        document.getElementById("joinGame").style.display = "none";
        document.getElementById("newGame").style.display = "block";
        document.getElementById("message").innerHTML = "There is no game. Start new game?";
    }
}

function addNewPlayer(){
    if(!document.getElementById("name").value)
    {
        alert("you need to enter a name to play the game")
        return;
    }
    const player = {name: document.getElementById("name").value};
    fetch('http://localhost:9423/game/current/player', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(player)
    })
    .catch((error) => { console.error('Error:', error); });
    window.location.href = "waitingRoom.html" + "?name=" + player.name;
}

function createNewGame(){
    const player = {name: document.getElementById("name").value};
    fetch('http://localhost:9423/game/current', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(player)
    })
    .catch((error) => { console.error('Error:', error); });
    window.location.href = "waitingRoom.html" + "?name=" + player.name;
}

window.addEventListener("load", () => {
    playerKicked();
    checkGameStatus();
    setInterval(checkGameStatus, 5000)   
});
document.getElementById("joinGame").addEventListener("click", addNewPlayer);
document.getElementById("newGame").addEventListener("click", createNewGame);

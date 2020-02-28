//check game status
window.addEventListener("load", async function(){
    let status;
    await fetch('http://localhost:9423/game/current')
    .then((resp) => status = resp.status)
    .catch((error) => { console.error('Error:', error); });
    if(status == 200){
        document.getElementById("newGame").style.display = "none";
        document.getElementById("message").innerHTML = "Game is in progress. Join game?";
    }
    else if(status == 403){
        document.getElementById("joinGame").style.display = "none";
        document.getElementById("message").innerHTML = "Too many players. Start new game?";
    }
    else{
        document.getElementById("joinGame").style.display = "none";
        document.getElementById("message").innerHTML = "There is no game. Start new game?";
    }
});

//add new player
document.getElementById("joinGame").addEventListener("click", () => {
    const player = {name: document.getElementById("name").value};
    fetch('http://localhost:9423/game/current/player', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(player)
    })
    .catch((error) => { console.error('Error:', error); });
    window.location.href = "waitingRoom.html" + "?name=" + player.name;
});

//create new game
document.getElementById("newGame").addEventListener("click", () => {
    const player = {name: document.getElementById("name").value};
    fetch('http://localhost:9423/game/current', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(player)
    })
    .catch((error) => { console.error('Error:', error); });
    window.location.href = "waitingRoom.html" + "?name=" + player.name;
});

//check game status
window.onload = async function(){
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
}

//add new player
document.getElementById("joinGame").onclick = async function(){
    event.preventDefault();
    const player = {name: document.getElementById("name").value};
    await fetch('http://localhost:9423/game/current/player', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(player)
    })
    .then((response) => {
        window.location.href = "http://127.0.0.1:9033/waitingRoom.html"
    })
    .catch((error) => { console.error('Error:', error); });
}

document.getElementById("joinGameForm").submit = async function(event) {
    event.preventDefault();
};

//create new game
document.getElementById("newGame").onclick = async function(event){
    event.preventDefault();
    let player = {name: document.getElementById("name").value };
    await fetch('http://localhost:9423/game/current', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(player)
    })
    .then((response) => {
        console.log(response)
        window.location.href = "http://127.0.0.1:9033/waitingRoom.html"
    })
    .catch((error) => { console.error('Error:', error); });
}

// window.onload = async function() {
//     const data = {name: "alexandra"};
//     let response;
//     try{
//         response = await fetch('http://localhost:9423/game/current/player', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(data),
//         });
//     }
//     catch(error){
//         console.log(error);
//     }
//     console.log(response.status);
//     console.log("hej")
// }

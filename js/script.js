let newGameChoiceBtn = document.getElementById("newGameChoiceBtn");
let joinGameChoiceBtn = document.getElementById("joinGameChoiceBtn");
let startNewGameBtn = document.getElementById("startNewGameBtn");
let joinExistingGameBtn = document.getElementById("joinExistingGameBtn");
let goBackBtn = document.getElementById("goBackBtn");

function playerKicked(){
    const kicked = new URLSearchParams(window.location.search).get("kicked");
    if(kicked == "gameNull"){ 
        alert("the game you were in does not exist");
        window.location.href = "index.html"
    }
    else if(kicked == "playerNull"){ 
        alert("your player does not exist in that game");
        window.location.href = "index.html"
    }
}

function startNewGame(){
    let playerName = document.getElementById("playerName").value;
    if(!playerName){return alert("you can't use that name");}
    
    const player = {name: playerName};
    fetch(`http://localhost:9423/game/new`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(player)
    })
    .then((resp) => {
        if(resp.status != 200){return alert("something went wrong, try again.")}
        resp.json().then((secretAndCodeObj) => {
            window.location.href = "waitingRoom.html" + "?secretKey=" + secretAndCodeObj.secretKey + "&code=" + secretAndCodeObj.code;
        });
    })
    .catch((error) => { console.error('Error:', error); });
}

function joinExistingGame(){
    let gameCode = document.getElementById("gameCode").value;
    let playerName = document.getElementById("playerName").value;
    if(!playerName){return alert("your username cannot be empty");}
    const player = {name: playerName};

    fetch(`http://localhost:9423/game/join/${gameCode}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(player)
    })
    .then((resp) => {
        if(resp.status == 404){return alert("there is no game with the entered game code");}
        if(resp.status == 403){return alert("your username is taken");}
        if(resp.status == 400){return alert("the game you are trying to join has already started");}
        resp.json().then((secretKeyObj) => {
            window.location.href = "waitingRoom.html" + "?secretKey=" + secretKeyObj.secretKey + "&code=" + gameCode;
        });
    })
    .catch((error) => { console.error('Error:', error); });
}

window.addEventListener("load", playerKicked);
startNewGameBtn.addEventListener("click", startNewGame);
joinExistingGameBtn.addEventListener("click", joinExistingGame);
newGameChoiceBtn.addEventListener("click", () => {
    newGameChoiceBtn.style.display = "none";
    joinGameChoiceBtn.style.display = "none";

    document.getElementById("playerName").style.display = "block";
    startNewGameBtn.style.display = "block";
    goBackBtn.style.display = "block";
});
joinGameChoiceBtn.addEventListener("click", () => {
    newGameChoiceBtn.style.display = "none";
    joinGameChoiceBtn.style.display = "none";

    document.getElementById("gameCode").style.display = "block";
    document.getElementById("playerName").style.display = "block";
    joinExistingGameBtn.style.display = "block";
    goBackBtn.style.display = "block";
});
goBackBtn.addEventListener("click", () => {
    document.getElementById("gameCode").style.display = "none";
    document.getElementById("playerName").style.display = "none";
    startNewGameBtn.style.display = "none";
    joinExistingGameBtn.style.display = "none";
    goBackBtn.style.display = "none";

    newGameChoiceBtn.style.display = "block";
    joinGameChoiceBtn.style.display = "block";
});

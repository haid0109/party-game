const playerName = new URLSearchParams(window.location.search).get("name");
let roundNum = new URLSearchParams(window.location.search).get("round");

function checkIfAllPlayersAnswered(){
    fetch('http://localhost:9423/game/current/checkIfAllPlayersAnswered/' + roundNum)
    .then((resp) => {
        console.log("all players answered status: ", resp.status);
        if(resp.status == 200){window.location.href = "roundResults.html" + window.location.search;}
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

window.addEventListener("load", () => {
    checkIfAllPlayersAnswered();
    checkIfNewGameStarted();
    setInterval(() => {
        checkIfAllPlayersAnswered();
        checkIfNewGameStarted();
    }, 5000);
});

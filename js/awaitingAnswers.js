const secretKey = new URLSearchParams(window.location.search).get("secretKey");
const gameCode = new URLSearchParams(window.location.search).get("code");
let roundNum = new URLSearchParams(window.location.search).get("round");

async function checkIfPlayerAndGameExist(){
    await fetch(`http://localhost:9423/game/player/exist/${gameCode}/${secretKey}`)
    .then((resp) => {
        if(resp.status == 404){window.location.href = "index.html" + "?kicked=gameNull";}
        if(resp.status == 403){window.location.href = "index.html" + "?kicked=playerNull";}
    })
    .catch((error) => {console.error('Error: ', error);});
}

async function checkIfRoundExist(){
    await fetch(`http://localhost:9423/game/round/exist/${gameCode}/${roundNum}`)
    .then((resp) => {
        if(resp.status == 404){window.location.href = "index.html" + "?kicked=gameNull";}
        if(resp.status == 403){window.location.href = "index.html" + "?kicked=roundNull";}
    })
    .catch((error) => {console.error('Error: ', error);});
}

function checkIfAllPlayersAnswered(){
    fetch(`http://localhost:9423/game/players/answered/${gameCode}`)
    .then((resp) => {
        if(resp.status == 404){return alert("something went wrong!");}
        if(resp.status == 200){window.location.href = "roundResults.html" + window.location.search;}
    })
    .catch((error) => {console.error('Error: ', error);});   
}

window.addEventListener("load", async () => {
    await checkIfPlayerAndGameExist();
    await checkIfRoundExist();
    checkIfAllPlayersAnswered();
    setInterval(checkIfAllPlayersAnswered, 5000);
});

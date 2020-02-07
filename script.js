window.onload = async function(){
    let status;
    await fetch('http://localhost:9423/game/current')
    .then((resp) => status = resp.status)
    .catch((error) => { console.error('Error:', error); });
    if(status == 200){
        document.getElementById("newGame").style.display = "none";
    }
    else{
        document.getElementById("joinGame").style.display = "none";
    }
}

//add new player
document.getElementById("joinGame").onclick = function(){
    const player = {name: document.getElementById("name").value};
    fetch('http://localhost:9423/game/current/player', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(player)
    })
    .then((response) => {

    })
    .catch((error) => { console.error('Error:', error); });
}

document.getElementById("newGame").onclick = function(){
    const player = {name: document.getElementById("name").value};
    fetch('http://localhost:9423/game/current', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(player)
    })
    .then((response) => {

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

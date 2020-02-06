window.onload = function(){
    const data = {name: "alexandra"};
    fetch('http://localhost:9423/game/current/player', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then((response) => {
        console.log(response)
    })
    .catch((error) => {
        console.error('Error:', error);
    });
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

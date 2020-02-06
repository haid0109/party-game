window.onload = function(){
    const data = {name: "alexandra"};
    fetch('http://localhost:9423/game/current/player', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then((res) => res.json())
    .then((data) => {
        console.log('Success:', data);
    })
    .catch((error) => {
        alert('Error:', error);
    });
    alert("hej");
}
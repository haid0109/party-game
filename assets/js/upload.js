window.addEventListener("load", () => {
    function hasGetUserMedia() {
        return !!(navigator.mediaDevices.getUserMedia);
    }
    if (hasGetUserMedia()) {
        // const player = document.getElementById('player');
        // const handleSuccess = function(stream) {
        //     if (window.URL) { player.srcObject = stream; } 
        //     else { player.src = stream; }
        // };
        // navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        // .then(handleSuccess);
        
    } 
    else { alert('getUserMedia() is not supported by your browser'); }
})
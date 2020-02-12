window.addEventListener("load", () => {
    function hasGetUserMedia() {
        return !!(navigator.mediaDevices &&
          navigator.mediaDevices.getUserMedia);
      }

      if (hasGetUserMedia()) {
      } else {
        alert('getUserMedia() is not supported by your browser');
      }
})
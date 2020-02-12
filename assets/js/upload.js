window.addEventListener("load", () => {
    function hasGetUserMedia() {
        return !!(navigator.mediaDevices &&
          navigator.mediaDevices.getUserMedia);
      }
      if (hasGetUserMedia()) {
          const contraints = {video: true};
          const video = document
      } 
      else { alert('getUserMedia() is not supported by your browser'); }
})

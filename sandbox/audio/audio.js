window.onload = function() {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia || navigator.msGetUserMedia || false;
        
    window.URL = window.URL || window.webkitURL || false;
    
    if (navigator.getUserMedia === false || window.URL === false) {
        console.log('getUserMedia/window.URL are not supported');
        return false;
    }
    
    window.mjs = window.mjs || {};
    window.mjs.recording = document.getElementById('recording');
    
    document.getElementById('startRecord').onclick = function() {
        window.mjs.recording.innerHTML = 'true';
        
        navigator.getUserMedia({
            video    : false,
            audio    : true,
            toString : function() {
                return "video,audio";
            }
        }, function (stream) {
            window.mjs.audio     = document.getElementsByTagName('audio')[0]; console.log(window.URL);
            window.mjs.audio.src = window.URL.createObjectURL(stream);
            
            window.mjs.stream    = stream;
        });    
    };
    
    document.getElementById('stopAndPlay').onclick = function() {
        window.mjs.recording.innerHTML = 'false';
        window.mjs.stream.stop();
        window.mjs.audio.play();
    };
}
onmessage = function(e) {
    var beforeTick = 20 * 1000; // 20 seconds to prepare;
    var tickTime = 3 * 60 * 1000; // 3 minutes
    var refreshRate = 100;
    if (e.data) {
        var data = e.data;
        setInterval(function () {
            function reset(t) {
                data.timeLeft = data.tickTime;
                if (t) data.timeLeft = data.timeLeft + t;
            }

            data.timeLeft = data.timeLeft - refreshRate;

            if (data.timeLeft <= beforeTick && (beforeTick - data.timeLeft) <= refreshRate) {
                postMessage('notify');
            }

            if (data.timeLeft <= 0) {
                reset(data.timeLeft)
            }

            if (data.timeLeft <= tickTime - 1000 && data.timeLeft >= tickTime - refreshRate - 1000){
                postMessage('calibrate');
            }

            else{
              postMessage({timeLeft:data.timeLeft});
            }
        }, refreshRate);
    }
};
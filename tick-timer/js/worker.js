onmessage = function(e) {
    var beforeTick = 20 * 1000; // 20 seconds to prepare;
    if (e.data) {
        var data = e.data;
        setInterval(function () {
            function reset(t) {
                data.timeLeft = data.tickTime;
                if (t) data.timeLeft = data.timeLeft + t;
            }

            data.timeLeft = data.timeLeft - 100;
            if (data.timeLeft <= beforeTick && (beforeTick - data.timeLeft) <= 100) {
                postMessage('notify');
            }

            if (data.timeLeft <= 0) {
                reset(data.timeLeft)
            }

            postMessage({timeLeft:data.timeLeft});

        }, 100);
    }
};
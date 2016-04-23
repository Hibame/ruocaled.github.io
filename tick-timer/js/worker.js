onmessage = function(e) {
    console.log('Message received from main script');
    var workerResult = 'Result: '
    console.log('Posting message back to main script');
    postMessage(workerResult);
}

//onmessage = function(e) {
//    if (e.data === 'start') {
//        setInterval(function () {
//            timeLeft = timeLeft - 100;
//            if (timeLeft <= beforeTick && (beforeTick - timeLeft) <= 100 && useNotification) {
//                notify()
//            }
//
//            if (timeLeft <= 0) {
//                reset(timeLeft)
//            }
//            var duration = moment.utc(timeLeft).format("mm:ss");
//
//            postMessage(duration);
//
//        }, 100);
//    }
//};
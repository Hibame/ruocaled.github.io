$(document).ready(function () {


    var tickTime = 3 * 60 * 1000;
    var beforeTick = 20 * 1000; // 20 seconds to prepare;
    var timeLeft;
    var timer;
    var useNotification = false;
    var worker;

    calibrate();

    $('#start').click(function () {
        reset();
        store();
        start();
    });

    $('#notification').click(function () {
        if ($('#notification').is(':checked')) {
            useNotification = true;
            Notification.requestPermission();
            if (localStorage) localStorage['useNotification'] = true;
        }
        else {
            useNotification = false;
            if (localStorage) delete localStorage['useNotification'];
        }
    });

    function start() {

        if(worker){
            worker.terminate();
        }

        worker = new Worker('worker.js');

        console.log(worker);

        worker.onmessage = function(e){

            console.log(e.data);

            var duration = e.data;

            $('#time-left').text(duration);
            $(document).prop('title', duration);
        };

        worker.postMessage('start');


    }

    function reset(t) {
        timeLeft = tickTime;
        if (t) timeLeft = timeLeft + t;
    }

    function store() {
        if (localStorage) {
            localStorage['lastCali'] = new Date();
        }
    }

    function notify() {
        playsound();
        if (Notification.permission === "granted") {
            var notification = new Notification("Time to Go To Bed!");
            setTimeout(function () {
                notification.close();
            }, 5000)
        }
    }

    function playsound() {
        $('#sound')[0].play();
    }

    function calibrate() {
        if (localStorage && localStorage['useNotification']) {
            $('#notification').prop('checked', true);
            useNotification = true;
        }
        if (localStorage && localStorage['lastCali']) {
            var lastCali = new Date(localStorage['lastCali']);
            var now = new Date();
            var timeHasPassed = now.getTime() - lastCali.getTime();
            if (timeHasPassed > tickTime) {
                timeLeft = tickTime - (timeHasPassed % tickTime);
            } else {
                timeLeft = tickTime - timeHasPassed;
            }
            start();
        }
    }
});
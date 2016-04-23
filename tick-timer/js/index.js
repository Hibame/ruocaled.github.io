$(document).ready(function () {

    if (!window.localStorage || !window.Worker){
        $('#timer').html('Your Browser is not supported, please get latest chrome or firefox');
        $('#timer').show();
    }

    var tickTime = 3 * 60 * 1000;

    var timeLeft;
    var useNotification = false;
    var worker;
    var notification;

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
            localStorage['useNotification'] = true;
        }
        else {
            useNotification = false;
            delete localStorage['useNotification'];
        }
    });

    function start() {
        if (notification) notification.close();
        if(worker){
            worker.terminate();
        }
        worker = new Worker('js/worker.js');
        worker.onmessage = function(e){
            if (e.data == 'notify' && useNotification){
                notify();
            }
            else{
                timeLeft = e.data.timeLeft;
                var duration = moment.utc(timeLeft).format("mm:ss");
                $('#time-left').text(duration);
                $(document).prop('title', duration);
                $('#timer').show();
            }
        };
        worker.postMessage({timeLeft:timeLeft,tickTime:tickTime});
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
            if (notification) notification.close();
            notification = new Notification("Time for Bed!",{icon:'icon.png'});
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
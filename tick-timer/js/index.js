
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
    var lastCali;
    var beforeTick = 20 * 1000;
    var volume;
    var settingsOpen = false;

    calibrate();
    autoStart();

    $('#start').click(function () {
        console.log('#start clicked');
        reset();
        store();
        start();
    });

    $('body').click(function(evt){
        if(evt.target.id == "settings")
            return;
        if(evt.target.id == "settings-btn")
            return;
        if($(evt.target).closest('#settings').length)
            return;
        if($(evt.target).closest('#settings-btn').length)
            return;
        $("#settings").css('left','-387px');


    });

    $('#settings-close-btn').click(function(){
        $("#settings").css('left','-387px');
    });

    $('#notification').click(function () {
        console.log('#notification clicked');
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

    $('#before-tick').on('input',function () {
        beforeTick = $('#before-tick').val()  * 1000;
        $('#before-tick-output').html(beforeTick / 1000);
        if (localStorage) {
            localStorage['beforeTick'] = beforeTick;
        }
        worker.postMessage({beforeTick: beforeTick});
    });


    $("#settings-btn").click(function(){

        $("#settings").css('left','0');
    });

    function start() {
        console.log('start()');
        $('#before-tick-output').html(beforeTick / 1000);
        if (notification) notification.close();
        if(worker){
            worker.terminate();
        }
        worker = new Worker('js/worker.js');
        worker.onmessage = function(e){
            if (e.data == 'notify' && useNotification){
                notify();
            }
            else if ( e.data == 'calibrate'){
                calibrate();
             }
            else{
                timeLeft = e.data.timeLeft;
            }
            print();
        };
        worker.postMessage({timeLeft:timeLeft,tickTime:tickTime});
        worker.postMessage({beforeTick: beforeTick});
    }

    function print(){
        var duration = moment.utc(timeLeft).format("mm:ss");
        $('#time-left').text(duration);
        $(document).prop('title', duration);
        $('#timer').css('display','block');
    }

    function reset(t) {
        console.log('reset()');
        timeLeft = tickTime;
        if (t) timeLeft = timeLeft + t;
    }

    function store() {
        console.log('store()');
        if (localStorage) {
            localStorage['lastCali'] = new Date();
        }
    }

    function notify() {
        console.log('notify()');
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
        console.log('playsound()');
        $('#sound')[0].play();
    }

    function calibrate() {
        console.log('calibrate()');
        if (localStorage && localStorage['useNotification']) {
            $('#notification').prop('checked', true);
            useNotification = true;
        }
        if (localStorage && localStorage['beforeTick']) {
            beforeTick = parseInt(localStorage['beforeTick']);
            $('#before-tick').val(beforeTick/1000);
        }
        if (localStorage && localStorage['volume']) {
            volume = parseInt(localStorage['volume']);
            $('#volume').val(volume);
        }
        if (localStorage && localStorage['lastCali']) {
            lastCali = new Date(localStorage['lastCali']);
            var now = new Date();
            var timeHasPassed = now.getTime() - lastCali.getTime();
            if (timeHasPassed > tickTime) {
                timeLeft = tickTime - (timeHasPassed % tickTime);
            } else {
                timeLeft = tickTime - timeHasPassed;
            }
        }
        else{
            $('#timer').show();
        }

    }

    function autoStart(){
        if (localStorage && localStorage['lastCali']) {
            start();
        }
    }
});
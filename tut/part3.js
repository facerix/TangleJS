require.config({
    paths: {
        'tangle': '..'
    }
});
require(
    ["tangle/core"],
    function(Tangle) {
    "use strict";

        var divStatus = document.getElementById('status'),
            imgClock  = document.createElement('img'),
            txtTime   = document.createElement('span'),
            btnOnOff  = document.getElementById('onoff'),
            txtFPS    = document.getElementById('fps'),
            x = 0, y = 0, dx = 1.4, dy = 2.3;

        // init DOM
        imgClock.src = 'assets/wait.gif';
        divStatus.appendChild(imgClock);
        divStatus.appendChild(txtTime);


        // set up main loop & FPS callback
        Tangle.init(_moveClock, _drawClock, function updateFPS(fps) {
            txtFPS.innerHTML = Math.floor(fps);
        });
        Tangle.play();

      
        // helper functions

        function _moveClock() {
            if ((dx > 0 && x > 260) || (dx < 0 && x <= 0)) dx = -1 * dx;
            if ((dy > 0 && y > 200) || (dy < 0 && y <= 0)) dy = -1 * dy;

            x += dx;
            y += dy;
            divStatus.style.left = Math.floor(x) + "px";
            divStatus.style.top  = Math.floor(y) + "px";
        }

        function _drawClock() {
            var now = new Date(),
                hms = [
                    _pad(now.getHours()),
                    _pad(now.getMinutes()),
                    _pad(now.getSeconds())
                ];

            function _pad(n) { return (n < 10) ? '0' + n : n + ''; }

            txtTime.innerHTML = '[' + hms.join(':') + "]";
        }

        // DOM event handlers

        function addEvent(tgt, type, func, useCapture) {
        // follows the API of the standard addEventListener, but abstracts it to work cross-browser
            var capture = useCapture || false;
            if (tgt.addEventListener) {
                // modern standards-based browsers
                tgt.addEventListener(type, func, capture);
            } else if (tgt.attachEvent) {
                // IE < 9
                tgt.attachEvent('on'+type, func);
            } else if (typeof tgt['on'+type] !== 'undefined') {
                // old school (can assign to the element's event handler this way, provided it's not undefined)
                var oldfunc = tgt['on'+type];
                if (typeof oldfunc === 'function') {
                    tgt['on'+type] = function() { oldfunc(); func(); };
                } else {
                    tgt['on'+type] = func;
                }
            } else {
                alert ("Can't add this event type: " + type + " to this element: " + tgt);
            }
        }

        addEvent(btnOnOff, 'click', function() {
            if (Tangle.isPaused()) {
                btnOnOff.innerHTML = "Pause";
                Tangle.play();
            } else {
                btnOnOff.innerHTML = "Resume";
                Tangle.pause();
            }
        });

    }
);

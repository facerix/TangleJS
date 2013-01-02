//
// tangle/core - convenience and polyfill functions for easier game logic
//
// author: Ryan Corradini
// license: MIT
//

define([], function() {
    // requestAnimationFrame / cancelAnimationFrame implementation;
    // adapted from the polyfill by Erik Möller, fixes from Paul Irish and Tino Zijdel
    // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    // http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };

    // end of requestAnimationFrame/cancelAnimationFrame polyfill

    var _mainLoop,
        _mainLoopId,
        _paused = true;

    var elapsedMs = 0,
        framesThisSecond = 0,
        previousTimestamp = 0,
        currentTimestamp = new Date().getTime(),
        _fpsCallback = function() {};

    function _checkFPS() {
        var currentFPS;

        // measure the framerate; adapted from a Gist by Christer Kaitila
        //  (see http://buildnewgames.com/dom-sprites)
        framesThisSecond++;
        previousTimestamp = currentTimestamp;
        currentTimestamp = new Date().getTime();
        elapsedMs += currentTimestamp - previousTimestamp;

        if (elapsedMs >= 1000) {
            elapsedMs -= 1000;
            framesThisSecond = 0;

            currentFPS = 1000 / (currentTimestamp - previousTimestamp);

            _fpsCallback(currentFPS);
        }
    }

    var tangleCore = {

        main: function mainLoop(func, fpsCallback) {
            if (func && typeof func == "function") {
                _paused = false;
                _mainLoop = function() {
                    func();
                    _checkFPS();
                    _mainLoopId = requestAnimationFrame(arguments.callee);
                };
                _mainLoopId = requestAnimationFrame(_mainLoop);
            } else {
                _paused = true;
                _mainLoop = null;
                console.error("[Tangle.main] >> Provided argument is null or not a function.");
            }

            if (fpsCallback && typeof fpsCallback == "function") _fpsCallback = fpsCallback;
        },

        isPaused: function isPaused() {
            return (_paused == true);
        },

        pause: function pauseMain() {
            if (!_paused) {
                _paused = true;
                cancelAnimationFrame(_mainLoopId);
            }
        },

        play: function playMain() {
            if (_paused) {
                _paused = false;
                _mainLoopId = requestAnimationFrame(_mainLoop);
            }
        }

    };

    return tangleCore;
});

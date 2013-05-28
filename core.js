//
// tangle/core - convenience and polyfill functions for easier game logic
//
// author: Ryan Corradini
// license: MIT
//

/*jslint browser: true*/
/*jslint plusplus: true*/
/*global define, alert, console, requestAnimationFrame, cancelAnimationFrame */

define([], function() {
    "use strict";

    // requestAnimationFrame / cancelAnimationFrame implementation;
    // adapted from the polyfill by Erik Moller, fixes from Paul Irish and Tino Zijdel
    // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    // http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
    (function(){
        var x, lastTime = 0,
            vendors = ['ms', 'moz', 'webkit', 'o'];

        for(x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                       || window[vendors[x]+'CancelRequestAnimationFrame'];
        }

        if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = function(callback, element) {
                var currTime = new Date().getTime(),
                    timeToCall = Math.max(0, 16 - (currTime - lastTime)),
                    id = window.setTimeout(
                        function() { callback(currTime + timeToCall); },
                        timeToCall
                    );
                lastTime = currTime + timeToCall;
                return id;
            };
        }

        if (!window.cancelAnimationFrame) {
            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };
        }
    }());   // (enclosed in an IIFE to contain the madness)
    // end of requestAnimationFrame/cancelAnimationFrame polyfill

    var _updateLoop,
        _renderLoop,
        _renderLoopId,
        _updateLoopId,
        _paused = true,
        elapsedMs = 0,
        framesThisSecond = 0,
        previousTimestamp = 0,
        currentTimestamp = new Date().getTime(),
        _fpsCallback = function() {},
        pageVis = {};


    // Page Visibility API flattening (uses browser-prefixed if no standard version)
    // https://developer.mozilla.org/en-US/docs/Web/Guide/User_experience/Using_the_Page_Visibility_API
    (function(pv){
        // Set the name of the hidden property and the change event for visibility
        var hidden, visibilityChange;
        if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
            pv.hidden = "hidden";
            pv.visibilityChange = "visibilitychange";
        } else if (typeof document.mozHidden !== "undefined") {
            pv.hidden = "mozHidden";
            pv.visibilityChange = "mozvisibilitychange";
        } else if (typeof document.msHidden !== "undefined") {
            pv.hidden = "msHidden";
            pv.visibilityChange = "msvisibilitychange";
        } else if (typeof document.webkitHidden !== "undefined") {
            pv.hidden = "webkitHidden";
            pv.visibilityChange = "webkitvisibilitychange";
        }
    }(pageVis));   // (end of enclosing IIFE)
    // end of pageVisibility polyfill


    // helper functions
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


    // public function implementations (here instead of inline below if we need to invoke them)
    function _addEvent(tgt, type, func, useCapture) {
        // follows the API of the standard addEventListener, but abstracts it to work cross-browser
        // (repurposed wholesale from Atto Core)
        var oldfunc, capture = useCapture || false;
        if (tgt.addEventListener) {
            // modern standards-based browsers
            tgt.addEventListener(type, func, capture);
        } else if (tgt.attachEvent) {
            // IE < 9
            tgt.attachEvent('on'+type, func);
        } else if (typeof tgt['on'+type] !== 'undefined') {
            // old school (can assign to the element's event handler this way, provided it's not undefined)
            oldfunc = tgt['on'+type];
            if (typeof oldfunc === 'function') {
                tgt['on'+type] = function() { oldfunc(); func(); };
            } else {
                tgt['on'+type] = func;
            }
        } else {
            alert ("Can't add this event type: " + type + " to this element: " + tgt);
        }
    }

    function _pauseMain() {
        if (!_paused) {
            _paused = true;
            clearInterval(_updateLoopId);
            cancelAnimationFrame(_renderLoopId);
        }
    }

    function _playMain() {
        if (_paused) {
            _paused = false;
            currentTimestamp = new Date().getTime();
            _updateLoopId = setInterval(_updateLoop, 1000 / 60);  // aim for 60 FPS
            _renderLoopId = requestAnimationFrame(_renderLoop);
        }
    }

    // Handle page visibility change
    _addEvent(document, pageVis.visibilityChange, function _handleVisibilityChange() {
        if (document[pageVis.hidden]) {
            _pauseMain();
        } else {
            _playMain();
        }
    });

    // return the singleton tangleCore object
    return {
        addEvent: _addEvent,

        init: function game_init(updateFunc, renderFunc, fpsFunc) {
            _paused = true;

            if (fpsFunc) {
                if (typeof fpsFunc === "function") {
                    _fpsCallback = fpsFunc;
                } else {
                    console.error("[Tangle.main] >> Provided argument fpsFunc is not a function.");
                }
            }

            if (updateFunc && typeof updateFunc === "function") {
                _updateLoop = updateFunc;
            } else {
                _updateLoop = null;
                console.error("[Tangle.main] >> Provided argument updateFunc is null or not a function.");
            }

            if (renderFunc && typeof renderFunc === "function") {
                _renderLoop = function() {
                    _checkFPS();  // calls fpsFunc with the latest calculated FPS
                    renderFunc();
                    _renderLoopId = requestAnimationFrame(_renderLoop);
                };
            } else {
                _renderLoop = null;
                console.error("[Tangle.main] >> Provided argument renderFunc is null or not a function.");
            }
        },

        isPaused: function isPaused() {
            return (_paused);
        },

        pause: _pauseMain,
        play: _playMain
    };
});

/***************************/
//@Author: Rylee Corradini
//@website: www.facerix.com
//@email: rylee@facerix.com
//@license: Free to use & modify, but please keep this credits message
/***************************/

require.config({
  paths: {
    atto: "../../atto",
    tangle: "..",
  },
});
require([
  "atto/core",
  "tangle/core",
  "tangle/inputManager",
  "p05_player",
], function (atto, Tangle, InputManager, Player) {
  "use strict";

  var _canvas = document.querySelector("canvas"),
    _context = null,
    _btnOnOff = document.getElementById("onoff"),
    _attrs = {
      width: (_canvas && _canvas.width) || 0,
      height: (_canvas && _canvas.height) || 0,
    },
    _player = new Player(),
    _im = new InputManager(),
    _inputs = {
      UP: 1,
      DOWN: 2,
      LEFT: 3,
      RIGHT: 4,
      BTN1: 5,
      BTN2: 6,
    },
    _txtFPS = document.getElementById("fps"),
    _txtAction = document.getElementById("currentAction");

  if (_canvas) {
    //console.log('getting context...');
    _context = _canvas.getContext("2d");
  }

  function _update() {
    //console.log('game.update()');
    // no global updating to do; just tell Player to update itself
    _player.update();
  }

  function _render() {
    // clear previous canvas
    //_context.clearRect(0,0, _attrs.width, _attrs.height);

    // clear previous canvas (uses rgba fillRect to produce a "ghosting" effect)
    _context.fillStyle = "rgba(255,255,255, 0.1)";
    _context.fillRect(0, 0, _attrs.width, _attrs.height);

    _player.render(_context);
  }

  function _updateFPS(fps) {
    _txtFPS.innerHTML = ~~fps;
  }
  function _updateAction(txt) {
    _txtAction.innerHTML = txt;
  }

  // set up main loops
  Tangle.init(_update, _render, _updateFPS);
  Tangle.play();

  // helper functions

  // DOM event handlers

  atto.addEvent(_btnOnOff, "click", function () {
    if (Tangle.isPaused()) {
      _btnOnOff.innerHTML = "Pause";
      Tangle.play();
    } else {
      _btnOnOff.innerHTML = "Resume";
      Tangle.pause();
    }
  });

  // set up input manager (could be done in another file and just included here)

  _im.listen(function (input) {
    switch (input) {
      case _inputs.UP:
        _updateAction("up");
        _player.input(_player.commands.UP);
        break;
      case _inputs.DOWN:
        _updateAction("down");
        _player.input(_player.commands.DOWN);
        break;
      case _inputs.LEFT:
        _updateAction("left");
        _player.input(_player.commands.LEFT);
        break;
      case _inputs.RIGHT:
        _updateAction("right");
        _player.input(_player.commands.RIGHT);
        break;
      case _inputs.BTN1:
        _updateAction("stopped");
        _player.input(_player.commands.STOP);
        break;
      case _inputs.BTN2:
        _updateAction("panic!");
        _player.input(_player.commands.PANIC);
        break;
      default:
        break;
    }
  });

  _im.alias(document, "key:I", _inputs.UP);
  _im.alias(document, "key:J", _inputs.LEFT);
  _im.alias(document, "key:K", _inputs.DOWN);
  _im.alias(document, "key:L", _inputs.RIGHT);
  _im.alias(document, "key:Q", _inputs.BTN1);
  _im.alias(document, "key:P", _inputs.BTN2);

  _im.alias(document, "key:ARROW_U", _inputs.UP);
  _im.alias(document, "key:ARROW_L", _inputs.LEFT);
  _im.alias(document, "key:ARROW_D", _inputs.DOWN);
  _im.alias(document, "key:ARROW_R", _inputs.RIGHT);
  _im.alias(document, "key:ESCAPE", _inputs.BTN1);
  _im.alias(document, "key:SPACE", _inputs.BTN2);

  _im.alias(document, "key:KEYPAD_8", _inputs.UP);
  _im.alias(document, "key:KEYPAD_4", _inputs.LEFT);
  _im.alias(document, "key:KEYPAD_2", _inputs.DOWN);
  _im.alias(document, "key:KEYPAD_6", _inputs.RIGHT);
  _im.alias(document, "key:KEYPAD_5", _inputs.BTN1);

  _im.alias(document, "touch:SWIPE_UP", _inputs.UP);
  _im.alias(document, "touch:SWIPE_LEFT", _inputs.LEFT);
  _im.alias(document, "touch:SWIPE_DOWN", _inputs.DOWN);
  _im.alias(document, "touch:SWIPE_RIGHT", _inputs.RIGHT);
  _im.alias(document, "touch:MULTI_TAP", _inputs.STOP);

  /* debug
        atto.addEvent(document, 'keypress', function(e) {
            var key = (e.charCode || e.keyCode || e.which);
            console.log("keypress:", key);
        });
        atto.addEvent(document, 'keydown', function(e) {
            var key = (e.charCode || e.keyCode || e.which);
            console.log("keydown:", key);
        });
*/

  /*

        // another approach to inputs (and input-debouncing) might be like this:

        _inputBuffer = [];

        atto.addEvent(_canvas, 'click', function(ev) {
            _inputBuffer.push( _inputs.MOUSE_CLICK );
        });

        function __update() {
            var inp = _inputBuffer.pop();
            switch (inp) {
                case _inputs.MOUSE_CLICK:
                    _player.cmd(_inputs.PANIC);
                    break;
                default:
                    break;
            }
        }

        */
});

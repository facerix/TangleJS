/***************************/
//@Author: Ryan Corradini
//@website: www.buyog.com
//@email: ryancorradini@yahoo.com
//@license: Free to use & modify, but please keep this credits message
/***************************/

require.config({
    paths: {
        'atto': '../../atto',
        'tangle': '..'
    }
});
require(
    ["atto/core", "tangle/core", "tangle/inputManager", "p05_player"],
    function(atto, Tangle, InputManager, Player) {
    "use strict";

        var _canvas   = document.querySelector('canvas'),
            _context  = null,
            _btnOnOff = document.getElementById('onoff'),
            _attrs    = {
                width:  _canvas && _canvas.width  || 0,
                height: _canvas && _canvas.height || 0
            },
            _player  = new Player(),
            _inMgr   = new InputManager();

        if (_canvas) {
            //console.log('getting context...');
            _context = _canvas.getContext('2d');
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
            _context.fillRect(0,0, _attrs.width, _attrs.height);

            _player.render(_context);
        }

        function _updateFPS(fps) {
            //console.log('fps:',fps);
        }

        // set up main loops
        Tangle.init(_update, _render, _updateFPS);
        Tangle.play();


        // helper functions


        // DOM event handlers

        atto.addEvent(_btnOnOff, 'click', function() {
            if (Tangle.isPaused()) {
                _btnOnOff.innerHTML = "Pause";
                Tangle.play();
            } else {
                _btnOnOff.innerHTML = "Resume";
                Tangle.pause();
            }
        });


        // set up input manager (could be done in another file and just included here)

        _inMgr.connect(document, 'key:I', _player.cmd, _player.commands.UP);
        _inMgr.connect(document, 'key:J', _player.cmd, _player.commands.LEFT);
        _inMgr.connect(document, 'key:K', _player.cmd, _player.commands.DOWN);
        _inMgr.connect(document, 'key:L', _player.cmd, _player.commands.RIGHT);
        _inMgr.connect(document, 'key:Q', _player.cmd, _player.commands.STOP);
        _inMgr.connect(document, 'key:P', _player.cmd, _player.commands.PANIC);

        _inMgr.connect(document, 'key:ARROW_U', _player.cmd, _player.commands.UP);
        _inMgr.connect(document, 'key:ARROW_L', _player.cmd, _player.commands.LEFT);
        _inMgr.connect(document, 'key:ARROW_D', _player.cmd, _player.commands.DOWN);
        _inMgr.connect(document, 'key:ARROW_R', _player.cmd, _player.commands.RIGHT);
        _inMgr.connect(document, 'key:CLEAR',   _player.cmd, _player.commands.STOP);
        _inMgr.connect(document, 'key:SPACE',   _player.cmd, _player.commands.PANIC);

        _inMgr.connect(document, 'key:KEYPAD_8', _player.cmd, _player.commands.UP);
        _inMgr.connect(document, 'key:KEYPAD_4', _player.cmd, _player.commands.LEFT);
        _inMgr.connect(document, 'key:KEYPAD_2', _player.cmd, _player.commands.DOWN);
        _inMgr.connect(document, 'key:KEYPAD_6', _player.cmd, _player.commands.RIGHT);
        _inMgr.connect(document, 'key:KEYPAD_5', _player.cmd, _player.commands.STOP);


        _inMgr.connect(document, 'touch:SWIPE_UP', _player.cmd, _player.commands.UP);
        _inMgr.connect(document, 'touch:SWIPE_LEFT', _player.cmd, _player.commands.LEFT);
        _inMgr.connect(document, 'touch:SWIPE_DOWN', _player.cmd, _player.commands.DOWN);
        _inMgr.connect(document, 'touch:SWIPE_RIGHT', _player.cmd, _player.commands.RIGHT);
        _inMgr.connect(document, 'touch:MULTI_TAP', _player.cmd, _player.commands.STOP);


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
                    _player.cmd(_player.commands.PANIC);
                    break;
                default:
                    break;
            }
        }

        */
    }
);

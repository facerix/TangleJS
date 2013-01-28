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
    ["atto/core", "tangle/assetCache", "tangle/stateManager"],
    function(atto, AssetCache, StateManager) {
    "use strict";

        var txtStatus = document.getElementById('status');
        var _assets  = new AssetCache(),
            _states  = new StateManager(),
            _canvas  = document.querySelector('canvas'),
            _context = null,
            _attrs   = {
                width: _canvas && _canvas.width || 0,
                height: _canvas && _canvas.height || 0
            },
            _inputs  = {
                MOUSE_CLICK: 1
            },
            _inputBuffer = [];

        if (_canvas) {
            //console.log('getting context...');
            _context = _canvas.getContext('2d');
            _context.font = '32px Serif';

            atto.addEvent(_canvas, 'click', function(ev) {
                _inputBuffer.push( _inputs.MOUSE_CLICK );
            });
        }

        // add states & preload assets
        _initStates();
        _initAssets();

        function _tick() {
            //console.log('Game::tick (this:', this, ')');
            _states.tick();
            _states.render(_context);
        }

        function _initAssets() {
            _assets.addAsset( "title", "assets/title.png" );
            _assets.addAsset( "wait",  "assets/wait.gif"  );
            _assets.addAsset( "font",  "assets/font.png"  );
        }

        function _initStates() {
            _states.addState({
                id: 0,
                title: 'Loading',
                before: function() {},
                tick: function() {
                    if (_assets.ready()) {
                        // assets are ready!
                        return 1;   // change to state 1
                    } else {
                        // still waiting for assets...
                        return;     // no change in state
                    }
                },
                render: function(context) {
                    context.fillStyle = "rgb(73,195,79)";
                    context.fillRect(0,0, _attrs.width, _attrs.height);

                    context.fillStyle = "#ffffff";
                    context.fillText('Loading...', 100, 175);
                }
            });
            _states.addState({
                id: 1,
                title: 'Title',
                before: function() {},
                tick: function() {
                    if (_inputBuffer.indexOf(_inputs.MOUSE_CLICK) > -1) {
                        return 2;   // change to state 2
                    } else {
                        return;     // no change
                    }
                },
                render: function(context) {
                    var imgSplash = _assets.getAsset('title');
                    if (imgSplash) {
                        context.drawImage(imgSplash, 0,0, _attrs.width, _attrs.height);
                    }
                }
            });
            _states.addState({
                id: 2,
                title: 'Play',
                before: function() {},
                tick: function() {},
                render: function(context) {
                    context.strokeWidth = 20;
                    context.strokeStyle = "#ffffff";

                    context.fillStyle = "rgb(73,195,79)";
                    context.fillRect(0,0, _attrs.width, _attrs.height);

                    context.fillStyle = "rgb(0,0,0)";
                    context.fillRect(60,20, _attrs.width-120, _attrs.height-40);

                    context.strokeRect(62,22, _attrs.width-124, _attrs.height-44);

                    context.fillStyle = "#ffffff";
                    context.fillText("Let's play!", 100, 125);
                }
            });
        }


        // StateManager event callbacks
        function stateChange(data) {
            _log( atto.supplant("Entered state {id}: {title}", data) );
        }
        stateChange(_states.currentState());
        _states.events.changeState.watch(stateChange);

        // main "game" loop
        function _loop() {
            _tick();
            requestAnimationFrame(_loop);
        }
        requestAnimationFrame(_loop);


        // helper functions

        function _log(msg) {
            //console.log(msg);
            txtStatus.appendChild(document.createTextNode(msg));
            txtStatus.appendChild(document.createElement('br'));
        }


        // DOM event handlers


    }
);

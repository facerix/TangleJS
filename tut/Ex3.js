/***************************/
//@Author: Ryan Corradini
//@website: www.buyog.com
//@email: ryancorradini@yahoo.com
//@license: Free to use & modify, but please keep this credits message
/***************************/

define(
    ["atto/core", "atto/event", "tangle/AssetCache", "tangle/StateManager"],
    function(atto, AttoEvent, AssetCache, StateManager) {
    "use strict";
        function constructor(args) {
            var _assets  = new AssetCache(),
                _states  = new StateManager(),
                _canvas  = args.canvas,
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
                _states.tick(this);
                _states.render(this, _context);
            }

            return {
                tick   : _tick,
                attrs  : _attrs,
                assets : _assets,
                states : _states,
                ctx    : _context,
                _inputBuffer: _inputBuffer,
                _inputs: _inputs
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
                    tick: function(game) {
                        if (_assets.ready()) {
                            // assets are ready!
                            return 1;   // change to state 1
                        } else {
                            // still waiting for assets...
                            return;     // no change in state
                        }
                    },
                    render: function(game, context) {
                        context.fillStyle = "rgb(73,195,79)";
                        context.fillRect(0,0, game.attrs.width, game.attrs.height);

                        context.fillStyle = "#ffffff";
                        context.fillText('Loading...', 100, 175);
                    }
                });
                _states.addState({
                    id: 1,
                    title: 'Title',
                    before: function() {},
                    tick: function(game) {
                        if (_inputBuffer.indexOf(_inputs.MOUSE_CLICK) > -1) {
                            return 2;   // change to state 2
                        } else {
                            return;     // no change
                        }
                    },
                    render: function(game, context) {
                        var imgSplash = game.assets.getAsset('title');
                        if (imgSplash) {
                            context.drawImage(imgSplash, 0,0, game.attrs.width, game.attrs.height);
                        }
                    }
                });
                _states.addState({
                    id: 2,
                    title: 'Play',
                    before: function() {},
                    tick: function(game) {},
                    render: function(game, context) {
                        context.strokeWidth = 20;
                        context.strokeStyle = "#ffffff";

                        context.fillStyle = "rgb(73,195,79)";
                        context.fillRect(0,0, game.attrs.width, game.attrs.height);

                        context.fillStyle = "rgb(0,0,0)";
                        context.fillRect(60,20, game.attrs.width-120, game.attrs.height-40);

                        context.strokeRect(62,22, game.attrs.width-124, game.attrs.height-44);

                        context.fillStyle = "#ffffff";
                        context.fillText("Let's play!", 100, 125);
                    }
                });
            }
        } // end of constructor

        return constructor;
    } // end AMD callback function
);

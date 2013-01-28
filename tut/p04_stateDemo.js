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
[
  "atto/core",
  "tangle/core",
  "tangle/assetCache",
  "tangle/stateManager"
], function(atto, Tangle, AssetCache, StateManager) {
  "use strict";

  var txtStatus = document.getElementById('status'),
      _canvas   = document.querySelector('canvas'),
      _context;
  var game = {
    assets : new AssetCache(),
    states : new StateManager(),
    attrs  : {
      width: _canvas && _canvas.width || 0,
      height: _canvas && _canvas.height || 0
    },
    inputs : {
      MOUSE_CLICK: 1
    },
    inputBuffer : []
  };

  // init canvas context
  if (_canvas) {
    _context = _canvas.getContext('2d');
    _context.font = '32px Serif';
  }


  // helper functions
  function _log(msg) {
    //console.log(msg);
    txtStatus.appendChild(document.createTextNode(msg));
    txtStatus.appendChild(document.createElement('br'));
  }


  // DOM event handlers
  atto.addEvent(_canvas, 'click', function(ev) {
    game.inputBuffer.push( game.inputs.MOUSE_CLICK );
  });


  // add states & preload assets
  game.assets.addAsset( "title", "assets/title.png" );
  game.assets.addAsset( "wait",  "assets/wait.gif"  );
  game.assets.addAsset( "font",  "assets/font.png"  );

  game.states.addState({
    id: 0,
    title: 'Loading',
    before: function() {},
    tick: function(me) {
      if (me.assets.ready()) {
        // assets are ready!
        return 1;   // change to state 1
      } else {
        // still waiting for assets...
        return;     // no change in state
      }
    },
    render: function(me, ctx) {
      ctx.fillStyle = "rgb(73,195,79)";
      ctx.fillRect(0,0, me.attrs.width, me.attrs.height);

      ctx.fillStyle = "#ffffff";
      ctx.fillText('Loading...', 100, 175);
    }
  }); // end of state 0

  game.states.addState({
    id: 1,
    title: 'Title',
    before: function() {},
    tick: function(me) {
      if (me.inputBuffer.indexOf(me.inputs.MOUSE_CLICK) > -1) {
        return 2;   // change to state 2
      } else {
        return;     // no change
      }
    },
    render: function(me, ctx) {
      var imgSplash = me.assets.getAsset('title');
      if (imgSplash) {
        ctx.drawImage(imgSplash, 0,0, me.attrs.width, me.attrs.height);
      }
    }
  }); // end of state 1

  game.states.addState({
    id: 2,
    title: 'Play',
    before: function() {},
    tick: function(me) {},
    render: function(me, ctx) {
      ctx.strokeWidth = 20;
      ctx.strokeStyle = "#ffffff";

      ctx.fillStyle = "rgb(73,195,79)";
      ctx.fillRect(0,0, me.attrs.width, me.attrs.height);

      ctx.fillStyle = "rgb(0,0,0)";
      ctx.fillRect(60,20, me.attrs.width-120, me.attrs.height-40);

      ctx.strokeRect(62,22, me.attrs.width-124, me.attrs.height-44);

      ctx.fillStyle = "#ffffff";
      ctx.fillText("Ready!", 120, 125);
    }
  }); // end of state 2


  // StateManager event callbacks
  function stateChange(data) {
    _log( atto.supplant("Entered state {id}: {title}", data) );
  }
  stateChange(game.states.currentState());
  game.states.events.changeState.watch(stateChange);


  // set up main loops
  function _tick() {
    game.states.tick(game);
  }
  function _render() {
    game.states.render(game, _context);
  }
  Tangle.init(_tick, _render);
  Tangle.play();
});
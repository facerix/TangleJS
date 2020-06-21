//
// tangle/stateManager
//
// author: Rylee Corradini
// license: MIT
//

define(["atto/core", "atto/event"], function (atto, AttoEvent) {
  function constructor(args) {
    var _events = {
        changeState: new AttoEvent("tangle.stateManager.changeState"),
      },
      _state = -1,
      _states = {},
      _currState = null;

    function _change(id, args) {
      if (_states.hasOwnProperty(id)) {
        _state = id;
        _currState = _states[id];
        if (_currState.before) _currState.before.call(this, args);
        _events.changeState.dispatch({ id: id, title: _currState.title });
      }
    }

    function _add(def) {
      if (def.id != undefined && _states.hasOwnProperty(def.id) == false) {
        if (!def.tick) {
          console.log("adding tick stub");
          def.tick = function () {};
        }
        _states[def.id] = def;

        if (!_currState) {
          this.changeState(def.id);
        }
      }
    }

    function _tick(game) {
      var newState;
      if (_currState.hasOwnProperty("tick")) {
        newState = _currState.tick(game);
      }

      if (newState) {
        this.changeState(newState, game);
      }
    }

    function _render(game, context) {
      if (_currState.hasOwnProperty("render")) {
        _currState.render(game, context);
      } else {
        context.clearRect(0, 0, game.attrs.width, game.attrs.height);
      }
    }

    return {
      addState: _add,
      changeState: _change,
      currentState: function () {
        return { id: _state, title: _currState.title };
      },
      events: _events,
      tick: _tick,
      render: _render,
    }; // end of public interface
  } // end of constructor

  return constructor;
}); // end AMD callback function

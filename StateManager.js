/***************************/
//@Author: Ryan Corradini
//@website: www.buyog.com
//@email: ryancorradini@yahoo.com
//@license: Free to use & modify, but please keep this credits message
/***************************/

define(
    ['atto/core', 'atto/event'],
    function(atto, AttoEvent) {
        function constructor(args) {
            var _events = {
                    changeState: new AttoEvent('tangle.stateManager.changeState'),
                },
                _state = -1,
                _states = {},
                _currState = null;

            function _change(id) {
                //console.log("ChangeState :: the 'this' that will get passed into call is:", this);
                if (_states.hasOwnProperty(id)) {
                    _state = id;
                    _currState = _states[id];
                    if (_currState.before) _currState.before.apply(this);
                    _events.changeState.dispatch({id:id, title:_currState.title});
                }
            }

            function _add(def) {
                //console.log("AddState :: by now 'this' has a different definition:", this);
                if ((def.id != undefined) && (_states.hasOwnProperty(def.id) == false)) {
                    if (!def.tick) {
                        console.log('adding tick stub');
                        def.tick = (function() {});
                    }
                    _states[def.id] = def;

                    if (!_currState) {
                        this.changeState(def.id);
                    }
                }
            }

            function _tick(game) {
                //console.dir(game);
                var newState;
                if (_currState.hasOwnProperty('tick')) {
                    newState = _currState.tick(game);
                }

                if (newState) {
                    this.changeState(newState);
                }
            }

            function _render(game, context) {
                if (_currState.hasOwnProperty('render')) {
                    _currState.render(game, context);
                } else {
                    context.clearRect(0,0, game.attrs.width, game.attrs.height);
                }
            }

            return {
                addState     : _add,
                changeState  : _change,
                currentState : function() { return {id:_state,title:_currState.title} },
                events       : _events,
                tick         : _tick,
                render       : _render
            } // end of public interface
        } // end of constructor

        return constructor;
    } // end AMD callback function
);
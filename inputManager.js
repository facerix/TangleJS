//
// tangle/inputManager
//
// author: Ryan Corradini
// license: MIT
//
// API rough sketch:
//
//    (int) connect(source, signal, target, method)  -- returns a connection ID (used by disconnect)
//    void disconnect(connection_id)
//
//    (so, something like a cross between typical pub/sub and dojo/on)
//

define(
    ['atto/core', 'atto/event', 'atto/pubsub'],
    function(atto, AttoEvent, pubsub) {
        function constructor(args) {

            // private defs & methods
            var key_mappings = {
                BREAK       : 3
                , BACKSPACE : 8
                , TAB       : 9
                , CLEAR     : 12
                , ENTER     : 13
                , SHIFT     : 16
                , CTRL      : 17
                , ALT       : 18
                , PAUSE     : 19
                , CAPS      : 20
                , ESCAPE    : 27
                , SPACE     : 32
                , PGUP      : 33
                , PGDN      : 34
                , END       : 35
                , HOME      : 36
                , ARROW_L   : 37
                , ARROW_U   : 38
                , ARROW_R   : 39
                , ARROW_D   : 40
                , ARROW_LEFT  : 37
                , ARROW_UP    : 38
                , ARROW_RIGHT : 39
                , ARROW_DOWN  : 40
                , INS      : 45
                , DEL      : 46
                , INSERT   : 45
                , DELETE   : 46
                , WIN      : 59
                , MENU     : 61
                , KEYPAD_0 : 64
                , KEYPAD_1 : 65
                , KEYPAD_2 : 66
                , KEYPAD_3 : 67
                , KEYPAD_4 : 68
                , KEYPAD_5 : 69
                , KEYPAD_6 : 70
                , KEYPAD_7 : 71
                , KEYPAD_8 : 72
                , KEYPAD_9 : 73
                , F1       : 80
                , F2       : 81
                , F3       : 82
                , F4       : 83
                , F5       : 84
                , F6       : 85
                , F7       : 86
                , F8       : 87
                , F9       : 88
                , F10      : 89
                , F11      : 90
                , F12      : 91
                , NUM_LOCK    : 112
                , SCROLL_LOCK : 113
            };

            var connection_cache = {},
                keypress_signals = {},
                keydown_signals = {},
                mouse_signals = {},
                touch_signals = {},
                lastUid = -1,
                handlers = {};

            // do whatever initialization you need to do

            // event handlers
            // TBD

            // private helper functions
            function _createKeydownHandler(sourceNode) {
                return function(e) {
                    var key = (e.charCode || e.keyCode || e.which);
                    // Map lower-case codes to the upper-case versions, so
                    //   the client code only has to connect letter keys once
                    if (key > 90) key = key-32;
                    if (keydown_signals.hasOwnProperty(key)) {
                        var func = keydown_signals[key][0],
                            sgl  = keydown_signals[key][1];
                        func.call(sourceNode, sgl);
                    //} else {
                    //    console.log('keydown:', key);
                    }
                };
            }

            function _createKeypressHandler(sourceNode) {
                return function(e) {
                    var key = (e.charCode || e.keyCode || e.which);
                    // Map lower-case codes to the upper-case versions, so
                    //   the client code only has to connect letter keys once
                    if (key > 90) key = key-32;
                    if (keypress_signals.hasOwnProperty(key)) {
                        var func = keypress_signals[key][0],
                            sgl  = keypress_signals[key][1];
                        func.call(sourceNode, sgl);
                    }
                };
            }

            function _registerKeySignal(srcNode, keyName, tgtFunc, signal) {
                // some keys can only be captured on keydown, but keypress is better if possible
                // (see Dojo 1.6's _base/event.js or Dojo 1.8's on.js for more info)

                var charCode, handlerId;

                // For the moment, we're only implementing single-key signatures (printables)
                if (keyName.length === 1) {
                    // only doing alpha characters for now; make sure code is in
                    //   the lower- or upper-case range
                    charCode = keyName.toUpperCase().charCodeAt(0);
                    handlerId = srcNode.id + ":keypress";

                    if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123)) {
                        keypress_signals[charCode] = [tgtFunc, signal];

                        // if there's no keypress event handler yet for the specified source node, add one
                        if (!handlers.hasOwnProperty(handlerId)) {
                            handlers[handlerId] = _createKeypressHandler(srcNode)
                            atto.addEvent(srcNode, 'keypress', handlers[handlerId]);
                        }
                    }

                } else {
                    // check the whitelist for supported keys (this could be a lot more comprehensive)
                    if (key_mappings.hasOwnProperty(keyName)) {
                        keydown_signals[key_mappings[keyName]] = [tgtFunc, signal];
                        handlerId = srcNode.id + ":keydown";

                        // if there's no keypress event handler yet for the specified source node, add one
                        if (!handlers.hasOwnProperty(handlerId)) {
                            handlers[handlerId] = _createKeydownHandler(srcNode)
                            atto.addEvent(srcNode, 'keydown', handlers[handlerId]);
                        }
                    } else {
                        console.warn('Unsupported key name:', keyName);
                        return;
                    }
                }

                return handlerId;
            }

            function _registerMouseSignal(signature, tgtFunc, signal) {
            }

            function _registerTouchSignal(signature, tgtFunc, signal) {
            }

            function _connect(srcNode, eventSignature, tgtFunc, signal) {
                /* Examples:
                     inputMgr.connect(doc, "key:I", player.cmd, player.commands.UP)
                     inputMgr.connect(doc, "mouse:CLICK", player.cmd, player.commands.CLICK)
                     inputMgr.connect(doc, "touch:SWIPE_LEFT", player.cmd, player.commands.LEFT)
                 */
                var eventInfo = eventSignature.toUpperCase().split(':'),
                    connectionId;

                if (srcNode && eventSignature && tgtFunc && (signal !== null)) {
                    var sourceId = srcNode.id || srcNode.name;

                    // if no sourceId is available, we'll need to assign a unique ID to the source node
                    if (!sourceId) {
                        sourceId = srcNode.id = "input_src_" + (++lastUid).toString();
                    }

                    switch (eventInfo[0]) {
                        case 'KEY':
                            connectionId = _registerKeySignal(srcNode, eventInfo[1], tgtFunc, signal);
                            break;

                        case 'MOUSE':
                            // TBD
                            break;

                        case 'TOUCH':
                            // TBD
                            break;

                        default:
                            // TBD: just listen for the event signature, pub/sub style
                            break;
                    }

                    // return ID for disconnecting
                    return connectionId;

                } else {
                    //console.log('error connecting input to signal:', srcNode, eventSignature, tgtFunc, signal);
                    return null;
                }
            }

            function _disconnect(id) {
                if (handlers.hasOwnProperty(id)) {
                    handlers[id] = null;
                }
            }


            return {
                connect    : _connect,
                disconnect : _disconnect
            } // end of public interface
        } // end of constructor

        return constructor;
    } // end AMD callback function
);

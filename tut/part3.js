require.config({
    paths: {
        'atto': '../../atto',
        'tangle': '..'
    }
});
require(
    ["atto/core", "Ex3"],
    function(atto, MainExample3) {
    "use strict";

        var txtStatus = atto.byId('status'),
            main      = new MainExample3({
                canvas: document.querySelector('canvas')
            });
        window.game = main;

        // StateManager event callbacks
        function stateChange(data) {
            _log( atto.supplant("Entered state {id}: {title}", data) );
        }
        stateChange(main.states.currentState());
        main.states.events.changeState.watch(stateChange);

        // main "game" loop
        function _loop() {
            main.tick();
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

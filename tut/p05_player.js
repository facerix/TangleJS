//
// Tangle Tutorial 5 Player class - inputDispatch demo
//
// author: Ryan Corradini
// license: MIT
//

define(
    ['atto/core', 'atto/event', 'atto/pubsub'],
    function(atto, AttoEvent, pubsub) {
        var _commands = {
            'PANIC': 's0',
            'STOP' : 's1',
            'UP'   : 's2',
            'LEFT' : 's3',
            'DOWN' : 's4',
            'RIGHT': 's5'
        };

        function constructor(args) {

            // private defs & methods
            var pos = {x:135,y:95},
                vel = {x:0,y:0};

            function _update() {
                var dx = vel.x,
                    dy = vel.y;
                if ((dx > 0 && pos.x > 270) || (dx < 0 && pos.x <= 0)) vel.x = -1 * vel.x;
                if ((dy > 0 && pos.y > 190) || (dy < 0 && pos.y <= 0)) vel.y = -1 * vel.y;

                pos.x += vel.x;
                pos.y += vel.y;
            }

            function _render(ctx) {
                // draw direction arrow
                ctx.fillStyle = "#ff0000";
                //ctx.translate(pos.x+25, pos.y+25);
                ctx.beginPath();
                if (vel.x > 0) {
                    // east
                    ctx.moveTo(pos.x+10, pos.y+10);
                    ctx.lineTo(pos.x+40, pos.y+25);
                    ctx.lineTo(pos.x+10, pos.y+40);

                } else if (vel.x < 0) {
                    // west
                    ctx.moveTo(pos.x+40, pos.y+10);
                    ctx.lineTo(pos.x+10, pos.y+25);
                    ctx.lineTo(pos.x+40, pos.y+40);

                } else if (vel.y > 0) {
                    // south
                    ctx.moveTo(pos.x+10, pos.y+10);
                    ctx.lineTo(pos.x+25, pos.y+40);
                    ctx.lineTo(pos.x+40, pos.y+10);

                } else if (vel.y < 0) {
                    // north
                    ctx.moveTo(pos.x+10, pos.y+40);
                    ctx.lineTo(pos.x+25, pos.y+10);
                    ctx.lineTo(pos.x+40, pos.y+40);

                } else {
                    // stopped; draw a circle
                    ctx.arc(pos.x+25,pos.y+25,15,0,Math.PI*2,true);
                    //ctx.arc(0,0,15,0,Math.PI*2,true);
                }
                ctx.closePath();
                ctx.fill();
                //ctx.restore();
            }

            function _cmd(cmd) {
                switch (cmd) {
                    case _commands.UP:
                        _up();
                        break;

                    case _commands.DOWN:
                        _down();
                        break;

                    case _commands.LEFT:
                        _left();
                        break;

                    case _commands.RIGHT:
                        _right();
                        break;

                    case _commands.PANIC:
                        _panic();
                        break;

                    case _commands.STOP:
                        _stop();
                        break;

                    default:
                        // unrecognized input
                        console.log('unrecognized input:', cmd);
                        break;
                }
            }

            function _up() {
                vel.x = 0;
                vel.y = (vel.y < 0) ? vel.y-1 : -1;
            }

            function _down() {
                vel.x = 0;
                vel.y = (vel.y > 0) ? vel.y+1 : 1;
            }

            function _left() {
                vel.x = (vel.x < 0) ? vel.x-1 : -1;
                vel.y = 0;
            }

            function _right() {
                vel.x = (vel.x > 0) ? vel.x+1 : 1;
                vel.y = 0;
            }

            function _stop() {
                vel.x = 0;
                vel.y = 0;
            }

            function _panic() {
                // causes the player to immediately change direction/velocity
                var rnd = Math.floor(Math.random() * 5);
                switch (rnd) {
                    case 0: // immediate about-face
                        vel.x = -1 * vel.x;
                        vel.y = -1 * vel.y;
                        break;

                    case 1: // move/accelerate west
                        _left();
                        break;

                    case 2: // move/accelerate north
                        _up();
                        break;

                    case 3: // move/accelerate east
                        _right();
                        break;

                    case 4: // move/accelerate south
                        _down();
                        break;

                    default:
                        break;
                }
            }

            return {
                update   : _update,
                render   : _render,
                cmd      : _cmd,
                commands : _commands
            } // end of public interface
        } // end of constructor

        return constructor;
    } // end AMD callback function
);

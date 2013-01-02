//
// tangle/loadProgress - a simple canvas-aware progressbar class
//
// author: Ryan Corradini
// license: MIT
//

define(
    ['atto/core', 'require'],
    function(atto) {
        function constructor(optionArgs) {
            var _opts = atto.mixinArgs({
                    min: 0,
                    max: 100
                }, optionArgs),
                _min = _opts.min,
                _max = _opts.max,
                _x   = _opts.x || 0,
                _y   = _opts.y || 0,
                _width = _opts.width || 320,
                _height = _opts.height || 75,
                _borderColor = _opts.borderColor || "#FFF",
                _fillColor = _opts.fillColor || "#FFF",
                _percent = 0,
                _val = _opts.startingValue || _min,
                _isDirty = true;

            _setVal(_val);

            function _setVal(newVal) {
                var norm = Math.min(_max, Math.max(_min, newVal)) * 100.0,
                    range = (_max - _min);
                if (range > 0 && newVal <= _max) {
                    _percent = norm / range;
                    _val = Math.min(_max, Math.max(_min, newVal));

                    _isDirty = true;
                }
            }

            function _setMin(newMin) {
                if (newMin < _max) {
                    _min = newMin;
                } else {
                    _min = newMin;
                    _max = newMin;
                }

                _isDirty = true;
            }

            function _setMax(newMax) {
                if (newMax >= _min) {
                    _max = newMax;
                } else {
                    _min = newMax;
                    _max = newMax;
                }

                _isDirty = true;
            }

            function _render(ctx) {
                if (_isDirty) {
                    ctx.strokeStyle = _borderColor;
                    ctx.strokeRect(_x,_y, _width, _height);
                    ctx.fillStyle = _fillColor;
                    ctx.strokeStyle = _fillColor;
                    ctx.fillRect(_x,_y, _width * _percent/100, _height);

                    _isDirty = false;
                }
            }

            return {
                getMin   : function() { return _min; },
                getMax   : function() { return _max; },
                getValue : function() { return _val; },
                setMin   : _setMin,
                setMax   : _setMax,
                setValue : _setVal,
                draw     : _render
            } // end of public interface
        } // end of constructor

        return constructor;
    } // end function
);

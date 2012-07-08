/***************************/
//@Author: Ryan Corradini
//@website: www.buyog.com
//@email: ryancorradini@yahoo.com
//@license: Free to use & modify, but please keep this credits message
/***************************/


define(
    ['atto/event'],
    function(Event) {
        function constructor(args) {
            var _assets     = {},
                _loadStatus = {},
                _events = {
                    error:  new Event('tiger.assetCache.error'),
                    ready:  new Event('tiger.assetCache.ready'),
                    loaded: new Event('tiger.assetCache.loaded'),
                };

            function _addAsset(name, src, type) {
                var self = this;
                if (name in _assets) {
                    //console.log("Asset '",name,"' is already in the cache");
                    return;
                } else {

                    if (type === 'audio') {
                        _assets[name] = new Audio();

                        _assets[name].onerror = function(e) {
                            _loadStatus[name] = false;
                            var msg = "Asset named '" + name + "' could not be loaded.";
                            _events.error.dispatch({name:name, details:msg});
                        }

                        _assets[name].addEventListener('canplaythrough', function() {
                            _loadStatus[name] = true;
                            _events.loaded.dispatch({name:name});

                            if (_ready()) {
                                _events.ready.dispatch({});
                            }
                        }, false);

                    } else {
                        _assets[name] = new Image();

                        _assets[name].onerror = function(e) {
                            _loadStatus[name] = false;
                            var msg = "Asset named '" + name + "' could not be loaded.";
                            _events.error.dispatch({name:name, details:msg});
                        }

                        _assets[name].onload = function() {
                            _loadStatus[name] = true;
                            _events.loaded.dispatch({name:name});

                            if (_ready()) {
                                _events.ready.dispatch({});
                            }
                        }
                    }

                    _loadStatus[name] = false;
                    _assets[name].src = src;
                }
            }

            function _hasAsset(name) {
                return (name in _assets);
            }

            function _getAsset(name) {
                if (_assets[name]) {
                    return _assets[name];
                } else {
                    var msg = "Asset named '" + name + "' not found in cache.";
                    _events.error.dispatch({name:name, details:msg});
                    return null;
                }
            }

            function _ready() {
                var retVal = true;
                for (var id in _assets) {
                    if (id in _loadStatus) {
                        retVal &= _loadStatus[id];
                    } else {
                        return false;
                    }
                }
                return retVal;
            }

            return {
                addAsset : _addAsset,
                hasAsset : _hasAsset,
                getAsset : _getAsset,
                ready    : _ready,
                events   : _events
            } // end of public interface
        } // end of constructor

        return constructor;
    } // end AMD callback function
);

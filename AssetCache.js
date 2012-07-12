/***************************/
//@Author: Ryan Corradini
//@website: www.buyog.com
//@email: ryancorradini@yahoo.com
//@license: Free to use & modify, but please keep this credits message
/***************************/


define(
    ['atto/core','atto/event'],
    function(atto,CustomEvent) {
        function constructor(args) {
            var _assets     = {},
                _loadStatus = {},
                _events = {
                    error:  new CustomEvent('tangle.assetCache.error'),
                    ready:  new CustomEvent('tangle.assetCache.ready'),
                    loaded: new CustomEvent('tangle.assetCache.loaded'),
                },
                _types = {
                    IMAGE: 1,
                    AUDIO: 2
                },
                _extension_to_type = {
                    png: 1,
                    bmp: 1,
                    gif: 1,
                    jpg: 1,
                    jpeg: 1,
                    wav: 2,
                    webm: 2,
                    ogg: 2,
                    mp3: 2,
                    aac: 2
                };

            function _assetTypeFromName(assetName) {
                var retVal;
                if (assetName.indexOf('.') > -1) {
                    // lastIndexOf is okay because all canvas-aware browsers have it
                    var ext = assetName.substr(assetName.lastIndexOf('.')+1);
                    retVal = _extension_to_type[ext.toLowerCase()];
                }

                // default to image if we couldn't figure it out
                return retVal || _types.IMAGE;
            }

            function _createLoadCallback(assetName) {
                return function() {
                    _loadStatus[assetName] = true;
                    _events.loaded.dispatch({name:assetName});

                    if (_ready()) {
                        _events.ready.dispatch({});
                    }
                }
            }

            function _createErrorCallback(assetName) {
                return function(e) {
                    _loadStatus[assetName] = false;
                    _events.error.dispatch({name:assetName, details:"Asset '"+assetName+"' could not be loaded."});
                }
            }

            function _addAsset(name, src) {
                var type = _assetTypeFromName(src);

                if (name in _assets) {
                    _events.error.dispatch({name:name, details:"Asset '"+name+"' is already in the cache"});
                    return;
                } else {

                    if (type === _types.IMAGE) {
                        // image: this is by far the simple case
                        _assets[name] = new Image();
                        //_assets[name].onload = _createLoadCallback(name);
                        atto.addEvent(_assets[name], 'load', _createLoadCallback(name), false);
                        //_assets[name].onerror = _createErrorCallback(name);
                        atto.addEvent(_assets[name], 'error', _createErrorCallback(name), false);

                    } else if (type === _types.AUDIO) {
                        // audio; this will take a little more magic, due to browser codec issues
                        _assets[name] = new Audio();
                        atto.addEvent(_assets[name], 'canplaythrough', _createLoadCallback(name), false);
                        atto.addEvent(_assets[name], 'error', _createErrorCallback(name), false);

                    } else {
                        // unsupported asset type
                        _events.error.dispatch({name:name, details:"Asset type '"+type+"' not supported."});
                        return false;
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
                    _events.error.dispatch({name:name, details:"Asset named '"+name+"' not found in cache."});
                    return null;
                }
            }

            function _getAssetType(name) {
                var obj;
                if (_assets[name]) {
                    obj = _assets[name];
                    if (obj) {
                        return (obj.tagName === "IMG") ? _types.IMAGE : _types.AUDIO;
                    }
                } else {
                    _events.error.dispatch({name:name, details:"Asset named '"+name+"' not found in cache."});
                }
                return -1;
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
                TYPES        : _types,
                addAsset     : _addAsset,
                hasAsset     : _hasAsset,
                getAsset     : _getAsset,
                getAssetType : _getAssetType,
                ready        : _ready,
                events       : _events
            } // end of public interface
        } // end of constructor

        return constructor;
    } // end AMD callback function
);

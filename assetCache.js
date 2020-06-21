//
// tangle/assetCache
//
// author: Rylee Corradini
// license: MIT
//

define(["atto/core", "atto/event"], function (atto, AttoEvent) {
  function constructor(args) {
    var _assets = {},
      _loadStatus = {},
      _events = {
        error: new AttoEvent("tangle.assetCache.error"),
        ready: new AttoEvent("tangle.assetCache.ready"),
        loaded: new AttoEvent("tangle.assetCache.loaded"),
      },
      _types = {
        IMAGE: 1,
        AUDIO: 2,
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
        aac: 2,
      };

    function _assetTypeFromFilename(fileName) {
      var segs = fileName.split("."),
        ext = segs[segs.length - 1],
        retVal = _extension_to_type[ext.toLowerCase()];

      // default to image if we couldn't figure it out
      return retVal || _types.IMAGE;
    }

    function _createLoadCallback(assetName) {
      return function () {
        _loadStatus[assetName] = true;
        _events.loaded.dispatch({ name: assetName });

        if (_ready()) {
          _events.ready.dispatch({});
        }
      };
    }

    function _createErrorCallback(assetName) {
      return function () {
        _loadStatus[assetName] = false;
        _events.error.dispatch({
          name: assetName,
          details: "Asset '" + assetName + "' could not be loaded.",
        });
      };
    }

    function _addAsset(name, src) {
      if (name in _assets) {
        _events.error.dispatch({
          name: name,
          details: "Asset '" + name + "' is already in the cache",
        });
        return;
      } else {
        var assetType = _assetTypeFromFilename(src);
        switch (assetType) {
          case _types.IMAGE:
            // image: this is by far the simple case
            _assets[name] = new Image();
            atto.addEvent(
              _assets[name],
              "load",
              _createLoadCallback(name),
              false
            );
            atto.addEvent(
              _assets[name],
              "error",
              _createErrorCallback(name),
              false
            );
            break;

          case _types.AUDIO:
            // audio; this will take a little more magic, due to browser codec issues
            _assets[name] = new Audio();
            atto.addEvent(
              _assets[name],
              "canplaythrough",
              _createLoadCallback(name),
              false
            );
            atto.addEvent(
              _assets[name],
              "error",
              _createErrorCallback(name),
              false
            );
            break;

          default:
            // unsupported asset type
            _events.error.dispatch({
              name: name,
              details: "Asset type '" + assetType + "' not supported.",
            });
            return false;
            break;
        }

        _loadStatus[name] = false;
        _assets[name].src = src;
      }
    }

    function _hasAsset(name) {
      return name in _assets;
    }

    function _getAsset(name) {
      if (_assets[name]) {
        return _assets[name];
      } else {
        _events.error.dispatch({
          name: name,
          details: "Asset named '" + name + "' not found in cache.",
        });
        return null;
      }
    }

    function _getAssetType(name) {
      var obj;
      if (_assets[name]) {
        obj = _assets[name];
        if (obj) {
          return obj.tagName === "IMG" ? _types.IMAGE : _types.AUDIO;
        }
      } else {
        _events.error.dispatch({
          name: name,
          details: "Asset named '" + name + "' not found in cache.",
        });
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

    function _completion() {
      var total = 0,
        loadCount = 0,
        loaded = false;
      for (var id in _assets) {
        total++;
        if (id in _loadStatus) {
          loaded = _loadStatus[id];
          if (loaded) loadCount++;
        }
      }

      return total ? loadCount / total : 0;
    }

    return {
      TYPES: _types,
      addAsset: _addAsset,
      hasAsset: _hasAsset,
      getAsset: _getAsset,
      getAssetType: _getAssetType,
      ready: _ready,
      percentage: _completion,
      events: _events,
    }; // end of public interface
  } // end of constructor

  return constructor;
}); // end AMD callback function

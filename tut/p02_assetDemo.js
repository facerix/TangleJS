require.config({
    baseUrl: '../..'
});
require(
    ["atto/core", "atto/progressBar", "tangle/AssetCache"],
    function(atto, ProgressBar, AssetCache) {
        var opts      = atto.byId("assetUrls").options,
            cache     = new AssetCache(),
            prg       = new ProgressBar(atto.byId('prg'), {min:0, max: opts.length}),
            tgtSel    = atto.byId('cachedAssets'),
            pvw       = atto.byId('preview'),
            ndNull    = document.createTextNode(' '),
            btnPP     = atto.byId('btnPlayPause'),
            txtStatus = atto.byId('status'),
            _currAudio;

        // helper functions

        function _log(msg) {
            txtStatus.appendChild(document.createTextNode(msg));
            txtStatus.appendChild(document.createElement('br'));
        }
        function _pauseAudio() {
            if (_currAudio) _currAudio.pause();
            btnPP.textContent = "Play";
        }
        function _playAudio() {
            if (_currAudio) _currAudio.play();
            btnPP.textContent = "Pause";
        }

        // DOM event handlers

        atto.addEvent(btnPP, 'click', function() {
            if (this.textContent == 'Play') {
                // paused; play now
                _playAudio();
            } else {
                // playing; pause now
                _pauseAudio();
            }
        }, true);

        atto.addEvent(atto.byId('btnStartPreloader'), 'click', function() {
            var count = 0, i;
            for (i=0; i<opts.length; i++) {
                if (opts[i].selected) {
                    cache.addAsset( opts[i].value, "assets/" + opts[i].value );
                    prg.setMax(++count);
                }
            }
            if (count > 0) {
                _log('Preloading ' + count + ' assets...');
            } else {
                alert('Please select at least one image file from the list before clicking Preload.');
            }
        }, true);

        atto.addEvent(tgtSel, 'change', function() {
            var sel = tgtSel.item(tgtSel.selectedIndex),
                img = null;
            if (sel && sel.value) {
                if (cache.hasAsset(sel.value)) {
                    _pauseAudio();
                    switch (cache.getAssetType(sel.value)) {
                        case cache.TYPES.IMAGE:
                            img = cache.getAsset(sel.value);
                            pvw.replaceChild(img, pvw.firstChild);
                            if (_currAudio) {
                                _currAudio = null;
                                btnPP.disabled = 'disabled';
                            }
                            break;

                        case cache.TYPES.AUDIO:
                            pvw.replaceChild(ndNull, pvw.firstChild);
                            _currAudio = cache.getAsset(sel.value);
                            if (_currAudio) {
                                btnPP.disabled = '';
                                _playAudio();
                            }
                            break;

                        default:
                            // no change
                            break;
                    }

                } else {
                    alert("D'oh! I can't load that asset from the cache!");
                }
            }
        }, true);


        // AssetCache event callbacks

        cache.events.error.watch(function(data) {
            _log(data.details);
        });

        cache.events.loaded.watch(function(data) {
            _log('Loaded ' + data.name + '.');
            prg.setValue(prg.getValue()+1);

            var opt = document.createElement('option');
            opt.setAttribute('value', data.name);
            opt.appendChild(document.createTextNode(data.name));
            tgtSel.appendChild(opt);
        });

        cache.events.ready.watch(function(data) {
            _log('All assets loaded.');
            prg.setValue(prg.getMax());
        });
    }
);

## TangleJS: A Tiny Game Library

Tangle is my contribution to the growing pile of small, lightweight HTML5 game libraries. It's mostly shared here as an educational effort, in conjunction with the [Let's Make a Canvas Library](http://www.facerix.com/code/search.php?tag=lmacl) series on my blog, and in accordance with the principles outlined in [this presentation](www.facerix.com/talks/utahjs) I gave at UtahJS in June 2012.

## Modules

Tangle is built upon the [Asynchronous Module Definition API](https://github.com/amdjs/amdjs-api/wiki/AMD), commonly referred to as AMD. This means that script dependencies are taken care of more or less for free, and we don't need a separate preloading step to bootstrap our JavaScript code for us (other than an [AMD-compatible](requirejs.org) [loader](https://github.com/cujojs/curl), of course).

Tangle leverages some basic cross-browser functionality provided by [Atto](https://github.com/facerix/atto), my minimal JavaScript library. As some point I may copy those dependent portions of Atto in here to make this library self-contained, but that isn't a priority at this time (remember, this library is educational in nature, not production-ready).

Beyond script module loading, this project aims to provide many of the basic building blocks for making a game in HTML5: sprite sheets and animation, stage backgrounds and viewports, music and sounds, and so on. Each of these discrete functional pieces has (or will eventually have) its own module as part of the library:

- AssetCache (image/audio file preloader)
- Sprite
- Map
- Screen (viewport-sized subsection of a Map)
- SoundEffect
- Music
- Font
- etc...

Additionally, I intend Tangle to eventually provide modules to help structure a game's logic:

- State machine
- Game loop
- Collision detection
- Physics engine
- etc...

It is likely that this module list will evolve over the course of the blog series, so check back often.

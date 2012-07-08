TangleJS: A Tiny Game Library
-------------
Tangle is my contribution to the growing pile of small, lightweight HTML5 game libraries. It's mostly shared here as an educational effort, in conjunction with the [Let's Make a Canvas Library](http://www.buyog.com/code/search.php?tag=lmacl) series on my blog.


Modules
-----

Tangle is built upon the [Asynchronous Module Definition API](https://github.com/amdjs/amdjs-api/wiki/AMD), commonly referred to as AMD. This means that dependencies are taken care of for free, and we don't need a preloader to bootstrap our JavaScript code for us (other than an AMD-compatible loader, of course).

Tangle is built upon some basic functionality present in [Atto](https://github.com/buyog/atto), my minimal JavaScript framework, and relies on a few core elements of that project. As some point I may copy them in here to make this library self-contained, but that isn't a priority at this time.

Beyond script module loading, Tangle takes care of all other game dependencies: images, sprite sheets, music and sounds, and so on. Each of these object types has (or will eventually have) its own module as part of the library:

  * AssetCache (image/audio file preloader)
  * Sprite
  * Map
  * Screen
  * SoundEffect
  * Music
  * Font

Additionally, Tangle will provide modules to help structure a game's code:

  * Physics engine
  * Collision detection
  * Game loop
  * TBD

It is likely that this module list will evolve over the course of the blog series, so check back often.


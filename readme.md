Fruu.js
----
Particle-based presentation tool.

![public/images/fruu.gif](public/images/fruu.gif)

### What
Fruu is the simplest text presentation tool ever. Is renders a single word or two per slide,
using WebGL particle emitter (simple 'clipart' like images are also supported).

### Why
The biggest and most common mistake of the beginner speakers is putting too much text on their slides. This force audience to focus on reading slides, not on what speaker is trying to say.
Fruu is solving this problem by allowing only one or two words per slide.

### How
To run Fruu:
  - fork/clone this repo:
  ```
  > git clone git@github.com:michalbe/fruu.git
  > cd fruu
  ```

  - install dependencies
  ```
  > npm i rollup -g
  > npm i
  ```

  - run the server
  ```
  > npm start
  ```
  - open `http://localhost:10001/` in your browser
  - open `public/slides.js` in your editor and edit it with your slides. `watcher` will restart Fruu every time you save.

## `slides.js` structure

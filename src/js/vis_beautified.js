/*
 vis_beautified.js
 Replaced corrupted file with a safe shim.

 The original file contained an interactive package-manager prompt and was
 accidentally written to this JS file. A backup of the original contents
 has been saved to `src/js/vis_beautified.js.bak`.

 This shim sets up a `vis` global if one is already present (from
 `vis.js` which the app already loads) or attempts to require it when
 running in a CommonJS environment. It intentionally avoids loading or
 embedding the full library to keep this change low-risk.
*/

(function (global) {
  'use strict';

  // If vis is already present on the page (the project loads js/vis.js),
  // keep that as the canonical reference.
  if (typeof window !== 'undefined' && window.vis) {
    global.vis = window.vis;
    return;
  }

  // Try to require a local vis.js in CommonJS/node environments.
  if (typeof module === 'object' && typeof require === 'function') {
    try {
      // require relative to this file; this will work if code runs via Node
      // in the project root where `src/js/vis.js` exists.
      var v = require('./vis.js');
      if (v) {
        global.vis = v;
        return;
      }
    } catch (e) {
      // ignore; leave global.vis as-is
    }
  }

  // Fallback: provide a minimal stub so code referencing `vis` won't crash.
  if (!global.vis) {
    global.vis = {
      // Minimal placeholders. Expand if needed.
      Network: function () {
        console.warn('vis.Network stub used — full vis library not loaded');
        return function () {};
      },
      DataSet: function () {
        console.warn('vis.DataSet stub used — full vis library not loaded');
        return {
          add: function () {},
          update: function () {},
          remove: function () {},
          get: function () { return null; }
        };
      }
    };
  }
})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));

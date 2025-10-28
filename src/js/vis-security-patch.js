// Security patch for vis.js prototype pollution vulnerability
// This patch overrides the vulnerable deepExtend function with a secure version

(function() {
    'use strict';

    // Check if vis.js is loaded
    if (typeof vis === 'undefined' || !vis.util) {
        console.warn('vis.js security patch: vis.js not found, patch may not be effective');
        return;
    }

    // Store the original vulnerable function for reference
    var originalDeepExtend = vis.util.deepExtend;

    // Secure deepExtend function that prevents prototype pollution
    function secureDeepExtend(target, source) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        var proto = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

        // List of dangerous properties that should not be copied
        var dangerousProperties = [
            '__proto__',
            'constructor',
            'prototype'
        ];

        for (var key in source) {
            if (source.hasOwnProperty(key) || options === true) {
                // Skip dangerous properties to prevent prototype pollution
                if (dangerousProperties.indexOf(key) !== -1) {
                    continue;
                }

                if (source[key] && source[key].constructor === Object) {
                    if (target[key] === undefined) {
                        target[key] = {};
                    }
                    if (target[key].constructor === Object) {
                        secureDeepExtend(target[key], source[key], options, proto);
                    } else {
                        // Use the original assignment logic for non-objects
                        assignProperty(target, source, key, proto);
                    }
                } else if (Array.isArray(source[key])) {
                    target[key] = [];
                    for (var i = 0; i < source[key].length; i++) {
                        target[key].push(source[key][i]);
                    }
                } else {
                    assignProperty(target, source, key, proto);
                }
            }
        }
        return target;
    }

    // Helper function to safely assign properties
    function assignProperty(target, source, key, proto) {
        // Additional safety check for dangerous properties
        if (['__proto__', 'constructor', 'prototype'].indexOf(key) === -1) {
            if (proto === null && target[key] !== undefined) {
                delete target[key];
            }
            target[key] = source[key];
        }
    }

    // Override the vulnerable function
    vis.util.deepExtend = secureDeepExtend;

    // Also patch selectiveDeepExtend and selectiveNotDeepExtend if they exist
    if (vis.util.selectiveDeepExtend) {
        var originalSelectiveDeepExtend = vis.util.selectiveDeepExtend;
        vis.util.selectiveDeepExtend = function(properties, target, source) {
            var proto = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
            if (Array.isArray(source)) {
                throw new TypeError("Arrays are not supported by deepExtend");
            }
            for (var i = 0; i < properties.length; i++) {
                var key = properties[i];
                if (source.hasOwnProperty(key)) {
                    if (source[key] && source[key].constructor === Object) {
                        if (target[key] === undefined) {
                            target[key] = {};
                        }
                        if (target[key].constructor === Object) {
                            secureDeepExtend(target[key], source[key], false, proto);
                        } else {
                            assignProperty(target, source, key, proto);
                        }
                    } else {
                        if (Array.isArray(source[key])) {
                            throw new TypeError("Arrays are not supported by deepExtend");
                        }
                        assignProperty(target, source, key, proto);
                    }
                }
            }
            return target;
        };
    }

    if (vis.util.selectiveNotDeepExtend) {
        var originalSelectiveNotDeepExtend = vis.util.selectiveNotDeepExtend;
        vis.util.selectiveNotDeepExtend = function(exclude, target, source) {
            var proto = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
            if (Array.isArray(source)) {
                throw new TypeError("Arrays are not supported by deepExtend");
            }
            for (var key in source) {
                if (source.hasOwnProperty(key) && exclude.indexOf(key) === -1) {
                    if (source[key] && source[key].constructor === Object) {
                        if (target[key] === undefined) {
                            target[key] = {};
                        }
                        if (target[key].constructor === Object) {
                            secureDeepExtend(target[key], source[key]);
                        } else {
                            assignProperty(target, source, key, proto);
                        }
                    } else if (Array.isArray(source[key])) {
                        target[key] = [];
                        for (var i = 0; i < source[key].length; i++) {
                            target[key].push(source[key][i]);
                        }
                    } else {
                        assignProperty(target, source, key, proto);
                    }
                }
            }
            return target;
        };
    }

    console.log('vis.js security patch applied: Prototype pollution vulnerability fixed');

})();
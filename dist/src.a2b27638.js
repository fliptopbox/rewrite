// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"src/functions.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dispatch = dispatch;
exports.subscribe = subscribe;

function dispatch(name) {
  var message = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var elm = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : window;
  var e = new CustomEvent(name, Object.assign({
    bubbles: true
  }, {
    detail: message
  }));
  elm.dispatchEvent(e);
}

function subscribe(name, callback) {
  var elm = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : window;
  elm.addEventListener(name, callback);
}
},{}],"node_modules/deep-is/index.js":[function(require,module,exports) {
var pSlice = Array.prototype.slice;
var Object_keys = typeof Object.keys === 'function'
    ? Object.keys
    : function (obj) {
        var keys = [];
        for (var key in obj) keys.push(key);
        return keys;
    }
;

var deepEqual = module.exports = function (actual, expected) {
  // enforce Object.is +0 !== -0
  if (actual === 0 && expected === 0) {
    return areZerosEqual(actual, expected);

  // 7.1. All identical values are equivalent, as determined by ===.
  } else if (actual === expected) {
    return true;

  } else if (actual instanceof Date && expected instanceof Date) {
    return actual.getTime() === expected.getTime();

  } else if (isNumberNaN(actual)) {
    return isNumberNaN(expected);

  // 7.3. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if (typeof actual != 'object' && typeof expected != 'object') {
    return actual == expected;

  // 7.4. For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected);
  }
};

function isUndefinedOrNull(value) {
  return value === null || value === undefined;
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function isNumberNaN(value) {
  // NaN === NaN -> false
  return typeof value == 'number' && value !== value;
}

function areZerosEqual(zeroA, zeroB) {
  // (1 / +0|0) -> Infinity, but (1 / -0) -> -Infinity and (Infinity !== -Infinity)
  return (1 / zeroA) === (1 / zeroB);
}

function objEquiv(a, b) {
  if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
    return false;

  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) return false;
  //~~~I've managed to break Object.keys through screwy arguments passing.
  //   Converting to array solves the problem.
  if (isArguments(a)) {
    if (!isArguments(b)) {
      return false;
    }
    a = pSlice.call(a);
    b = pSlice.call(b);
    return deepEqual(a, b);
  }
  try {
    var ka = Object_keys(a),
        kb = Object_keys(b),
        key, i;
  } catch (e) {//happens when one is a string literal and the other isn't
    return false;
  }
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length != kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!deepEqual(a[key], b[key])) return false;
  }
  return true;
}

},{}],"src/utilities/uuid.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var serial = 0;

var uuid = function uuid() {
  serial++;
  return (new Date().valueOf().toString(16) + // eg 127b795136 (11)
  Math.floor(1000 + Math.random() * 1000).toString(13) + // eg aa7 (3)
  (1000 + serial++ % 1000).toString(5) + // eg 13001 (5)
  "").slice(-16);
};

var _default = uuid;
exports.default = _default;
},{}],"node_modules/sbd/lib/sanitize-html-browser.js":[function(require,module,exports) {

module.exports = function sanitizeHtml(text, opts) {
  // Strip HTML from Text using browser HTML parser
  if ((typeof text == 'string' || text instanceof String) && typeof document !== "undefined") {
    var $div = document.createElement("DIV");
    $div.innerHTML = text;
    text = ($div.textContent || '').trim();
  }
  //DOM Object
  else if (typeof text === 'object' && text.textContent) {
    text = (text.textContent || '').trim();
  }

  return text;
};

},{}],"node_modules/sbd/lib/stringHelper.js":[function(require,module,exports) {

exports.endsWithChar = function ends_with_char(word, c) {
    if (c.length > 1) {
        return c.indexOf(word.slice(-1)) > -1;
    }

    return word.slice(-1) === c;
};

exports.endsWith = function ends_with(word, end) {
    return word.slice(word.length - end.length) === end;
};
},{}],"node_modules/sbd/lib/Match.js":[function(require,module,exports) {
var abbreviations;
var englishAbbreviations = [
    "al",
    "adj",
    "assn",
    "Ave",
    "BSc", "MSc",
    "Cell",
    "Ch",
    "Co",
    "cc",
    "Corp",
    "Dem",
    "Dept",
    "ed",
    "eg",
    "Eq",
    "Eqs",
    "est",
    "est",
    "etc",
    "Ex",
    "ext", // + number?
    "Fig",
    "fig",
    "Figs",
    "figs",
    "i.e",
    "ie",
    "Inc",
    "inc",
    "Jan","Feb","Mar","Apr","Jun","Jul","Aug","Sep","Sept","Oct","Nov","Dec",
    "jr",
    "mi",
    "Miss", "Mrs", "Mr", "Ms",
    "Mol",
    "mt",
    "mts",
    "no",
    "Nos",
    "PhD", "MD", "BA", "MA", "MM",
    "pl",
    "pop",
    "pp",
    "Prof", "Dr",
    "pt",
    "Ref",
    "Refs",
    "Rep",
    "repr",
    "rev",
    "Sec",
    "Secs",
    "Sgt", "Col", "Gen", "Rep", "Sen",'Gov', "Lt", "Maj", "Capt","St",
    "Sr", "sr", "Jr", "jr", "Rev",
    "Sun","Mon","Tu","Tue","Tues","Wed","Th","Thu","Thur","Thurs","Fri","Sat",
    "trans",
    "Univ",
    "Viz",
    "Vol",
    "vs",
    "v",
];

exports.setAbbreviations = function(abbr) {
    if(abbr){
        abbreviations = abbr;
    } else {
        abbreviations = englishAbbreviations;
    }
}

var isCapitalized = exports.isCapitalized = function(str) {
    return /^[A-Z][a-z].*/.test(str) || isNumber(str);
}

// Start with opening quotes or capitalized letter
exports.isSentenceStarter = function(str) {
    return isCapitalized(str) || /``|"|'/.test(str.substring(0,2));
}

exports.isCommonAbbreviation = function(str) {
    return ~abbreviations.indexOf(str.replace(/\W+/g, ''));
}

// This is going towards too much rule based
exports.isTimeAbbreviation = function(word, next) {
    if (word === "a.m." || word === "p.m.") {
        var tmp = next.replace(/\W+/g, '').slice(-3).toLowerCase();

        if (tmp === "day") {
            return true;
        }
    }

    return false;
}

exports.isDottedAbbreviation = function(word) {
    var matches = word.replace(/[\(\)\[\]\{\}]/g, '').match(/(.\.)*/);
    return matches && matches[0].length > 0;
}

// TODO look for next words, if multiple are capitalized,
// then it's probably not a sentence ending
exports.isCustomAbbreviation = function(str) {
    if (str.length <= 3) {
        return true;
    }

    return isCapitalized(str);
}

// Uses current word count in sentence and next few words to check if it is
// more likely an abbreviation + name or new sentence.
exports.isNameAbbreviation = function(wordCount, words) {
    if (words.length > 0) {
        if (wordCount < 5 && words[0].length < 6 && isCapitalized(words[0])) {
            return true;
        }

        var capitalized = words.filter(function(str) {
            return /[A-Z]/.test(str.charAt(0));
        });

        return capitalized.length >= 3;
    }

    return false;
}

var isNumber = exports.isNumber = function(str, dotPos) {
    if (dotPos) {
        str = str.slice(dotPos-1, dotPos+2);
    }

    return !isNaN(str);
};

// Phone number matching
// http://stackoverflow.com/a/123666/951517
exports.isPhoneNr = function(str) {
    return str.match(/^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/);
};

// Match urls / emails
// http://stackoverflow.com/a/3809435/951517
exports.isURL = function(str) {
    return str.match(/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/);
};

// Starting a new sentence if beginning with capital letter
// Exception: The word is enclosed in brackets
exports.isConcatenated = function(word) {
    var i = 0;

    if ((i = word.indexOf(".")) > -1 ||
        (i = word.indexOf("!")) > -1 ||
        (i = word.indexOf("?")) > -1)
    {
        var c = word.charAt(i + 1);

        // Check if the next word starts with a letter
        if (c.match(/[a-zA-Z].*/)) {
            return [word.slice(0, i), word.slice(i+1)];
        }
    }

    return false;
};

exports.isBoundaryChar = function(word) {
    return word === "." ||
           word === "!" ||
           word === "?";
};

},{}],"node_modules/sbd/lib/tokenizer.js":[function(require,module,exports) {
/*jshint node:true, laxcomma:true */
"use strict";

var sanitizeHtml = require('sanitize-html');

var stringHelper = require('./stringHelper');
var Match  = require('./Match');

var newline_placeholder = " @~@ ";
var newline_placeholder_t = newline_placeholder.trim();


var whiteSpaceCheck = new RegExp("\\S", "");
var addNewLineBoundaries = new RegExp("\\n+|[-#=_+*]{4,}", "g");
var splitIntoWords = new RegExp("\\S+|\\n", "g");


// Split the entry into sentences.
exports.sentences = function(text, user_options) {
    if (!text || typeof text !== "string" || !text.length) {
        return [];
    }

    if (!whiteSpaceCheck.test(text)) {
      // whitespace-only string has no sentences
      return [];
    }

    var options = {
        "newline_boundaries"  : false,
        "html_boundaries"     : false,
        "html_boundaries_tags": ["p","div","ul","ol"],
        "sanitize"            : false,
        "allowed_tags"        : false,
        "preserve_whitespace" : false,
        "abbreviations"       : null
    };

    if (typeof user_options === "boolean") {
        // Deprecated quick option
        options.newline_boundaries = true;
    }
    else {
        // Extend options
        for (var k in user_options) {
            options[k] = user_options[k];
        }
    }

    Match.setAbbreviations(options.abbreviations);

    if (options.newline_boundaries) {
        text = text.replace(addNewLineBoundaries, newline_placeholder);
    }

    if (options.html_boundaries) {
        var html_boundaries_regexp = "(<br\\s*\\/?>|<\\/(" + options.html_boundaries_tags.join("|") + ")>)";
        var re = new RegExp(html_boundaries_regexp, "g");
        text = text.replace(re, "$1" + newline_placeholder);
    }

    if (options.sanitize || options.allowed_tags) {
        if (! options.allowed_tags) {
            options.allowed_tags = [""];
        }

        text = sanitizeHtml(text, { "allowedTags" : options.allowed_tags });
    }


    // Split the text into words
    var words;
    var tokens;

    // Split the text into words
    if (options.preserve_whitespace) {
        // <br> tags are the odd man out, as whitespace is allowed inside the tag
        tokens = text.split(/(<br\s*\/?>|\S+|\n+)/);

        // every other token is a word
        words = tokens.filter(function (token, ii) {
          return ii % 2;
        });
    }
    else {
        // - see http://blog.tompawlak.org/split-string-into-tokens-javascript
        words = text.trim().match(splitIntoWords);
    }


    var wordCount = 0;
    var index = 0;
    var temp  = [];
    var sentences = [];
    var current   = [];

    // If given text is only whitespace (or nothing of \S+)
    if (!words || !words.length) {
        return [];
    }

    for (var i=0, L=words.length; i < L; i++) {
        wordCount++;

        // Add the word to current sentence
        current.push(words[i]);

        // Sub-sentences, reset counter
        if (~words[i].indexOf(',')) {
            wordCount = 0;
        }

        if (Match.isBoundaryChar(words[i]) || stringHelper.endsWithChar(words[i], "?!") || words[i] === newline_placeholder_t) {
            if ((options.newline_boundaries || options.html_boundaries) && words[i] === newline_placeholder_t) {
                current.pop();
            }

            sentences.push(current);

            wordCount = 0;
            current   = [];

            continue;
        }


        if (stringHelper.endsWithChar(words[i], "\"") || stringHelper.endsWithChar(words[i], "”")) {
            words[i] = words[i].slice(0, -1);
        }

        // A dot might indicate the end sentences
        // Exception: The next sentence starts with a word (non abbreviation)
        //            that has a capital letter.
        if (stringHelper.endsWithChar(words[i], '.')) {
            // Check if there is a next word
            // This probably needs to be improved with machine learning
            if (i+1 < L) {
                // Single character abbr.
                if (words[i].length === 2 && isNaN(words[i].charAt(0))) {
                    continue;
                }

                // Common abbr. that often do not end sentences
                if (Match.isCommonAbbreviation(words[i])) {
                    continue;
                }

                // Next word starts with capital word, but current sentence is
                // quite short
                if (Match.isSentenceStarter(words[i+1])) {
                    if (Match.isTimeAbbreviation(words[i], words[i+1])) {
                        continue;
                    }

                    // Dealing with names at the start of sentences
                    if (Match.isNameAbbreviation(wordCount, words.slice(i, 6))) {
                        continue;
                    }

                    if (Match.isNumber(words[i+1])) {
                        if (Match.isCustomAbbreviation(words[i])) {
                            continue;
                        }
                    }
                }
                else {
                    // Skip ellipsis
                    if (stringHelper.endsWith(words[i], "..")) {
                        continue;
                    }

                    //// Skip abbreviations
                    // Short words + dot or a dot after each letter
                    if (Match.isDottedAbbreviation(words[i])) {
                        continue;
                    }

                    if (Match.isNameAbbreviation(wordCount, words.slice(i, 5))) {
                        continue;
                    }
                }
            }

            sentences.push(current);
            current   = [];
            wordCount = 0;

            continue;
        }

        // Check if the word has a dot in it
        if ((index = words[i].indexOf(".")) > -1) {
            if (Match.isNumber(words[i], index)) {
                continue;
            }

            // Custom dotted abbreviations (like K.L.M or I.C.T)
            if (Match.isDottedAbbreviation(words[i])) {
                continue;
            }

            // Skip urls / emails and the like
            if (Match.isURL(words[i]) || Match.isPhoneNr(words[i])) {
                continue;
            }
        }

        if (temp = Match.isConcatenated(words[i])) {
            current.pop();
            current.push(temp[0]);
            sentences.push(current);

            current = [];
            wordCount = 0;
            current.push(temp[1]);
        }
    }

    if (current.length) {
        sentences.push(current);
    }


    // Clear "empty" sentences
    sentences = sentences.filter(function(s) {
        return s.length > 0;
    });

    var result = sentences.slice(1).reduce(function (out, sentence) {
      var lastSentence = out[out.length - 1];
      // Single words, could be "enumeration lists"
      if (lastSentence.length === 1 && /^.{1,2}[.]$/.test(lastSentence[0])) {
          // Check if there is a next sentence
          // It should not be another list item
          if (!/[.]/.test(sentence[0])) {
              out.pop()
              out.push(lastSentence.concat(sentence));
              return out;
          }
      }
      out.push(sentence);
      return out;
    }, [ sentences[0] ]);

    // join tokens back together
    return result.map(function (sentence, ii) {
      if (options.preserve_whitespace && !options.newline_boundaries && !options.html_boundaries) {
        // tokens looks like so: [leading-space token, non-space token, space
        // token, non-space token, space token... ]. In other words, the first
        // item is the leading space (or the empty string), and the rest of
        // the tokens are [non-space, space] token pairs.
        var tokenCount = sentence.length * 2;
        if (ii === 0) {
          tokenCount += 1;
        }
        return tokens.splice(0, tokenCount).join('');
      }
      return sentence.join(" ");
    });
};

},{"sanitize-html":"node_modules/sbd/lib/sanitize-html-browser.js","./stringHelper":"node_modules/sbd/lib/stringHelper.js","./Match":"node_modules/sbd/lib/Match.js"}],"src/utilities/inflate.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sbd = _interopRequireDefault(require("sbd"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function inflate(text) {
  // returns sentences broken into lines
  var array = _sbd.default.sentences(text);

  return array.join("\n\n");
}

var _default = inflate;
exports.default = _default;
},{"sbd":"node_modules/sbd/lib/tokenizer.js"}],"src/utilities/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _deepIs = _interopRequireDefault(require("deep-is"));

var _uuid = _interopRequireDefault(require("./uuid"));

var _inflate = _interopRequireDefault(require("./inflate"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var timer;
var count = 0;
var delay = 250;

function time() {
  return new Date().toString().replace(/.* (\d+:\d+:\d+) .*/g, "$1");
}

function storage() {
  var sufix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var ns = ["rewrite", sufix].filter(function (val) {
    return val;
  }).join("-");
  return {
    read: function read() {
      var data = localStorage[ns] || null;
      return data && JSON.parse(data);
    },
    write: function write(obj) {
      clearTimeout(timer);
      count = (count || 0) + 1;
      timer = setTimeout(function () {
        console.log("localstroage SAVE", count, time());
        localStorage[ns] = JSON.stringify(obj);
        count = 0;
      }, delay);
    }
  };
}

var _default = {
  uuid: _uuid.default,
  deepEqual: _deepIs.default,
  inflate: _inflate.default,
  storage: storage,
  time: time
};
exports.default = _default;
},{"deep-is":"node_modules/deep-is/index.js","./uuid":"src/utilities/uuid.js","./inflate":"src/utilities/inflate.js"}],"src/editor/config.json":[function(require,module,exports) {
module.exports = {
  "resetDelay": 750,
  "doubleTap": 200,
  "autoTerminate": false,
  "onChange": null,
  "selector": null,
  "alwaysOpen": true,
  "className": "comment",
  "prefixToken": "> "
};
},{}],"src/editor/empty.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function empty(s) {
  if (s === undefined) return;
  return s;
}

var _default = empty;
exports.default = _default;
},{}],"src/editor/htmlToStringArray.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var settings = require("./config");

function htmlToStringArray(children) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var _settings$options = _objectSpread({}, settings, options),
      prefixToken = _settings$options.prefixToken,
      className = _settings$options.className;

  return _toConsumableArray(children).map(function (el) {
    var innerText = el.innerText,
        classList = el.classList;
    var is_comment = classList.contains(className);
    var prefix = is_comment ? prefixToken : "";
    return "".concat(prefix).concat(innerText.trim());
  });
}

var _default = htmlToStringArray;
exports.default = _default;
},{"./config":"src/editor/config.json"}],"src/editor/textToArray.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function textToArray() {
  var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  // returns simple text Array
  // correcting for double line breaks
  if (!text) return;
  return text.replace(/\n\n/gm, "\n").split(/\n/g);
}

var _default = textToArray;
exports.default = _default;
},{}],"src/editor/terminate.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var re_punctuation = /(\.|\:|\!|\?|\"|\))$/g;

function terminate(text) {
  var autoTerminate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  // return a closed sentnece.
  text = text && text.trim();
  if (!text) return;
  var is_closed = re_punctuation.test(text);
  var sufix = autoTerminate && !is_closed ? "." : "";
  return "".concat(text).concat(sufix);
}

var _default = terminate;
exports.default = _default;
},{}],"src/editor/getCandidateString.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _terminate = _interopRequireDefault(require("./terminate"));

var _textToArray = _interopRequireDefault(require("./textToArray"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var re_comments = /^([\/\>\?\=\!]\s*?)/;

function getCandidateString(value) {
  var autoTerminate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  // recieve String or Array
  // returns string
  // parse the DOM elements to simple Array
  var is_array = value && value.constructor === Array;
  var array = is_array ? value : (0, _textToArray.default)(value);
  return _toConsumableArray(array).map(function (line) {
    return re_comments.test(line) ? null : (0, _terminate.default)(line, autoTerminate);
  }).filter(function (s) {
    return s && s.length;
  }).join(" ").trim();
}

var _default = getCandidateString;
exports.default = _default;
},{"./terminate":"src/editor/terminate.js","./textToArray":"src/editor/textToArray.js"}],"src/editor/arrayToHtml.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var comment = new RegExp("^[>]s?", "g");

function arrayToHtml(array) {
  // returns DOM string
  // parse comment chars to className "comment"
  return _toConsumableArray(array).map(function (text) {
    var className = comment.test(text) ? " class=\"comment\"" : "";
    var value = text ? text.replace(comment, "").trim() : "<br />";
    return "<div".concat(className, ">").concat(value, "</div>");
  }).join("\n").toString();
}

var _default = arrayToHtml;
exports.default = _default;
},{}],"../../../.nvm/versions/node/v8.10.0/lib/node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"../../../.nvm/versions/node/v8.10.0/lib/node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"../../../.nvm/versions/node/v8.10.0/lib/node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"src/editor/editor.scss":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../../../.nvm/versions/node/v8.10.0/lib/node_modules/parcel-bundler/src/builtins/css-loader.js"}],"src/editor/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _config3 = _interopRequireDefault(require("./config"));

var _empty = _interopRequireDefault(require("./empty"));

var _htmlToStringArray = _interopRequireDefault(require("./htmlToStringArray"));

var _textToArray = _interopRequireDefault(require("./textToArray"));

var _getCandidateString = _interopRequireDefault(require("./getCandidateString"));

var _arrayToHtml = _interopRequireDefault(require("./arrayToHtml"));

require("./editor.scss");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*

  const e = initialize($elm, {...options})

  e.onChange((candidate, versions) = console.log(candidate, versions))
  
  e.trigger("shiftaltalt", toggleCase);

  const toggleCase = el => {
    const text = el.innerText;
    const upper = text.toUpperCase() === text;
    const toggle = upper ? "toLowerCase" : "toUpperCase";
    el.innerText = text[toggle]();
  };

*/
var editor;

var config = _objectSpread({}, _config3.default);

var cache = {
  candidate: null,
  // string
  versions: [null] // versions

}; // const re_comment_prefix = new RegExp("^[>]s?", "g");

var re_punctuation = /(\.|\:|\!|\?|\"|\))$/g;
var re_comments = /^([\/\>\?\=\!]\s*?)/;
console.log(re_punctuation);
var triggerDictionary = {
  cleanup: cleanupBlanks,
  shiftshift: toggleComment
}; // ["Lorem ipsum 1","Lorem ipsum 2","> Lorem ipsum 4","","Lorem ipsum 3"]

function clearVersions() {
  editor.innerHTML = "";
  editor = null;
  cache.candidate = null;
  cache.versions = [null]; // issue onClose event
}

function load() {
  var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  if (!value) return;
  if (!editor) initialize();
  var array = value.constructor === Array ? value : (0, _textToArray.default)(value);
  var html = (0, _arrayToHtml.default)(array);
  config = Object.assign({}, config, options);
  editor.innerHTML = html;
  editor.focus();
  notifyChanges();
  return html;
}

function toggleComment(bool) {
  var line = document.getSelection().focusNode.parentNode;
  var text = line.innerText;
  var skip = !/div/i.test(line.nodeName) || !text || !text.trim();
  if (skip) return;
  line.classList.toggle("comment");
}

function cleanupBlanks(rows) {
  _toConsumableArray(rows).forEach(function (row, n) {
    var text = row.innerText && row.innerText.trim() || null;
    text ? row : row.classList.remove("comment");
  });
}

function executeTriggers(e, keyTime, keyHistory) {
  var parentNode = window.getSelection().focusNode.parentNode;
  var children = parentNode.children;
  keyHistory = keyHistory.join("").toLowerCase();
  var cleanup = triggerDictionary.cleanup;

  var trigger = triggerDictionary[keyHistory] || triggerDictionary["id".concat(keyHistory)] || _empty.default;

  cleanup(children);
  trigger(parentNode);
  notifyChanges();
}

function bindEvents() {
  var ts = 0;
  var hist = [];

  editor.onkeyup = function (e) {
    var _config = config,
        doubleTap = _config.doubleTap,
        resetDelay = _config.resetDelay;
    var diff = e.timeStamp - ts;
    var delay = diff < doubleTap;
    ts = e.timeStamp;
    hist = diff > resetDelay ? [] : hist;
    hist.push(e.key);
    hist = hist.slice(-5);
    setTimeout(function () {
      return executeTriggers(e, delay, hist);
    }, 0);
  };
}

function getVersionArray() {
  var options = _objectSpread({}, config);

  return (0, _htmlToStringArray.default)(editor.children, options);
}

function notifyChanges() {
  // if the candidate is diffrent OR
  // if the version array is different
  // execute the change
  var _editor = editor,
      children = _editor.children;

  var _cache = _objectSpread({}, cache),
      candidate = _cache.candidate,
      versions = _cache.versions;

  var _config2 = config,
      onChange = _config2.onChange;
  var string = (0, _htmlToStringArray.default)(children);
  var nextCandidate = String((0, _getCandidateString.default)(string));

  var nextVersions = _toConsumableArray(getVersionArray()); // cheap checks first ...


  var a = candidate !== nextCandidate;
  var b = a || versions.length !== nextVersions.length; // most expensive check

  var execute = b || versions.sort().join("") !== nextVersions.sort().join(""); // change detected

  if (execute) {
    cache = {
      candidate: nextCandidate,
      versions: nextVersions
    };
    onChange(nextCandidate, nextVersions);
  }
}

function addOnChange(fn) {
  config = Object.assign({}, config, {
    onChange: fn
  });
}

function trigger(key, callback) {
  var id = triggerDictionary[key] ? "id".concat(key) : key;
  triggerDictionary[id] = callback;
  console.log("added trigger [%s]", id, key);
}

function initialize() {
  var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var options = arguments.length > 1 ? arguments[1] : undefined;
  config.selector = config.selector || selector;
  editor = document.querySelector(config.selector);

  if (!editor) {
    throw "module requires DOM element [".concat(selector, "]");
  }

  if (options) {
    config = Object.assign({}, config, options);
  }

  bindEvents();
  return {
    load: load,
    trigger: trigger,
    clear: clearVersions,
    settings: function settings() {
      return config;
    },
    onChange: addOnChange,
    candidate: _getCandidateString.default,
    versions: _htmlToStringArray.default
  };
}

var _default = initialize;
exports.default = _default;
},{"./config":"src/editor/config.json","./empty":"src/editor/empty.js","./htmlToStringArray":"src/editor/htmlToStringArray.js","./textToArray":"src/editor/textToArray.js","./getCandidateString":"src/editor/getCandidateString.js","./arrayToHtml":"src/editor/arrayToHtml.js","./editor.scss":"src/editor/editor.scss"}],"src/editor/collectionToHtml.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _uuid = _interopRequireDefault(require("../utilities/uuid"));

var _getCandidateString = _interopRequireDefault(require("./getCandidateString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function collectionToHtml(array) {
  // returns HTML String
  // Expected collection schema:
  // [{text: String, versions: Object}, ...]
  if (!array) return;
  var html = array.map(function (row) {
    var _row$text = row.text,
        text = _row$text === void 0 ? "" : _row$text,
        _row$versions = row.versions,
        versions = _row$versions === void 0 ? "" : _row$versions;
    var id = versions ? (0, _uuid.default)() : "";
    var classname = versions && "locked" || "";
    var value = text || versions && (0, _getCandidateString.default)(versions) || "";
    var json = versions ? JSON.stringify(versions) : ""; // create DOM element to ensure json is parsed correctly
    // when we use it as data-version String

    var div = document.createElement("div"); // only render relavant attributes

    id && (div.id = id);
    classname && (div.className = classname);
    versions && (div.dataset.versions = json);
    div.innerHTML = value || "<br/>";
    return div.outerHTML;
  });
  return html.join("\n");
}

var _default = collectionToHtml;
exports.default = _default;
},{"../utilities/uuid":"src/utilities/uuid.js","./getCandidateString":"src/editor/getCandidateString.js"}],"src/styles.scss":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../../../.nvm/versions/node/v8.10.0/lib/node_modules/parcel-bundler/src/builtins/css-loader.js"}],"src/editor/startup.json":[function(require,module,exports) {
module.exports = [{
  "text": "kilroy",
  "versions": ["kilroy", "", "> is here", "> might come here", "> was here."]
}, {
  "versions": ["kilroy", "is here", "> might come here", "", "> was here."]
}, {
  "text": "kilroy",
  "versions": ["kilroy", "> is here", "", "> .... who's Kilroy"]
}, {}, {}, {
  "text": "Word is the the last word."
}];
},{}],"src/index.js":[function(require,module,exports) {
"use strict";

var _functions = require("./functions");

var _utilities = _interopRequireDefault(require("./utilities"));

var _editor = _interopRequireDefault(require("./editor"));

var _collectionToHtml = _interopRequireDefault(require("./editor/collectionToHtml"));

require("./styles.scss");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var messages = {
  confirmDelete: "\n    You are unlocking this paragraph. \n\n    This will delete the working versions and destill \n    the paragraph to the currently elected candidate.\n\n    CANCEL to keep working versions\n    OK to discard versions"
};
var editor = (0, _editor.default)("#sentences", {
  autoTerminate: false
}); // load some text into the DOM

var $focusOn; // current node element

var $doc = document.querySelector("#document");

var sample = require("./editor/startup.json");

var local = _utilities.default.storage().read();

function save($els) {
  // parse DOM to collection
  // save to localstrorage
  var collection = _toConsumableArray($els).map(function (el) {
    var _el$innerText = el.innerText,
        innerText = _el$innerText === void 0 ? "" : _el$innerText,
        dataset = el.dataset;
    var versions = dataset.versions && JSON.parse(dataset.versions) || "";
    return {
      text: innerText,
      versions: versions
    };
  });

  _utilities.default.storage().write(collection);
}

function updateParent(e) {
  var _e$detail = e.detail,
      candidate = _e$detail.candidate,
      versions = _e$detail.versions;
  document.querySelector("#article").innerHTML = candidate;
  document.querySelector("#versions").innerHTML = JSON.stringify(versions);

  if ($focusOn) {
    $focusOn.innerText = candidate;
    $focusOn.dataset.versions = JSON.stringify(versions);
    save(document.querySelector("#document").children);
  }
} // Initial DOM injection


$doc.innerHTML = (0, _collectionToHtml.default)(local || sample); // Passive events from Editor changes

editor.onChange(function (candidate, versions) {
  return (0, _functions.dispatch)("updateparent", {
    candidate: candidate,
    versions: versions
  });
});
(0, _functions.subscribe)("updateparent", updateParent); // Acive DOM interaction Events

document.querySelector("#document").ondblclick = function (e) {
  e.target.id = e.target.id || _utilities.default.uuid();
  var _e$target = e.target,
      id = _e$target.id,
      innerText = _e$target.innerText,
      dataset = _e$target.dataset;
  var versions = dataset.versions;

  if (versions) {
    // confirm delete
    if (!window.confirm(messages.confirmDelete)) return; // first clear editor

    editor.clear(); // next ... remove DOM reference

    $focusOn.id = "";
    $focusOn = null; // next cleanup this

    e.target.className = "";
    e.target.id = "";
    e.target.dataset.versions = ""; // update local storage

    console.log("toggle off", $focusOn);
    return;
  }

  var text = _utilities.default.inflate(innerText);

  var value = versions && JSON.parse(versions) || text || "";
  $focusOn = document.querySelector("#".concat(id));
  $focusOn.className = "locked selected";
  editor.load(value);
};

document.querySelector("#document").onclick = function (e) {
  // de-select any existing nodes
  var selected = document.querySelector(".selected");
  selected && selected.classList.remove("selected"); // only load locked nodes

  var _e$target2 = e.target,
      id = _e$target2.id,
      dataset = _e$target2.dataset;
  if (!id || !dataset.versions) return;
  console.log(333, e.target);
  $focusOn = document.querySelector("#".concat(id));
  $focusOn.classList.add("selected");
  editor.load(JSON.parse(dataset.versions));
};
},{"./functions":"src/functions.js","./utilities":"src/utilities/index.js","./editor":"src/editor/index.js","./editor/collectionToHtml":"src/editor/collectionToHtml.js","./styles.scss":"src/styles.scss","./editor/startup.json":"src/editor/startup.json"}],"../../../.nvm/versions/node/v8.10.0/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "36347" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../../../.nvm/versions/node/v8.10.0/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/index.js"], null)
//# sourceMappingURL=/src.a2b27638.map
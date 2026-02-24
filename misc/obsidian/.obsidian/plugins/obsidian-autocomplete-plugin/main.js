'use strict';

var obsidian = require('obsidian');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var Provider = /** @class */ (function () {
    function Provider() {
    }
    Provider.prototype.matchWith = function (input) {
        var _this = this;
        var inputLowered = input.toLowerCase();
        var inputHasUpperCase = /[A-Z]/.test(input);
        // case-sensitive logic if input has an upper case.
        // Otherwise, uses case-insensitive logic
        var suggestions = this.completions
            .filter(function (suggestion) {
            return suggestion != input
                ? inputHasUpperCase
                    ? suggestion.includes(input)
                    : suggestion.toLowerCase().includes(inputLowered)
                : false;
        })
            .sort(function (a, b) { return a.localeCompare(b); })
            .sort(function (a, b) {
            return Number(b.toLowerCase().startsWith(inputLowered)) -
                Number(a.toLowerCase().startsWith(inputLowered));
        })
            .map(function (suggestion) {
            return { category: _this.category, value: suggestion };
        });
        return suggestions;
    };
    Provider.wordSeparatorRegex = /(\.|,|;|:|'|"|!|\?|-|\)|\]|\}|\/| |Enter)/g;
    Provider.placeholder = '#{}';
    return Provider;
}());

function defaultDirection() {
    return { index: 0, direction: 'still' };
}
function managePlaceholders(selectedValue, initialCursorIndex) {
    var normalizedValue;
    var placeholder = Provider.placeholder;
    var newCursorPosition = initialCursorIndex;
    var placeholderIndex = selectedValue.indexOf(placeholder);
    if (placeholderIndex > -1) {
        // TODO: Manage multiple placeholders
        var placeholderRegex = new RegExp(placeholder, 'g');
        normalizedValue = selectedValue.replace(placeholderRegex, '');
        newCursorPosition += placeholderIndex;
    }
    else {
        normalizedValue = selectedValue;
        newCursorPosition += selectedValue.length;
    }
    return { normalizedValue: normalizedValue, newCursorPosition: newCursorPosition };
}
function selectLastSuggestion(selected, suggestionsLength) {
    var decreased = selected.index - 1;
    var updatedSelected = {
        index: decreased < 0 ? suggestionsLength - 1 : decreased,
        direction: 'backward',
    };
    return updatedSelected;
}
function updateSelectedSuggestionFrom(event, selected, suggestionsLength) {
    var updatedSelected = selected;
    switch (event.ctrlKey + " " + event.key) {
        case 'true p':
        case 'false ArrowUp':
            updatedSelected = selectLastSuggestion(selected, suggestionsLength);
            break;
        case 'true n':
        case 'false ArrowDown':
            var increased = selected.index + 1;
            updatedSelected = {
                index: increased >= suggestionsLength ? 0 : increased,
                direction: 'forward',
            };
            break;
    }
    return updatedSelected;
}
function copyObject(obj) {
    return __assign({}, obj);
}
function isVimNormalMode(editor) {
    return editor.getOption('keyMap') === 'vim';
}
function isVimTrigger(_a) {
    var triggerLikeVim = _a.triggerLikeVim, editor = _a.editor, event = _a.event;
    return (triggerLikeVim &&
        !isVimNormalMode(editor) &&
        event.ctrlKey &&
        (event.key === 'n' || event.key === 'p'));
}
var PRINTABLE_CHARS = ["Digit0", "Digit1", "Digit2", "Digit3", "Digit4", "Digit5", "Digit6", "Digit7", "Digit8", "Digit9", "Minus", "Equal", "KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU", "KeyI", "KeyO", "KeyP", "BracketLeft", "BracketRight", "KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL", "Semicolon", "Quote", "Backquote", "Backslash", "KeyZ", "KeyX", "KeyC", "KeyV", "KeyB", "KeyN", "KeyM", "Comma", "Period", "Slash", "NumpadMultiply", "Numpad7", "Numpad8", "Numpad9", "NumpadSubtract", "Numpad4", "Numpad5", "Numpad6", "NumpadAdd", "Numpad1", "Numpad2", "Numpad3", "Numpad0", "NumpadDecimal"];
function isKeyboardCodePrintable(code) {
    return PRINTABLE_CHARS.includes(code);
}
function isAutoTrigger(editor, event, tokenizer, settings) {
    var trigger = false;
    if (settings.autoTrigger &&
        !isVimNormalMode(editor) &&
        !tokenizer.isWordSeparator(event.key) &&
        isKeyboardCodePrintable(event.code) &&
        !(
        // Not on copy/cut/paste/undo
        ((event.ctrlKey || event.metaKey) &&
            (event.code === 'KeyX' ||
                event.code === 'KeyC' ||
                event.code === 'KeyV' ||
                event.code === 'KeyZ')))) {
        var cursor = editor.getCursor();
        var currentLine = editor.getLine(cursor.line);
        // If last word is longer or eq than threshold
        trigger =
            currentLine.length - tokenizer.lastWordStartPos(currentLine, cursor.ch) >=
                settings.autoTriggerMinSize;
    }
    return trigger;
}

function generateView(suggestions, selectedIndex) {
    var suggestionsHtml = suggestions.map(function (tip, index) {
        var isSelected = selectedIndex === index;
        return "\n        <div id=\"suggestion-" + index + "\" class=\"no-space-wrap suggestion-item" + (isSelected ? ' is-selected' : '') + "\">\n          <div id=\"suggestion-" + index + "\" class=\"suggestion-content\">\n          <span class=\"suggestion-flair\">" + tip.category + "</span>\n          " + tip.value + "\n          </div>\n        </div>\n      ";
    }, []);
    var suggestionsJoined = suggestionsHtml.join('\n');
    var viewString = "\n      <div id=\"suggestion-list\" class=\"suggestion\">\n        " + (suggestionsJoined.length > 0
        ? suggestionsJoined
        : '<div class="no-suggestions">No match found</div>') + "\n      </div>\n      <div class=\"prompt-instructions\">\n        <div class=\"prompt-instruction\">\n          <span class=\"prompt-instruction-command\">Ctrl+N /\u2191 </span>\n          <span>Next Suggestion</span>\n        </div>\n        <div class=\"prompt-instruction\">\n          <span class=\"prompt-instruction-command\">Ctrl+P /\u2193 </span>\n          <span>Previous Suggestion</span>\n        </div>\n        <div class=\"prompt-instruction\">\n          <span class=\"prompt-instruction-command\">Enter/Tab</span>\n          <span>Select Suggestion</span>\n        </div>\n      </div>\n    ";
    var containerNode = document.createElement('div');
    containerNode.classList.add('suggestion-container');
    containerNode.insertAdjacentHTML('beforeend', viewString);
    return containerNode;
}
function updateCachedView(view, selectedIndex) {
    var _a;
    var children = (_a = view.firstElementChild) === null || _a === void 0 ? void 0 : _a.children;
    if (!children)
        return;
    for (var index = 0; index < children.length; index++) {
        var child = children[index];
        child.toggleClass('is-selected', index === selectedIndex);
    }
}
function scrollTo(selected, view, suggestionsLength) {
    if (!view || suggestionsLength === 0)
        return;
    // TODO: Improve scrolling with page size and boundaries
    var parent = view.children[0];
    var selectedIndex = selected.index;
    var child = parent.children[0];
    if (child) {
        var scrollAmount = child.scrollHeight * selectedIndex;
        switch (selected.direction) {
            case 'forward':
                if (selectedIndex === 0)
                    // End -> Start
                    parent.scrollTop = 0;
                else
                    parent.scrollTop = scrollAmount;
                break;
            case 'backward':
                if (selectedIndex === suggestionsLength - 1)
                    // End <- Start
                    parent.scrollTop = parent.scrollHeight;
                else
                    parent.scrollTop = scrollAmount;
                break;
        }
    }
}
function appendWidget(editor, view, scrollable) {
    if (scrollable === void 0) { scrollable = true; }
    var cursor = editor.getCursor();
    editor.addWidget({ ch: cursor.ch, line: cursor.line }, view, scrollable);
}

var FlowProvider = /** @class */ (function (_super) {
    __extends(FlowProvider, _super);
    function FlowProvider() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.category = 'F';
        _this.completions = [];
        return _this;
    }
    FlowProvider.prototype.addLastWordFrom = function (line, cursorIndex, tokenizer) {
        var word = tokenizer.lastWordFrom(line, cursorIndex, { normalize: true });
        this.addWord(word);
    };
    FlowProvider.prototype.addWordsFrom = function (text, tokenizer) {
        var _this = this;
        var result = tokenizer.tokenize(text);
        result.tokens.forEach(function (token) { return _this.addWord(token); });
    };
    FlowProvider.prototype.addWord = function (word) {
        if (!word || this.alreadyAdded(word))
            return;
        this.completions.push(word);
    };
    FlowProvider.prototype.alreadyAdded = function (word) {
        return this.completions.includes(word);
    };
    return FlowProvider;
}(Provider));

var TOKENIZE_STRATEGIES = [
    'default',
    'japanese',
    'arabic',
];
var Tokenizer = /** @class */ (function () {
    function Tokenizer(wordSeparators) {
        var escapedSeparators = wordSeparators.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        this.wordSeparatorPattern = new RegExp("[" + escapedSeparators + "]");
        // NOTE: global flag takes note of lastIndex used!
        this.trimPattern = new RegExp(this.wordSeparatorPattern, 'g');
    }
    Tokenizer.prototype.lastWordStartPos = function (text, index, options) {
        if (options === void 0) { options = { normalize: false }; }
        var _a = options.normalize
            ? this.normalizedLine(text, index)
            : { normalized: text, updatedCursor: index }, normalized = _a.normalized, updatedCursor = _a.updatedCursor;
        var wordStartIndex = updatedCursor;
        while (wordStartIndex &&
            !this.isWordSeparator(normalized.charAt(wordStartIndex - 1)))
            wordStartIndex -= 1;
        return wordStartIndex;
    };
    Tokenizer.prototype.lastWordFrom = function (text, cursorIndex, options) {
        if (options === void 0) { options = { normalize: false }; }
        var _a = options.normalize
            ? this.normalizedLine(text, cursorIndex)
            : { normalized: text, updatedCursor: cursorIndex }, normalized = _a.normalized, updatedCursor = _a.updatedCursor;
        if (options.normalize)
            // Already normalized
            options.normalize = false;
        var wordStartIndex = this.lastWordStartPos(normalized, updatedCursor, options);
        var word = null;
        if (wordStartIndex !== updatedCursor)
            word = text.slice(wordStartIndex, updatedCursor);
        return word;
    };
    Tokenizer.prototype.isWordSeparator = function (char) {
        return this.wordSeparatorPattern.test(char);
    };
    /*
     * Remove spaces and word separators
     * near the left of the cursorIndex
     */
    Tokenizer.prototype.normalizedLine = function (line, cursorIndex) {
        var partialLine = line.slice(0, cursorIndex);
        var normalized = partialLine.trimEnd();
        // Subtract how many spaces removed
        var updatedCursor = cursorIndex - (partialLine.length - normalized.length);
        if (normalized.length === 0)
            return { normalized: '', updatedCursor: 0 };
        var lastChar = normalized.charAt(updatedCursor - 1);
        if (this.isWordSeparator(lastChar)) {
            updatedCursor -= 1;
            normalized = normalized.slice(0, updatedCursor);
        }
        return { normalized: normalized, updatedCursor: updatedCursor };
    };
    return Tokenizer;
}());

var DefaultTokenizer = /** @class */ (function (_super) {
    __extends(DefaultTokenizer, _super);
    function DefaultTokenizer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DefaultTokenizer.prototype.tokenize = function (text, range) {
        var _this = this;
        var tokens = text
            .slice(range === null || range === void 0 ? void 0 : range.start, range === null || range === void 0 ? void 0 : range.end)
            .split('\n')
            .flatMap(function (line) { return line.split(_this.trimPattern); })
            .filter(function (t) { return t.length > 0; });
        return { range: range, tokens: tokens };
    };
    return DefaultTokenizer;
}(Tokenizer));

var ArabicTokenizer = /** @class */ (function (_super) {
    __extends(ArabicTokenizer, _super);
    function ArabicTokenizer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ArabicTokenizer;
}(DefaultTokenizer));

// @ts-nocheck
// Because this code is originally javascript code.
// TinySegmenter 0.1 -- Super compact Japanese tokenizer in Javascript
// (c) 2008 Taku Kudo <taku@chasen.org>
// TinySegmenter is freely distributable under the terms of a new BSD licence.
// For details, see http://chasen.org/~taku/software/TinySegmenter/LICENCE.txt
function TinySegmenter() {
    var patterns = {
        '[一二三四五六七八九十百千万億兆]': 'M',
        '[一-龠々〆ヵヶ]': 'H',
        '[ぁ-ん]': 'I',
        '[ァ-ヴーｱ-ﾝﾞｰ]': 'K',
        '[a-zA-Zａ-ｚＡ-Ｚ]': 'A',
        '[0-9０-９]': 'N',
    };
    this.chartype_ = [];
    for (var i in patterns) {
        var regexp = new RegExp();
        regexp.compile(i);
        this.chartype_.push([regexp, patterns[i]]);
    }
    this.BIAS__ = -332;
    this.BC1__ = { HH: 6, II: 2461, KH: 406, OH: -1378 };
    this.BC2__ = {
        AA: -3267,
        AI: 2744,
        AN: -878,
        HH: -4070,
        HM: -1711,
        HN: 4012,
        HO: 3761,
        IA: 1327,
        IH: -1184,
        II: -1332,
        IK: 1721,
        IO: 5492,
        KI: 3831,
        KK: -8741,
        MH: -3132,
        MK: 3334,
        OO: -2920,
    };
    this.BC3__ = {
        HH: 996,
        HI: 626,
        HK: -721,
        HN: -1307,
        HO: -836,
        IH: -301,
        KK: 2762,
        MK: 1079,
        MM: 4034,
        OA: -1652,
        OH: 266,
    };
    this.BP1__ = { BB: 295, OB: 304, OO: -125, UB: 352 };
    this.BP2__ = { BO: 60, OO: -1762 };
    this.BQ1__ = {
        BHH: 1150,
        BHM: 1521,
        BII: -1158,
        BIM: 886,
        BMH: 1208,
        BNH: 449,
        BOH: -91,
        BOO: -2597,
        OHI: 451,
        OIH: -296,
        OKA: 1851,
        OKH: -1020,
        OKK: 904,
        OOO: 2965,
    };
    this.BQ2__ = {
        BHH: 118,
        BHI: -1159,
        BHM: 466,
        BIH: -919,
        BKK: -1720,
        BKO: 864,
        OHH: -1139,
        OHM: -181,
        OIH: 153,
        UHI: -1146,
    };
    this.BQ3__ = {
        BHH: -792,
        BHI: 2664,
        BII: -299,
        BKI: 419,
        BMH: 937,
        BMM: 8335,
        BNN: 998,
        BOH: 775,
        OHH: 2174,
        OHM: 439,
        OII: 280,
        OKH: 1798,
        OKI: -793,
        OKO: -2242,
        OMH: -2402,
        OOO: 11699,
    };
    this.BQ4__ = {
        BHH: -3895,
        BIH: 3761,
        BII: -4654,
        BIK: 1348,
        BKK: -1806,
        BMI: -3385,
        BOO: -12396,
        OAH: 926,
        OHH: 266,
        OHK: -2036,
        ONN: -973,
    };
    this.BW1__ = {
        ',と': 660,
        ',同': 727,
        B1あ: 1404,
        B1同: 542,
        '、と': 660,
        '、同': 727,
        '」と': 1682,
        あっ: 1505,
        いう: 1743,
        いっ: -2055,
        いる: 672,
        うし: -4817,
        うん: 665,
        から: 3472,
        がら: 600,
        こう: -790,
        こと: 2083,
        こん: -1262,
        さら: -4143,
        さん: 4573,
        した: 2641,
        して: 1104,
        すで: -3399,
        そこ: 1977,
        それ: -871,
        たち: 1122,
        ため: 601,
        った: 3463,
        つい: -802,
        てい: 805,
        てき: 1249,
        でき: 1127,
        です: 3445,
        では: 844,
        とい: -4915,
        とみ: 1922,
        どこ: 3887,
        ない: 5713,
        なっ: 3015,
        など: 7379,
        なん: -1113,
        にし: 2468,
        には: 1498,
        にも: 1671,
        に対: -912,
        の一: -501,
        の中: 741,
        ませ: 2448,
        まで: 1711,
        まま: 2600,
        まる: -2155,
        やむ: -1947,
        よっ: -2565,
        れた: 2369,
        れで: -913,
        をし: 1860,
        を見: 731,
        亡く: -1886,
        京都: 2558,
        取り: -2784,
        大き: -2604,
        大阪: 1497,
        平方: -2314,
        引き: -1336,
        日本: -195,
        本当: -2423,
        毎日: -2113,
        目指: -724,
        Ｂ１あ: 1404,
        Ｂ１同: 542,
        '｣と': 1682,
    };
    this.BW2__ = {
        '..': -11822,
        11: -669,
        '――': -5730,
        '−−': -13175,
        いう: -1609,
        うか: 2490,
        かし: -1350,
        かも: -602,
        から: -7194,
        かれ: 4612,
        がい: 853,
        がら: -3198,
        きた: 1941,
        くな: -1597,
        こと: -8392,
        この: -4193,
        させ: 4533,
        され: 13168,
        さん: -3977,
        しい: -1819,
        しか: -545,
        した: 5078,
        して: 972,
        しな: 939,
        その: -3744,
        たい: -1253,
        たた: -662,
        ただ: -3857,
        たち: -786,
        たと: 1224,
        たは: -939,
        った: 4589,
        って: 1647,
        っと: -2094,
        てい: 6144,
        てき: 3640,
        てく: 2551,
        ては: -3110,
        ても: -3065,
        でい: 2666,
        でき: -1528,
        でし: -3828,
        です: -4761,
        でも: -4203,
        とい: 1890,
        とこ: -1746,
        とと: -2279,
        との: 720,
        とみ: 5168,
        とも: -3941,
        ない: -2488,
        なが: -1313,
        など: -6509,
        なの: 2614,
        なん: 3099,
        にお: -1615,
        にし: 2748,
        にな: 2454,
        によ: -7236,
        に対: -14943,
        に従: -4688,
        に関: -11388,
        のか: 2093,
        ので: -7059,
        のに: -6041,
        のの: -6125,
        はい: 1073,
        はが: -1033,
        はず: -2532,
        ばれ: 1813,
        まし: -1316,
        まで: -6621,
        まれ: 5409,
        めて: -3153,
        もい: 2230,
        もの: -10713,
        らか: -944,
        らし: -1611,
        らに: -1897,
        りし: 651,
        りま: 1620,
        れた: 4270,
        れて: 849,
        れば: 4114,
        ろう: 6067,
        われ: 7901,
        を通: -11877,
        んだ: 728,
        んな: -4115,
        一人: 602,
        一方: -1375,
        一日: 970,
        一部: -1051,
        上が: -4479,
        会社: -1116,
        出て: 2163,
        分の: -7758,
        同党: 970,
        同日: -913,
        大阪: -2471,
        委員: -1250,
        少な: -1050,
        年度: -8669,
        年間: -1626,
        府県: -2363,
        手権: -1982,
        新聞: -4066,
        日新: -722,
        日本: -7068,
        日米: 3372,
        曜日: -601,
        朝鮮: -2355,
        本人: -2697,
        東京: -1543,
        然と: -1384,
        社会: -1276,
        立て: -990,
        第に: -1612,
        米国: -4268,
        '１１': -669,
    };
    this.BW3__ = {
        あた: -2194,
        あり: 719,
        ある: 3846,
        'い.': -1185,
        'い。': -1185,
        いい: 5308,
        いえ: 2079,
        いく: 3029,
        いた: 2056,
        いっ: 1883,
        いる: 5600,
        いわ: 1527,
        うち: 1117,
        うと: 4798,
        えと: 1454,
        'か.': 2857,
        'か。': 2857,
        かけ: -743,
        かっ: -4098,
        かに: -669,
        から: 6520,
        かり: -2670,
        'が,': 1816,
        'が、': 1816,
        がき: -4855,
        がけ: -1127,
        がっ: -913,
        がら: -4977,
        がり: -2064,
        きた: 1645,
        けど: 1374,
        こと: 7397,
        この: 1542,
        ころ: -2757,
        さい: -714,
        さを: 976,
        'し,': 1557,
        'し、': 1557,
        しい: -3714,
        した: 3562,
        して: 1449,
        しな: 2608,
        しま: 1200,
        'す.': -1310,
        'す。': -1310,
        する: 6521,
        'ず,': 3426,
        'ず、': 3426,
        ずに: 841,
        そう: 428,
        'た.': 8875,
        'た。': 8875,
        たい: -594,
        たの: 812,
        たり: -1183,
        たる: -853,
        'だ.': 4098,
        'だ。': 4098,
        だっ: 1004,
        った: -4748,
        って: 300,
        てい: 6240,
        てお: 855,
        ても: 302,
        です: 1437,
        でに: -1482,
        では: 2295,
        とう: -1387,
        とし: 2266,
        との: 541,
        とも: -3543,
        どう: 4664,
        ない: 1796,
        なく: -903,
        など: 2135,
        'に,': -1021,
        'に、': -1021,
        にし: 1771,
        にな: 1906,
        には: 2644,
        'の,': -724,
        'の、': -724,
        の子: -1000,
        'は,': 1337,
        'は、': 1337,
        べき: 2181,
        まし: 1113,
        ます: 6943,
        まっ: -1549,
        まで: 6154,
        まれ: -793,
        らし: 1479,
        られ: 6820,
        るる: 3818,
        'れ,': 854,
        'れ、': 854,
        れた: 1850,
        れて: 1375,
        れば: -3246,
        れる: 1091,
        われ: -605,
        んだ: 606,
        んで: 798,
        カ月: 990,
        会議: 860,
        入り: 1232,
        大会: 2217,
        始め: 1681,
        市: 965,
        新聞: -5055,
        '日,': 974,
        '日、': 974,
        社会: 2024,
        ｶ月: 990,
    };
    this.TC1__ = {
        AAA: 1093,
        HHH: 1029,
        HHM: 580,
        HII: 998,
        HOH: -390,
        HOM: -331,
        IHI: 1169,
        IOH: -142,
        IOI: -1015,
        IOM: 467,
        MMH: 187,
        OOI: -1832,
    };
    this.TC2__ = {
        HHO: 2088,
        HII: -1023,
        HMM: -1154,
        IHI: -1965,
        KKH: 703,
        OII: -2649,
    };
    this.TC3__ = {
        AAA: -294,
        HHH: 346,
        HHI: -341,
        HII: -1088,
        HIK: 731,
        HOH: -1486,
        IHH: 128,
        IHI: -3041,
        IHO: -1935,
        IIH: -825,
        IIM: -1035,
        IOI: -542,
        KHH: -1216,
        KKA: 491,
        KKH: -1217,
        KOK: -1009,
        MHH: -2694,
        MHM: -457,
        MHO: 123,
        MMH: -471,
        NNH: -1689,
        NNO: 662,
        OHO: -3393,
    };
    this.TC4__ = {
        HHH: -203,
        HHI: 1344,
        HHK: 365,
        HHM: -122,
        HHN: 182,
        HHO: 669,
        HIH: 804,
        HII: 679,
        HOH: 446,
        IHH: 695,
        IHO: -2324,
        IIH: 321,
        III: 1497,
        IIO: 656,
        IOO: 54,
        KAK: 4845,
        KKA: 3386,
        KKK: 3065,
        MHH: -405,
        MHI: 201,
        MMH: -241,
        MMM: 661,
        MOM: 841,
    };
    this.TQ1__ = {
        BHHH: -227,
        BHHI: 316,
        BHIH: -132,
        BIHH: 60,
        BIII: 1595,
        BNHH: -744,
        BOHH: 225,
        BOOO: -908,
        OAKK: 482,
        OHHH: 281,
        OHIH: 249,
        OIHI: 200,
        OIIH: -68,
    };
    this.TQ2__ = { BIHH: -1401, BIII: -1033, BKAK: -543, BOOO: -5591 };
    this.TQ3__ = {
        BHHH: 478,
        BHHM: -1073,
        BHIH: 222,
        BHII: -504,
        BIIH: -116,
        BIII: -105,
        BMHI: -863,
        BMHM: -464,
        BOMH: 620,
        OHHH: 346,
        OHHI: 1729,
        OHII: 997,
        OHMH: 481,
        OIHH: 623,
        OIIH: 1344,
        OKAK: 2792,
        OKHH: 587,
        OKKA: 679,
        OOHH: 110,
        OOII: -685,
    };
    this.TQ4__ = {
        BHHH: -721,
        BHHM: -3604,
        BHII: -966,
        BIIH: -607,
        BIII: -2181,
        OAAA: -2763,
        OAKK: 180,
        OHHH: -294,
        OHHI: 2446,
        OHHO: 480,
        OHIH: -1573,
        OIHH: 1935,
        OIHI: -493,
        OIIH: 626,
        OIII: -4007,
        OKAK: -8156,
    };
    this.TW1__ = { につい: -4681, 東京都: 2026 };
    this.TW2__ = {
        ある程: -2049,
        いった: -1256,
        ころが: -2434,
        しょう: 3873,
        その後: -4430,
        だって: -1049,
        ていた: 1833,
        として: -4657,
        ともに: -4517,
        もので: 1882,
        一気に: -792,
        初めて: -1512,
        同時に: -8097,
        大きな: -1255,
        対して: -2721,
        社会党: -3216,
    };
    this.TW3__ = {
        いただ: -1734,
        してい: 1314,
        として: -4314,
        につい: -5483,
        にとっ: -5989,
        に当た: -6247,
        'ので,': -727,
        'ので、': -727,
        のもの: -600,
        れから: -3752,
        十二月: -2287,
    };
    this.TW4__ = {
        'いう.': 8576,
        'いう。': 8576,
        からな: -2348,
        してい: 2958,
        'たが,': 1516,
        'たが、': 1516,
        ている: 1538,
        という: 1349,
        ました: 5543,
        ません: 1097,
        ようと: -4258,
        よると: 5865,
    };
    this.UC1__ = { A: 484, K: 93, M: 645, O: -505 };
    this.UC2__ = { A: 819, H: 1059, I: 409, M: 3987, N: 5775, O: 646 };
    this.UC3__ = { A: -1370, I: 2311 };
    this.UC4__ = {
        A: -2643,
        H: 1809,
        I: -1032,
        K: -3450,
        M: 3565,
        N: 3876,
        O: 6646,
    };
    this.UC5__ = { H: 313, I: -1238, K: -799, M: 539, O: -831 };
    this.UC6__ = { H: -506, I: -253, K: 87, M: 247, O: -387 };
    this.UP1__ = { O: -214 };
    this.UP2__ = { B: 69, O: 935 };
    this.UP3__ = { B: 189 };
    this.UQ1__ = {
        BH: 21,
        BI: -12,
        BK: -99,
        BN: 142,
        BO: -56,
        OH: -95,
        OI: 477,
        OK: 410,
        OO: -2422,
    };
    this.UQ2__ = { BH: 216, BI: 113, OK: 1759 };
    this.UQ3__ = {
        BA: -479,
        BH: 42,
        BI: 1913,
        BK: -7198,
        BM: 3160,
        BN: 6427,
        BO: 14761,
        OI: -827,
        ON: -3212,
    };
    this.UW1__ = {
        ',': 156,
        '、': 156,
        '「': -463,
        あ: -941,
        う: -127,
        が: -553,
        き: 121,
        こ: 505,
        で: -201,
        と: -547,
        ど: -123,
        に: -789,
        の: -185,
        は: -847,
        も: -466,
        や: -470,
        よ: 182,
        ら: -292,
        り: 208,
        れ: 169,
        を: -446,
        ん: -137,
        '・': -135,
        主: -402,
        京: -268,
        区: -912,
        午: 871,
        国: -460,
        大: 561,
        委: 729,
        市: -411,
        日: -141,
        理: 361,
        生: -408,
        県: -386,
        都: -718,
        '｢': -463,
        '･': -135,
    };
    this.UW2__ = {
        ',': -829,
        '、': -829,
        〇: 892,
        '「': -645,
        '」': 3145,
        あ: -538,
        い: 505,
        う: 134,
        お: -502,
        か: 1454,
        が: -856,
        く: -412,
        こ: 1141,
        さ: 878,
        ざ: 540,
        し: 1529,
        す: -675,
        せ: 300,
        そ: -1011,
        た: 188,
        だ: 1837,
        つ: -949,
        て: -291,
        で: -268,
        と: -981,
        ど: 1273,
        な: 1063,
        に: -1764,
        の: 130,
        は: -409,
        ひ: -1273,
        べ: 1261,
        ま: 600,
        も: -1263,
        や: -402,
        よ: 1639,
        り: -579,
        る: -694,
        れ: 571,
        を: -2516,
        ん: 2095,
        ア: -587,
        カ: 306,
        キ: 568,
        ッ: 831,
        三: -758,
        不: -2150,
        世: -302,
        中: -968,
        主: -861,
        事: 492,
        人: -123,
        会: 978,
        保: 362,
        入: 548,
        初: -3025,
        副: -1566,
        北: -3414,
        区: -422,
        大: -1769,
        天: -865,
        太: -483,
        子: -1519,
        学: 760,
        実: 1023,
        小: -2009,
        市: -813,
        年: -1060,
        強: 1067,
        手: -1519,
        揺: -1033,
        政: 1522,
        文: -1355,
        新: -1682,
        日: -1815,
        明: -1462,
        最: -630,
        朝: -1843,
        本: -1650,
        東: -931,
        果: -665,
        次: -2378,
        民: -180,
        気: -1740,
        理: 752,
        発: 529,
        目: -1584,
        相: -242,
        県: -1165,
        立: -763,
        第: 810,
        米: 509,
        自: -1353,
        行: 838,
        西: -744,
        見: -3874,
        調: 1010,
        議: 1198,
        込: 3041,
        開: 1758,
        間: -1257,
        '｢': -645,
        '｣': 3145,
        ｯ: 831,
        ｱ: -587,
        ｶ: 306,
        ｷ: 568,
    };
    this.UW3__ = {
        ',': 4889,
        1: -800,
        '−': -1723,
        '、': 4889,
        々: -2311,
        〇: 5827,
        '」': 2670,
        '〓': -3573,
        あ: -2696,
        い: 1006,
        う: 2342,
        え: 1983,
        お: -4864,
        か: -1163,
        が: 3271,
        く: 1004,
        け: 388,
        げ: 401,
        こ: -3552,
        ご: -3116,
        さ: -1058,
        し: -395,
        す: 584,
        せ: 3685,
        そ: -5228,
        た: 842,
        ち: -521,
        っ: -1444,
        つ: -1081,
        て: 6167,
        で: 2318,
        と: 1691,
        ど: -899,
        な: -2788,
        に: 2745,
        の: 4056,
        は: 4555,
        ひ: -2171,
        ふ: -1798,
        へ: 1199,
        ほ: -5516,
        ま: -4384,
        み: -120,
        め: 1205,
        も: 2323,
        や: -788,
        よ: -202,
        ら: 727,
        り: 649,
        る: 5905,
        れ: 2773,
        わ: -1207,
        を: 6620,
        ん: -518,
        ア: 551,
        グ: 1319,
        ス: 874,
        ッ: -1350,
        ト: 521,
        ム: 1109,
        ル: 1591,
        ロ: 2201,
        ン: 278,
        '・': -3794,
        一: -1619,
        下: -1759,
        世: -2087,
        両: 3815,
        中: 653,
        主: -758,
        予: -1193,
        二: 974,
        人: 2742,
        今: 792,
        他: 1889,
        以: -1368,
        低: 811,
        何: 4265,
        作: -361,
        保: -2439,
        元: 4858,
        党: 3593,
        全: 1574,
        公: -3030,
        六: 755,
        共: -1880,
        円: 5807,
        再: 3095,
        分: 457,
        初: 2475,
        別: 1129,
        前: 2286,
        副: 4437,
        力: 365,
        動: -949,
        務: -1872,
        化: 1327,
        北: -1038,
        区: 4646,
        千: -2309,
        午: -783,
        協: -1006,
        口: 483,
        右: 1233,
        各: 3588,
        合: -241,
        同: 3906,
        和: -837,
        員: 4513,
        国: 642,
        型: 1389,
        場: 1219,
        外: -241,
        妻: 2016,
        学: -1356,
        安: -423,
        実: -1008,
        家: 1078,
        小: -513,
        少: -3102,
        州: 1155,
        市: 3197,
        平: -1804,
        年: 2416,
        広: -1030,
        府: 1605,
        度: 1452,
        建: -2352,
        当: -3885,
        得: 1905,
        思: -1291,
        性: 1822,
        戸: -488,
        指: -3973,
        政: -2013,
        教: -1479,
        数: 3222,
        文: -1489,
        新: 1764,
        日: 2099,
        旧: 5792,
        昨: -661,
        時: -1248,
        曜: -951,
        最: -937,
        月: 4125,
        期: 360,
        李: 3094,
        村: 364,
        東: -805,
        核: 5156,
        森: 2438,
        業: 484,
        氏: 2613,
        民: -1694,
        決: -1073,
        法: 1868,
        海: -495,
        無: 979,
        物: 461,
        特: -3850,
        生: -273,
        用: 914,
        町: 1215,
        的: 7313,
        直: -1835,
        省: 792,
        県: 6293,
        知: -1528,
        私: 4231,
        税: 401,
        立: -960,
        第: 1201,
        米: 7767,
        系: 3066,
        約: 3663,
        級: 1384,
        統: -4229,
        総: 1163,
        線: 1255,
        者: 6457,
        能: 725,
        自: -2869,
        英: 785,
        見: 1044,
        調: -562,
        財: -733,
        費: 1777,
        車: 1835,
        軍: 1375,
        込: -1504,
        通: -1136,
        選: -681,
        郎: 1026,
        郡: 4404,
        部: 1200,
        金: 2163,
        長: 421,
        開: -1432,
        間: 1302,
        関: -1282,
        雨: 2009,
        電: -1045,
        非: 2066,
        駅: 1620,
        '１': -800,
        '｣': 2670,
        '･': -3794,
        ｯ: -1350,
        ｱ: 551,
        ｸﾞ: 1319,
        ｽ: 874,
        ﾄ: 521,
        ﾑ: 1109,
        ﾙ: 1591,
        ﾛ: 2201,
        ﾝ: 278,
    };
    this.UW4__ = {
        ',': 3930,
        '.': 3508,
        '―': -4841,
        '、': 3930,
        '。': 3508,
        〇: 4999,
        '「': 1895,
        '」': 3798,
        '〓': -5156,
        あ: 4752,
        い: -3435,
        う: -640,
        え: -2514,
        お: 2405,
        か: 530,
        が: 6006,
        き: -4482,
        ぎ: -3821,
        く: -3788,
        け: -4376,
        げ: -4734,
        こ: 2255,
        ご: 1979,
        さ: 2864,
        し: -843,
        じ: -2506,
        す: -731,
        ず: 1251,
        せ: 181,
        そ: 4091,
        た: 5034,
        だ: 5408,
        ち: -3654,
        っ: -5882,
        つ: -1659,
        て: 3994,
        で: 7410,
        と: 4547,
        な: 5433,
        に: 6499,
        ぬ: 1853,
        ね: 1413,
        の: 7396,
        は: 8578,
        ば: 1940,
        ひ: 4249,
        び: -4134,
        ふ: 1345,
        へ: 6665,
        べ: -744,
        ほ: 1464,
        ま: 1051,
        み: -2082,
        む: -882,
        め: -5046,
        も: 4169,
        ゃ: -2666,
        や: 2795,
        ょ: -1544,
        よ: 3351,
        ら: -2922,
        り: -9726,
        る: -14896,
        れ: -2613,
        ろ: -4570,
        わ: -1783,
        を: 13150,
        ん: -2352,
        カ: 2145,
        コ: 1789,
        セ: 1287,
        ッ: -724,
        ト: -403,
        メ: -1635,
        ラ: -881,
        リ: -541,
        ル: -856,
        ン: -3637,
        '・': -4371,
        ー: -11870,
        一: -2069,
        中: 2210,
        予: 782,
        事: -190,
        井: -1768,
        人: 1036,
        以: 544,
        会: 950,
        体: -1286,
        作: 530,
        側: 4292,
        先: 601,
        党: -2006,
        共: -1212,
        内: 584,
        円: 788,
        初: 1347,
        前: 1623,
        副: 3879,
        力: -302,
        動: -740,
        務: -2715,
        化: 776,
        区: 4517,
        協: 1013,
        参: 1555,
        合: -1834,
        和: -681,
        員: -910,
        器: -851,
        回: 1500,
        国: -619,
        園: -1200,
        地: 866,
        場: -1410,
        塁: -2094,
        士: -1413,
        多: 1067,
        大: 571,
        子: -4802,
        学: -1397,
        定: -1057,
        寺: -809,
        小: 1910,
        屋: -1328,
        山: -1500,
        島: -2056,
        川: -2667,
        市: 2771,
        年: 374,
        庁: -4556,
        後: 456,
        性: 553,
        感: 916,
        所: -1566,
        支: 856,
        改: 787,
        政: 2182,
        教: 704,
        文: 522,
        方: -856,
        日: 1798,
        時: 1829,
        最: 845,
        月: -9066,
        木: -485,
        来: -442,
        校: -360,
        業: -1043,
        氏: 5388,
        民: -2716,
        気: -910,
        沢: -939,
        済: -543,
        物: -735,
        率: 672,
        球: -1267,
        生: -1286,
        産: -1101,
        田: -2900,
        町: 1826,
        的: 2586,
        目: 922,
        省: -3485,
        県: 2997,
        空: -867,
        立: -2112,
        第: 788,
        米: 2937,
        系: 786,
        約: 2171,
        経: 1146,
        統: -1169,
        総: 940,
        線: -994,
        署: 749,
        者: 2145,
        能: -730,
        般: -852,
        行: -792,
        規: 792,
        警: -1184,
        議: -244,
        谷: -1000,
        賞: 730,
        車: -1481,
        軍: 1158,
        輪: -1433,
        込: -3370,
        近: 929,
        道: -1291,
        選: 2596,
        郎: -4866,
        都: 1192,
        野: -1100,
        銀: -2213,
        長: 357,
        間: -2344,
        院: -2297,
        際: -2604,
        電: -878,
        領: -1659,
        題: -792,
        館: -1984,
        首: 1749,
        高: 2120,
        '｢': 1895,
        '｣': 3798,
        '･': -4371,
        ｯ: -724,
        ｰ: -11870,
        ｶ: 2145,
        ｺ: 1789,
        ｾ: 1287,
        ﾄ: -403,
        ﾒ: -1635,
        ﾗ: -881,
        ﾘ: -541,
        ﾙ: -856,
        ﾝ: -3637,
    };
    this.UW5__ = {
        ',': 465,
        '.': -299,
        1: -514,
        E2: -32768,
        ']': -2762,
        '、': 465,
        '。': -299,
        '「': 363,
        あ: 1655,
        い: 331,
        う: -503,
        え: 1199,
        お: 527,
        か: 647,
        が: -421,
        き: 1624,
        ぎ: 1971,
        く: 312,
        げ: -983,
        さ: -1537,
        し: -1371,
        す: -852,
        だ: -1186,
        ち: 1093,
        っ: 52,
        つ: 921,
        て: -18,
        で: -850,
        と: -127,
        ど: 1682,
        な: -787,
        に: -1224,
        の: -635,
        は: -578,
        べ: 1001,
        み: 502,
        め: 865,
        ゃ: 3350,
        ょ: 854,
        り: -208,
        る: 429,
        れ: 504,
        わ: 419,
        を: -1264,
        ん: 327,
        イ: 241,
        ル: 451,
        ン: -343,
        中: -871,
        京: 722,
        会: -1153,
        党: -654,
        務: 3519,
        区: -901,
        告: 848,
        員: 2104,
        大: -1296,
        学: -548,
        定: 1785,
        嵐: -1304,
        市: -2991,
        席: 921,
        年: 1763,
        思: 872,
        所: -814,
        挙: 1618,
        新: -1682,
        日: 218,
        月: -4353,
        査: 932,
        格: 1356,
        機: -1508,
        氏: -1347,
        田: 240,
        町: -3912,
        的: -3149,
        相: 1319,
        省: -1052,
        県: -4003,
        研: -997,
        社: -278,
        空: -813,
        統: 1955,
        者: -2233,
        表: 663,
        語: -1073,
        議: 1219,
        選: -1018,
        郎: -368,
        長: 786,
        間: 1191,
        題: 2368,
        館: -689,
        '１': -514,
        Ｅ２: -32768,
        '｢': 363,
        ｲ: 241,
        ﾙ: 451,
        ﾝ: -343,
    };
    this.UW6__ = {
        ',': 227,
        '.': 808,
        1: -270,
        E1: 306,
        '、': 227,
        '。': 808,
        あ: -307,
        う: 189,
        か: 241,
        が: -73,
        く: -121,
        こ: -200,
        じ: 1782,
        す: 383,
        た: -428,
        っ: 573,
        て: -1014,
        で: 101,
        と: -105,
        な: -253,
        に: -149,
        の: -417,
        は: -236,
        も: -206,
        り: 187,
        る: -135,
        を: 195,
        ル: -673,
        ン: -496,
        一: -277,
        中: 201,
        件: -800,
        会: 624,
        前: 302,
        区: 1792,
        員: -1212,
        委: 798,
        学: -960,
        市: 887,
        広: -695,
        後: 535,
        業: -697,
        相: 753,
        社: -507,
        福: 974,
        空: -822,
        者: 1811,
        連: 463,
        郎: 1082,
        '１': -270,
        Ｅ１: 306,
        ﾙ: -673,
        ﾝ: -496,
    };
    return this;
}
TinySegmenter.prototype.ctype_ = function (str) {
    for (var i in this.chartype_) {
        if (str.match(this.chartype_[i][0])) {
            return this.chartype_[i][1];
        }
    }
    return 'O';
};
TinySegmenter.prototype.ts_ = function (v) {
    if (v) {
        return v;
    }
    return 0;
};
TinySegmenter.prototype.segment = function (input) {
    if (input == null || input == undefined || input == '') {
        return [];
    }
    var result = [];
    var seg = ['B3', 'B2', 'B1'];
    var ctype = ['O', 'O', 'O'];
    var o = input.split('');
    for (i = 0; i < o.length; ++i) {
        seg.push(o[i]);
        ctype.push(this.ctype_(o[i]));
    }
    seg.push('E1');
    seg.push('E2');
    seg.push('E3');
    ctype.push('O');
    ctype.push('O');
    ctype.push('O');
    var word = seg[3];
    var p1 = 'U';
    var p2 = 'U';
    var p3 = 'U';
    for (var i = 4; i < seg.length - 3; ++i) {
        var score = this.BIAS__;
        var w1 = seg[i - 3];
        var w2 = seg[i - 2];
        var w3 = seg[i - 1];
        var w4 = seg[i];
        var w5 = seg[i + 1];
        var w6 = seg[i + 2];
        var c1 = ctype[i - 3];
        var c2 = ctype[i - 2];
        var c3 = ctype[i - 1];
        var c4 = ctype[i];
        var c5 = ctype[i + 1];
        var c6 = ctype[i + 2];
        score += this.ts_(this.UP1__[p1]);
        score += this.ts_(this.UP2__[p2]);
        score += this.ts_(this.UP3__[p3]);
        score += this.ts_(this.BP1__[p1 + p2]);
        score += this.ts_(this.BP2__[p2 + p3]);
        score += this.ts_(this.UW1__[w1]);
        score += this.ts_(this.UW2__[w2]);
        score += this.ts_(this.UW3__[w3]);
        score += this.ts_(this.UW4__[w4]);
        score += this.ts_(this.UW5__[w5]);
        score += this.ts_(this.UW6__[w6]);
        score += this.ts_(this.BW1__[w2 + w3]);
        score += this.ts_(this.BW2__[w3 + w4]);
        score += this.ts_(this.BW3__[w4 + w5]);
        score += this.ts_(this.TW1__[w1 + w2 + w3]);
        score += this.ts_(this.TW2__[w2 + w3 + w4]);
        score += this.ts_(this.TW3__[w3 + w4 + w5]);
        score += this.ts_(this.TW4__[w4 + w5 + w6]);
        score += this.ts_(this.UC1__[c1]);
        score += this.ts_(this.UC2__[c2]);
        score += this.ts_(this.UC3__[c3]);
        score += this.ts_(this.UC4__[c4]);
        score += this.ts_(this.UC5__[c5]);
        score += this.ts_(this.UC6__[c6]);
        score += this.ts_(this.BC1__[c2 + c3]);
        score += this.ts_(this.BC2__[c3 + c4]);
        score += this.ts_(this.BC3__[c4 + c5]);
        score += this.ts_(this.TC1__[c1 + c2 + c3]);
        score += this.ts_(this.TC2__[c2 + c3 + c4]);
        score += this.ts_(this.TC3__[c3 + c4 + c5]);
        score += this.ts_(this.TC4__[c4 + c5 + c6]);
        //  score += this.ts_(this.TC5__[c4 + c5 + c6]);
        score += this.ts_(this.UQ1__[p1 + c1]);
        score += this.ts_(this.UQ2__[p2 + c2]);
        score += this.ts_(this.UQ3__[p3 + c3]);
        score += this.ts_(this.BQ1__[p2 + c2 + c3]);
        score += this.ts_(this.BQ2__[p2 + c3 + c4]);
        score += this.ts_(this.BQ3__[p3 + c2 + c3]);
        score += this.ts_(this.BQ4__[p3 + c3 + c4]);
        score += this.ts_(this.TQ1__[p2 + c1 + c2 + c3]);
        score += this.ts_(this.TQ2__[p2 + c2 + c3 + c4]);
        score += this.ts_(this.TQ3__[p3 + c1 + c2 + c3]);
        score += this.ts_(this.TQ4__[p3 + c2 + c3 + c4]);
        var p = 'O';
        if (score > 0) {
            result.push(word);
            word = '';
            p = 'B';
        }
        p1 = p2;
        p2 = p3;
        p3 = p;
        word += seg[i];
    }
    result.push(word);
    return result;
};

var JapaneseTokenizer = /** @class */ (function (_super) {
    __extends(JapaneseTokenizer, _super);
    function JapaneseTokenizer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // @ts-ignore
        _this.tokenizer = new TinySegmenter();
        return _this;
    }
    JapaneseTokenizer.prototype.tokenize = function (text, range) {
        var _this = this;
        var tokens = text
            .slice(range === null || range === void 0 ? void 0 : range.start, range === null || range === void 0 ? void 0 : range.end)
            .split('\n')
            .flatMap(function (line) { return _this.tokenizer.segment(line); })
            .map(function (t) { return t.replace(_this.trimPattern, ''); });
        return { tokens: tokens };
    };
    JapaneseTokenizer.prototype.lastWordFrom = function (text, index, options) {
        var _this = this;
        if (options === void 0) { options = { normalize: false }; }
        var normalized = (options.normalize
            ? this.normalizedLine(text, index)
            : { normalized: text }).normalized;
        var tokens = this.tokenizer
            .segment(normalized)
            .map(function (t) { return t.replace(_this.trimPattern, ''); });
        var length = tokens.length;
        return length > 0 ? tokens[length - 1] : null;
    };
    JapaneseTokenizer.prototype.lastWordStartPos = function (text, index, options) {
        if (options === void 0) { options = { normalize: false }; }
        var lastWord = this.lastWordFrom(text, index, options);
        return lastWord ? text.length - lastWord.length : 0;
    };
    return JapaneseTokenizer;
}(Tokenizer));

var TokenizerFactory = /** @class */ (function () {
    function TokenizerFactory() {
    }
    TokenizerFactory.getTokenizer = function (strategy, wordSeparators) {
        var tokenizer;
        switch (strategy) {
            case 'default':
                tokenizer = new DefaultTokenizer(wordSeparators);
                break;
            case 'japanese':
                tokenizer = new JapaneseTokenizer(wordSeparators);
                break;
            case 'arabic':
                tokenizer = new ArabicTokenizer(wordSeparators);
                break;
            default:
                throw new Error("Strategy '" + strategy + "' not found");
        }
        return tokenizer;
    };
    return TokenizerFactory;
}());

var LaTexProvider = /** @class */ (function (_super) {
    __extends(LaTexProvider, _super);
    function LaTexProvider() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.category = "L";
        _this.completions = ["\\Arrowvert", "\\Bbbk", "\\Big", "\\Bigg", "\\Biggl", "\\Biggr", "\\Bigl", "\\Bigm", "\\Bigr", "\\Box", "\\Bumpeq", "\\Cap", "\\cite[#{}]{#{}}", "\\cite", "\\Cup", "\\DeclareMathOperator{#{}}{#{}}", "\\Delta", "\\Downarrow", "\\Finv", "\\Game", "\\Gamma", "\\Im", "\\Lambda", "\\Leftarrow", "\\Leftrightarrow", "\\Lleftarrow", "\\Longleftarrow", "\\Longleftrightarrow", "\\Longrightarrow", "\\Lsh", "\\Omega", "\\Phi", "\\Pi", "\\Pr", "\\Psi", "\\Re", "\\Rightarrow", "\\Rrightarrow", "\\Rsh", "\\S", "\\Sigma", "\\Subset", "\\Supset", "\\TeX", "\\Theta", "\\Uparrow", "\\Updownarrow", "\\Upsilon", "\\Vdash", "\\Vert", "\\Vvdash", "\\Xi", "\\above", "\\abovewithdelims", "\\acute{#{}}", "\\aleph", "\\alpha", "\\amalg", "\\angle", "\\approx", "\\approxeq", "\\arccos", "\\arcsin", "\\arctan", "\\arg", "\\arrowvert", "\\ast", "\\asymp", "\\atop",
            "\\atopwithdelims", "\\backepsilon", "\\backprime", "\\backsim", "\\backsimeq", "\\backslash", "\\bar{#{}}", "\\barwedge", "\\because", "\\beta", "\\beth", "\\between", "\\bf", "\\big", "\\bigcap", "\\bigcirc", "\\bigcup", "\\bigg", "\\biggl", "\\biggm", "\\biggr", "\\bigl", "\\bigm", "\\bigodot", "\\bigoplus", "\\bigotimes", "\\bigr\\}", "\\bigsqcup", "\\bigstar", "\\bigtriangledown", "\\bigtriangleup", "\\biguplus", "\\bigvee", "\\bigwedge", "\\binom{#{}}{#{}}", "\\blacklozenge", "\\blacksquare", "\\blacktriangle", "\\blacktriangledown", "\\blacktriangleleft", "\\blacktriangleright", "\\bmod", "\\boldsymbol{#{}}", "\\bot", "\\bowtie", "\\boxdot", "\\boxed{#{}}", "\\boxminus", "\\boxplus", "\\boxtimes", "\\brace", "\\bracevert", "\\brack", "\\breve{#{}}", "\\buildrel", "\\bullet", "\\bumpeq", "\\cal", "\\cap", "\\cases{#{}}", "\\cdot", "\\cdotp", "\\cdots",
            "\\centerdot", "\\cfrac{#{}}{#{}}", "\\check{#{}}", "\\checkmark", "\\chi", "\\choose", "\\circ", "\\circeq", "\\circlearrowleft", "\\circlearrowright", "\\circledS", "\\circledast", "\\circledcirc", "\\circleddash", "\\clubsuit", "\\colon", "\\complement", "\\cong", "\\coprod", "\\cos", "\\cosh", "\\cot", "\\coth", "\\cr", "\\csc", "\\cup", "\\curlyeqprec", "\\curlyeqsucc", "\\curlyvee", "\\curlywedge", "\\curvearrowleft", "\\curvearrowright", "\\dagger", "\\daleth", "\\dashleftarrow", "\\dashrightarrow", "\\dashv", "\\dbinom{#{}}{#{}}", "\\ddagger", "\\ddddot{#{}}", "\\dddot{#{}}", "\\ddot{#{}}", "\\ddots", "\\def", "\\deg", "\\delta", "\\det", "\\dfrac{#{}}{#{}}", "\\diagdown", "\\diagup", "\\diamond", "\\diamondsuit", "\\digamma", "\\dim", "\\displaylines", "\\displaystyle", "\\div", "\\divideontimes", "\\dot{#{}}", "\\doteq", "\\doteqdot", "\\dotplus",
            "\\dots", "\\dotsb", "\\dotsc", "\\dotsi", "\\dotsm", "\\dotso", "\\doublebarwedge", "\\downarrow", "\\downdownarrows", "\\downharpoonleft", "\\downharpoonright", "\\ell", "\\emptyset", "\\enspace", "\\epsilon", "\\eqalign{#{}}", "\\eqalignno{#{}}", "\\eqcirc", "\\eqref{#{}}", "\\eqsim", "\\eqslantgtr", "\\eqslantless", "\\equiv", "\\eta", "\\eth", "\\exists", "\\exp", "\\fallingdotseq", "\\flat", "\\forall", "\\frown", "\\gamma", "\\gcd", "\\ge", "\\geq", "\\geqq", "\\geqslant", "\\gets", "\\gg", "\\ggg", "\\gimel", "\\gnapprox", "\\gneq", "\\gneqq", "\\gnsim", "\\grave{#{}}", "\\gtrapprox", "\\gtrdot", "\\gtreqless", "\\gtreqqless", "\\gtrless", "\\gtrsim", "\\gvertneqq", "\\hat{#{}}", "\\hbar", "\\hbox", "\\heartsuit", "\\hfil", "\\hfill", "\\hom", "\\hookleftarrow", "\\hookrightarrow", "\\hphantom{#{}}", "\\hskip", "\\hslash", "\\idotsint", "\\iff",
            "\\iiiint", "\\iiint", "\\iint", "\\imath", "\\impliedby", "\\implies", "\\in", "\\inf", "\\infty", "\\injlim", "\\int\\limits_{#{}}^{#{}}", "\\intercal", "\\iota", "\\it", "\\jmath", "\\kappa", "\\ker", "\\kern", "\\lVert", "\\lambda", "\\land", "\\langle", "\\lbrace", "\\lbrack", "\\lceil", "\\ldotp", "\\ldots", "\\le", "\\left", "\\leftarrow", "\\leftarrowtail", "\\leftharpoondown", "\\leftharpoonup", "\\leftleftarrows", "\\leftrightarrow", "\\leftrightarrows", "\\leftrightharpoons", "\\leftrightsquigarrow", "\\leftroot{#{}}", "\\leftthreetimes", "\\leq", "\\leqalignno{#{}}", "\\leqq", "\\leqslant", "\\lessapprox", "\\lessdot", "\\lesseqgtr", "\\lesseqqgtr", "\\lessgtr", "\\lesssim", "\\let{#{}}{#{}}", "\\lfloor", "\\lg", "\\lgroup", "\\lhd", "\\lim", "\\liminf", "\\limits_{#{}}^{#{}}", "\\limsup", "\\ll", "\\llap{#{}}", "\\llcorner", "\\lll", "\\lmoustache",
            "\\ln", "\\lnapprox", "\\lneq", "\\lneqq", "\\lnot", "\\lnsim", "\\log", "\\longleftarrow", "\\longleftrightarrow", "\\longmapsto", "\\longrightarrow", "\\looparrowleft", "\\looparrowright", "\\lor", "\\lower", "\\lozenge", "\\lrcorner", "\\ltimes", "\\lvert", "\\lvertneqq", "\\maltese", "\\mapsto", "\\mathbb{#{}}", "\\mathbf{#{}}", "\\mathbin", "\\mathcal{#{}}", "\\mathchoice", "\\mathclose", "\\mathfrak{#{}}", "\\mathinner", "\\mathop", "\\mathopen", "\\mathord", "\\mathpunct", "\\mathrel", "\\mathstrut", "\\matrix{#{}}", "\\max", "\\measuredangle", "\\mho", "\\mid", "\\middle", "\\min", "\\mit", "\\mkern", "\\mod", "\\models", "\\moveleft", "\\moveright", "\\mp", "\\mskip", "\\mspace{#{}}", "\\mu", "\\multimap", "\\nLeftarrow", "\\nLeftrightarrow", "\\nRightarrow", "\\nVDash", "\\nVdash", "\\nabla", "\\natural", "\\ncong", "\\ne", "\\nearrow", "\\neg", "\\negmedspace",
            "\\negthickspace", "\\negthinspace", "\\neq", "\\nexists", "\\ngeq", "\\ngeqq", "\\ngeqslant", "\\ngtr", "\\ni", "\\nleftarrow", "\\nleftrightarrow", "\\nleq", "\\nleqq", "\\nleqslant", "\\nless", "\\nmid", "\\nolimits_{#{}}^{#{}}", "\\not", "\\notag", "\\notin", "\\nparallel", "\\nprec", "\\npreceq", "\\nrightarrow", "\\nshortmid", "\\nshortparallel", "\\nsim", "\\nsubseteq", "\\nsubseteqq", "\\nsucc", "\\nsucceq", "\\nsupseteq", "\\nsupseteqq", "\\ntriangleleft", "\\ntrianglelefteq", "\\ntriangleright", "\\ntrianglerighteq", "\\nu", "\\nvDash", "\\nvdash", "\\nwarrow", "\\odot", "\\oint", "\\oldstyle", "\\omega", "\\ominus", "\\operatorname{#{}}", "\\oplus", "\\oslash", "\\otimes", "\\over", "\\overbrace{#{}}", "\\overleftarrow{#{}}", "\\overleftrightarrow{#{}}", "\\overline{#{}}", "\\overrightarrow{#{}}", "\\overset{#{}}{#{}}", "\\overwithdelims", "\\owns",
            "\\parallel", "\\partial", "\\perp", "\\phantom{#{}}", "\\phi", "\\pi", "\\pitchfork", "\\pm", "\\pmatrix{#{}}", "\\pmb{#{}}", "\\pmod", "\\pod", "\\prec", "\\precapprox", "\\preccurlyeq", "\\preceq", "\\precnapprox", "\\precneqq", "\\precnsim", "\\precsim", "\\prime", "\\prod\\limits_{#{}}^{#{}}", "\\projlim", "\\propto", "\\psi", "\\qquad", "\\quad", "\\rVert", "\\raise", "\\rangle", "\\rbrace", "\\rbrack", "\\rceil", "\\rfloor", "\\rgroup", "\\rhd", "\\rho", "\\right", "\\rightarrow", "\\rightarrowtail", "\\rightharpoondown", "\\rightharpoonup", "\\rightleftarrows", "\\rightleftharpoons", "\\rightrightarrows", "\\rightsquigarrow", "\\rightthreetimes", "\\risingdotseq", "\\rlap{#{}}", "\\rm", "\\rmoustache", "\\root #{} \\of #{}", "\\rtimes", "\\rvert", "\\scriptscriptstyle", "\\scriptstyle", "\\searrow", "\\sec", "\\setminus", "\\sharp", "\\shortmid",
            "\\shortparallel", "\\sideset{#{}}{#{}}{#{}}", "\\sigma", "\\sim", "\\simeq", "\\sin", "\\sinh", "\\skew{#{}}{#{}}{#{}}", "\\smallfrown", "\\smallint", "\\smallsetminus", "\\smallsmile", "\\smash{#{}}", "\\smile", "\\space", "\\spadesuit", "\\sphericalangle", "\\sqcap", "\\sqcup", "\\sqrt{#{}}", "\\sqsubset", "\\sqsubseteq", "\\sqsupset", "\\sqsupseteq", "\\square", "\\star", "\\strut", "\\subset", "\\subseteq", "\\subseteqq", "\\subsetneq", "\\subsetneqq", "\\substack{#{}}", "\\succ", "\\succapprox", "\\succcurlyeq", "\\succeq", "\\succnapprox", "\\succneqq", "\\succnsim", "\\succsim", "\\sum\\limits_{#{}}^{#{}}", "\\sup", "\\supset", "\\supseteq", "\\supseteqq", "\\supsetneq", "\\supsetneqq", "\\surd", "\\swarrow", "\\tag{#{}}", "\\tan", "\\tanh", "\\tau", "\\tbinom{#{}}{#{}}", "\\text{#{}}", "\\textstyle", "\\tfrac{#{}}{#{}}", "\\therefore", "\\theta",
            "\\thickapprox", "\\thicksim", "\\thinspace", "\\tilde{#{}}", "\\times", "\\to", "\\top", "\\triangle", "\\triangledown", "\\triangleleft", "\\trianglelefteq", "\\triangleq", "\\triangleright", "\\trianglerighteq", "\\tt", "\\twoheadleftarrow", "\\twoheadrightarrow", "\\ulcorner", "\\underbrace{#{}}", "\\underleftarrow{#{}}", "\\underleftrightarrow{#{}}", "\\underline{#{}}", "\\underrightarrow{#{}}", "\\underset{#{}}{#{}}", "\\unlhd", "\\unrhd", "\\uparrow", "\\updownarrow", "\\upharpoonleft", "\\upharpoonright", "\\uplus", "\\uproot{#{}}", "\\upsilon", "\\upuparrows", "\\urcorner", "\\vDash", "\\varDelta", "\\varGamma", "\\varLambda", "\\varOmega", "\\varPhi", "\\varPi", "\\varPsi", "\\varSigma", "\\varTheta", "\\varUpsilon", "\\varXi", "\\varepsilon", "\\varinjlim", "\\varkappa", "\\varliminf", "\\varlimsup", "\\varnothing", "\\varphi", "\\varpi",
            "\\varprojlim", "\\varpropto", "\\varrho", "\\varsigma", "\\varsubsetneq", "\\varsubsetneqq", "\\varsupsetneq", "\\varsupsetneqq", "\\vartheta", "\\vartriangle", "\\vartriangleleft", "\\vartriangleright", "\\vcenter", "\\vdash", "\\vec{#{}}", "\\vee", "\\veebar", "\\vert", "\\vphantom{#{}}", "\\wedge", "\\widehat{#{}}", "\\widetilde{#{}}", "\\wp", "\\wr", "\\xi", "\\xleftarrow{#{}}", "\\xrightarrow{#{}}", "\\zeta", "\\begin{definition}", "\\begin{tikzcd}", "\\begin{tikzpicture}", "\\begin{align}", "\\begin{align*}", "\\begin{alignat}", "\\begin{alignat*}", "\\begin{aligned}", "\\begin{alignedat}", "\\begin{array}", "\\begin{Bmatrix}", "\\begin{bmatrix}", "\\begin{cases}", "\\begin{CD}", "\\begin{eqnarray}", "\\begin{eqnarray*}", "\\begin{equation}", "\\begin{equation*}", "\\begin{gather}", "\\begin{gather*}", "\\begin{gathered}", "\\begin{matrix}",
            "\\begin{multline}", "\\begin{multline*}", "\\begin{pmatrix}", "\\begin{smallmatrix}", "\\begin{split}", "\\begin{subarray}", "\\begin{Vmatrix}", "\\begin{vmatrix}", "\\end{definition}", "\\end{tikzcd}", "\\end{tikzpicture}", "\\end{align}", "\\end{align*}", "\\end{alignat}", "\\end{alignat*}", "\\end{aligned}", "\\end{alignedat}", "\\end{array}", "\\end{Bmatrix}", "\\end{bmatrix}", "\\end{cases}", "\\end{CD}", "\\end{eqnarray}", "\\end{eqnarray*}", "\\end{equation}", "\\end{equation*}", "\\end{gather}", "\\end{gather*}", "\\end{gathered}", "\\end{matrix}",
            "\\end{multline}", "\\end{multline*}", "\\end{pmatrix}", "\\end{smallmatrix}", "\\end{split}", "\\end{subarray}", "\\end{Vmatrix}", "\\end{vmatrix}"];
        return _this;
    }
    return LaTexProvider;
}(Provider));

var Autocomplete = /** @class */ (function () {
    function Autocomplete(settings) {
        var _this = this;
        this.keyMaps = {
            // Override code mirror default key maps
            'Ctrl-P': function () { },
            'Ctrl-N': function () { },
            Up: function () { },
            Down: function () { },
            Right: function (editor) { return _this.removeViewFrom(editor); },
            Left: function (editor) { return _this.removeViewFrom(editor); },
            Tab: function (editor) {
                _this.selectSuggestion(editor);
            },
            Enter: function (editor) {
                _this.selectSuggestion(editor);
            },
            Esc: function (editor) {
                _this.removeViewFrom(editor);
                if (editor.getOption('keyMap') === 'vim-insert')
                    editor.operation(function () {
                        // https://github.com/codemirror/CodeMirror/blob/bd37a96d362b8d92895d3960d569168ec39e4165/keymap/vim.js#L5341
                        var vim = editor.state.vim;
                        vim.insertMode = false;
                        editor.setOption('keyMap', 'vim');
                    });
            },
        };
        this.settings = settings;
        this.loadProviders();
        this.suggestions = [];
        this.selected = defaultDirection();
        this.view = null;
    }
    Object.defineProperty(Autocomplete.prototype, "isShown", {
        get: function () {
            return this.view !== null;
        },
        enumerable: false,
        configurable: true
    });
    // TODO: Create settings type
    Autocomplete.prototype.toggleViewIn = function (editor, _a) {
        var _b = _a === void 0 ? {
            autoSelect: true,
            showEmptyMatch: true,
        } : _a, autoSelect = _b.autoSelect, showEmptyMatch = _b.showEmptyMatch;
        var isEnabled = this.settings.enabled;
        if (this.isShown || !isEnabled) {
            this.cursorAtTrigger = null;
            this.removeViewFrom(editor);
        }
        else if (isEnabled) {
            var cursor = copyObject(editor.getCursor());
            var currentLine = editor.getLine(cursor.line);
            var wordStartIndex = this.tokenizer.lastWordStartPos(currentLine, cursor.ch);
            var cursorAt = cursor.ch;
            cursor.ch = wordStartIndex;
            this.cursorAtTrigger = cursor;
            var word = currentLine.slice(wordStartIndex, cursorAt);
            this.showViewIn(editor, word, { autoSelect: autoSelect, showEmptyMatch: showEmptyMatch });
        }
    };
    Autocomplete.prototype.updateViewIn = function (editor, event, _a) {
        var _b = _a === void 0 ? {
            updateSelected: true,
            autoSelect: true,
            showEmptyMatch: true,
        } : _a, updateSelected = _b.updateSelected, autoSelect = _b.autoSelect, showEmptyMatch = _b.showEmptyMatch;
        if (updateSelected)
            this.selected = updateSelectedSuggestionFrom(event, this.selected, this.suggestions.length);
        var cursor = copyObject(editor.getCursor());
        var currentLine = editor.getLine(cursor.line);
        var completionWord = this.tokenizer.lastWordFrom(currentLine, cursor.ch);
        var recreate = completionWord !== this.lastCompletionWord;
        if (recreate) {
            this.lastCompletionWord = completionWord;
            this.showViewIn(editor, completionWord, { autoSelect: autoSelect, showEmptyMatch: showEmptyMatch });
        }
        else
            updateCachedView(this.view, this.selected.index);
        scrollTo(this.selected, this.view, this.suggestions.length);
    };
    Autocomplete.prototype.removeViewFrom = function (editor) {
        this.selected = defaultDirection();
        editor.removeKeyMap(this.keyMaps);
        if (!this.view)
            return;
        this.addClickListener(this.view, editor, false);
        try {
            var parentNode = this.view.parentNode;
            if (parentNode) {
                var removed = parentNode.removeChild(this.view);
                if (removed)
                    this.view = null;
            }
        }
        catch (e) {
            console.error("Cannot destroy view. Reason: " + e);
        }
    };
    Autocomplete.prototype.updateProvidersFrom = function (event, editor) {
        var tokenizer = this.tokenizer;
        if (!event.ctrlKey &&
            (tokenizer.isWordSeparator(event.key) || event.key === 'Enter')) {
            var cursor_1 = copyObject(editor.getCursor());
            if (event.key === 'Enter') {
                cursor_1.line -= 1;
                var currentLine = editor.getLine(cursor_1.line);
                // Changed editor pane
                if (!currentLine)
                    return;
                cursor_1.ch = currentLine.length;
            }
            var line_1 = editor.getLine(cursor_1.line);
            this.providers.forEach(function (provider) {
                // For now only FlowProvider
                if (provider instanceof FlowProvider)
                    provider.addLastWordFrom(line_1, cursor_1.ch, tokenizer);
            });
        }
    };
    Autocomplete.prototype.scanFile = function (file, strategy) {
        var _this = this;
        var _a;
        if (strategy === void 0) { strategy = 'default'; }
        var providers = this.providers;
        (_a = file.vault) === null || _a === void 0 ? void 0 : _a.read(file).then(function (content) {
            // TODO: Make it async
            providers.forEach(function (provider) {
                if (provider instanceof FlowProvider) {
                    var tokenizer = _this.tokenizer;
                    if (strategy !== _this.tokenizerStrategy)
                        tokenizer = TokenizerFactory.getTokenizer(strategy, _this.getWordSeparatorsFrom(strategy));
                    provider.addWordsFrom(content, tokenizer);
                }
            });
        });
    };
    // TODO: Improve suggestions public API
    Autocomplete.prototype.selectLastSuggestion = function () {
        this.selected = {
            index: this.suggestions.length - 1,
            direction: 'backward',
        };
    };
    Object.defineProperty(Autocomplete.prototype, "tokenizer", {
        get: function () {
            return TokenizerFactory.getTokenizer(this.tokenizerStrategy, this.tokenizerWordSeparators);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Autocomplete.prototype, "tokenizerStrategy", {
        get: function () {
            return this.settings.flowProviderTokenizeStrategy;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Autocomplete.prototype, "tokenizerWordSeparators", {
        get: function () {
            return this.settings.flowWordSeparators[this.tokenizerStrategy];
        },
        enumerable: false,
        configurable: true
    });
    Autocomplete.prototype.getWordSeparatorsFrom = function (strategy) {
        return this.settings.flowWordSeparators[strategy];
    };
    // TODO: Create settings type
    Autocomplete.prototype.showViewIn = function (editor, completionWord, _a) {
        if (completionWord === void 0) { completionWord = ''; }
        var _b = _a === void 0 ? {
            autoSelect: true,
            showEmptyMatch: true,
        } : _a, autoSelect = _b.autoSelect, showEmptyMatch = _b.showEmptyMatch;
        this.suggestions = this.providers.reduce(function (acc, provider) { return acc.concat(provider.matchWith(completionWord || '')); }, []);
        var suggestionsLength = this.suggestions.length;
        if (!this.isShown && autoSelect && suggestionsLength === 1) {
            // Suggest automatically
            this.selected.index = 0;
            this.selectSuggestion(editor);
        }
        else if (!showEmptyMatch && suggestionsLength === 0) {
            this.removeViewFrom(editor);
        }
        else {
            if (this.view)
                this.removeViewFrom(editor);
            editor.addKeyMap(this.keyMaps);
            this.view = generateView(this.suggestions, this.selected.index);
            this.addClickListener(this.view, editor);
            appendWidget(editor, this.view);
        }
    };
    // TODO: Refactor
    Autocomplete.prototype.addClickListener = function (view, editor, add) {
        var _this = this;
        if (add === void 0) { add = true; }
        if (!this.onClickCallback)
            this.onClickCallback = function (event) {
                var element = event.target;
                var hintId = element.id;
                if (!hintId) {
                    var parent_1 = element.parentNode;
                    if (parent_1 && parent_1.id)
                        hintId = parent_1.id;
                }
                var hintIdPrefix = 'suggestion-';
                if (hintId && hintId.startsWith(hintIdPrefix)) {
                    hintId = hintId.replace(hintIdPrefix, '');
                    var id = parseInt(hintId);
                    if (id >= 0 && id < _this.suggestions.length) {
                        _this.selected.index = id;
                        _this.selectSuggestion(editor);
                    }
                }
            };
        if (add)
            view.addEventListener('click', this.onClickCallback);
        else
            view.removeEventListener('click', this.onClickCallback);
    };
    Autocomplete.prototype.selectSuggestion = function (editor) {
        var _this = this;
        var _a;
        var cursor = editor.getCursor();
        var selectedValue = (_a = this.suggestions[this.selected.index]) === null || _a === void 0 ? void 0 : _a.value;
        if (!selectedValue) {
            this.removeViewFrom(editor);
            return;
        }
        var _b = managePlaceholders(selectedValue, this.cursorAtTrigger.ch), normalizedValue = _b.normalizedValue, newCursorPosition = _b.newCursorPosition;
        editor.operation(function () {
            editor.replaceRange(normalizedValue, _this.cursorAtTrigger, cursor);
            var updatedCursor = {
                line: cursor.line,
                ch: newCursorPosition,
            };
            editor.setCursor(updatedCursor);
        });
        // Need to remove it here because of focus
        this.removeViewFrom(editor);
        editor.focus();
    };
    Autocomplete.prototype.loadProviders = function () {
        var providers = [];
        if (this.settings.flowProvider)
            providers.push(new FlowProvider());
        if (this.settings.latexProvider)
            providers.push(new LaTexProvider());
        this.providers = providers;
    };
    return Autocomplete;
}());

var AutocompleteSettings = /** @class */ (function () {
    function AutocompleteSettings() {
        this.enabled = true;
        this.autoSelect = false;
        this.autoTrigger = true;
        this.autoTriggerMinSize = 3;
        /*
         * Trigger on ctrl-p/n bindings
         */
        this.triggerLikeVim = false;
        // TODO: Refactor provider settings
        this.latexProvider = false;
        this.flowProvider = true;
        this.flowProviderScanCurrent = true;
        this.flowProviderTokenizeStrategy = 'default';
        this.flowWordSeparators = {
            default: "~?!@#$%^&*()-=+[{]}|;:' \",.<>/",
            arabic: "~?!@#$%^&*()-=+[{]}|;:' \",.<>/\u060C\u061B",
            japanese: "~?!@#$%^&*()-=+[{]}|;:' \",.<>/",
        };
    }
    return AutocompleteSettings;
}());

var AutocompleteSettingsTab = /** @class */ (function (_super) {
    __extends(AutocompleteSettingsTab, _super);
    function AutocompleteSettingsTab(app, plugin) {
        var _this = _super.call(this, app, plugin) || this;
        _this.capitalize = function (text) {
            return text.replace(/^\w/, function (c) { return c.toLocaleUpperCase(); });
        };
        _this.plugin = plugin;
        return _this;
    }
    // TODO: Refactor
    AutocompleteSettingsTab.prototype.display = function () {
        var _this = this;
        var containerEl = this.containerEl;
        containerEl.empty();
        new obsidian.Setting(containerEl)
            .setName('Enabled')
            .setDesc('Set the autocomplete state')
            .addToggle(function (cb) {
            return cb.setValue(_this.plugin.settings.enabled).onChange(function (value) {
                _this.plugin.settings.enabled = value;
                _this.plugin.saveData(_this.plugin.settings);
                _this.plugin.refresh();
            });
        });
        new obsidian.Setting(containerEl)
            .setName('Auto trigger')
            .setDesc('Trigger autocomplete on printable keystroke that are not word separators')
            .addToggle(function (cb) {
            return cb.setValue(_this.plugin.settings.autoTrigger).onChange(function (value) {
                if (_this.plugin.settings.triggerLikeVim)
                    _this.plugin.settings.triggerLikeVim = false;
                if (_this.plugin.settings.autoSelect)
                    _this.plugin.settings.autoSelect = false;
                _this.plugin.settings.autoTrigger = value;
                _this.plugin.saveData(_this.plugin.settings);
                _this.plugin.refresh();
                // Render again
                _this.display();
            });
        });
        new obsidian.Setting(containerEl)
            .setName('Auto trigger from n-th character')
            .setDesc('Trigger autocomplete only when there are at least n characters in the last word')
            .addDropdown(function (cb) {
            var options = ['1', '2', '3', '4', '5', '6', '7', '8'];
            options.forEach(function (opt) { return cb.addOption(opt, opt); });
            var minLength = String(_this.plugin.settings.autoTriggerMinSize);
            cb.setValue(minLength).onChange(function (val) {
                if (_this.plugin.settings.autoTrigger) {
                    _this.plugin.settings.autoTriggerMinSize = Number(val);
                    _this.plugin.saveData(_this.plugin.settings);
                    _this.plugin.refresh();
                }
                else {
                    new obsidian.Notice('Cannot change because Auto Trigger is not enabled.');
                    cb.setValue(minLength);
                }
            });
        });
        new obsidian.Setting(containerEl)
            .setName('Auto select')
            .setDesc('Auto select suggestion if there is only one')
            .addToggle(function (cb) {
            return cb.setValue(_this.plugin.settings.autoSelect).onChange(function (value) {
                if (_this.plugin.settings.triggerLikeVim)
                    _this.plugin.settings.triggerLikeVim = false;
                if (_this.plugin.settings.autoTrigger)
                    _this.plugin.settings.autoTrigger = false;
                _this.plugin.settings.autoSelect = value;
                _this.plugin.saveData(_this.plugin.settings);
                _this.plugin.refresh();
                // Render again
                _this.display();
            });
        });
        new obsidian.Setting(containerEl)
            .setName('Trigger like Vim autocomplete')
            .setDesc('Use CTRL-P/N bindings to trigger autocomplete. Be aware of keybinding clash on Windows (ctrl-n)')
            .addToggle(function (cb) {
            return cb.setValue(_this.plugin.settings.triggerLikeVim).onChange(function (value) {
                if (_this.plugin.settings.autoSelect)
                    _this.plugin.settings.autoSelect = false;
                if (_this.plugin.settings.autoTrigger)
                    _this.plugin.settings.autoTrigger = false;
                _this.plugin.settings.triggerLikeVim = value;
                _this.plugin.saveData(_this.plugin.settings);
                _this.plugin.refresh();
                // Render again
                _this.display();
            });
        });
        // Providers
        containerEl.createEl('h2', { text: 'Text Providers', cls: 'text-left' });
        containerEl.createEl('div', {
            text: 'The providers below suggest completions based on input. Be aware that enabling multiple providers can decrease performance',
            cls: 'setting-item-description',
        });
        new obsidian.Setting(containerEl)
            .setClass('no-border-top')
            .setName('LaTex Provider')
            .setDesc('Toggle LaTex suggestions')
            .addToggle(function (cb) {
            return cb.setValue(_this.plugin.settings.latexProvider).onChange(function (value) {
                _this.plugin.settings.latexProvider = value;
                _this.plugin.saveData(_this.plugin.settings);
                _this.plugin.refresh();
            });
        });
        new obsidian.Setting(containerEl)
            .setName('Flow Provider')
            .setDesc('Learns as you type. For now limited to current session')
            .setHeading();
        new obsidian.Setting(containerEl)
            .setClass('no-border-top')
            .setName('Enabled')
            .setDesc('Enable Flow Provider')
            .addToggle(function (cb) {
            return cb.setValue(_this.plugin.settings.flowProvider).onChange(function (value) {
                _this.plugin.settings.flowProvider = value;
                if (!value)
                    // Scan current file can be enabled only if flow provider is
                    _this.plugin.settings.flowProviderScanCurrent = false;
                _this.plugin.saveData(_this.plugin.settings);
                _this.plugin.refresh();
                // Render again
                _this.display();
            });
        });
        new obsidian.Setting(containerEl)
            .setName('Scan current file')
            .setDesc('Provides current file text suggestions. Be aware of performance issues with large files.')
            .addToggle(function (cb) {
            var settings = _this.plugin.settings;
            cb.setValue(settings.flowProvider && settings.flowProviderScanCurrent).onChange(function (value) {
                if (settings.flowProvider) {
                    _this.plugin.settings.flowProviderScanCurrent = value;
                    _this.plugin.saveData(_this.plugin.settings);
                    _this.plugin.refresh();
                }
                else if (value) {
                    // Cannot enable plugin
                    cb.setValue(false);
                    new obsidian.Notice('Cannot activate because flow provider is not enabled.');
                }
                // Render again
                _this.display();
            });
        });
        new obsidian.Setting(containerEl)
            .setName('Scan strategy')
            .setDesc('Choose the default scan strategy')
            .addDropdown(function (cb) {
            // Add options
            TOKENIZE_STRATEGIES.forEach(function (strategy) {
                cb.addOption(strategy, _this.capitalize(strategy));
            });
            var settings = _this.plugin.settings;
            cb.setValue(settings.flowProviderTokenizeStrategy).onChange(function (value) {
                if (settings.flowProvider) {
                    _this.plugin.settings.flowProviderTokenizeStrategy = value;
                    _this.plugin.saveData(_this.plugin.settings);
                    _this.plugin.refresh();
                }
                else {
                    new obsidian.Notice('Cannot change because flow provider is not enabled.');
                    cb.setValue(settings.flowProviderTokenizeStrategy);
                }
            });
        });
        new obsidian.Setting(containerEl)
            .setName('Word separators')
            .setDesc('Change word separators to personalize the autocomplete suggestions');
        var settings = this.plugin.settings;
        var wordSeparators = settings.flowWordSeparators;
        var strategies = Object.keys(wordSeparators);
        strategies.forEach(function (strategy, index) {
            var separators = wordSeparators[strategy];
            var setting = new obsidian.Setting(containerEl).setName(_this.capitalize(strategy));
            if (index === 1)
                setting.setClass('no-border-top');
            if (strategy === 'japanese')
                setting.setDesc('Used only to remove from suggestions. Word separation is done by Tokenizer');
            setting.addText(function (cb) {
                cb.setValue(separators).onChange(function (value) {
                    if (settings.flowProvider) {
                        settings.flowWordSeparators[strategy] = value;
                        _this.plugin.saveData(settings);
                        _this.plugin.refresh();
                    }
                    else {
                        new obsidian.Notice('Cannot change because flow provider is not enabled.');
                        cb.setValue(separators);
                    }
                });
            });
        });
    };
    return AutocompleteSettingsTab;
}(obsidian.PluginSettingTab));

var StatusBarView = /** @class */ (function () {
    function StatusBarView(plugin, settings) {
        var _this = this;
        this.onStatusBarClick = function () {
            var currentStrategy = _this.settings.flowProviderTokenizeStrategy;
            var currentIndex = TOKENIZE_STRATEGIES.findIndex(function (strategy) { return strategy === currentStrategy; });
            var newStrategy = currentIndex === TOKENIZE_STRATEGIES.length - 1
                ? TOKENIZE_STRATEGIES[0]
                : TOKENIZE_STRATEGIES[currentIndex + 1];
            _this.settings.flowProviderTokenizeStrategy = newStrategy;
            _this.plugin.saveData(_this.settings);
            _this.statusBar.innerHTML = _this.getStatusBarText(newStrategy);
        };
        this.plugin = plugin;
        this.settings = settings;
    }
    StatusBarView.prototype.addStatusBar = function () {
        if (!this.settings.flowProvider)
            return;
        var statusBar = this.plugin.addStatusBarItem();
        statusBar.addClass('mod-clickable');
        statusBar.innerHTML = this.getStatusBarText(this.settings.flowProviderTokenizeStrategy);
        statusBar.addEventListener('click', this.onStatusBarClick);
        this.statusBar = statusBar;
    };
    StatusBarView.prototype.removeStatusBar = function () {
        if (!this.statusBar)
            return;
        this.statusBar.removeEventListener('click', this.onStatusBarClick);
        this.statusBar.remove();
    };
    StatusBarView.prototype.getStatusBarText = function (strategy) {
        return "strategy: " + strategy;
    };
    return StatusBarView;
}());

var AutocompletePlugin = /** @class */ (function (_super) {
    __extends(AutocompletePlugin, _super);
    function AutocompletePlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /*
         * Listener used to trigger autocomplete
         * It intercepts inputs that could change the current line (e.g. ctrl+n)
         */
        _this.keyDownListener = function (editor, event) {
            var autocomplete = _this.autocomplete;
            var settings = _this.settings;
            var autoSelect = settings.autoSelect;
            if (autocomplete.isShown &&
                autocomplete.tokenizer.isWordSeparator(event.key)) {
                _this.autocomplete.removeViewFrom(editor);
                return;
            }
            else if (autocomplete.isShown)
                return;
            // Trigger like Vim autocomplete (ctrl+p/n)
            if (isVimTrigger({
                triggerLikeVim: settings.triggerLikeVim,
                editor: editor,
                event: event,
            })) {
                _this.justTriggeredBy = 'vim';
                autocomplete.toggleViewIn(editor, {
                    autoSelect: autoSelect,
                    showEmptyMatch: !settings.autoTrigger,
                });
                if (event.key === 'p')
                    autocomplete.selectLastSuggestion();
            }
            else if (isAutoTrigger(editor, event, autocomplete.tokenizer, settings)) {
                _this.justTriggeredBy = 'autotrigger';
                autocomplete.toggleViewIn(editor, {
                    autoSelect: autoSelect,
                    showEmptyMatch: !settings.autoTrigger,
                });
            }
        };
        /*
         * Listener used to scan current word
         * Updates autocomplete results
         */
        _this.keyUpListener = function (editor, event) {
            var autocomplete = _this.autocomplete;
            autocomplete.updateProvidersFrom(event, editor);
            if (!autocomplete.isShown)
                return;
            _this.updateEditorIfChanged(editor, autocomplete);
            var settings = _this.settings;
            var updateSelected = true;
            if (isVimTrigger({
                triggerLikeVim: settings.triggerLikeVim,
                editor: editor,
                event: event,
            }) &&
                _this.justTriggeredBy === 'vim') {
                // Do not update selected when there is vim trigger
                updateSelected = false;
            }
            if (_this.justTriggeredBy !== 'autotrigger')
                autocomplete.updateViewIn(editor, event, {
                    updateSelected: updateSelected,
                    autoSelect: settings.autoSelect,
                    showEmptyMatch: !settings.autoTrigger,
                });
            if (_this.justTriggeredBy)
                _this.justTriggeredBy = undefined;
        };
        return _this;
    }
    AutocompletePlugin.prototype.onload = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        console.log('Loading Autocomplete plugin.');
                        _a = this;
                        _c = (_b = Object).assign;
                        _d = [new AutocompleteSettings()];
                        return [4 /*yield*/, this.loadData()];
                    case 1:
                        _a.settings = _c.apply(_b, _d.concat([_e.sent()]));
                        this.addSettingTab(new AutocompleteSettingsTab(this.app, this));
                        if (!this.settings.enabled)
                            return [2 /*return*/];
                        this.statusBar = new StatusBarView(this, this.settings);
                        this.enable();
                        this.addCommands();
                        return [2 /*return*/];
                }
            });
        });
    };
    AutocompletePlugin.prototype.onunload = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log('Unloaded Obsidian Autocomplete');
                this.disable();
                return [2 /*return*/];
            });
        });
    };
    AutocompletePlugin.prototype.refresh = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.disable();
                this.enable();
                return [2 /*return*/];
            });
        });
    };
    AutocompletePlugin.prototype.addCommands = function () {
        var _this = this;
        this.addCommand({
            id: 'autocomplete-toggle',
            name: 'Toggle Autocomplete',
            hotkeys: [
                {
                    modifiers: ['Ctrl'],
                    key: ' ',
                },
            ],
            callback: function () {
                var autocomplete = _this.autocomplete;
                var editor = _this.getValidEditorFor(autocomplete);
                if (editor) {
                    // Do not open on vim normal mode
                    if (isVimNormalMode(editor))
                        return;
                    autocomplete.toggleViewIn(editor);
                }
            },
        });
        this.addScanCommands();
    };
    AutocompletePlugin.prototype.enable = function () {
        var _this = this;
        this.autocomplete = new Autocomplete(this.settings);
        this.justTriggeredBy = undefined;
        var settings = this.settings;
        if (settings.flowProvider)
            this.statusBar.addStatusBar();
        if (settings.flowProviderScanCurrent) {
            this.app.workspace.on('file-open', this.onFileOpened, this);
            if (this.app.workspace.layoutReady)
                this.onLayoutReady();
            this.app.workspace.on('layout-ready', this.onLayoutReady, this);
        }
        this.registerCodeMirror(function (editor) {
            editor.on('keydown', _this.keyDownListener);
            editor.on('keyup', _this.keyUpListener);
        });
    };
    AutocompletePlugin.prototype.disable = function () {
        var _this = this;
        var workspace = this.app.workspace;
        // Always remove to avoid any kind problem
        workspace.off('file-open', this.onFileOpened);
        workspace.off('layout-ready', this.onLayoutReady);
        this.statusBar.removeStatusBar();
        workspace.iterateCodeMirrors(function (cm) {
            cm.off('keyup', _this.keyUpListener);
            cm.off('keydown', _this.keyDownListener);
            _this.autocomplete.removeViewFrom(cm);
        });
    };
    AutocompletePlugin.prototype.addScanCommands = function () {
        var _this = this;
        TOKENIZE_STRATEGIES.forEach(function (type) {
            var capitalized = type.replace(/^\w/, function (c) { return c.toLocaleUpperCase(); });
            var name = "Scan current file " + (type !== 'default' ? "(" + capitalized + ")" : '');
            _this.addCommand({
                id: "autocomplete-scan-current-file-" + type,
                name: name,
                callback: function () {
                    if (!_this.settings.flowProviderScanCurrent) {
                        new obsidian.Notice('Please activate setting flow Provider: Scan current file');
                    }
                    var autocomplete = _this.autocomplete;
                    var editor = _this.getValidEditorFor(autocomplete);
                    if (editor) {
                        var file = _this.app.workspace.getActiveFile();
                        autocomplete.scanFile(file, type);
                    }
                },
            });
        });
    };
    AutocompletePlugin.prototype.onLayoutReady = function () {
        var file = this.app.workspace.getActiveFile();
        if (file)
            this.autocomplete.scanFile(file);
    };
    AutocompletePlugin.prototype.onFileOpened = function (file) {
        if (file)
            this.autocomplete.scanFile(file);
    };
    AutocompletePlugin.prototype.getValidEditorFor = function (autocomplete) {
        var currentEditor = this.getCurrentEditor();
        if (currentEditor)
            this.updateEditorIfChanged(currentEditor, autocomplete);
        return currentEditor;
    };
    AutocompletePlugin.prototype.updateEditorIfChanged = function (editor, autocomplete) {
        if (!this.lastUsedEditor)
            this.lastUsedEditor = editor;
        if (editor !== this.lastUsedEditor) {
            autocomplete.removeViewFrom(this.lastUsedEditor);
            this.lastUsedEditor = editor;
        }
    };
    AutocompletePlugin.prototype.getCurrentEditor = function () {
        var view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
        return view ? view.sourceMode.cmEditor : null;
    };
    return AutocompletePlugin;
}(obsidian.Plugin));

module.exports = AutocompletePlugin;


/* nosourcemap */
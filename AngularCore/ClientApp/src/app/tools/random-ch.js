"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var iconv = require("iconv-lite");
var buffer_1 = require("buffer");
var RandomChar = /** @class */ (function () {
    function RandomChar() {
    }
    RandomChar.prototype.range = function (MAX, MIN) {
        if (MAX === void 0) { MAX = 0x9fff; }
        if (MIN === void 0) { MIN = 0x4e00; }
        var DIFF = MAX - MIN;
        return parseInt((Math.random() * DIFF).toFixed(0)) + MIN;
    };
    RandomChar.prototype.getGB2312 = function () {
        var HMAX = 0xf7;
        var HMIN = 0xb0;
        var LMAX = 0xfe;
        var LMIN = 0xa1;
        var high = this.range(HMAX, HMIN);
        var low = this.range(LMAX, LMIN);
        return [high, low];
    };
    RandomChar.prototype.simplified = function () {
        var gb = this.getGB2312();
        return iconv.decode(new buffer_1.Buffer(gb), "GB2312");
    };
    RandomChar.prototype.all = function () {
        return String.fromCharCode(this.range());
    };
    return RandomChar;
}());
exports.RandomChar = RandomChar;
//# sourceMappingURL=random-ch.js.map
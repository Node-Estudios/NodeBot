"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Queue = /** @class */ (function (_super) {
    __extends(Queue, _super);
    function Queue() {
        var _this = _super.call(this) || this;
        _this.current = null;
        _this.previous = null;
        return _this;
    }
    Queue.prototype.add = function (track, index) {
        if (!this.current) {
            this.current = track;
        }
        else if (typeof index === 'undefined' && typeof index !== 'number') {
            this.push(track);
        }
        else {
            this.splice(index, 0, track);
        }
    };
    Queue.prototype.remove = function (index) {
        this.splice(index, 1);
    };
    Queue.prototype.clear = function () {
        this.splice(0);
    };
    Queue.prototype.shuffle = function () {
        var _a;
        for (var i = this.length - 1; i > 0; i--) {
            var n = Math.floor(Math.random() * (i + 1));
            _a = [this[n], this[i]], this[i] = _a[0], this[n] = _a[1];
        }
    };
    Queue.prototype.totalSize = function () {
        return this.length + (this.current ? 1 : 0);
    };
    return Queue;
}(Array));
exports["default"] = Queue;

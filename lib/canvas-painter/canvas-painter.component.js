"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var CanvasPainterComponent = (function () {
    function CanvasPainterComponent() {
        var _this = this;
        this.canvasWidth = 600;
        this.canvasHeight = 600;
        this.color = "#000000";
        this.lineWidth = 10;
        this.cacheSize = 10;
        this.clipBounds = { x: 0, y: 0, width: 0, height: 0 };
        this.paintStart = new core_1.EventEmitter();
        this.paintEnd = new core_1.EventEmitter();
        this.undoLength = new core_1.EventEmitter();
        this.redoLength = new core_1.EventEmitter();
        this.isEmpty = new core_1.EventEmitter();
        this._undoCache = [];
        this._redoCache = [];
        this._deletedFromUndoCache = false;
        this._isEmpty = true;
        this._point = { x: 0, y: 0 };
        this._ppts = [];
        this._downHandler = function (e) { _this.mousedown(); };
        this._moveHandler = function (e) { _this.paint(e); };
        this._upHandler = function (e) { _this.mouseup(); };
        this._paintStartHandler = function (e) { _this.startTmpImage(e); };
        this._paintEndHandler = function (e) { _this.copyTmpImage(); };
        this._enterHandler = function (e) { _this.mouseenter(e); };
        this._leaveHandler = function (e) { _this.mouseleave(e); };
    }
    CanvasPainterComponent.prototype.ngOnInit = function () {
        this._isTouch = !!('ontouchstart' in window);
        this.PAINT_START = this._isTouch ? 'touchstart' : 'mousedown';
        this.PAINT_MOVE = this._isTouch ? 'touchmove' : 'mousemove';
        this.PAINT_END = this._isTouch ? 'touchend' : 'mouseup';
        this._ctx = this.canvas.nativeElement.getContext('2d');
        this._ctxDynamic = this.canvasDynamic.nativeElement.getContext('2d');
        this.initListeners();
        this.undoLength.emit(0);
        this.redoLength.emit(0);
        this.isEmpty.emit(true);
    };
    CanvasPainterComponent.prototype.undo = function () {
        if (this._undoCache.length > 0) {
            this._redoCache.push(this._ctx.getImageData(0, 0, this.canvasDynamic.nativeElement.width, this.canvasDynamic.nativeElement.height));
            this._ctx.putImageData(this._undoCache.pop(), 0, 0);
            this.undoLength.emit(this._undoCache.length);
            this.redoLength.emit(this._redoCache.length);
            if (!this._deletedFromUndoCache && !this._undoCache.length) {
                this.setIsEmpty(true);
            }
        }
    };
    CanvasPainterComponent.prototype.redo = function () {
        if (this._redoCache.length > 0) {
            this._undoCache.push(this._ctx.getImageData(0, 0, this.canvasDynamic.nativeElement.width, this.canvasDynamic.nativeElement.height));
            this._ctx.putImageData(this._redoCache.pop(), 0, 0);
            this.undoLength.emit(this._undoCache.length);
            this.redoLength.emit(this._redoCache.length);
            this.setIsEmpty(false);
        }
    };
    CanvasPainterComponent.prototype.wipe = function () {
        this._ctx.clearRect(0, 0, this.canvasDynamic.nativeElement.width, this.canvasDynamic.nativeElement.height);
        this._ctxDynamic.clearRect(0, 0, this.canvasDynamic.nativeElement.width, this.canvasDynamic.nativeElement.height);
        if (this._undoCache.length > 0) {
            this._undoCache.splice(0, this._undoCache.length);
            this.undoLength.emit(0);
        }
        this.setIsEmpty(true);
        this._deletedFromUndoCache = false;
        if (this._redoCache.length > 0) {
            this._redoCache.splice(0, this._redoCache.length);
            this.redoLength.emit(0);
        }
    };
    CanvasPainterComponent.prototype.getImageData = function () {
        return this.canvas.nativeElement.toDataURL();
    };
    CanvasPainterComponent.prototype.getOffset = function (elem) {
        var bbox = elem.getBoundingClientRect();
        return {
            left: bbox.left,
            top: bbox.top
        };
    };
    ;
    CanvasPainterComponent.prototype.initListeners = function () {
        this.canvasDynamic.nativeElement.addEventListener(this.PAINT_START, this._paintStartHandler, false);
        this.canvasDynamic.nativeElement.addEventListener(this.PAINT_END, this._paintEndHandler, false);
        if (!this._isTouch) {
            document.body.addEventListener('mousedown', this._downHandler);
            document.body.addEventListener('mouseup', this._upHandler);
            //scope.$on('$destroy', removeEventListeners);
            this.canvasDynamic.nativeElement.addEventListener('mouseenter', this._enterHandler);
            this.canvasDynamic.nativeElement.addEventListener('mouseleave', this._leaveHandler);
        }
    };
    CanvasPainterComponent.prototype.removeEventListeners = function () {
        document.body.removeEventListener('mousedown', this._downHandler);
        document.body.removeEventListener('mouseup', this._upHandler);
    };
    CanvasPainterComponent.prototype.copyTmpImage = function () {
        this._undoCache.push(this._ctx.getImageData(0, 0, this.canvasDynamic.nativeElement.width, this.canvasDynamic.nativeElement.height));
        if (this._undoCache.length > this.cacheSize) {
            this._undoCache = this._undoCache.slice(-1 * this.cacheSize);
            this._deletedFromUndoCache = true;
        }
        else {
            this.undoLength.emit(this._undoCache.length);
        }
        this.setIsEmpty(false);
        if (this._redoCache.length) {
            this._redoCache.splice(0, this._redoCache.length);
            this.redoLength.emit(0);
        }
        this._ctxDynamic.restore();
        this.canvasDynamic.nativeElement.removeEventListener(this.PAINT_MOVE, this._moveHandler, false);
        this._ctx.drawImage(this.canvasDynamic.nativeElement, 0, 0);
        this._ctxDynamic.clearRect(0, 0, this.canvasDynamic.nativeElement.width, this.canvasDynamic.nativeElement.height);
        this._ppts = [];
        this.paintEnd.emit();
    };
    ;
    CanvasPainterComponent.prototype.startTmpImage = function (e) {
        e.preventDefault();
        this.paintStart.emit();
        this.canvasDynamic.nativeElement.addEventListener(this.PAINT_MOVE, this._moveHandler, false);
        this.setPointFromEvent(this._point, e);
        this._ppts.push({
            x: this._point.x,
            y: this._point.y
        });
        this._ppts.push({
            x: this._point.x,
            y: this._point.y
        });
        this.paint(e);
    };
    ;
    CanvasPainterComponent.prototype.setPointFromEvent = function (point, e) {
        if (this._isTouch) {
            point.x = e.changedTouches[0].pageX - this.getOffset(e.target).left;
            point.y = e.changedTouches[0].pageY - this.getOffset(e.target).top;
        }
        else {
            point.x = e.offsetX !== undefined ? e.offsetX : e.layerX;
            point.y = e.offsetY !== undefined ? e.offsetY : e.layerY;
        }
    };
    ;
    CanvasPainterComponent.prototype.paint = function (e) {
        if (e) {
            e.preventDefault();
            this.setPointFromEvent(this._point, e);
        }
        // Saving all the points in an array
        this._ppts.push({
            x: this._point.x,
            y: this._point.y
        });
        if (this._ppts.length === 3) {
            var b = this._ppts[0];
            this._ctxDynamic.lineJoin = this._ctxDynamic.lineCap = 'round';
            this._ctxDynamic.fillStyle = this.color;
            this._ctxDynamic.save();
            this.clip();
            this._ctxDynamic.beginPath();
            this._ctxDynamic.arc(b.x, b.y, this._ctxDynamic.lineWidth / 2, 0, Math.PI * 2, !0);
            this._ctxDynamic.fill();
            this._ctxDynamic.closePath();
            this._ctxDynamic.restore();
            return;
        }
        // Tmp canvas is always cleared up before drawing.
        this._ctxDynamic.clearRect(0, 0, "this.canvasDynamic.nativeElement.width", this.canvasDynamic.nativeElement.height);
        this._ctxDynamic.save();
        this.clip();
        this._ctxDynamic.beginPath();
        this._ctxDynamic.moveTo(this._ppts[0].x, this._ppts[0].y);
        for (var i = 1; i < this._ppts.length - 2; i++) {
            var c = (this._ppts[i].x + this._ppts[i + 1].x) / 2;
            var d = (this._ppts[i].y + this._ppts[i + 1].y) / 2;
            this._ctxDynamic.quadraticCurveTo(this._ppts[i].x, this._ppts[i].y, c, d);
        }
        // For the last 2 points
        this._ctxDynamic.quadraticCurveTo(this._ppts[i].x, this._ppts[i].y, this._ppts[i + 1].x, this._ppts[i + 1].y);
        this._ctxDynamic.lineJoin = this._ctxDynamic.lineCap = 'round';
        this._ctxDynamic.lineWidth = this.lineWidth;
        this._ctxDynamic.strokeStyle = this.color;
        this._ctxDynamic.stroke();
        this._ctxDynamic.restore();
    };
    ;
    CanvasPainterComponent.prototype.clip = function () {
        if (this.clipBounds && null != this.clipBounds &&
            this.clipBounds.x >= 0 && this.clipBounds.y >= 0 &&
            this.clipBounds.width > 0 && this.clipBounds.height > 0) {
            this._ctxDynamic.beginPath();
            this._ctxDynamic.rect(this.clipBounds.x, this.clipBounds.y, this.clipBounds.width, this.clipBounds.height);
            this._ctxDynamic.clip();
        }
    };
    CanvasPainterComponent.prototype.mousedown = function () {
        this._mouseDown = true;
    };
    CanvasPainterComponent.prototype.mouseup = function () {
        this._mouseDown = false;
    };
    CanvasPainterComponent.prototype.mouseenter = function (e) {
        // If the mouse is down when it enters the canvas, start a path
        if (this._mouseDown) {
            this.startTmpImage(e);
        }
    };
    CanvasPainterComponent.prototype.mouseleave = function (e) {
        // If the mouse is down when it leaves the canvas, end the path
        if (this._mouseDown) {
            this.copyTmpImage();
        }
    };
    CanvasPainterComponent.prototype.setIsEmpty = function (isEmpty) {
        if (this._isEmpty !== isEmpty) {
            this.isEmpty.emit(isEmpty);
            this._isEmpty = isEmpty;
        }
    };
    return CanvasPainterComponent;
}());
CanvasPainterComponent.decorators = [
    { type: core_1.Component, args: [{
                selector: 'canvas-painter',
                template: "\n    <canvas id=\"static\" #canvas [width]=\"canvasWidth\" [height]=\"canvasHeight\"></canvas>\n    <canvas id=\"dynamic\" #canvasDynamic [width]=\"canvasWidth\" [height]=\"canvasHeight\"></canvas>\n  ",
                styles: ["\n    canvas {\n        position: absolute;\n        background-color: transparent;\n\n    \n    }\n\n    canvas#static {\n        z-index: 0;\n    }\n\n    canvas#dynamic {\n        z-index: 1;\n    }\n  "]
            },] },
];
/** @nocollapse */
CanvasPainterComponent.ctorParameters = function () { return []; };
CanvasPainterComponent.propDecorators = {
    'canvas': [{ type: core_1.ViewChild, args: ['canvas',] },],
    'canvasDynamic': [{ type: core_1.ViewChild, args: ['canvasDynamic',] },],
    'canvasWidth': [{ type: core_1.Input },],
    'canvasHeight': [{ type: core_1.Input },],
    'color': [{ type: core_1.Input },],
    'lineWidth': [{ type: core_1.Input },],
    'cacheSize': [{ type: core_1.Input },],
    'clipBounds': [{ type: core_1.Input },],
    'paintStart': [{ type: core_1.Output },],
    'paintEnd': [{ type: core_1.Output },],
    'undoLength': [{ type: core_1.Output },],
    'redoLength': [{ type: core_1.Output },],
    'isEmpty': [{ type: core_1.Output },],
};
exports.CanvasPainterComponent = CanvasPainterComponent;
//# sourceMappingURL=canvas-painter.component.js.map
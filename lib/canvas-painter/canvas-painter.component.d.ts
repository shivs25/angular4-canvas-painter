import { OnInit, ElementRef, EventEmitter } from '@angular/core';
export declare class CanvasPainterComponent implements OnInit {
    private PAINT_START;
    private PAINT_MOVE;
    private PAINT_END;
    canvas: ElementRef;
    canvasDynamic: ElementRef;
    canvasWidth: number;
    canvasHeight: number;
    color: string;
    lineWidth: number;
    cacheSize: number;
    clipBounds: any;
    paintStart: EventEmitter<void>;
    paintEnd: EventEmitter<void>;
    undoLength: EventEmitter<number>;
    redoLength: EventEmitter<number>;
    isEmpty: EventEmitter<boolean>;
    private _isTouch;
    private _mouseDown;
    private _undoCache;
    private _redoCache;
    private _deletedFromUndoCache;
    private _isEmpty;
    private _point;
    private _ppts;
    private _ctx;
    private _ctxDynamic;
    constructor();
    ngOnInit(): void;
    undo(): void;
    redo(): void;
    wipe(): void;
    getImageData(): string;
    private getOffset(elem);
    private initListeners();
    private removeEventListeners();
    private copyTmpImage();
    private startTmpImage(e);
    private setPointFromEvent(point, e);
    private paint(e);
    private _downHandler;
    private _moveHandler;
    private _upHandler;
    private _paintStartHandler;
    private _paintEndHandler;
    private _enterHandler;
    private _leaveHandler;
    private clip();
    private mousedown();
    private mouseup();
    private mouseenter(e);
    private mouseleave(e);
    private setIsEmpty(isEmpty);
}

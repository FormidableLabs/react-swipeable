import * as React from "react";
export declare type HandledEvents = React.MouseEvent | TouchEvent | MouseEvent;
export declare type Vector2 = [number, number];
export declare type EventData = {
    event: HandledEvents;
    deltaX: number;
    deltaY: number;
    absX: number;
    absY: number;
    first: boolean;
    initial: Vector2;
    velocity: number;
    dir: "Left" | "Right" | "Up" | "Down";
};
export declare type SwipeCallback = (eventData: EventData) => void;
export interface SwipeableOptions {
    onSwiped?: SwipeCallback;
    onSwipedLeft?: SwipeCallback;
    onSwipedRight?: SwipeCallback;
    onSwipedUp?: SwipeCallback;
    onSwipedDown?: SwipeCallback;
    onSwiping?: SwipeCallback;
    delta?: number;
    preventDefaultTouchmoveEvent?: boolean;
    trackTouch?: boolean;
    trackMouse?: boolean;
    rotationAngle?: number;
}
export interface SwipeableHandlers {
    ref(element: HTMLElement | null): void;
    onMouseDown?(event: React.MouseEvent): void;
}
export declare const LEFT = "Left";
export declare const RIGHT = "Right";
export declare const UP = "Up";
export declare const DOWN = "Down";
export declare function useSwipeable(options: SwipeableOptions): SwipeableHandlers;

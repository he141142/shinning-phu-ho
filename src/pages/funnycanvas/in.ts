import { MutableRefObject } from "react";

export enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

export interface Point {
  x: number;
  y: number;
}

export interface Point3D extends Point {
  z: number;
}

export interface IFrame {
  width: number;
  height: number;
  ctx: CanvasRenderingContext2D;
  frameCount: number;

  isMouseCursorEnabled: boolean;

  UpdateFrameCount(fn: (frame: IFrame) => number): void;

  FillRect(): void;
  ClearRect(): void;
  FillStyle(color: string): void;
  BeginPath(): void;
  RenderCircle(circle: CircleProps): void;

  AdaptMouseCursor(adapter: MouseAdapter): void;
}

export interface IFrameBuilder {
  WithCtx(ctx: CanvasRenderingContext2D): IFrameBuilder;
  WithWidth(width: number): IFrameBuilder;
  WithHeight(height: number): IFrameBuilder;
  Build(): IFrame;
}

export class FrameBuilder implements IFrameBuilder {
  private ctx: CanvasRenderingContext2D = {} as CanvasRenderingContext2D;
  private width: number = 0;
  private height: number = 0;

  WithCtx(ctx: CanvasRenderingContext2D): IFrameBuilder {
    this.ctx = ctx;
    return this;
  }

  WithWidth(width: number): IFrameBuilder {
    this.width = width;
    return this;
  }

  WithHeight(height: number): IFrameBuilder {
    this.height = height;
    return this;
  }

  Build(): IFrame {
    return new Frame(this.width, this.height, this.ctx);
  }
}

class Frame implements IFrame {
  width: number = 0;
  height: number = 0;
  ctx: CanvasRenderingContext2D = {} as CanvasRenderingContext2D;
  frameCount: number = 0;
  isMouseCursorEnabled: boolean = false;
  mouseAdapter: MouseAdapter = {} as MouseAdapter;

  constructor(width: number, height: number, ctx: CanvasRenderingContext2D) {
    this.width = width;
    this.height = height;
    this.ctx = ctx;
  }

  FillRect() {
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  UpdateFrameCount(fn: (frame: IFrame) => number) {
    this.frameCount = fn(this);
  }

  ClearRect() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  FillStyle(color: string) {
    this.ctx.fillStyle = color;
  }

  BeginPath() {
    this.ctx.beginPath();
  }

  setColor = (ctx: CanvasRenderingContext2D, color: string) => {
    ctx.fillStyle = color;
  };

  RenderCircle(circle: CircleProps) {
    this.ctx.beginPath();

    if (this.isMouseCursorEnabled) {
      this.mouseAdapter.cursorEffect.ApplyEffect();
      circle.startX = this.mouseAdapter.cursorEffect.circle.x;
      circle.startY = this.mouseAdapter.cursorEffect.circle.y;
    }

    this.ctx.arc(
      circle.startX,
      circle.startY,
      10 * Math.sin(this.frameCount * 0.05) ** 2,
      0,
      2 * Math.PI
    );
    this.ctx.fill();
  }

  AdaptMouseCursor(mouseAdapter: MouseAdapter) {
    this.isMouseCursorEnabled = true;
    this.mouseAdapter = mouseAdapter;
  }
}

class CircleProps {
  startX: number = 0;
  startY: number = 0;
  radius: number = 0;
  color: string = "#000000";

  constructor(startX: number, startY: number, radius: number, color: string) {
    this.startX = startX;
    this.startY = startY;
    this.radius = radius;
    this.color = color;
  }
};

export { CircleProps, Frame };

export interface MouseCursorEffect {
  mousePos: MutableRefObject<Point>;
  circle: Point;
  ApplyEffect(): void;

  MakeChangeCircle(c: CircleProps): void;
};

export class MouseCursorEffectNone implements MouseCursorEffect {
  mousePos: MutableRefObject<Point> = {} as MutableRefObject<Point>;

  circle: Point = { x: 0, y: 0 };
  ApplyEffect() {
    console.log("No effect applied");
  }

  MakeChangeCircle(c: CircleProps) {
    c.startX = this.circle.x;
    c.startY = this.circle.y;
  }
};

export class MouseCursorEffectChase implements MouseCursorEffect {
  mousePos: MutableRefObject<Point> = {} as MutableRefObject<Point>;
  circle: Point = { x: 0, y: 0 };
  speed: number = 0;

  constructor(mousePos: MutableRefObject<Point>, circle: Point, speed: number) {
    this.mousePos = mousePos;
    this.circle = circle;
    this.speed = speed;
  }

  MakeChangeCircle(c: CircleProps) {
    c.startX = this.circle.x;
    c.startY = this.circle.y;
  }

  chaseMouse = (speed: number) => {
    let dx = this.mousePos.current.x - this.circle.x;
    let dy = this.mousePos.current.y - this.circle.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance > 1) {
      this.circle.x += (dx / distance) * speed;
      this.circle.y += (dy / distance) * speed;
    }
  };

  isCollisionMatch = (offset: number) => {
    return (
      Math.abs(this.circle.x - this.mousePos.current.x) < offset &&
      Math.abs(this.circle.y - this.mousePos.current.y) < offset
    );
  };

  ApplyEffect() {
    this.chaseMouse(this.speed);
  }
};

export class MouseAdapter {
  cursorEffect: MouseCursorEffect = {} as MouseCursorEffect;
  constructor(cursorEffect: MouseCursorEffect) {
    this.cursorEffect = cursorEffect;
  }
};
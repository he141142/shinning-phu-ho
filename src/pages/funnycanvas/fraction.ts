import { Direction } from "framer-motion";
import { Point } from "./in";

export class CanvasContainer {
  Fractions: Fraction[] = [];
  frameCountEachMove = 10;
  addFraction(f: Fraction) {
    this.Fractions.push(f);
  }

  rednerRandomFraction = (
    ctx: CanvasRenderingContext2D,
    numOfFractions: number
  ) => {
    for (let i = 0; i < numOfFractions; i++) {
      this.addFraction(
        new Fraction(
          Math.random() * 500,
          Math.random() * 500,
          Math.random() + 1.2 * 10
        )
      );
    }

    let n = Math.random() * this.Fractions.length - 1;

    let randomFrac =
      this.Fractions[Math.floor(Math.random() * this.Fractions.length)];

    this.Fractions.forEach((f) => {
      f.connectedFractions.push(randomFrac);
    });
  };

  draw = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.beginPath();
    ctx.fillStyle = "black";

    this.Fractions.forEach((f) => {
      ctx.fillRect(f.x, f.y, f.size, f.size);
    });
  };

  update = () => {
    this.frameCountEachMove++;
    if (this.frameCountEachMove === 1000) {
      this.frameCountEachMove = 0;
    }

    this.Fractions.forEach((f, i) => {
      let prevFractions = this.Fractions.slice(0, i);
      f.memoPrevFractions(prevFractions);
      f.updateWithFrame(this.frameCountEachMove);
    });
  };
}

enum DIRECTTION {
  UP = 0,
  DOWN = 1,
  LEFT = 2,
  RIGHT = 3,
}

export class Fraction {
  connectedFractions: Fraction[] = [];

  otherFractions: Fraction[] = [];

  x: number = 0;
  y: number = 0;
  size = 10;
  step = 1;

  vx = Math.random() * 2 - 1;
  vy = Math.random() * 2 - 1;

  directions = [
    DIRECTTION.UP,
    DIRECTTION.DOWN,
    DIRECTTION.LEFT,
    DIRECTTION.RIGHT,
  ];

  directtionsX = [DIRECTTION.LEFT, DIRECTTION.RIGHT];
  directtionsY = [DIRECTTION.UP, DIRECTTION.DOWN];

  stayX: boolean = Math.random() > 0.5;
  stayY: boolean = Math.random() > 0.5;

  direct: Record<DIRECTTION, Point> = {
    [DIRECTTION.UP]: { x: 0, y: -1 },
    [DIRECTTION.DOWN]: { x: 0, y: 1 },
    [DIRECTTION.LEFT]: { x: -1, y: 0 },
    [DIRECTTION.RIGHT]: { x: 1, y: 0 },
  };

  direction = this.directions[Math.floor(Math.random() * 4)];

  directX: DIRECTTION = this.directtionsX[Math.floor(Math.random() * 2)];
  directY: DIRECTTION = this.directtionsY[Math.floor(Math.random() * 2)];

  prevDirection: DIRECTTION = this.direction;
  stepForEachMove = 10;
  currStep = 0;

  constructor(x: number, y: number, size: number) {
    this.x = x;
    this.y = y;
    this.size = size;
  }

  update() {
    if (this.isEndFrame()) {
      this.changeDirection();
      this.updateXYByCurrDirection();
      this.currStep = 0;
      return;
    }

    this.updateXYByCurrDirection();
    this.currStep++;

    return;
  }

  // updateXYByCurrDirection = () => {
  //   let currDirection = this.getCurrDirection();
  //   this.x += currDirection.x * this.step;
  //   this.y += currDirection.y * this.step;
  //   // if (this.x < 0 || this.x > 700 || this.y < 0 || this.y > 700) {
  //   //   this.changeDirection();
  //   //   this.updateXYByCurrDirection();
  //   // }
  //   this.x = Math.max(0, Math.min(this.x, 700));
  //   this.y = Math.max(0, Math.min(this.y, 700));
  // };
  findCollision = (offset: number): Fraction | null => {
    return this.otherFractions.find((f) => {
      return (
        Math.abs(f.x - this.x) < offset &&
        Math.abs(f.y - this.y) < offset
      );
    }) || null;
  };
  
  updateXYByCurrDirection = () => {
    let currDirection = this.getCurrDirection();
    let nextX = this.x + currDirection.x * this.step;
    let nextY = this.y + currDirection.y * this.step;
  
    // Check for collision before moving
    let collision = this.findCollision(10);
    if (collision) {
      // Pick a new random direction to avoid collision
      this.changeDirection();
      return;
    }
  
    // Move if no collision detected
    this.x = nextX;
    this.y = nextY;
  
    // Ensure the object stays within bounds
    this.x = Math.max(0, Math.min(this.x, 700));
    this.y = Math.max(0, Math.min(this.y, 700));
  };

  isCollisionMatch = (offset: number) => {
    return (
      this.otherFractions.filter((f) => {
        return (
          Math.abs(f.x - this.x) < offset && Math.abs(f.y - this.y) < offset
        );
      }).length > 0
    );
  };

  isEndFrame = (): boolean => {
    return this.currStep === this.stepForEachMove;
  };

  // changeDirection = () => {
  //   this.direction = this.directions[Math.floor(Math.random() * 4)];
  // };

  changeDirection = () => {
    let newDirection;
    do {
      newDirection = this.directions[Math.floor(Math.random() * this.directions.length)];
    } while (newDirection === this.direction); // Avoid same direction twice
  
    this.direction = newDirection;
  };

  getCurrDirection = (): Point => {
    return this.direct[this.direction];
  };

  updateWithFrame(frame: number) {
    if (frame % 2 === 0) {
      this.update();
    }
  }

  memoPrevFractions = (fractions: Fraction[]) => {
    this.otherFractions = fractions;
  };

  updateStay() {
    this.stayX = Math.random() > 0.5;
    this.stayY = Math.random() > 0.5;
  }

  connectTo(ctx: CanvasRenderingContext2D, f: Fraction) {
    const dx = f.x - this.x;
    const dy = f.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    ctx.beginPath();
    let centerX1 = this.x + this.size / 2;
    let centerY1 = this.y + this.size / 2;

    let centerX2 = f.x + f.size / 2;
    let centerY2 = f.y + f.size / 2;

    ctx.moveTo(centerX1, centerY1);
    ctx.lineTo(centerX2, centerY2);
    ctx.strokeStyle = "black";
    ctx.stroke();
  }

  connectFractions(ctx: CanvasRenderingContext2D) {
    this.connectedFractions.forEach((f) => {
      this.connectTo(ctx, f);
    });
  }

  resolveCollision = () => {};
}

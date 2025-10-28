export class QPoint {
  x: number = 0;
  y: number = 0;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  distanceFrom(p: QPoint): number {
    return Math.sqrt(Math.pow(this.x - p.x, 2) + Math.pow(this.y - p.y, 2));
  }

  renderRectTable = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.strokeRect(this.x - w / 2, this.y - h / 2, w, h);
  };
}

export class Rectangle {
  x: number = 0;
  y: number = 0;
  w: number = 0;
  h: number = 0;
  left = this.x - this.w / 2;
  right = this.x + this.w / 2;
  top = this.y - this.h / 2;
  bottom = this.y + this.h / 2;

  constructor(x: number, y: number, w: number, h: number) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.left = this.x - this.w / 2;
    this.right = this.x + this.w / 2;
    this.top = this.y - this.h / 2;
    this.bottom = this.y + this.h / 2;
  }

  draw = (ctx: CanvasRenderingContext2D) => {
    // ctx.fillText("x: " + this.x, this.x, this.y);
    // ctx.fillText("y: " + this.y, this.x, this.y + 10);
    // ctx.fillText("w: " + this.w, this.x, this.y + 20);
    // ctx.fillText("h: " + this.h, this.x, this.y + 30);
    // ctx.fillText("left: " + this.left, this.x, this.y + 40);
    // ctx.fillText("right: " + this.right, this.x, this.y + 50);
    // ctx.fillText("top: " + this.top, this.x, this.y + 60);
    // ctx.fillText("bottom: " + this.bottom, this.x, this.y + 70);

    // ctx.fillText("left: "+this.left, this.left, this.top);
    // ctx.fillText(
    //   "left: " + this.left + "  top: " + this.top,
    //   this.left,
    //   this.top
    // );
  };
}

//     N
//     |
//   W-*-E
//     |
//     S

export class Quad {
  boundary: Rectangle = {} as Rectangle;
  capacity: number = 4;
  dept = 0;
  points: QPoint[] = [];

  is_divided: boolean = false;

  nw: Quad = {} as Quad;
  ne: Quad = {} as Quad;
  sw: Quad = {} as Quad;
  se: Quad = {} as Quad;

  constructor(boundary: Rectangle, capacity: number, dept: number) {
    this.boundary = boundary;
    this.capacity = capacity;
    this.dept = dept;
  }

  isContainPoint = (p: QPoint): boolean => {
    return (
      p.x >= this.boundary.left &&
      p.x <= this.boundary.right &&
      p.y >= this.boundary.top &&
      p.y <= this.boundary.bottom
    );
  };

  subdivide = () => {
    let b: Rectangle = this.boundary;
    let Rect: Rectangle = new Rectangle(
      b.x - b.w / 4,
      b.y - b.h / 4,
      b.w / 2,
      b.h / 2
    );
    //nw
    this.nw = new Quad(Rect, this.capacity, this.dept + 1);
    //ne:
    Rect = new Rectangle(b.x + b.w / 4, b.y - b.h / 4, b.w / 2, b.h / 2);
    this.ne = new Quad(Rect, this.capacity, this.dept + 1);
    //sw:
    Rect = new Rectangle(b.x - b.w / 4, b.y + b.h / 4, b.w / 2, b.h / 2);
    this.sw = new Quad(Rect, this.capacity, this.dept + 1);
    //se:
    Rect = new Rectangle(b.x + b.w / 4, b.y + b.h / 4, b.w / 2, b.h / 2);
    this.se = new Quad(Rect, this.capacity, this.dept + 1);
    this.is_divided = true;
  };

  addPoint = (p: QPoint): boolean => {
    if (!this.isContainPoint(p)) {
      return false;
    }

    if (this.points.length < this.capacity) {
      this.points.push(p);
      return true;
    }

    if (!this.is_divided) {
      //   this.subdivide();
      //   this.is_divided= true;
      this.subdivide();
    }

    return (
      this.nw.addPoint(p) ||
      this.ne.addPoint(p) ||
      this.se.addPoint(p) ||
      this.sw.addPoint(p)
    );
  };

  log = () => {
    console.log("dept: ", this.dept);
    console.log("boundary: ", this.boundary);
    console.log("points: ", this.points);

    console.log(this.ne);
    console.log(this.nw);
    console.log(this.se);
    console.log(this.sw);
  };

  render = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = "white";
    ctx.strokeRect(
      this.boundary.x - this.boundary.w / 2,
      this.boundary.y - this.boundary.h / 2,
      this.boundary.w,
      this.boundary.h
    );
    this.points.forEach((p: QPoint) => {
      p.renderRectTable(ctx, 5, 5);
    });

    this.boundary.draw(ctx);
    if (this.is_divided) {
      this.nw.render(ctx);
      this.ne.render(ctx);
      this.sw.render(ctx);
      this.se.render(ctx);
    }
  };
}

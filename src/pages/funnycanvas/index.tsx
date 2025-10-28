import { delay } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { CircleProps, FrameBuilder, IFrame, MouseAdapter, MouseCursorEffect, MouseCursorEffectChase, Point } from "./in";
import { CanvasContainer, Fraction } from "./fraction";
import { QPoint, Quad, Rectangle } from "./quadtree/quad";

const FunnyCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const frameRef = useRef<number>(0);

    const [title, setTile] = useState("Hello World");
    const frameInstance = useRef<IFrame | null>(null);

    const mousePos = useRef<Point>({ x: 0, y: 0 });

    const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
        mousePos.current = {
            x: event.clientX - canvasRef.current?.offsetLeft!,
            y: event.clientY - canvasRef.current?.offsetTop!
        };
    };

    const updateFrame = () => {
        frameRef.current++;
    }


    const [circle, setC] = useState<Point>({
        x: 50,
        y: 50
    });
    let ctx: CanvasRenderingContext2D;

    const isCollisionMatch = (offset: number) => {
        return Math.abs(circle.x - mousePos.current.x) < offset && Math.abs(circle.y - mousePos.current.y) < offset;
    }

    const draw = (frame: IFrame) => {
        frame.ClearRect();
        frame.FillStyle("#000000");
        let cycle: CircleProps = new CircleProps(circle.x, circle.y, 20, "");
        frame.RenderCircle(cycle);
    };

    const draw2 = (ctx: CanvasRenderingContext2D) => {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.beginPath();
        ctx.fillStyle = "red";


        ctx.fillRect(10, 10, 10, 10);
        ctx.fillStyle = "blue";
        ctx.fillRect(30, 10, 10, 10);
    };


    const render = (ctx: CanvasRenderingContext2D) => {
        let animationFrameId: number;
        let container: CanvasContainer = new CanvasContainer();

        container.rednerRandomFraction(ctx, 50);
        const animate = () => {
            container.update();
            container.draw(ctx);
            animationFrameId = window.requestAnimationFrame(animate);

        };

        animate();

        return () => {
            window.cancelAnimationFrame(animationFrameId);
        };
    };



    // useEffect(() => {
    //     if (!canvasRef.current) return;

    //     const ctxRef = canvasRef.current.getContext("2d");
    //     if (!ctxRef) return;
    //     canvasRef.current.width = 700;
    //     canvasRef.current.height = 700;
    //     ctx = ctxRef;

    //     console.log(ctxRef); // Should now log correctly

    //     const cleanup = render(ctxRef);
    //     return cleanup;
    // }, []);


    useEffect(() => {
        if (!canvasRef.current) return;

        const ctxRef = canvasRef.current.getContext("2d");
        if (!ctxRef) return;
        canvasRef.current.width = 700;
        canvasRef.current.height = 700;
        ctx = ctxRef;


        ctxRef.fillStyle = "black";
        ctxRef.fillRect(0, 0, 2000, 2000);

        ctxRef.fillStyle = "red";
        ctxRef.fillRect(0, 0, 100, 100);
        ctxRef.fillRect(200, 200, 200, 200);
        ctxRef.fillStyle = "blue";
        let rectangle: Rectangle = new Rectangle(75, 75, 50, 50);
        ctxRef.fillRect(rectangle.x - rectangle.w / 2, rectangle.y - rectangle.w / 2, rectangle.w, rectangle.h);


        let rootQuad: Quad = new Quad(new Rectangle(400, 1100, 2000, 2000), 4, 0);
        let points: QPoint[] = Array.from({ length: 400 }, () => {
            let x = Math.min(Math.random() * 700, 700);
            let y = Math.min(Math.random() * 700, 700);
            return new QPoint(x, y);
        });
        

        points.forEach((point: QPoint) => {
            rootQuad.addPoint(point);
        });

        rootQuad.log();

        rootQuad.render(ctxRef);

        return () => {
            console.log("cleanup");
        };
    }, []);


    console.log("re-render");

    return (
        <>
            <div>
                <h1>{title}</h1>
                <h2>{frameRef.current}</h2>
                <h1>{mousePos.current.x}--MOUSE--{mousePos.current.y}</h1>
                <h1>{circle.x}--CIRCLE--{circle.y}</h1>
                <h1>Diff: {Math.abs(circle.x - mousePos.current.x)} - {Math.abs(circle.y - mousePos.current.y)}</h1>

                <canvas
                    className="w-[700px] h-[700px] border-[1px] border-black"
                    onMouseMove={handleMouseMove}
                    ref={canvasRef}></canvas>
            </div>
        </>
    );
};

export default FunnyCanvas;

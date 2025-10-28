import { useEffect, useRef } from "react";

export default function TeacherTeaching() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  let frame = useRef(0);
  const FPS = 120;
  let lastTime = useRef(0);
  let textIndex = useRef(0);
  const text = "Welcome To Class!";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function drawTeacher(frame: number) {
        if (!ctx) return;
      const armAngle = Math.sin(frame * 0.1) * 30;
      ctx.fillStyle = "#ffcc66";
      ctx.fillRect(200, 100, 50, 100);
      ctx.fillStyle = "#000";
      ctx.beginPath();
      ctx.arc(225, 90, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.save();
      ctx.translate(220, 120);
      ctx.rotate((armAngle * Math.PI) / 180);
      ctx.fillStyle = "#663300";
      ctx.fillRect(50, 0, 5, 40);
      ctx.restore();
    }

    function drawStudents(frame: number) {
        if (!ctx) return;
      for (let i = 0; i < 3; i++) {
        const headTilt = Math.sin(frame * 0.1 + i) * 3;
        ctx.fillStyle = "#6699ff";
        ctx.fillRect(50 + i * 60, 180, 40, 60);
        ctx.save();
        ctx.translate(70 + i * 60, 170 + headTilt);
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.arc(0, 0, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    function drawBoard() {
        if (!ctx) return;
      ctx.fillStyle = "#228B22";
      ctx.fillRect(50, 20, 300, 150);
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "20px Arial";
      ctx.fillText(text.substring(0, textIndex.current), 130, 50);
    }

    function animate(currentTime: number) {
      if (currentTime - lastTime.current < 1000 / FPS) {
        requestAnimationFrame(animate);
        return;
      }
      lastTime.current = currentTime;
      if (!ctx) return;
      if (!canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBoard();
      drawTeacher(frame.current);
      drawStudents(frame.current);
      frame.current++;
      
      if (frame.current % 10 ===0 && textIndex.current < text.length) {
        textIndex.current++;
      };


      if (textIndex.current  === text.length) {
        textIndex.current = 0;
      }
      
      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }, []);

  return (
    <div className="flex justify-center items-center h-100">
      <canvas
        ref={canvasRef}
        width={400}
        height={300}
        className="border-4  rounded-lg shadow-lg"
      />
    </div>
  );
}

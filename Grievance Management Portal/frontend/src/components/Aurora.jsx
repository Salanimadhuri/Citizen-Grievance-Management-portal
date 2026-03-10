import { useEffect, useRef } from 'react';

const Aurora = ({ 
  colorStops = ["#d8eed8", "#a0f3b5", "#bbb9c6"], 
  blend = 0.5, 
  amplitude = 1.0, 
  speed = 1 
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let time = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      colorStops.forEach((color, index) => {
        gradient.addColorStop(index / (colorStops.length - 1), color);
      });

      // Create wave effect
      ctx.globalAlpha = blend;
      ctx.fillStyle = gradient;
      
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      
      for (let x = 0; x <= canvas.width; x += 10) {
        const y = canvas.height / 2 + 
          Math.sin((x * 0.01) + (time * speed * 0.02)) * amplitude * 50 +
          Math.sin((x * 0.02) + (time * speed * 0.03)) * amplitude * 30;
        ctx.lineTo(x, y);
      }
      
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      ctx.fill();

      time++;
      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    animate();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [colorStops, blend, amplitude, speed]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: -1 }}
    />
  );
};

export default Aurora;
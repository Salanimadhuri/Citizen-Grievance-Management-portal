import { useState, useEffect } from 'react';

const ClickSpark = ({
  children,
  sparkColor = '#ffffff',
  sparkSize = 15,
  sparkRadius = 15,
  sparkCount = 8,
  duration = 400
}) => {
  const [sparks, setSparks] = useState([]);

  const createSpark = (x, y) => {
    const newSparks = [];
    for (let i = 0; i < sparkCount; i++) {
      const angle = (360 / sparkCount) * i;
      const radian = (angle * Math.PI) / 180;
      const sparkX = x + Math.cos(radian) * sparkRadius;
      const sparkY = y + Math.sin(radian) * sparkRadius;
      
      newSparks.push({
        id: Date.now() + i,
        x: sparkX,
        y: sparkY,
        angle
      });
    }
    
    setSparks(prev => [...prev, ...newSparks]);
    
    setTimeout(() => {
      setSparks(prev => prev.filter(spark => !newSparks.includes(spark)));
    }, duration);
  };

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    createSpark(x, y);
  };

  return (
    <div 
      className="relative w-full h-full"
      onClick={handleClick}
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      {children}
      
      {sparks.map(spark => (
        <div
          key={spark.id}
          className="absolute pointer-events-none animate-ping"
          style={{
            left: spark.x - sparkSize / 2,
            top: spark.y - sparkSize / 2,
            width: sparkSize,
            height: sparkSize,
            backgroundColor: sparkColor,
            borderRadius: '50%',
            animationDuration: `${duration}ms`,
            animationFillMode: 'forwards'
          }}
        />
      ))}
    </div>
  );
};

export default ClickSpark;
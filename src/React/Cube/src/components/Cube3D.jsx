import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './Cube3D.css';

const Cube3D = ({
  size = 300,
  autoRotate = false,
  rotationSpeed = 0.5,
  interactive = true,
  faces = {
    front: { type: 'empty' },
    back: { type: 'empty' },
    right: { type: 'empty' },
    left: { type: 'empty' },
    top: { type: 'empty' },
    bottom: { type: 'empty' }
  },
  className = '',
  style = {}
}) => {
  const containerRef = useRef(null);
  const cubeRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [currentRotation, setCurrentRotation] = useState({ x: 15, y: 45, z: 0 });
  const [previousMouse, setPreviousMouse] = useState({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [lastTime, setLastTime] = useState(0);
  const [autoRotationPaused, setAutoRotationPaused] = useState(false);
  const currentRotationRef = useRef({ x: 15, y: 45, z: 0 });
  const timelineRef = useRef(null);

  const ROTATION_SPEED = 0.3;
  const INERTIA_FACTOR = 0.95;

  const normalizeRotation = (angle) => {
    return angle % 360;
  };

  const updateCubeRotation = () => {
    gsap.set(cubeRef.current, {
      rotateX: currentRotationRef.current.x,
      rotateY: currentRotationRef.current.y
    });
  };

  const startAutoRotation = () => {
    timelineRef.current = gsap.timeline({ repeat: -1 });
    timelineRef.current.to({}, {
      duration: 15 / rotationSpeed,
      ease: "none",
      onUpdate: function() {
        if (!autoRotationPaused) {
          currentRotationRef.current.y += (360 / (15 / rotationSpeed)) / 60; // 360 degrees over duration
          currentRotationRef.current.x += (180 / (15 / rotationSpeed)) / 60; // 180 degrees over duration
          updateCubeRotation();
        }
      }
    });
  };

  useEffect(() => {
    // Set initial rotation without animation
    if (cubeRef.current) {
      gsap.set(cubeRef.current, {
        rotateX: currentRotationRef.current.x,
        rotateY: currentRotationRef.current.y
      });
    }
    
    if (autoRotate) {
      startAutoRotation();
    }

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [autoRotate, rotationSpeed]);

  const handleStart = (e) => {
    if (!interactive) return;
    setIsDragging(true);
    setAutoRotationPaused(true);
    
    // Pause the timeline completely during drag
    if (timelineRef.current) {
      timelineRef.current.pause();
    }
    
    setLastTime(performance.now());
    setVelocity({ x: 0, y: 0 });

    const clientX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;
    setPreviousMouse({ x: clientX, y: clientY });
    e.preventDefault();
  };

  const handleMove = (e) => {
    if (!isDragging || !interactive) return;

    const currentTime = performance.now();
    const deltaTime = currentTime - lastTime;
    setLastTime(currentTime);

    const clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;

    const deltaX = clientX - previousMouse.x;
    const deltaY = clientY - previousMouse.y;

    const newVelocityX = (deltaX * ROTATION_SPEED) / deltaTime;
    const newVelocityY = (deltaY * ROTATION_SPEED) / deltaTime;

    setVelocity({ x: newVelocityX, y: newVelocityY });
    
    currentRotationRef.current.y += newVelocityX * deltaTime;
    currentRotationRef.current.x -= newVelocityY * deltaTime;

    updateCubeRotation();
    setPreviousMouse({ x: clientX, y: clientY });
    e.preventDefault();
  };

  const handleEnd = () => {
    if (!interactive) return;
    setIsDragging(false);
    setAutoRotationPaused(false);
    
    // Resume the timeline after drag ends
    if (timelineRef.current) {
      timelineRef.current.play();
    }

    const applyInertia = () => {
      if (Math.abs(velocity.x) > 0.001 || Math.abs(velocity.y) > 0.001) {
        currentRotationRef.current.y += velocity.x;
        currentRotationRef.current.x -= velocity.y;

        setVelocity(prev => ({
          x: prev.x * INERTIA_FACTOR,
          y: prev.y * INERTIA_FACTOR
        }));

        updateCubeRotation();
        requestAnimationFrame(applyInertia);
      }
    };

    requestAnimationFrame(applyInertia);
  };

  const renderFaceContent = (face, content) => {
    switch (content.type) {
      case 'video':
        return (
          <div className="face-content">
            <video
              src={content.src}
              autoPlay
              loop
              muted
              playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        );
      case 'image':
        return (
          <div className="face-content">
            <img
              src={content.src}
              alt={face}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        );
      case 'html':
        return (
          <div
            className="face-content"
            dangerouslySetInnerHTML={{ __html: content.html }}
          />
        );
      case 'empty':
      default:
        return null;
    }
  };

  return (
    <div
      ref={containerRef}
      className={`cube-container ${className}`}
      style={{ 
        perspective: '1000px',
        ...style
      }}
      onMouseDown={handleStart}
      onMouseMove={handleMove}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={handleStart}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
    >
      <div
        ref={cubeRef}
        className="cube"
        style={{
          width: size,
          height: size,
          transform: `translateZ(-${size/2}px)`,
          transformStyle: 'preserve-3d'
        }}
      >
        {Object.entries(faces).map(([face, content]) => (
          <div
            key={face}
            className={`cube-face cube-face--${face}`}
            style={{
              width: size,
              height: size,
              transform: getFaceTransform(face, size)
            }}
          >
            {renderFaceContent(face, content)}
          </div>
        ))}
      </div>
    </div>
  );
};

const getFaceTransform = (face, size) => {
  const halfSize = size / 2;
  switch (face) {
    case 'front':
      return `rotateY(0deg) translateZ(${halfSize}px)`;
    case 'back':
      return `rotateY(180deg) translateZ(${halfSize}px)`;
    case 'right':
      return `rotateY(90deg) translateZ(${halfSize}px)`;
    case 'left':
      return `rotateY(-90deg) translateZ(${halfSize}px)`;
    case 'top':
      return `rotateX(90deg) translateZ(${halfSize}px)`;
    case 'bottom':
      return `rotateX(-90deg) translateZ(${halfSize}px)`;
    default:
      return '';
  }
};

export default Cube3D; 
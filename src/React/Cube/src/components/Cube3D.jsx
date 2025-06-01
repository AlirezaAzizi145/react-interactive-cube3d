import React, { useEffect, useRef } from 'react';
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
  const rotationRef = useRef({ x: 15, y: 45 });
  const isDraggingRef = useRef(false);
  const mouseRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const cube = cubeRef.current;
    if (!container || !cube) return;

    // Set initial rotation
    gsap.set(cube, {
      rotateX: rotationRef.current.x,
      rotateY: rotationRef.current.y
    });

    // Auto rotation with setInterval for consistent timing
    if (autoRotate) {
      const animate = () => {
        if (!isDraggingRef.current) {
          rotationRef.current.y += 0.5 * rotationSpeed;
          rotationRef.current.x += 0.3 * rotationSpeed;
          gsap.set(cube, {
            rotateX: rotationRef.current.x,
            rotateY: rotationRef.current.y
          });
        }
      };
      animationFrameRef.current = setInterval(animate, 16); // ~60fps
    }

    // Mouse/Touch handlers
    const handlePointerDown = (e) => {
      if (!interactive) return;
      
      isDraggingRef.current = true;
      velocityRef.current = { x: 0, y: 0 };

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      mouseRef.current = { x: clientX, y: clientY };

      // Add move and up listeners only when dragging starts
      window.addEventListener('mousemove', handlePointerMove);
      window.addEventListener('touchmove', handlePointerMove);
      window.addEventListener('mouseup', handlePointerUp);
      window.addEventListener('touchend', handlePointerUp);

      e.preventDefault();
    };

    const handlePointerMove = (e) => {
      if (!isDraggingRef.current || !interactive) return;

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - mouseRef.current.x;
      const deltaY = clientY - mouseRef.current.y;

      // Direct rotation update
      rotationRef.current.y += deltaX * 0.5;
      rotationRef.current.x -= deltaY * 0.5;

      gsap.set(cube, {
        rotateX: rotationRef.current.x,
        rotateY: rotationRef.current.y
      });

      // Store velocity for inertia
      velocityRef.current = { x: deltaX * 0.1, y: -deltaY * 0.1 };

      mouseRef.current = { x: clientX, y: clientY };
      e.preventDefault();
    };

    const handlePointerUp = () => {
      if (!interactive) return;
      
      isDraggingRef.current = false;

      // Remove move and up listeners when dragging ends
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchend', handlePointerUp);

      // Apply inertia
      const applyInertia = () => {
        if (Math.abs(velocityRef.current.x) > 0.1 || Math.abs(velocityRef.current.y) > 0.1) {
          rotationRef.current.y += velocityRef.current.x;
          rotationRef.current.x += velocityRef.current.y;

          gsap.set(cube, {
            rotateX: rotationRef.current.x,
            rotateY: rotationRef.current.y
          });

          velocityRef.current.x *= 0.95;
          velocityRef.current.y *= 0.95;

          requestAnimationFrame(applyInertia);
        }
      };

      requestAnimationFrame(applyInertia);
    };

    // Add event listeners
    container.addEventListener('mousedown', handlePointerDown);
    container.addEventListener('touchstart', handlePointerDown);

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        clearInterval(animationFrameRef.current);
      }
      
      container.removeEventListener('mousedown', handlePointerDown);
      container.removeEventListener('touchstart', handlePointerDown);
      // Remove any remaining listeners
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [autoRotate, interactive, rotationSpeed]);

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
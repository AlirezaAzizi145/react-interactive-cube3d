import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './Cube3D.css';

const Cube3D = ({
  size = 300,
  responsive = false,
  minSize = 150,
  maxSize = 600,
  autoRotate = false,
  rotationSpeed = 0.5,
  interactive = true,
  interactiveEffects = false,
  effectColors = {
    front: '#00ffff',  // Cyan
    back: '#ff00ff',   // Magenta
    right: '#ffff00',  // Yellow
    left: '#ff8800',   // Orange
    top: '#88ff00',    // Lime
    bottom: '#ff0088'  // Pink
  },
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
  const [cubeSize, setCubeSize] = useState(size);

  // Responsive sizing effect
  useEffect(() => {
    if (!responsive) {
      setCubeSize(size);
      return;
    }

    const updateSize = () => {
      const container = containerRef.current;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const containerHeight = containerRect.height;
      
      // Use 70% of the smaller dimension to ensure cube fits well
      const availableSize = Math.min(containerWidth, containerHeight) * 0.7;
      
      // Clamp between min and max sizes
      const newSize = Math.max(minSize, Math.min(maxSize, availableSize));
      
      setCubeSize(newSize);
    };

    // Initial size calculation
    updateSize();

    // Add resize listener
    window.addEventListener('resize', updateSize);
    
    return () => {
      window.removeEventListener('resize', updateSize);
    };
  }, [responsive, size, minSize, maxSize]);

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
      if (e.touches) {
        // Touch events - use passive: false for touchmove to allow preventDefault
        window.addEventListener('touchmove', handlePointerMove, { passive: false });
        window.addEventListener('touchend', handlePointerUp);
        window.addEventListener('touchcancel', handlePointerUp);
      } else {
        // Mouse events
        window.addEventListener('mousemove', handlePointerMove);
        window.addEventListener('mouseup', handlePointerUp);
      }

      e.preventDefault();
    };

    const handlePointerMove = (e) => {
      if (!isDraggingRef.current || !interactive) return;

      // Handle both touch and mouse events
      let clientX, clientY;
      if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

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
      
      // Prevent scrolling and default behavior
      e.preventDefault();
      e.stopPropagation();
    };

    const handlePointerUp = (e) => {
      if (!interactive) return;
      
      isDraggingRef.current = false;

      // Remove all listeners
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
      window.removeEventListener('touchcancel', handlePointerUp);

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

    // Add event listeners with proper options
    container.addEventListener('mousedown', handlePointerDown);
    container.addEventListener('touchstart', handlePointerDown, { passive: false });

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        clearInterval(animationFrameRef.current);
      }
      
      container.removeEventListener('mousedown', handlePointerDown);
      container.removeEventListener('touchstart', handlePointerDown);
      // Remove any remaining listeners from window
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
      window.removeEventListener('touchcancel', handlePointerUp);
    };
  }, [autoRotate, interactive, rotationSpeed]);

  // Interactive Effects
  useEffect(() => {
    if (!interactiveEffects) return;

    const faces = document.querySelectorAll('.cube-face');
    
    const handleFaceHover = (e) => {
      const face = e.currentTarget;
      const lightEffect = face.querySelector('.light-effect');
      const faceType = face.className.split('--')[1]; // Get face type (front, back, etc.)
      const faceColor = effectColors[faceType];
      
      if (lightEffect) {
        gsap.to(lightEffect, {
          opacity: 0.6,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
      
      // Add glow effect to face with dynamic color
      gsap.to(face, {
        boxShadow: `0 0 32px 8px ${faceColor}88, 0 0 16px 4px ${faceColor}88`,
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    const handleFaceLeave = (e) => {
      const face = e.currentTarget;
      const lightEffect = face.querySelector('.light-effect');
      
      if (lightEffect) {
        gsap.to(lightEffect, {
          opacity: 0,
          duration: 0.5,
          ease: 'power2.out'
        });
      }
      
      // Remove glow effect
      gsap.to(face, {
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
        duration: 0.5,
        ease: 'power2.out'
      });
    };

    const handleFaceClick = (e) => {
      const face = e.currentTarget;
      const faceType = face.className.split('--')[1];
      const faceColor = effectColors[faceType];
      
      // Bounce effect
      gsap.fromTo(face, 
        { scale: 1 },
        { 
          scale: 1.1,
          duration: 0.2,
          ease: 'power2.out',
          yoyo: true,
          repeat: 1
        }
      );
      
      // Light flash effect with dynamic color
      const lightEffect = face.querySelector('.light-effect');
      if (lightEffect) {
        gsap.fromTo(lightEffect, 
          { opacity: 0 },
          { 
            opacity: 1,
            duration: 0.1,
            ease: 'power2.out',
            yoyo: true,
            repeat: 1
          }
        );
      }
    };

    // Add event listeners to all faces
    faces.forEach(face => {
      face.addEventListener('mouseenter', handleFaceHover);
      face.addEventListener('mouseleave', handleFaceLeave);
      face.addEventListener('click', handleFaceClick);
    });

    // Cleanup
    return () => {
      faces.forEach(face => {
        face.removeEventListener('mouseenter', handleFaceHover);
        face.removeEventListener('mouseleave', handleFaceLeave);
        face.removeEventListener('click', handleFaceClick);
      });
    };
  }, [interactiveEffects, effectColors]);

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
          width: cubeSize,
          height: cubeSize,
          transform: `translateZ(-${cubeSize/2}px)`,
          transformStyle: 'preserve-3d'
        }}
      >
        {Object.entries(faces).map(([face, content]) => (
          <div
            key={face}
            className={`cube-face cube-face--${face}`}
            style={{
              width: cubeSize,
              height: cubeSize,
              transform: getFaceTransform(face, cubeSize)
            }}
          >
            {renderFaceContent(face, content)}
            {interactiveEffects && (
              <div className="light-effect"></div>
            )}
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
class Cube3D {
  constructor(container, options = {}) {
    this.container = container;
    this.size = options.size || 300;
    this.autoRotate = options.autoRotate || false;
    this.rotationSpeed = options.rotationSpeed || 0.5;
    this.currentRotation = { x: 15, y: 45, z: 0 };
    
    // Mouse control variables
    this.isDragging = false;
    this.previousMouseX = 0;
    this.previousMouseY = 0;
    this.velocityX = 0;
    this.velocityY = 0;
    this.lastTime = 0;
    this.autoRotationPaused = false;
    
    // Constants
    this.ROTATION_SPEED = 0.3;
    this.INERTIA_FACTOR = 0.95;
    
    this.init();
  }

  init() {
    // Create cube container
    this.cube = document.createElement('div');
    this.cube.style.cssText = `
      width: ${this.size}px;
      height: ${this.size}px;
      position: relative;
      transform-style: preserve-3d;
      transform: translateZ(-${this.size/2}px);
    `;
    this.container.appendChild(this.cube);

    // Create faces
    this.faces = {};
    const faces = ['front', 'back', 'right', 'left', 'top', 'bottom'];
    const positions = {
      front: 'rotateY(0deg) translateZ(' + (this.size/2) + 'px)',
      back: 'rotateY(180deg) translateZ(' + (this.size/2) + 'px)',
      right: 'rotateY(90deg) translateZ(' + (this.size/2) + 'px)',
      left: 'rotateY(-90deg) translateZ(' + (this.size/2) + 'px)',
      top: 'rotateX(90deg) translateZ(' + (this.size/2) + 'px)',
      bottom: 'rotateX(-90deg) translateZ(' + (this.size/2) + 'px)'
    };

    faces.forEach(face => {
      const faceElement = document.createElement('div');
      faceElement.className = `cube-face cube-face--${face}`;
      faceElement.style.cssText = `
        position: absolute;
        width: 100%;
        height: 100%;
        transform: ${positions[face]};
        backface-visibility: visible;
        transform-style: preserve-3d;
      `;
      this.faces[face] = faceElement;
      this.cube.appendChild(faceElement);
    });

    // Set up event listeners
    this.setupEventListeners();

    // Start auto-rotation if enabled
    if (this.autoRotate) {
      this.startAutoRotation();
    }
  }

  setupEventListeners() {
    this.container.addEventListener('mousedown', this.handleStart.bind(this));
    window.addEventListener('mousemove', this.handleMove.bind(this));
    window.addEventListener('mouseup', this.handleEnd.bind(this));
    
    this.container.addEventListener('touchstart', this.handleStart.bind(this));
    window.addEventListener('touchmove', this.handleMove.bind(this));
    window.addEventListener('touchend', this.handleEnd.bind(this));
  }

  normalizeRotation(angle) {
    return angle % 360;
  }

  updateCubeRotation() {
    this.currentRotation.x = this.normalizeRotation(this.currentRotation.x);
    this.currentRotation.y = this.normalizeRotation(this.currentRotation.y);
    
    gsap.set(this.cube, {
      rotateX: this.currentRotation.x,
      rotateY: this.currentRotation.y
    });
  }

  handleStart(e) {
    this.isDragging = true;
    this.autoRotationPaused = true;
    this.lastTime = performance.now();
    this.velocityX = 0;
    this.velocityY = 0;

    if (e.type === "touchstart") {
      this.previousMouseX = e.touches[0].clientX;
      this.previousMouseY = e.touches[0].clientY;
    } else {
      this.previousMouseX = e.clientX;
      this.previousMouseY = e.clientY;
    }
    
    e.preventDefault();
  }

  handleMove(e) {
    if (!this.isDragging) return;

    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    let currentX, currentY;
    if (e.type === "touchmove") {
      currentX = e.touches[0].clientX;
      currentY = e.touches[0].clientY;
    } else {
      currentX = e.clientX;
      currentY = e.clientY;
    }

    const deltaX = currentX - this.previousMouseX;
    const deltaY = currentY - this.previousMouseY;

    this.velocityX = (deltaX * this.ROTATION_SPEED) / deltaTime;
    this.velocityY = (deltaY * this.ROTATION_SPEED) / deltaTime;

    this.currentRotation.y += this.velocityX * deltaTime;
    this.currentRotation.x -= this.velocityY * deltaTime;

    this.updateCubeRotation();

    this.previousMouseX = currentX;
    this.previousMouseY = currentY;

    e.preventDefault();
  }

  handleEnd() {
    this.isDragging = false;
    this.autoRotationPaused = false;

    const applyInertia = () => {
      if (Math.abs(this.velocityX) > 0.001 || Math.abs(this.velocityY) > 0.001) {
        this.currentRotation.y += this.velocityX;
        this.currentRotation.x -= this.velocityY;

        this.velocityX *= this.INERTIA_FACTOR;
        this.velocityY *= this.INERTIA_FACTOR;

        this.updateCubeRotation();
        requestAnimationFrame(applyInertia);
      }
    };

    requestAnimationFrame(applyInertia);
  }

  startAutoRotation() {
    gsap.timeline({ repeat: -1 })
      .to(this.cube, {
        duration: 10,
        ease: "none",
        onUpdate: () => {
          if (!this.autoRotationPaused) {
            this.currentRotation.y += 0.5;
            this.currentRotation.x += 0.3;
            this.updateCubeRotation();
          }
        }
      });
  }

  setFaces(contents) {
    Object.entries(contents).forEach(([face, content]) => {
      if (this.faces[face]) {
        this.faces[face].innerHTML = content;
      }
    });
  }

  rotate(x, y, z) {
    this.currentRotation.x = x || this.currentRotation.x;
    this.currentRotation.y = y || this.currentRotation.y;
    this.currentRotation.z = z || this.currentRotation.z;
    this.updateCubeRotation();
  }
}
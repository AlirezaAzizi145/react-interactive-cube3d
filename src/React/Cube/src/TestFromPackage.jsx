import React from 'react';
// استفاده از پکیج محلی (شبیه‌ساز npm install)
import { Cube3D } from './index.js';
import '../dist/cube3d.css';

function TestFromPackage() {
  const faces = {
    front: {
      type: 'image',
      src: 'https://images.pexels.com/photos/2825033/pexels-photo-2825033.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    back: {
      type: 'image',
      src: 'https://images.pexels.com/photos/8721342/pexels-photo-8721342.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    right: {
      type: 'html',
      html: `
        <div style="
          color: white; 
          text-align: center; 
          padding: 20px; 
          background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100%;
        ">
          <h2>React پکیج</h2>
          <p>✨ کار می‌کند!</p>
        </div>
      `
    },
    left: {
      type: 'html',
      html: `
        <div style="
          color: white; 
          text-align: center; 
          padding: 20px; 
          background: linear-gradient(135deg, #667eea, #764ba2);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100%;
        ">
          <h3>🎯 عالی!</h3>
          <p>react-interactive-cube3d</p>
        </div>
      `
    },
    top: {
      type: 'html',
      html: `
        <div style="
          color: white; 
          text-align: center; 
          padding: 20px; 
          background: linear-gradient(45deg, #f093fb, #f5576c);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100%;
        ">
          <h3>🔝 بالا</h3>
          <p>TOP FACE</p>
        </div>
      `
    },
    bottom: {
      type: 'html',
      html: `
        <div style="
          color: white; 
          text-align: center; 
          padding: 20px; 
          background: linear-gradient(45deg, #4facfe, #00f2fe);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100%;
        ">
          <h3>⬇️ پایین</h3>
          <p>BOTTOM FACE</p>
        </div>
      `
    }
  };

  const effectColors = {
    front: '#ff0000',   // قرمز
    back: '#00ff00',    // سبز
    right: '#0000ff',   // آبی
    left: '#ff00ff',    // بنفش
    top: '#ffff00',     // زرد
    bottom: '#00ffff'   // فیروزه‌ای
  };

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      background: 'linear-gradient(135deg, #1e3c72, #2a5298)',
      flexDirection: 'column'
    }}>
      <h1 style={{ 
        color: 'white', 
        marginBottom: '20px',
        fontFamily: 'Tahoma, Arial, sans-serif'
      }}>
        🚀 تست پکیج در React
      </h1>
      
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        padding: '20px',
        borderRadius: '15px',
        marginBottom: '30px',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <code style={{ color: '#00ff88', fontSize: '14px' }}>
          npm install react-interactive-cube3d
        </code>
      </div>

      <Cube3D
        size={320}
        autoRotate={true}
        rotationSpeed={1.5}
        interactive={true}
        interactiveEffects={true}
        effectColors={effectColors}
        faces={faces}
        responsive={false}
      />

      <div style={{
        marginTop: '30px',
        color: '#ccc',
        textAlign: 'center',
        fontSize: '14px'
      }}>
        <p>✅ پکیج منتشر شد در npm</p>
        <p>🎮 Interactive + Auto-rotate فعال</p>
        <p>🎨 Effect colors سفارشی</p>
      </div>
    </div>
  );
}

export default TestFromPackage; 
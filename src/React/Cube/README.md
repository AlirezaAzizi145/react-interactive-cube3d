# React Interactive Cube3D

[![npm version](https://badge.fury.io/js/react-interactive-cube3d.svg)](https://badge.fury.io/js/react-interactive-cube3d)
[![Downloads](https://img.shields.io/npm/dm/react-interactive-cube3d.svg)](https://www.npmjs.com/package/react-interactive-cube3d)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, interactive 3D cube component for React with support for video, image, and HTML content.

## ✨ Features

- 🎥 **Multi-content support** - Video, image, and HTML content on each face
- 🎮 **Interactive controls** - Drag, rotate with inertia
- 🔄 **Auto-rotation** - Customizable speed and direction
- ✨ **Interactive effects** - Hover/click effects with customizable colors
- 📱 **Responsive design** - Adapts to different screen sizes
- 🎨 **Highly customizable** - Full control over styling and behavior
- 🚀 **Optimized performance** - Smooth animations using GSAP
- 💪 **TypeScript support** - Full type definitions included

## 📦 Installation

```bash
npm install react-interactive-cube3d
# or
yarn add react-interactive-cube3d
```

## 🚀 Quick Start

```jsx
import { Cube3D } from 'react-interactive-cube3d';
import 'react-interactive-cube3d/dist/cube3d.css';

function App() {
  const faces = {
    front: {
      type: 'video',
      src: 'path/to/video.mp4'
    },
    back: {
      type: 'image',
      src: 'path/to/image.jpg'
    },
    right: {
      type: 'html',
      html: '<div>Custom HTML</div>'
    },
    // ... other faces
  };

  return (
    <Cube3D
      size={300}
      autoRotate={true}
      rotationSpeed={0.5}
      interactive={true}
      interactiveEffects={true}
      faces={faces}
    />
  );
}
```

## 📖 API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `number` | `300` | Size of the cube in pixels |
| `responsive` | `boolean` | `false` | Enable responsive sizing |
| `minSize` | `number` | `150` | Minimum size when responsive |
| `maxSize` | `number` | `600` | Maximum size when responsive |
| `autoRotate` | `boolean` | `false` | Enable auto-rotation |
| `rotationSpeed` | `number` | `0.5` | Speed of auto-rotation |
| `interactive` | `boolean` | `true` | Enable drag controls |
| `interactiveEffects` | `boolean` | `false` | Enable hover/click effects |
| `effectColors` | `EffectColors` | `{...}` | Custom colors for effects |
| `faces` | `Faces` | `{...}` | Content for each face |
| `className` | `string` | `''` | Additional CSS class |
| `style` | `CSSProperties` | `{}` | Additional inline styles |

### Face Content Types

Each face can have one of these content types:

```jsx
// Video
{
  type: 'video',
  src: 'path/to/video.mp4'
}

// Image
{
  type: 'image',
  src: 'path/to/image.jpg'
}

// HTML
{
  type: 'html',
  html: '<div>Custom HTML</div>'
}

// Empty
{
  type: 'empty'
}
```

### Effect Colors

Customize the colors for interactive effects:

```jsx
const effectColors = {
  front: '#00ffff',  // Cyan
  back: '#ff00ff',   // Magenta
  right: '#ffff00',  // Yellow
  left: '#ff8800',   // Orange
  top: '#88ff00',    // Lime
  bottom: '#ff0088'  // Pink
};
```

## 🎮 Examples

### Basic Cube with Images

```jsx
<Cube3D
  size={250}
  autoRotate={true}
  faces={{
    front: { type: 'image', src: '/image1.jpg' },
    back: { type: 'image', src: '/image2.jpg' },
    right: { type: 'image', src: '/image3.jpg' },
    left: { type: 'image', src: '/image4.jpg' },
    top: { type: 'image', src: '/image5.jpg' },
    bottom: { type: 'image', src: '/image6.jpg' }
  }}
/>
```

### Interactive Dashboard Cube

```jsx
<Cube3D
  size={300}
  interactive={true}
  interactiveEffects={true}
  faces={{
    front: { 
      type: 'html', 
      html: '<div class="dashboard">Clock: 12:34</div>' 
    },
    back: { 
      type: 'html', 
      html: '<div class="dashboard">Weather: 22°C</div>' 
    }
    // ... more faces
  }}
/>
```

## 🛠️ Development

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/react-interactive-cube3d.git

# Install dependencies
npm install

# Build the package
npm run build

# Run tests
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [GSAP](https://greensock.com/gsap/) for smooth animations
- Inspired by modern 3D web interfaces

---

<div align="center">
  <strong>Made with ❤️ for the React community</strong>
</div>

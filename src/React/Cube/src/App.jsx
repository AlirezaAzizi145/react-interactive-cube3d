import React, { useEffect, useState } from 'react';
import Cube3D from './components/Cube3D';
import './App.css';

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [chartValue, setChartValue] = useState(50);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const chartTimer = setInterval(() => {
      setChartValue(Math.floor(Math.random() * 80) + 10);
    }, 1500);

    return () => {
      clearInterval(timer);
      clearInterval(chartTimer);
    };
  }, []);

  const videoFaces = {
    front: {
      type: 'video',
      src: 'https://videos.pexels.com/video-files/4962907/4962907-uhd_2732_1440_25fps.mp4'
    },
    back: {
      type: 'video',
      src: 'https://videos.pexels.com/video-files/7651117/7651117-sd_640_360_25fps.mp4'
    },
    right: {
      type: 'video',
      src: 'https://videos.pexels.com/video-files/6944457/6944457-sd_640_360_25fps.mp4'
    },
    left: {
      type: 'video',
      src: 'https://videos.pexels.com/video-files/2759484/2759484-sd_640_360_30fps.mp4'
    },
    top: {
      type: 'video',
      src: 'https://videos.pexels.com/video-files/30767358/13160990_640_360_30fps.mp4'
    },
    bottom: {
      type: 'video',
      src: 'https://videos.pexels.com/video-files/8058474/8058474-sd_640_360_25fps.mp4'
    }
  };

  const dashboardFaces = {
    front: {
      type: 'html',
      html: `
        <div class="face-content">
          <div class="dashboard-title">Clock</div>
          <div class="dashboard-clock">${currentTime.toLocaleTimeString()}</div>
        </div>
      `
    },
    back: {
      type: 'html',
      html: `
        <div class="face-content">
          <div class="dashboard-title">Weather</div>
          <div class="dashboard-weather-icon">☁️</div>
          <div class="dashboard-weather">Cloudy<br />18°C</div>
        </div>
      `
    },
    right: {
      type: 'html',
      html: `
        <div class="face-content">
          <div class="dashboard-title">Music</div>
          <div class="dashboard-music">
            <div>Now Playing:<br /><b>Minimal Beat</b></div>
            <button class="dashboard-music-btn" id="music-play-btn">${isPlaying ? 'Pause' : 'Play'}</button>
          </div>
        </div>
      `
    },
    left: {
      type: 'html',
      html: `
        <div class="face-content">
          <div class="dashboard-title">Stats</div>
          <div class="dashboard-chart-bar">
            <div class="dashboard-chart-fill" style="width: ${chartValue}%"></div>
          </div>
          <div class="dashboard-note">Live Data</div>
        </div>
      `
    },
    top: {
      type: 'html',
      html: `
        <div class="face-content">
          <div class="dashboard-title">Note</div>
          <div class="dashboard-note">Stay focused and keep it simple.</div>
        </div>
      `
    },
    bottom: {
      type: 'html',
      html: `
        <div class="face-content">
          <div class="dashboard-title">Quick Links</div>
          <div>
            <a href="https://github.com/" target="_blank">GitHub</a> | 
            <a href="https://dribbble.com/" target="_blank">Dribbble</a>
          </div>
        </div>
      `
    }
  };

  return (
    <div className="app">
      <Cube3D
        size={300}
        autoRotate={true}
        rotationSpeed={0.3}
        interactive={true}
        faces={videoFaces}
        className="main-cube"
      />
      <Cube3D
        size={300}
        autoRotate={true}
        rotationSpeed={0.1}
        interactive={true}
        faces={dashboardFaces}
        className="dashboard-cube"
        style={{ marginLeft: '50px' }}
      />
    </div>
  );
}

export default App;

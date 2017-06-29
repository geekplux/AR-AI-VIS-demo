import tracking from 'tracking';
import 'tracking-face';
import './style.css';

/**
 * face tracking
 */
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const tracker = new tracking.ObjectTracker('face');
tracker.setInitialScale(4);
tracker.setStepSize(2);
tracker.setEdgesDensity(0.1);
tracking.track('#video', tracker, { camera: true });
tracker.on('track', (event) => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  event.data.forEach((rect) => {
    context.strokeStyle = '#a64ceb';
    context.lineWidth = 10;
    context.strokeRect(rect.x, rect.y, rect.width, rect.height);
    context.font = '11px Helvetica';
    context.fillStyle = '#fff';
    context.fillText(`x: ${rect.x}px`, rect.x + rect.width + 5, rect.y + 11);
    context.fillText(`y: ${rect.y}px`, rect.x + rect.width + 5, rect.y + 22);
  });
});

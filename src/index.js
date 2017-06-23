import tracking from 'tracking';
import 'tracking-face';
import './style.css';

const video = document.getElementById('video');
const h1 = document.querySelector('h1');

// navigator.getUserMedia = navigator.getUserMedia ||
//   navigator.webkitGetUserMedia ||
//   navigator.mozGetUserMedia ||
//   navigator.msGetUserMedia;

// Older browsers might not implement mediaDevices at all, so we set an empty object first
if (navigator.mediaDevices === undefined) {
  navigator.mediaDevices = {};
}

// Some browsers partially implement mediaDevices. We can't just assign an object
// with getUserMedia as it would overwrite existing properties.
// Here, we will just add the getUserMedia property if it's missing.
if (navigator.mediaDevices.getUserMedia === undefined) {
  navigator.mediaDevices.getUserMedia = (constraints) => {
    // First get ahold of the legacy getUserMedia, if present
    const getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    // Some browsers just don't implement it - return a rejected promise with an error
    // to keep a consistent interface
    if (!getUserMedia) {
      return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
    }

    // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
    return new Promise((resolve, reject) => {
      getUserMedia.call(navigator, constraints, resolve, reject);
    });
  };
}

navigator.mediaDevices.getUserMedia({ audio: true, video: true })
  .then((stream) => {
    /* use the stream */
    callback(stream);
    // var video = document.querySelector('video');
    // Older browsers may not have srcObject
    if ('srcObject' in video) {
      video.srcObject = stream;
    } else {
      // Avoid using this in new browsers, as it is going away.
      video.src = window.URL.createObjectURL(stream);
    }
    video.onloadedmetadata = (e) => {
      video.play();
    };
  })
  .catch((err) => {
    /* handle the error */
    fallback(err);
    console.log(err.name + ': ' + err.message);
  });

function fallback (e) {
  h1.innerHTML = 'not support getting userMedia';
  video.src = 'fallbackvideo.webm';
}

function callback (stream) {
  h1.innerHTML = 'success';
}

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

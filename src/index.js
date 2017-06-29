import tracking from 'tracking';
import 'tracking-face';
import './style.css';

var videoElement = document.querySelector('video');
var audioSelect = document.querySelector('select#audioSource');
var videoSelect = document.querySelector('select#videoSource');

navigator.mediaDevices.enumerateDevices()
  .then(gotDevices).then(getStream).catch(handleError);

audioSelect.onchange = getStream;
videoSelect.onchange = getStream;

function gotDevices (deviceInfos) {
  for (let i = 0; i !== deviceInfos.length; ++i) {
    const deviceInfo = deviceInfos[i];
    const option = document.createElement('option');
    option.value = deviceInfo.deviceId;
    if (deviceInfo.kind === 'audioinput') {
      option.text = deviceInfo.label ||
        'microphone ' + (audioSelect.length + 1);
      audioSelect.appendChild(option);
    } else if (deviceInfo.kind === 'videoinput') {
      option.text = deviceInfo.label || 'camera ' +
        (videoSelect.length + 1);
      videoSelect.appendChild(option);
    } else {
      console.log('Found ome other kind of source/device: ', deviceInfo);
    }
  }
}

function getStream () {
  if (window.stream) {
    window.stream.getTracks().forEach((track) => track.stop());
  }

  var constraints = {
    audio: {
      optional: [{
        sourceId: audioSelect.value
      }]
    },
    video: {
      optional: [{
        sourceId: videoSelect.value
      }]
    }
  };

  navigator.mediaDevices.getUserMedia(constraints)
    .then(gotStream).catch(handleError);
}

function gotStream (stream) {
  window.stream = stream; // make stream available to console
  videoElement.srcObject = stream;
}

function handleError (error) {
  console.log('Error: ', error);
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

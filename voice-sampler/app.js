const info = document.getElementById("info");
const message = document.getElementById("message");
const statusButton = document.getElementById("status-btn");

const scopeBgColor = "black";
const scopeRayColor = "lightgreen";

// 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768. Defaults to 2048.
let sliderValue = 6;
let FFT_SIZE = 2 ** (sliderValue + 5);

const canvas = document.querySelector("canvas");
const canvasCtx = canvas.getContext("2d");

const DPR = window.devicePixelRatio || 1;
const cssWidth = canvas.clientWidth;
const cssHeight = canvas.clientHeight;
canvas.width = Math.floor(cssWidth * DPR);
canvas.height = Math.floor(cssHeight * DPR);
canvas.style.width = cssWidth + "px";
canvas.style.height = cssHeight + "px";
canvasCtx.scale(DPR, DPR);
const WIDTH = cssWidth;
const HEIGHT = cssHeight;
const scaleY = HEIGHT / 256;
canvasCtx.fillStyle = scopeBgColor;
canvasCtx.lineWidth = 2;
canvasCtx.strokeStyle = scopeRayColor;

let analyser, bufferLength, dataArray, drawVisual, mediaStream,
  audioContext, sampleRate, sliceWidth;

const draw = () => {
  drawVisual = requestAnimationFrame(draw);

  analyser.getByteTimeDomainData(dataArray);

  canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

  canvasCtx.beginPath();

  const startY = dataArray[0] * scaleY;
  canvasCtx.moveTo(0, startY);

  for (let i = 1; i < bufferLength; i++) {
    const y = dataArray[i] * scaleY;
    canvasCtx.lineTo(sliceWidth * i, y);
  }

  canvasCtx.stroke();
};

const startAudio = async () =>
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((stream) => {
      mediaStream = stream;
      audioContext = new AudioContext();
      // resume in case it's suspended by autoplay policy
      if (audioContext.state === "suspended") audioContext.resume();

      sampleRate = audioContext.sampleRate;

      const source = audioContext.createMediaStreamSource(stream);
      analyser = audioContext.createAnalyser();
      source.connect(analyser);

      analyser.fftSize = FFT_SIZE;
      bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);

      sliceWidth = WIDTH / (bufferLength - 1);
      draw();
    })
    .catch((err) => {
      const { name } = err;
      if (name === "NotAllowedError" || name === "PermissionDeniedError") {
        message.textContent = "Microphone permission denied";
      } else if (name === "NotFoundError") {
        message.textContent = "No microphone found";
      } else {
        message.textContent = `Error: ${err.message}`;
      }
    });

const stopAudio = () => {
  if (drawVisual) cancelAnimationFrame(drawVisual);
  if (mediaStream) mediaStream.getTracks().forEach((t) => t.stop());
  if (audioContext && audioContext.state !== "closed") audioContext.close();

  state = 'stopped';
  message.textContent = "Audio stopped.";
  statusButton.textContent = 'Start'
};

let state = 'stopped';

statusButton.addEventListener("click", async () => {
  switch (state) {
    case 'stopped':
      await startAudio();
      state = 'started';
      info.textContent = `Sample rate: ${sampleRate / 1000} kHz
      screen width: ${(bufferLength / sampleRate * 1000).toFixed(3)} ms
      `;
      message.textContent = "Audio started.";
      statusButton.textContent = 'Stop'
      break
    case 'started':
      stopAudio();
  }
});

const fftSlider = document.querySelector('#fft-slider');

fftSlider.value = sliderValue;
fftSlider.nextElementSibling.textContent = FFT_SIZE;

fftSlider.addEventListener('input', (event) => {
  if (state !== 'stopped') stopAudio();

  sliderValue = Number(event.target.value);
  FFT_SIZE = 2 ** (sliderValue + 5);
  fftSlider.nextElementSibling.textContent = FFT_SIZE;
});
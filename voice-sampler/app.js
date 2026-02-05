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

let analyser, bufferLength, dataArray, drawVisual, mediaStream,
  audioContext, sampleRate;

const draw = () => {
  drawVisual = requestAnimationFrame(draw);

  analyser.getByteTimeDomainData(dataArray);

  canvasCtx.fillStyle = scopeBgColor;
  canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

  canvasCtx.lineWidth = 2;
  canvasCtx.strokeStyle = scopeRayColor;
  canvasCtx.beginPath();

  const sliceWidth = WIDTH / bufferLength;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    const v = dataArray[i] / 128;
    const y = v * HEIGHT / 2;
    if (i === 0) canvasCtx.moveTo(x, y);
    else canvasCtx.lineTo(x, y);
    x += sliceWidth;
  }

  canvasCtx.lineTo(WIDTH, HEIGHT / 2);
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

      draw();
    })
    .catch((err) => {
      const { name } = err;
      if (name === "NotAllowedError" || name === "PermissionDeniedError") {
        message.textContent = "Microphone permission denied";
      } else if (name === "NotFoundError") {
        message.textContent = "No microphone found";
      } else {
        message.textContent = "Error: " + err.message;
      }
    });

const stopAudio = () => {
  if (drawVisual) cancelAnimationFrame(drawVisual);
  if (mediaStream) mediaStream.getTracks().forEach((t) => t.stop());
  if (audioContext && audioContext.state !== "closed") audioContext.close();

  state = 'stop';
  message.textContent = "Audio stopped.";
  statusButton.textContent = 'Start'
};

let state = 'stop';

statusButton.addEventListener("click", async () => {
  switch (state) {
    case 'stop':
      await startAudio();
      state = 'start';
      info.textContent = `Sample rate: ${sampleRate / 1000} kHz
      screen width: ${(bufferLength / sampleRate * 1000).toFixed(3)} ms
      `;
      message.textContent = "Audio started.";
      statusButton.textContent = 'Stop'
      break
    case 'start':
      stopAudio();
  }
});

const fftSlider = document.querySelector('#fft-slider');

fftSlider.value = sliderValue;
fftSlider.nextElementSibling.textContent = FFT_SIZE;

fftSlider.addEventListener('input', (event) => {
  if (state !== 'stop') stopAudio();

  sliderValue = Number(event.target.value);
  FFT_SIZE = 2 ** (sliderValue + 5);
  fftSlider.nextElementSibling.textContent = FFT_SIZE;
});
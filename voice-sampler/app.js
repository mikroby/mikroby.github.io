const message = document.getElementById("message");
const stopButton = document.getElementById("stop-btn");

const scopeBgColor = "black";
const scopeRayColor = "green";

const canvas = document.querySelector("canvas");
const canvasCtx = canvas.getContext("2d");

const DPR = window.devicePixelRatio || 1;
const cssWidth = canvas.clientWidth || 300;
const cssHeight = canvas.clientHeight || 150;
canvas.width = Math.floor(cssWidth * DPR);
canvas.height = Math.floor(cssHeight * DPR);
canvas.style.width = cssWidth + "px";
canvas.style.height = cssHeight + "px";
canvasCtx.scale(DPR, DPR);

const WIDTH = cssWidth;
const HEIGHT = cssHeight;

let analyser, bufferLength, dataArray, drawVisual, mediaStream, audioContext;

const draw = () => {
  drawVisual = requestAnimationFrame(draw);

  analyser.getByteTimeDomainData(dataArray);

  canvasCtx.fillStyle = scopeBgColor;
  canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

  canvasCtx.lineWidth = 2;
  canvasCtx.strokeStyle = "rgb(0,0,0)";
  canvasCtx.beginPath();

  const sliceWidth = WIDTH / bufferLength;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    const v = dataArray[i] / 128.0;
    const y = (v * HEIGHT) / 2;
    if (i === 0) canvasCtx.moveTo(x, y);
    else canvasCtx.lineTo(x, y);
    x += sliceWidth;
  }

  canvasCtx.lineTo(WIDTH, HEIGHT / 2);
  canvasCtx.stroke();
};

navigator.mediaDevices
  .getUserMedia({ audio: true })
  .then((stream) => {
    mediaStream = stream;
    audioContext = new AudioContext();
    // resume in case it's suspended by autoplay policy
    if (audioContext.state === "suspended") audioContext.resume();

    const source = audioContext.createMediaStreamSource(stream);
    analyser = audioContext.createAnalyser();
    source.connect(analyser);

    analyser.fftSize = 2048;
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    message.textContent = "Audio started.";
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
};

stopButton.addEventListener("click", () => {
  stopAudio();
  message.textContent = "Audio stopped.";
});

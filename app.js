window.addEventListener("load", () => {
  const canvas = document.getElementById("starfield");
if (!canvas) return;

const ctx = canvas.getContext("2d");
ctx.shadowBlur = 0;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];

document.addEventListener("mousemove", (e) => {
  for (let i = 0; i < 1; i++) {
    particles.push({
      x: e.clientX,
      y: e.clientY,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      alpha: 1,
      size: Math.random() * 1 + 0.3
    });
  }
});

function draw() {
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];

    p.x += p.vx;
    p.y += p.vy;
    p.alpha -= 0.008;

    ctx.beginPath();
    ctx.fillStyle = `rgba(255, 200, 120, ${p.alpha})`;
    ctx.shadowColor = "rgba(255, 220, 140, 0.5)";
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();

    if (p.alpha <= 0) {
      particles.splice(i, 1);
      i--;
    }
  }

  requestAnimationFrame(draw);
}

draw();

window.addEventListener("DOMContentLoaded", () => {

console.log("APP LOADED");
  
let mediaRecorder;
let audioChunks = [];

let decayLevel = parseInt(localStorage.getItem("decayLevel") || "0");

function getCooldownMessage() {
  const now = Date.now();
  const diff = now - lastSendTime;

  const fiveMinutes = 5 * 60 * 1000;
  const twentyFourHours = 24 * 60 * 60 * 1000;

  if (messageCount >= 3) {
    if (diff < twentyFourHours) {
      return {
        allowed: false,
        message: "PLEASE WAIT 24 HOURS TO SEND ANOTHER MESSAGE TO DECREASE SPAM"
      };
    }
  }

  if (diff < fiveMinutes) {
    return {
      allowed: false,
      message: "PLEASE WAIT 5 MINUTES UNTIL YOU CAN SEND ANOTHER MESSAGE"
    };
  }

  return { allowed: true };
}


function applySunDecay() {
  const title = document.querySelector(".sun-title");
  
  if (!title) return;

  const baseText = "TELL ME HOW THE SUN CHANGED YOU";

  let corrupted = baseText.split("");

  const chars = "!@#$%^&*~░▒▓█/\\|";

  for (let i = 0; i < decayLevel; i++) {
    const index = Math.floor(Math.random() * corrupted.length);
    const randomChar = chars[Math.floor(Math.random() * chars.length)];

    corrupted =
      corrupted.substring(0, index) +
      randomChar +
      corrupted.substring(index + 1);
  }

  title.innerText = corrupted.join("");
}

const recordBtn = document.getElementById("record");
const stopBtn = document.getElementById("stop");
const statusText = document.getElementById("status");
const visual = document.getElementById("visual");

let lastSendTime = parseInt(localStorage.getItem("lastSendTime") || "0");
let messageCount = parseInt(localStorage.getItem("messageCount") || "0");

recordBtn.onclick = async () => {
const check = getCooldownMessage();

if (!check.allowed) {
  statusText.innerText = check.message;
  return;

  }

  cooldown = true;

  statusText.innerText = "REQUESTING VOICE...";
  visual.classList.add("recording");

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  mediaRecorder = new MediaRecorder(stream);
  audioChunks = [];

  mediaRecorder.ondataavailable = e => {
    audioChunks.push(e.data);
  };

  mediaRecorder.onstop = async () => {

    statusText.innerText = "SENDING TO THE ARCHIVE...";

    const audioBlob = new Blob(audioChunks, { type: "audio/webm" });

    const formData = new FormData();
    formData.append("file", audioBlob, "message.webm");
    formData.append("content", "A voice returned to the archive");

    await fetch(
      "https://discord.com/api/webhooks/1503392023250735104/SBZ4pxroQceHwvfQQ4yit8K8JFqX5d0tTdTZ7v8c_wT0prULE4pm98H4g1UCDsvvd5sB",
      {
        method: "POST",
        body: formData
      }
    );

    statusText.innerText = "SENT";
lastSendTime = Date.now();
messageCount += 1;

localStorage.setItem("lastSendTime", lastSendTime);
localStorage.setItem("messageCount", messageCount);

decayLevel += 1;
localStorage.setItem("decayLevel", decayLevel);
applySunDecay();

    visual.classList.remove("recording");

    setTimeout(() => {
      cooldown = false;
      statusText.innerText = "";
    }, 8000); // cooldown prevents spam
  };

  mediaRecorder.start();

  recordBtn.disabled = true;
  stopBtn.disabled = false;

  statusText.innerText = "RECORDING...";
};

stopBtn.onclick = () => {

  mediaRecorder.stop();

  recordBtn.disabled = false;
  stopBtn.disabled = true;
};

window.addEventListener("load", () => {
  applySunDecay();

function triggerGlitch() {
  const title = document.querySelector(".sun-title");
  if (!canvas) {
  console.log("No starfield canvas found");
} else {

  title.classList.add("glitch-on");

  setTimeout(() => {
    title.classList.remove("glitch-on");
  }, 200);
}

setInterval(() => {
  triggerGlitch();
}, 3000 + Math.random() * 2000);
const countdownTarget = new Date("2026-06-20T18:00:00+01:00");

function updateCountdown() {
  const timer = document.getElementById("countdown-timer");
  if (!timer) return;

  const now = new Date();
  const difference = countdownTarget - now;

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / (1000 * 60)) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  timer.innerHTML =
    `DAYS: <span class="timer-number">${days}</span>
     HOURS: <span class="timer-number">${hours}</span>
     MINUTES: <span class="timer-number">${minutes}</span>
     SECONDS: <span class="timer-number">${seconds}</span>`;
}

updateCountdown();
setInterval(updateCountdown, 1000);

console.log("APP LOADED");

window.addEventListener("DOMContentLoaded", () => {

  // ----------------------------
  // BASIC STATE
  // ----------------------------
  let mediaRecorder;
  let audioChunks = [];

  let decayLevel = parseInt(localStorage.getItem("decayLevel") || "0");
  let lastSendTime = parseInt(localStorage.getItem("lastSendTime") || "0");
  let messageCount = parseInt(localStorage.getItem("messageCount") || "0");

  let cooldown = false;

  // ----------------------------
  // ELEMENTS
  // ----------------------------
  const recordBtn = document.getElementById("record");
  const stopBtn = document.getElementById("stop");
  const statusText = document.getElementById("status");
  const visual = document.getElementById("visual");

  // ----------------------------
  // COOLDOWN LOGIC
  // ----------------------------
  function getCooldownMessage() {
    const now = Date.now();
    const diff = now - lastSendTime;

    const fiveMinutes = 5 * 60 * 1000;
    const twentyFourHours = 24 * 60 * 60 * 1000;

    if (messageCount >= 3 && diff < twentyFourHours) {
      return {
        allowed: false,
        message: "PLEASE WAIT 24 HOURS TO SEND ANOTHER MESSAGE"
      };
    }

    if (diff < fiveMinutes) {
      return {
        allowed: false,
        message: "PLEASE WAIT 5 MINUTES"
      };
    }

    return { allowed: true };
  }

  // ----------------------------
  // SUN DECAY
  // ----------------------------
  function applySunDecay() {
    const title = document.querySelector(".sun-title");
    if (!title) return;

    const baseText = "TELL ME HOW THE SUN CHANGED YOU";
    let corrupted = baseText.split("");

    const chars = "!@#$%^&*~░▒▓█/\\|";

    for (let i = 0; i < decayLevel; i++) {
      const index = Math.floor(Math.random() * corrupted.length);
      const randomChar = chars[Math.floor(Math.random() * chars.length)];
      corrupted[index] = randomChar;
    }

    title.innerText = corrupted.join("");
  }

  // ----------------------------
  // GLITCH
  // ----------------------------
  function triggerGlitch() {
    const title = document.querySelector(".sun-title");
    if (!title) return;

    title.classList.add("glitch-on");

    setTimeout(() => {
      title.classList.remove("glitch-on");
    }, 200);
  }

  setInterval(triggerGlitch, 4000);

  // ----------------------------
  // COUNTDOWN
  // ----------------------------
  const countdownTarget = new Date("2026-06-20T18:00:00+01:00");

  function updateCountdown() {
    const timer = document.getElementById("countdown-timer");
    if (!timer) return;

    const now = new Date();
    const diff = countdownTarget - now;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    timer.innerHTML =
      `DAYS: <span class="timer-number">${days}</span>
       HOURS: <span class="timer-number">${hours}</span>
       MINUTES: <span class="timer-number">${minutes}</span>
       SECONDS: <span class="timer-number">${seconds}</span>`;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ----------------------------
  // RECORDING
  // ----------------------------
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

    mediaRecorder.ondataavailable = (e) => {
      audioChunks.push(e.data);
    };

    mediaRecorder.onstop = async () => {
      statusText.innerText = "SENDING...";

      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });

      const formData = new FormData();
      formData.append("file", audioBlob, "message.webm");
      formData.append("content", "A voice returned to the archive");

      await fetch("https://discord.com/api/webhooks/1503392023250735104/SBZ4pxroQceHwvfQQ4yit8K8JFqX5d0tTdTZ7v8c_wT0prULE4pm98H4g1UCDsvvd5sB", {
        method: "POST",
        body: formData
      });

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
      }, 5000);
    };

    mediaRecorder.start();

    recordBtn.disabled = true;
    stopBtn.disabled = false;

    statusText.innerText = "RECORDING...";
  };

  stopBtn.onclick = () => {
    if (mediaRecorder) mediaRecorder.stop();

    recordBtn.disabled = false;
    stopBtn.disabled = true;
  };

  // ----------------------------
  // INIT
  // ----------------------------
  applySunDecay();

  window.addEventListener("load", () => {
    applySunDecay();
  });

});

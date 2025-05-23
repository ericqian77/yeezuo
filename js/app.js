// DOM elements
const timerDisplay = document.getElementById('timer-display');
const startStopBtn = document.getElementById('start-stop-btn');
const todayTimeDisplay = document.getElementById('today-time');
const backgroundSelector = document.getElementById('background-selector');
const themeToggleBtn = document.getElementById('theme-toggle');

// Audio element
const audio = new Audio('audio/misty-forests-rainy-seasons_001.mp3');
audio.loop = true;

// Background options
const backgrounds = [
  'linear-gradient(to bottom right, #e0f7fa, #b2ebf2)',
  'linear-gradient(to bottom right, #e8f5e9, #c8e6c9)',
  'linear-gradient(to bottom right, #fff3e0, #ffe0b2)',
  'linear-gradient(to bottom right, #f3e5f5, #e1bee7)',
];

let intervalId;
let isRunning = false;
let seconds = 0;
let todaySeconds = 0;
let darkMode = false;

// Update timer display
function updateDisplay(time) {
  const minutes = Math.floor(time / 60);
  const remainingSeconds = time % 60;
  timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Fade in audio
function fadeInAudio(duration = 2000) {
  audio.volume = 0;
  audio.play();
  let start = Date.now();
  let timer = setInterval(() => {
    let timePassed = Date.now() - start;
    if (timePassed >= duration) {
      clearInterval(timer);
      audio.volume = 1;
      return;
    }
    audio.volume = timePassed / duration;
  }, 50);
}

// Fade out audio
function fadeOutAudio(duration = 2000) {
  let start = Date.now();
  let timer = setInterval(() => {
    let timePassed = Date.now() - start;
    if (timePassed >= duration) {
      clearInterval(timer);
      audio.pause();
      audio.volume = 1;
      return;
    }
    audio.volume = 1 - timePassed / duration;
  }, 50);
}

// Start or stop the timer
function toggleTimer() {
  if (isRunning) {
    clearInterval(intervalId);
    fadeOutAudio();
    startStopBtn.textContent = 'Start Session';
    todaySeconds += seconds;
    updateTodayTime();
    seconds = 0;
    updateDisplay(seconds);
  } else {
    intervalId = setInterval(() => {
      seconds++;
      updateDisplay(seconds);
    }, 1000);
    fadeInAudio();
    startStopBtn.textContent = 'End Session';
  }
  isRunning = !isRunning;
}

// Update today's meditation time
function updateTodayTime() {
  const minutes = Math.floor(todaySeconds / 60);
  todayTimeDisplay.textContent = minutes;
  localStorage.setItem('todayMeditationTime', todaySeconds);
}

// Reset daily progress at midnight
function checkAndResetDaily() {
  const now = new Date();
  const lastReset = new Date(localStorage.getItem('lastResetDate') || 0);

  if (
    now.getDate() !== lastReset.getDate() ||
    now.getMonth() !== lastReset.getMonth() ||
    now.getFullYear() !== lastReset.getFullYear()
  ) {
    todaySeconds = 0;
    updateTodayTime();
    localStorage.setItem('lastResetDate', now.toISOString());
  }
}

// Change background
function changeBackground(index) {
  document.body.style.background = backgrounds[index];
  localStorage.setItem('selectedBackground', index);
}

function toggleDarkMode() {
  darkMode = !darkMode;
  document.body.classList.toggle('dark-mode', darkMode);
  themeToggleBtn.textContent = darkMode ? 'Light Mode' : 'Dark Mode';
  localStorage.setItem('darkMode', darkMode ? '1' : '0');
}

// Event listeners
startStopBtn.addEventListener('click', toggleTimer);
backgroundSelector.addEventListener('change', (e) => changeBackground(e.target.value));
themeToggleBtn.addEventListener('click', toggleDarkMode);

// Initialize
window.addEventListener('load', () => {
  checkAndResetDaily();
  const storedTime = localStorage.getItem('todayMeditationTime');
  if (storedTime) {
    todaySeconds = parseInt(storedTime, 10);
    updateTodayTime();
  }

  const storedBackground = localStorage.getItem('selectedBackground');
  if (storedBackground) {
    changeBackground(storedBackground);
    backgroundSelector.value = storedBackground;
  }

  const storedDarkMode = localStorage.getItem('darkMode');
  if (storedDarkMode === '1') {
    darkMode = true;
    document.body.classList.add('dark-mode');
    themeToggleBtn.textContent = 'Light Mode';
  }
});

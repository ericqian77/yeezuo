// DOM elements
const timerDisplay = document.getElementById('timer-display');
const startStopBtn = document.getElementById('start-stop-btn');
const todayTimeDisplay = document.getElementById('today-time');

// Audio element
const audio = new Audio('audio/misty-forests-rainy-seasons_001.mp3');
audio.loop = true; // This will make the audio loop continuously

let intervalId;
let isRunning = false;
let seconds = 0;
let todaySeconds = 0;

// Update timer display
function updateDisplay(time) {
    const minutes = Math.floor(time / 60);
    const remainingSeconds = time % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Start or stop the timer
function toggleTimer() {
    if (isRunning) {
        clearInterval(intervalId);
        audio.pause();
        audio.currentTime = 0; // Reset audio to beginning
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
        audio.play();
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
    
    if (now.getDate() !== lastReset.getDate() || now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
        todaySeconds = 0;
        updateTodayTime();
        localStorage.setItem('lastResetDate', now.toISOString());
    }
}

// Event listener for start/stop button
startStopBtn.addEventListener('click', toggleTimer);

// Load today's meditation time from local storage and check for reset
window.addEventListener('load', () => {
    checkAndResetDaily();
    const storedTime = localStorage.getItem('todayMeditationTime');
    if (storedTime) {
        todaySeconds = parseInt(storedTime, 10);
        updateTodayTime();
    }
});
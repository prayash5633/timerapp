document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const hoursDisplay = document.getElementById('hours');
    const minutesDisplay = document.getElementById('minutes');
    const secondsDisplay = document.getElementById('seconds');
    const millisecondsDisplay = document.getElementById('milliseconds');
    const inputHours = document.getElementById('input-hours');
    const inputMinutes = document.getElementById('input-minutes');
    const inputSeconds = document.getElementById('input-seconds');
    const controlBtn = document.getElementById('control-btn');
    const resetBtn = document.getElementById('reset-btn');
    const alarmSound = document.getElementById('alarm-sound');

    // Timer Variables
    let timer;
    let totalMilliseconds = 0;
    let remainingMilliseconds = 0;
    let isRunning = false;
    let isPaused = false;
    let startTime;

    // Initialize Display
    updateDisplay(0, 0, 0, 0);

    // Setup Scroll Buttons
    document.querySelectorAll('.increment').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.nextElementSibling;
            input.stepUp();
            if (input.value > input.max) input.value = input.max;
        });
    });

    document.querySelectorAll('.decrement').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.previousElementSibling;
            input.stepDown();
            if (input.value < input.min) input.value = input.min;
        });
    });

    // Control Button (Start/Pause/Resume)
    controlBtn.addEventListener('click', () => {
        if (!isRunning && !isPaused) {
            startTimer();
        } else if (isRunning && !isPaused) {
            pauseTimer();
        } else if (!isRunning && isPaused) {
            resumeTimer();
        }
    });

    // Reset Button
    resetBtn.addEventListener('click', resetTimer);

    // Timer Functions
    function startTimer() {
        const hours = parseInt(inputHours.value) || 0;
        const minutes = parseInt(inputMinutes.value) || 0;
        const seconds = parseInt(inputSeconds.value) || 0;

        totalMilliseconds = (hours * 3600 + minutes * 60 + seconds) * 1000;

        if (totalMilliseconds > 0) {
            startTime = Date.now();
            isRunning = true;
            controlBtn.textContent = 'Pause';
            runTimer();
        }
    }

    function pauseTimer() {
        clearTimeout(timer);
        isRunning = false;
        isPaused = true;
        controlBtn.textContent = 'Resume';
    }

    function resumeTimer() {
        startTime = Date.now() - (totalMilliseconds - remainingMilliseconds);
        isRunning = true;
        isPaused = false;
        controlBtn.textContent = 'Pause';
        runTimer();
    }

    function resetTimer() {
        clearTimeout(timer);
        isRunning = false;
        isPaused = false;
        remainingMilliseconds = 0;
        totalMilliseconds = 0;
        controlBtn.textContent = 'Start';
        updateDisplay(0, 0, 0, 0);
        alarmSound.pause();
        alarmSound.currentTime = 0;
    }

    function runTimer() {
        if (!isRunning) return;

        const elapsed = Date.now() - startTime;
        remainingMilliseconds = totalMilliseconds - elapsed;

        if (remainingMilliseconds <= 0) {
            finishTimer();
            return;
        }

        updateTimerDisplay(remainingMilliseconds);
        timer = setTimeout(runTimer, 10);
    }

    function finishTimer() {
        clearTimeout(timer);
        isRunning = false;
        remainingMilliseconds = 0;
        controlBtn.textContent = 'Start';
        updateDisplay(0, 0, 0, 0);
        alarmSound.play(); // Play alarm sound
    }

    function updateTimerDisplay(ms) {
        const hours = Math.floor(ms / (1000 * 60 * 60));
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((ms % (1000 * 60)) / 1000);
        const milliseconds = Math.floor((ms % 1000) / 10);

        updateDisplay(hours, minutes, seconds, milliseconds);
    }

    function updateDisplay(h, m, s, ms) {
        hoursDisplay.textContent = padZero(h);
        minutesDisplay.textContent = padZero(m);
        secondsDisplay.textContent = padZero(s);
        millisecondsDisplay.textContent = padZero(ms);
    }

    function padZero(num) {
        return num.toString().padStart(2, '0');
    }
});
const timerElement = document.getElementById('timer');
const playButton = document.getElementById('play');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');
const optionButtons = document.querySelectorAll('.set-timer');

function formatTime(seconds) {
    const min = Math.floor(seconds / 60).toString().padStart(2, '0');
    const sec = (seconds % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
}

function updateTimerDisplay(timeLeft) {
    timerElement.textContent = formatTime(timeLeft);
}

chrome.runtime.sendMessage({ action: 'getStatus' }, (response) => {
    updateTimerDisplay(response.timeLeft);
});

chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action === 'update') {
        updateTimerDisplay(msg.timeLeft);
    }

    if (msg.action === 'finished') {
        const audio = new Audio('audio.mp3');
        audio.play();

        if (msg.cycles >= 3) {
            confetti({
                particleCount: 200,
                spread: 80,
                origin: { y: 0.6 }
            });
            alert('Parabéns! 3 ciclos completos 🎉');
        } else {
            alert('Pomodoro completo! Hora de descansar.');
        }
    }
});

playButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'start' });
});

pauseButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'pause' });
});

resetButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'reset' });
});

optionButtons.forEach(button => {
    button.addEventListener('click', () => {
        const time = parseInt(button.dataset.time);
        chrome.runtime.sendMessage({ action: 'setTime', time });
    });
});

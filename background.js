let timer = null;
let timeLeft = 1500; // 25 minutos padrão
let running = false;
let cycles = 0;

function tick() {
    if (timeLeft > 0) {
        timeLeft--;
    } else {
        running = false;
        clearInterval(timer);
        cycles++;

        chrome.runtime.sendMessage({ action: 'finished', cycles });

        if (cycles >= 3) {
            cycles = 0;
        }

        timeLeft = 300; // 5 min descanso
    }

    chrome.runtime.sendMessage({ action: 'update', timeLeft, cycles, running });
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === 'start') {
        if (!running) {
            running = true;
            timer = setInterval(tick, 1000);
        }
    }

    if (msg.action === 'pause') {
        running = false;
        clearInterval(timer);
    }

    if (msg.action === 'reset') {
        running = false;
        clearInterval(timer);
        timeLeft = 1500;
        cycles = 0;
    }

    if (msg.action === 'setTime') {
        running = false;
        clearInterval(timer);
        timeLeft = msg.time;
        cycles = 0;
    }

    if (msg.action === 'getStatus') {
        sendResponse({ timeLeft, cycles, running });
    }
});

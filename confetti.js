// Make sure to include the canvas-confetti library in your HTML file before this script runs.

function startConfetti() {
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
    });
}
let timer = 120; 
const timerDisplay = document.getElementById('timer');


function runningTimer() {
    if (timer > 0) {
        timer--; 
        timerDisplay.textContent = timer;
    } else {
        clearInterval(timerInterval);
        alert('Timer up');
    }
}

// hier wird es gezeigt
const timerInterval = setInterval(() => {
    runningTimer();
}, 1000);

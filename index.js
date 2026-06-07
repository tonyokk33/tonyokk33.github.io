// Variables de estado
let workDuration = 50 * 60;
let breakDuration = 10 * 60;
let timeLeft = workDuration;
let timerId = null;
let isWorkTime = true; 

const alarmSound = document.getElementById('alarmSound'); 

const display = document.getElementById('timer-display');
const btnStart = document.getElementById('btn-start');
const btnPause = document.getElementById('btn-pause');
const btnReset = document.getElementById('btn-reset');
const statusLabel = document.getElementById('status-label');

function stopSound() {
    if(alarmSound) {
        alarmSound.pause();
        alarmSound.currentTime = 0; 
    }
}

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
   
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;
    
    display.textContent = `${formattedMinutes}:${formattedSeconds}`;
}


function startTimer() {
    
    if (timerId !== null) return;

    timerId = setInterval(() => {
        timeLeft--;
        updateDisplay();

        
        if (timeLeft === 0) {
            clearInterval(timerId);
            timerId = null;
            
            if(alarmSound) {
                alarmSound.play(); 
            }
            
            isWorkTime = !isWorkTime;
            timeLeft = isWorkTime ? workDuration : breakDuration;
            
            
            if (statusLabel) {
                statusLabel.textContent = isWorkTime ? "Pulsa INICIAR" : "¡Descanso! Pulsa INICIAR para volver al trabajo.";
            }
            
            updateDisplay();
            
            
            alert(isWorkTime ? "¡Se acabó el descanso! A trabajar." : "¡Buen trabajo! Toma un descanso.");
        }
    }, 1000); 
}


function pauseTimer() {
    clearInterval(timerId);
    timerId = null;

    stopSound();
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    isWorkTime = true;
    timeLeft = workDuration;

    stopSound(); 
    
    if (statusLabel) {
        statusLabel.textContent = "Pulsa INICIAR";
    }
    
    updateDisplay();
}


btnStart.addEventListener('click', startTimer);
btnPause.addEventListener('click', pauseTimer);
btnReset.addEventListener('click', resetTimer);


updateDisplay();
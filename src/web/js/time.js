let timerInterval

$("#timer-start").addEventListener("click", startTimer)
$("#timer-pause").addEventListener("click", pauseTimer)
$("#timer-stop").addEventListener("click", stopTimer)
$("#timer-set").addEventListener("click", () => {
  const minutes = $("#timer-minutes").value
  const seconds = $("#timer-seconds").value

  setTimer(minutes, seconds)
})

function startTimer() {
  if(timerInterval) clearInterval(timerInterval)

  timerInterval = setInterval(() => {
    time -= 1000

    parseTime(time)

    if(time <= 0) {
      audio.play()
      clearInterval(timerInterval)
    }
  }, 1000)
}

function pauseTimer() {
  if(timerInterval) clearInterval(timerInterval)
}

function stopTimer() {
  pauseTimer()
  time = 65 * 60 * 1000
  parseTime(time)
}

function setTimer(minutes, seconds) {
  if(minutes<0) {
    minutes = 0
  }

  if(seconds<0) {
    seconds = 0
  }

  time = (minutes * 60 * 1000) + (seconds * 1000)
  parseTime(time)
}

function parseTime(ms) {
  let minutes = Math.floor(ms / 60 / 1000)
  let seconds = (ms / 1000) % 60

  if(minutes<10) minutes = "0"+minutes
  if(seconds<10) seconds = "0"+seconds

  $("#menu-timer").textContent = `${minutes}:${seconds}`
  $("#timer-large").textContent = `${minutes}:${seconds}`
}

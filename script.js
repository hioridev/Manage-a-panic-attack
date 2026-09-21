const dailyMessages = [
  "This feeling is intense, but it is not forever.",
  "You do not have to feel calm to begin caring for yourself.",
  "A hard moment is not a failed day.",
  "Let today be made of small, manageable things.",
  "Your body is trying to protect you. You can answer it gently.",
  "You are allowed to pause without explaining why.",
  "There is no prize for rushing through recovery.",
  "You have made it through every wave before this one.",
  "Your next breath can be soft, not perfect.",
  "Needing support does not make you a burden.",
  "You can be proud of yourself for staying with this moment.",
  "Even a little steadiness counts.",
  "Today, speak to yourself like someone worth comforting.",
  "You are still here, and that is enough for right now."
];

const dailyMessage = document.querySelector("#daily-message");
const todayDate = document.querySelector("#today-date");

function getDayNumber(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  return Math.floor((date - start) / 86400000);
}

const today = new Date();
if (dailyMessage) {
  dailyMessage.textContent = dailyMessages[getDayNumber(today) % dailyMessages.length];
}
if (todayDate) {
  todayDate.textContent = new Intl.DateTimeFormat("en-CA", {
    weekday: "long",
    month: "long",
    day: "numeric"
  }).format(today);
}

const breathVisual = document.querySelector("#breathing-visual");
const breathPhase = document.querySelector("#breath-phase");
const breathTimer = document.querySelector("#breath-timer");
const breathToggle = document.querySelector("#breath-toggle");
const breathReset = document.querySelector("#breath-reset");

let breathingInterval;
let secondsRemaining = 60;
let elapsedInCycle = 0;
let isBreathing = false;

function displayTime() {
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = String(secondsRemaining % 60).padStart(2, "0");
  breathTimer.textContent = `${minutes}:${seconds}`;
  breathTimer.setAttribute("aria-label", `${secondsRemaining} seconds remaining`);
}

function setBreathPhase() {
  const inhaling = elapsedInCycle < 4;
  breathVisual.classList.toggle("inhale", inhaling);
  breathVisual.classList.toggle("exhale", !inhaling);
  breathPhase.textContent = inhaling ? "Breathe in" : "Breathe out";
}

function stopBreathing(completed = false) {
  window.clearInterval(breathingInterval);
  isBreathing = false;
  breathVisual.classList.remove("inhale", "exhale");
  breathToggle.textContent = completed ? "Breathe again" : "Continue";
  breathPhase.textContent = completed ? "You made some space" : "Paused";
}

function startBreathing() {
  if (secondsRemaining === 0) {
    secondsRemaining = 60;
    elapsedInCycle = 0;
    displayTime();
  }

  isBreathing = true;
  breathToggle.textContent = "Pause";
  setBreathPhase();
  breathingInterval = window.setInterval(() => {
    secondsRemaining -= 1;
    elapsedInCycle = (elapsedInCycle + 1) % 10;
    displayTime();
    setBreathPhase();

    if (secondsRemaining <= 0) {
      stopBreathing(true);
    }
  }, 1000);
}

breathToggle?.addEventListener("click", () => {
  if (isBreathing) {
    stopBreathing(false);
  } else {
    startBreathing();
  }
});

breathReset?.addEventListener("click", () => {
  window.clearInterval(breathingInterval);
  isBreathing = false;
  secondsRemaining = 60;
  elapsedInCycle = 0;
  breathVisual.classList.remove("inhale", "exhale");
  breathPhase.textContent = "Ready when you are";
  breathToggle.textContent = "Start breathing";
  displayTime();
});

const groundingButtons = [...document.querySelectorAll(".sense-checks button")];
const groundingCount = document.querySelector("#grounding-count");
const groundingProgressBar = document.querySelector("#grounding-progress-bar");
const groundingReset = document.querySelector("#grounding-reset");

function updateGroundingProgress() {
  const checked = groundingButtons.filter((button) => button.classList.contains("is-checked")).length;
  if (groundingCount) {
    groundingCount.textContent = checked === 15 ? "All 15 noticed — you are here" : `${checked} of 15 noticed`;
  }
  if (groundingProgressBar) {
    groundingProgressBar.style.width = `${(checked / 15) * 100}%`;
  }
}

groundingButtons.forEach((button) => {
  button.setAttribute("aria-pressed", "false");
  button.addEventListener("click", () => {
    const checked = button.classList.toggle("is-checked");
    button.setAttribute("aria-pressed", String(checked));
    updateGroundingProgress();
  });
});

groundingReset?.addEventListener("click", () => {
  groundingButtons.forEach((button) => {
    button.classList.remove("is-checked");
    button.setAttribute("aria-pressed", "false");
  });
  updateGroundingProgress();
});

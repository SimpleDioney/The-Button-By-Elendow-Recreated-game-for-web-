// Variáveis
let isMessageDisplayed = false;
let currentClicks = 0;
let maxScore = 0;
let totalScore = 0;
let restarts = 0;
let restartChance = 0;
let isButtonClicked = false;

// Arrays de cores e textos
const colors = [
  { background: 'purple', text: '#333', shadow: '#444' },
  { background: 'blue', text: '#111', shadow: '#444' },
  { background: 'green', text: '#222', shadow: '#444' },
  { background: 'red', text: '#444', shadow: '#444' },
];

const randomTexts = [
  "Keep going!", "Continue assim!",
  "You're doing great!", "Você está indo muito bem!",
  "Almost there!", "Quase lá!",
  "Don't give up!", "Não desista!",
  "Nice click!", "Belo clique!",
  "Excellent!", "Excelente!",
  "Wow, you're fast!", "Uau, você é rápido!",
  "Keep up the good work!", "Continue com o bom trabalho!",
  "You can do it!", "Você consegue!",
];

const resetTexts = [
  "Game reset! Try again.", "Jogo reiniciado! Tente novamente.",
  "Oops! Restarted. Keep going!", "Ops! Reiniciado. Continue!",
  "Restarted! You've got this!", "Reiniciado! Você consegue!",
  "Reset! Don't give up!", "Reinício! Não desista!",
  "Keep trying! You can do it!", "Continue tentando! Você consegue!",
  "That was close! Try again!", "Foi por pouco! Tente novamente!",
  "Breathe and try again!", "Respire e tente novamente!",
  "You'll get it next time!", "Você vai conseguir na próxima!",
];

// Funções
function displayRandomText() {
  const textIndex = Math.floor(Math.random() * randomTexts.length);
  displayText(randomTexts[textIndex]);
}

function displayText(text) {
  if (isMessageDisplayed) return;
  isMessageDisplayed = true;
  const textContainer = document.getElementById('text-container');
  textContainer.innerHTML = '';
  const messageDiv = document.createElement('div');
  messageDiv.className = 'text-message';
  messageDiv.innerText = text;
  textContainer.appendChild(messageDiv);
  setTimeout(() => {
    textContainer.removeChild(messageDiv);
    isMessageDisplayed = false;
  }, 5000);
}

function updateRandomText() {
  setInterval(displayRandomText, Math.random() * 10000 + 5000);
}

function checkResetText() {
  if (Math.random() < 0.3) {
    const textIndex = Math.floor(Math.random() * resetTexts.length);
    displayText(resetTexts[textIndex]);
  }
}

function updateColor(index) {
  const colorButtonInner = document.getElementById('circle');
  const color = colors[index];
  colorButtonInner.style.fontSize = '75px';
  colorButtonInner.style.backgroundColor = color.background;
  colorButtonInner.style.color = 'rgba(51, 51, 51, 0.5)';
  colorButtonInner.style.boxShadow = `0px 15px 25px ${color.shadow}`;
  localStorage.setItem('colorIndex', index.toString());
}

function clickCircle() {
  if (isButtonClicked) return;
  isButtonClicked = true;
  setButtonActive(false);
  setTimeout(() => {
    isButtonClicked = false;
    setButtonActive(true);
  }, 400);

  const clickSound = document.getElementById('click-sound');
  clickSound.currentTime = 0;
  clickSound.play();

  currentClicks++;
  totalScore++;
  restartChance += 1;

  if (currentClicks > maxScore) {
    maxScore = currentClicks;
  }

  document.getElementById('circle').innerText = currentClicks;
  document.getElementById('max-score').innerText = maxScore;
  document.getElementById('total-score').innerText = totalScore;

  if (Math.random() * 100 < restartChance) {
    currentClicks = 0;
    restarts++;
    restartChance = 0;
    document.getElementById('circle').innerText = currentClicks;
    document.getElementById('restarts').innerText = restarts;
    setTimeout(checkResetText, 100);
  }

  saveProgress();
}

function setButtonActive(isActive) {
  const circle = document.getElementById('circle');
  if (isActive) {
    circle.classList.remove('inactive');
  } else {
    circle.classList.add('inactive');
  }
}

function togglePopup() {
  const popup = document.getElementById('color-popup');
  popup.classList.toggle('show');
}

function toggleColorPopup() {
  const configPopup = document.getElementById('config-popup');
  const colorPopup = document.getElementById('color-popup');
  if (configPopup.classList.contains('show')) {
    configPopup.classList.remove('show');
  }
  colorPopup.classList.toggle('show');
}

function saveProgress() {
  localStorage.setItem('maxScore', maxScore.toString());
  localStorage.setItem('totalScore', totalScore.toString());
  localStorage.setItem('restarts', restarts.toString());
}

function initializeGame() {
  const savedColorIndex = localStorage.getItem('colorIndex') || '0';
  updateColor(parseInt(savedColorIndex));

  maxScore = parseInt(localStorage.getItem('maxScore') || '0');
  totalScore = parseInt(localStorage.getItem('totalScore') || '0');
  restarts = parseInt(localStorage.getItem('restarts') || '0');

  document.getElementById('max-score').innerText = maxScore;
  document.getElementById('total-score').innerText = totalScore;
  document.getElementById('restarts').innerText = restarts;

  const colorCard = document.getElementById('color-card');
  colors.forEach((color, index) => {
    const colorOption = document.createElement('div');
    colorOption.className = 'color-option';
    colorOption.onclick = () => {
      updateColor(index);
      toggleColorPopup();
    };

    const innerDiv = document.createElement('div');
    innerDiv.style.backgroundColor = color.background;
    innerDiv.style.color = 'rgba(51, 51, 51, 0.5)';
    innerDiv.style.fontSize = '20px';
    innerDiv.style.fontWeight = 'bold';
    innerDiv.style.display = 'flex';
    innerDiv.style.alignItems = 'center';
    innerDiv.style.justifyContent = 'center';
    innerDiv.innerText = index + 1;
    colorOption.appendChild(innerDiv);

    colorCard.appendChild(colorOption);
  });
}

function updateRandomText() {
  setInterval(displayRandomText, Math.random() * 10000 + 5000);
}

function checkResetText() {
  if (Math.random() < 0.3) {
    const textIndex = Math.floor(Math.random() * resetTexts.length);
    displayText(resetTexts[textIndex]);
  }
}

function updateColor(index) {
  const circle = document.getElementById('circle');
  const color = colors[index];
  circle.style.fontSize = '75px';
  circle.style.backgroundColor = color.background;
  circle.style.color = 'rgba(51, 51, 51, 0.5)';
  circle.style.boxShadow = `0px 15px 25px ${color.shadow}`;
  localStorage.setItem('colorIndex', index.toString());
}

function toggleConfigPopup() {
  const popup = document.getElementById('config-popup');
  popup.classList.toggle('show');
}

function resetScores() {
  maxScore = 0;
  totalScore = 0;
  restarts = 0;
  document.getElementById('max-score').innerText = maxScore;
  document.getElementById('total-score').innerText = totalScore;
  document.getElementById('restarts').innerText = restarts;
  saveProgress();
  toggleConfigPopup();
}

window.onload = () => {
  initializeGame();
  updateRandomText();
};

// Variáveis globais
let isMessageDisplayed = false;
let currentClicks = 0;
let maxScore = 0;
let totalScore = 0;
let restarts = 0;
let restartChance = 0;
let isButtonClicked = false;
let achievements = [];
let colorChanged = false;
let selectedColors = [];

// Cores
const colors = [
  { background: 'purple', text: '#333', shadow: '#444' },
  { background: 'blue', text: '#111', shadow: '#444' },
  { background: 'green', text: '#222', shadow: '#444' },
  { background: 'red', text: '#444', shadow: '#444' },
];

// Textos aleatórios
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
  colorChanged = true;

  let selectedColors = JSON.parse(localStorage.getItem('selectedColors')) || [];
  if (!selectedColors.includes(index)) {
    selectedColors.push(index);
    localStorage.setItem('selectedColors', JSON.stringify(selectedColors));
  }
}


// Conquistas
const achievementData = [
  { name: 'Primeiro clique', description: 'Realize seu primeiro clique no jogo.', unlocked: false, condition: () => currentClicks >= 1 },
  { name: '10 cliques', description: 'Alcance 10 cliques em uma única sessão.', unlocked: false, condition: () => currentClicks >= 10 },
  { name: '50 cliques', description: 'Alcance 50 cliques em uma única sessão.', unlocked: false, condition: () => currentClicks >= 50 },
  { name: '100 cliques', description: 'Alcance 100 cliques em uma única sessão.', unlocked: false, condition: () => currentClicks >= 100 },
  { name: '500 cliques totais', description: 'Alcance um total de 500 cliques.', unlocked: false, condition: () => totalScore >= 500 },
  { name: '1000 cliques totais', description: 'Alcance um total de 1000 cliques.', unlocked: false, condition: () => totalScore >= 1000 },
  { name: '5 reinícios', description: 'Reinicie o jogo 5 vezes.', unlocked: false, condition: () => restarts >= 5 },
  { name: '10 reinícios', description: 'Reinicie o jogo 10 vezes.', unlocked: false, condition: () => restarts >= 10 },
  { name: 'Primeira mudança de cor', description: 'Mude a cor do botão pela primeira vez.', unlocked: false, condition: () => colorChanged },
  { name: 'Clique rápido', description: 'Alcance 5 cliques com menos de 5% de chance de reiniciar.', unlocked: false, condition: () => currentClicks >= 5 && restartChance <= 5 },
  { name: 'Maratona de cliques', description: 'Alcance um total de 5000 cliques.', unlocked: false, condition: () => totalScore >= 5000 },
  { name: 'Sortudo', description: 'Reinicie o jogo 20 vezes com menos de 1000 cliques totais.', unlocked: false, condition: () => restarts >= 20 && totalScore <= 1000 },
  { name: 'Iniciante', description: 'Alcance entre 100 e 499 cliques totais.', unlocked: false, condition: () => totalScore >= 100 && totalScore < 500 },
  { name: 'Veterano', description: 'Alcance entre 5000 e 9999 cliques totais.', unlocked: false, condition: () => totalScore >= 5000 && totalScore < 10000 },
  { name: 'Lenda dos cliques', description: 'Alcance 10.000 ou mais cliques totais.', unlocked: false, condition: () => totalScore >= 10000 },
  { name: 'Nunca desista', description: 'Reinicie o jogo 50 vezes.', unlocked: false, condition: () => restarts >= 50 },
  { name: 'Corajoso', description: 'Alcance 100 cliques em uma sessão com menos de 10 reinícios.', unlocked: false, condition: () => maxScore >= 100 && restarts <= 10 },
  { name: 'Mestre da resistência', description: 'Alcance 200 cliques em uma sessão com 50% ou mais de chance de reiniciar.', unlocked: false, condition: () => maxScore >= 200 && restartChance >= 50 },
  { name: 'Ousado', description: 'Alcance 50 cliques em uma sessão com menos de 10% de chance de reiniciar.', unlocked: false, condition: () => maxScore >= 50 && restartChance <= 10 }
];


// Função para verificar e desbloquear conquistas
function checkAchievements() {
  achievementData.forEach((ach, index) => {
    if (!achievements[index] && ach.condition()) {
      achievements[index] = {
        unlocked: true,
        unlockedAt: new Date().getTime()  // Armazena a data de desbloqueio
      };
      localStorage.setItem('achievements', JSON.stringify(achievements));

      // Exibir o popup de conquista desbloqueada
      const popup = document.getElementById('achievement-unlocked-popup');
      const popupText = document.getElementById('achievement-unlocked-text');
      popupText.textContent = `Conquista ${ach.name} desbloqueada!`;
      popup.style.display = 'block';

      // Ocultar o popup depois de 3 segundos
      setTimeout(() => {
        popup.style.display = 'none';
      }, 3000);
    }
  });
}



// Função para mostrar conquistas
function showAchievements() {
  const achievementsCard = document.getElementById('achievements-card');
  const tabsContainer = document.getElementById('tabs-container');
  achievementsCard.innerHTML = '';
  tabsContainer.innerHTML = '';

  let tabIndex = 1;
  let tabContent = document.createElement('div');
  tabContent.className = 'tab-content';
  tabContent.id = `tab-${tabIndex}`;
  tabContent.style.display = 'block';  // Exibe o conteúdo da primeira aba

  const tabButton = document.createElement('button');
  tabButton.className = 'tab-button';
  tabButton.innerText = `Página ${tabIndex}`;
  tabButton.onclick = () => changeTab(tabIndex);
  tabsContainer.appendChild(tabButton);

  achievementData.forEach((ach, index) => {
    if (index % 10 === 0 && index !== 0) {
      achievementsCard.appendChild(tabContent);
      tabContent = document.createElement('div');
      tabContent.className = 'tab-content';
      tabContent.id = `tab-${++tabIndex}`;

      const newTabButton = document.createElement('button');
      newTabButton.className = 'tab-button';
      newTabButton.innerText = `Página ${tabIndex}`;
      newTabButton.onclick = (event) => changeTab(tabIndex, event);  // Adicione o parâmetro de evento aqui

      tabsContainer.appendChild(newTabButton);
    }

    const achDiv = document.createElement('div');
    achDiv.className = 'achievement';
    achDiv.onclick = () => showAchievementDetails(ach, index);
    if (achievements[index]) {
      achDiv.innerHTML = `${ach.name} <span class="unlocked-icon">✔</span>`;
      achDiv.classList.add('unlocked');
    } else {
      achDiv.innerHTML = `${ach.name} <span class="locked-icon">❌</span>`;
    }

    tabContent.appendChild(achDiv);
  });

  achievementsCard.appendChild(tabContent);
}

function changeTab(tabIndex, event) {
  event.stopPropagation();  // Adicione esta linha
  const tabs = document.getElementsByClassName('tab-content');
  for (let i = 0; i < tabs.length; i++) {
    tabs[i].style.display = 'none';
  }
  document.getElementById(`tab-${tabIndex}`).style.display = 'block';
}



function showAchievementDetails(ach, index) {
  const detailsCard = document.getElementById('achievement-details-card');
  const detailsPopup = document.getElementById('achievement-details-popup');
  const achData = achievements[index];
  let unlockedAt = 'Ainda não desbloqueado';
  if (achData && achData.unlocked) {
    unlockedAt = new Date(achData.unlockedAt).toLocaleString();
  }
  detailsCard.innerHTML = `
    <h2>${ach.name}</h2>
    <p>${ach.description}</p>
    <p>Desbloqueado em: ${unlockedAt}</p>
  `;
  detailsPopup.style.display = 'block';
}




// Pega o elemento do fundo do pop-up
const popupBackground = document.getElementById('achievement-details-popup');

// Pega o elemento da caixa de detalhes
const detailsCard = document.getElementById('achievement-details-card');

// Esconde o pop-up quando o fundo é clicado
popupBackground.addEventListener('click', function() {
  popupBackground.style.display = 'none';
});

// Impede que o evento de clique se propague para o fundo quando a caixa de detalhes é clicada
detailsCard.addEventListener('click', function(event) {
  event.stopPropagation();
});


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
  checkAchievements();
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

function toggleAchievementsPopup() {
  const popup = document.getElementById('achievements-popup');
  popup.classList.toggle('hidden');
  popup.classList.toggle('show');
  showAchievements();  // Adicione essa linha
}





function togglePopup() {
  const popup = document.getElementById('color-popup');
  popup.classList.toggle('show');
}
function saveProgress() {
  localStorage.setItem('maxScore', maxScore.toString());
  localStorage.setItem('totalScore', totalScore.toString());
  localStorage.setItem('restarts', restarts.toString());
}

function initializeGame() {
  console.log(`maxScore: ${maxScore}, totalScore: ${totalScore}, restarts: ${restarts}`);

  colorChanged = false;
  selectedColors = JSON.parse(localStorage.getItem('selectedColors')) || [];
  maxScore = parseInt(localStorage.getItem('maxScore') || '0');
  totalScore = parseInt(localStorage.getItem('totalScore') || '0');
  restarts = parseInt(localStorage.getItem('restarts') || '0');
  achievements = JSON.parse(localStorage.getItem('achievements')) || [];

  document.getElementById('max-score').innerText = maxScore;
  document.getElementById('total-score').innerText = totalScore;
  document.getElementById('restarts').innerText = restarts;


  const colorCard = document.getElementById('color-card');
  colors.forEach((color, index) => {
    const colorOption = document.createElement('div');
    colorOption.className = 'color-option';
    colorOption.onclick = () => {
      updateColor(index);
      togglePopup();
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
    showAchievements();

  });
}


function toggleConfigPopup() {
  const popup = document.getElementById('config-popup');
  popup.classList.toggle('show');
}

function toggleColorPopup() {
  const popup = document.getElementById('color-popup');
  popup.classList.toggle('show');
}

function removeAchievements() {
  // Limpar as conquistas do localStorage
  localStorage.removeItem('achievements');

  // Resetar a variável de conquistas
  achievements = [];

  // Resetar o estado desbloqueado de cada conquista
  achievementData.forEach(ach => ach.unlocked = false);

  // Atualizar a exibição de conquistas
  showAchievements();

  // Fechar o popup de configuração
  toggleConfigPopup();
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

  setInterval(displayRandomText, Math.random() * 10000 + 5000);
};

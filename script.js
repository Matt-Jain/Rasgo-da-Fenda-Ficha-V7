let player = "";
let characters = [];

const SKILLS = [
  "Força","Agilidade","Intelecto","Vontade",
  "Percepção","Ocultismo","Luta","Pontaria","Furtividade","Investigação"
];

function login() {
  const name = document.getElementById("playerName").value.trim();
  if (!name) return alert("Digite um nome");
  player = name;
  document.getElementById("login-screen").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");
  initCreate();
}

function showTab(id) {
  document.querySelectorAll(".tab").forEach(t => t.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

let createSkills = {};
let points = 200;

function initCreate() {
  const div = document.getElementById("skillsCreate");
  div.innerHTML = "";
  createSkills = {};
  points = 200;

  SKILLS.forEach(s => {
    createSkills[s] = 20;
    const el = document.createElement("div");
    el.className = "skill";
    el.innerHTML = `
      <span>${s}</span>
      <input type="number" value="20" min="0" onchange="updateSkill('${s}', this.value)">
    `;
    div.appendChild(el);
  });

  updatePoints();
}

function updateSkill(skill, value) {
  value = Number(value);
  const diff = value - createSkills[skill];
  if (points - diff < 0) return;
  createSkills[skill] = value;
  points -= diff;
  updatePoints();
}

function updatePoints() {
  document.getElementById("pointsLeft").innerText = `Pontos restantes: ${points}`;
}

function createCharacter() {
  const name = document.getElementById("charName").value;
  if (!name) return alert("Nome obrigatório");

  characters.push({
    name,
    story: document.getElementById("charStory").value,
    skills: {...createSkills},
    life: 100,
    sanity: 100,
    control: 100
  });

  initCreate();
  renderCharacters();
  updateDice();
  alert("Personagem criado");
}

function renderCharacters() {
  const list = document.getElementById("characterList");
  list.innerHTML = "";

  characters.forEach((c, i) => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <strong>${c.name}</strong>
      <p>${c.story}</p>

      <div class="bar life"><span>Vida</span>
        <button onclick="mod(i,'life',-5)">-</button>${c.life}
        <button onclick="mod(i,'life',5)">+</button>
      </div>

      <div class="bar sanity"><span>Sanidade</span>
        <button onclick="mod(i,'sanity',-5)">-</button>${c.sanity}
        <button onclick="mod(i,'sanity',5)">+</button>
      </div>

      <div class="bar control"><span>Incontrole</span>
        <button onclick="mod(i,'control',-5)">-</button>${c.control}
        <button onclick="mod(i,'control',5)">+</button>
      </div>
    `;
    list.appendChild(div);
  });
}

function mod(i, stat, v) {
  characters[i][stat] = Math.max(0, Math.min(100, characters[i][stat] + v));
  renderCharacters();
}

function updateDice() {
  const sel = document.getElementById("diceChar");
  sel.innerHTML = "";
  characters.forEach((c,i)=>{
    sel.innerHTML += `<option value="${i}">${c.name}</option>`;
  });
  renderDiceSkills();
}

function renderDiceSkills() {
  const div = document.getElementById("diceSkills");
  div.innerHTML = "";
  const c = characters[document.getElementById("diceChar").value];
  if (!c) return;

  Object.keys(c.skills).forEach(s=>{
    const b = document.createElement("button");
    b.innerText = `${s} (${c.skills[s]})`;
    b.onclick = ()=>roll(s, c.skills[s]);
    div.appendChild(b);
  });
}

document.getElementById("diceChar").onchange = renderDiceSkills;

function roll(skill, value) {
  const anim = document.getElementById("diceAnim");
  const res = document.getElementById("diceResult");

  anim.classList.remove("hidden");
  res.innerHTML = "";

  setTimeout(()=>{
    anim.classList.add("hidden");
    const r = Math.floor(Math.random()*100)+1;
    res.innerHTML = r <= value
      ? `<span style="color:green">Sucesso (${r})</span>`
      : `<span style="color:red">Falha (${r})</span>`;
  },600);
}

const calendarEl = document.getElementById("calendar");
const timeEl = document.getElementById("time-selection");
const clientInfoEl = document.getElementById("client-info");
const confirmBtn = document.getElementById("confirm");

const now = new Date();
const horarios = [13, 14, 15, 16, 17, 18, 19];
let selectedDate = null;
let selectedTime = null;
let agendados = {};

function renderCalendar(year, month) {
  calendarEl.innerHTML = "";
  const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

  const tituloMes = new Date(year, month).toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric'
  });

  const titulo = document.createElement('h2');
  titulo.textContent = tituloMes;
  calendarEl.appendChild(titulo);

  diasSemana.forEach(dia => {
    const el = document.createElement('div');
    el.textContent = dia;
    el.className = 'date';
    el.style.fontWeight = 'bold';
    calendarEl.appendChild(el);
  });

  const primeiroDia = new Date(year, month, 1).getDay();
  const diasNoMes = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < primeiroDia; i++) {
    const vazio = document.createElement('div');
    vazio.className = 'date';
    vazio.style.visibility = 'hidden';
    calendarEl.appendChild(vazio);
  }

  for (let dia = 1; dia <= diasNoMes; dia++) {
    const data = new Date(year, month, dia);
    const diaEl = document.createElement('div');
    diaEl.textContent = dia;
    diaEl.className = 'date';

    if (data < new Date(now.toDateString())) {
      diaEl.classList.add('disabled');
    } else {
      diaEl.addEventListener('click', () => selectDate(data, diaEl));
    }
    calendarEl.appendChild(diaEl);
  }
}

function selectDate(data, el) {
  selectedDate = data;
  [...document.querySelectorAll('.date')].forEach(el => el.classList.remove('selected'));
  el.classList.add('selected');

  timeEl.innerHTML = '';
  timeEl.classList.remove('hidden');
  clientInfoEl.classList.add('hidden');

  horarios.forEach(h => {
    const timeSlot = document.createElement('div');
    timeSlot.textContent = `${h}h`;
    timeSlot.className = 'time-slot';

    const jaPassou = data.toDateString() === now.toDateString() && h <= now.getHours();
    const jaAgendado = agendados[`${data.toDateString()}-${h}`];

    if (jaPassou || jaAgendado) {
      timeSlot.classList.add('disabled');
    } else {
      timeSlot.addEventListener('click', () => selectTime(h, timeSlot));
    }

    timeEl.appendChild(timeSlot);
  });
}

function selectTime(hora, el) {
  selectedTime = hora;
  [...document.querySelectorAll('.time-slot')].forEach(e => e.classList.remove('selected'));
  el.classList.add('selected');
  clientInfoEl.classList.remove('hidden');
}

confirmBtn.addEventListener('click', () => {
  const nome = document.getElementById("client-name").value;
  const telefone = document.getElementById("client-phone").value;

  if (!nome || !telefone) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  const dia = selectedDate.toLocaleDateString('pt-BR');
  const msg = `Olá, meu nome é ${nome}. Agendei um horário no dia ${dia} às ${selectedTime}h`;
  agendados[`${selectedDate.toDateString()}-${selectedTime}`] = true;

  const url = `https://wa.me/5511997572290?text=${encodeURIComponent(msg)}`;
  window.location.href = url;
});

renderCalendar(now.getFullYear(), now.getMonth());

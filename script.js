const calendarEl = document.getElementById("calendar");
const timesEl = document.getElementById("times");
const availabilityBar = document.getElementById("availability-bar");
const clientInfoEl = document.getElementById("client-info");
let selectedDay = "";
let selectedTime = "";

const hours = ["13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];

function getStoredReservations() {
    return JSON.parse(localStorage.getItem("reservations")) || {};
}

function updateAvailabilityBar(day, totalHours) {
    const booked = getStoredReservations()[day]?.length || 0;
    const available = totalHours - booked;
    const widthPercentage = (available / totalHours) * 100;
    availabilityBar.innerHTML = `<div class="bar" style="width: ${widthPercentage}%"></div>`;
}

function createCalendar() {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    
    const monthDays = new Date(currentYear, currentMonth + 1, 0).getDate();

    const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
    daysOfWeek.forEach(day => {
        const headerEl = document.createElement("div");
        headerEl.className = "calendar-day-header";
        headerEl.innerText = day;
        calendarEl.appendChild(headerEl);
    });

    const todayISO = today.toISOString().split("T")[0]; 

    for (let i = 1; i <= monthDays; i++) {
        const date = new Date(currentYear, currentMonth, i);
        const dayKey = date.toISOString().split("T")[0];

        const dayEl = document.createElement("div");
        dayEl.className = "calendar-day";
        dayEl.innerText = i;

        if (dayKey < todayISO) {
            dayEl.classList.add("disabled");
        } else {
            dayEl.onclick = () => showTimes(dayKey);
        }

        calendarEl.appendChild(dayEl);
    }
}

function showTimes(day) {
    selectedDay = day;
    timesEl.innerHTML = "";
    clientInfoEl.style.display = "none";
    const reservations = getStoredReservations();
    const bookedTimes = reservations[day] || [];

    const today = new Date();
    const selectedDate = new Date(day);
    const currentTime = today.getHours();

    hours.forEach(hour => {
        const timeEl = document.createElement("div");
        timeEl.className = "time";
        timeEl.innerText = hour;

        const [hourNum] = hour.split(":").map(Number);
        if (selectedDate.toISOString().split("T")[0] === today.toISOString().split("T")[0] && hourNum < currentTime) {
            timeEl.classList.add("disabled");
        }

        if (bookedTimes.includes(hour)) {
            timeEl.classList.add("disabled");
        } else {
            timeEl.onclick = () => selectTime(day, hour);
        }

        timesEl.appendChild(timeEl);
    });

    updateAvailabilityBar(day, hours.length);
}

function selectTime(day, hour) {
    selectedTime = hour;
    clientInfoEl.style.display = "block";
}

function sendWhatsApp() {
    const name = document.getElementById("clientName").value;
    const phone = document.getElementById("clientPhone").value;
    const assinatura = document.getElementById("assinatura").value;

    const checkboxes = [
        { id: "temAlergia", label: "Alergia a produto" },
        { id: "condicaoOcular", label: "Condição ocular" },
        { id: "gravidez", label: "Gestante/Lactante" },
        { id: "lentes", label: "Usa lentes de contato" },
        { id: "fezProcedimento", label: "Fez procedimento recente" },
        { id: "leuCuidados", label: "Leu os cuidados pós" },
        { id: "autorizo", label: "Autorizou o procedimento" }
    ];

    if (!name || !phone || !assinatura) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    }

    for (const box of checkboxes) {
        const checkbox = document.getElementById(box.id);
        if (!checkbox.checked) {
            alert(`Marque: ${box.label}`);
            return;
        }
    }

    let reservations = getStoredReservations();
    if (!reservations[selectedDay]) {
        reservations[selectedDay] = [];
    }

    if (!reservations[selectedDay].includes(selectedTime)) {
        reservations[selectedDay].push(selectedTime);
        localStorage.setItem("reservations", JSON.stringify(reservations));
    }

    let message = `Olá, meu nome é ${name}.\nAgendei um horário no dia ${selectedDay} às ${selectedTime}.\n\n`;
    message += `Ficha de Anamnese:\n`;

    checkboxes.forEach(box => {
        const checked = document.getElementById(box.id).checked ? "Sim" : "Não";
        message += `- ${box.label}: ${checked}\n`;
    });

    message += `\nAssinatura digital: ${assinatura}`;

    const whatsappURL = `https://wa.me/5511997572290?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, "_blank");
}

createCalendar();

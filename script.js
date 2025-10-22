// Audio Player
const audioPlayer = document.getElementById('audioPlayer');
const playBtn = document.getElementById('playBtn');
const playIcon = document.querySelector('.play-icon');
const pauseIcon = document.querySelector('.pause-icon');
const progressFill = document.getElementById('progressFill');
const timeDisplay = document.getElementById('timeDisplay');

// Toggle play/pause
playBtn.addEventListener('click', () => {
    if (audioPlayer.paused) {
        audioPlayer.play();
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
    } else {
        audioPlayer.pause();
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
    }
});

// Update progress bar
audioPlayer.addEventListener('timeupdate', () => {
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressFill.style.width = progress + '%';
    
    const currentMinutes = Math.floor(audioPlayer.currentTime / 60);
    const currentSeconds = Math.floor(audioPlayer.currentTime % 60);
    const durationMinutes = Math.floor(audioPlayer.duration / 60);
    const durationSeconds = Math.floor(audioPlayer.duration % 60);
    
    timeDisplay.textContent = `${currentMinutes}:${currentSeconds.toString().padStart(2, '0')} / ${durationMinutes}:${durationSeconds.toString().padStart(2, '0')}`;
});

// Click on progress bar to seek
document.querySelector('.progress-bar').addEventListener('click', (e) => {
    const progressBar = e.currentTarget;
    const clickX = e.offsetX;
    const width = progressBar.offsetWidth;
    const duration = audioPlayer.duration;
    
    audioPlayer.currentTime = (clickX / width) * duration;
});

// Calendar System
let currentWeekStart = new Date();
currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay()); // Start from Sunday

const prevWeekBtn = document.getElementById('prevWeek');
const nextWeekBtn = document.getElementById('nextWeek');
const currentWeekDisplay = document.getElementById('currentWeek');
const calendarGrid = document.getElementById('calendarGrid');
const bookingForm = document.getElementById('bookingForm');

let selectedSlot = null;

// Generate calendar
function generateCalendar() {
    calendarGrid.innerHTML = '';
    
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    
    // Update week display
    const weekEnd = new Date(currentWeekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    currentWeekDisplay.textContent = `${currentWeekStart.getDate()} ${months[currentWeekStart.getMonth()]} - ${weekEnd.getDate()} ${months[weekEnd.getMonth()]} ${weekEnd.getFullYear()}`;
    
    // Generate day cards
    for (let i = 0; i < 7; i++) {
        const date = new Date(currentWeekStart);
        date.setDate(date.getDate() + i);
        
        const dayCard = document.createElement('div');
        dayCard.className = 'day-card';
        
        const timeSlots = ['10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];
        
        dayCard.innerHTML = `
            <div class="day-name">${days[date.getDay()]}</div>
            <div class="day-date">${date.getDate()}</div>
            <div class="time-slots">
                ${timeSlots.map(time => `<div class="time-slot" data-date="${date.toDateString()}" data-time="${time}">${time}</div>`).join('')}
            </div>
        `;
        
        calendarGrid.appendChild(dayCard);
        
        // Add click event to time slots
        const slots = dayCard.querySelectorAll('.time-slot');
        slots.forEach(slot => {
            slot.addEventListener('click', (e) => {
                e.stopPropagation();
                selectTimeSlot(slot);
            });
        });
    }
}

// Select time slot
function selectTimeSlot(slot) {
    // Remove previous selection
    document.querySelectorAll('.time-slot').forEach(s => {
        s.style.background = '';
        s.style.fontWeight = '';
    });
    
    // Highlight selected slot
    slot.style.background = 'var(--primary-color)';
    slot.style.color = 'white';
    slot.style.fontWeight = '600';
    
    selectedSlot = {
        date: slot.dataset.date,
        time: slot.dataset.time
    };
    
    // Show booking form
    bookingForm.style.display = 'block';
    bookingForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Navigate weeks
prevWeekBtn.addEventListener('click', () => {
    currentWeekStart.setDate(currentWeekStart.getDate() - 7);
    generateCalendar();
});

nextWeekBtn.addEventListener('click', () => {
    currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    generateCalendar();
});

// Booking form handlers
document.getElementById('confirmBtn').addEventListener('click', () => {
    const name = document.getElementById('nameInput').value;
    const phone = document.getElementById('phoneInput').value;
    const email = document.getElementById('emailInput').value;
    const notes = document.getElementById('notesInput').value;
    
    if (!name || !phone || !email) {
        alert('Por favor completá todos los campos requeridos');
        return;
    }
    
    if (!selectedSlot) {
        alert('Por favor seleccioná un horario');
        return;
    }
    
    // Here you would typically send this data to a server
    alert(`¡Reserva confirmada!\n\nNombre: ${name}\nFecha: ${selectedSlot.date}\nHorario: ${selectedSlot.time}\n\nTe contactaremos pronto a ${phone}`);
    
    // Reset form
    document.getElementById('nameInput').value = '';
    document.getElementById('phoneInput').value = '';
    document.getElementById('emailInput').value = '';
    document.getElementById('notesInput').value = '';
    bookingForm.style.display = 'none';
    
    // Reset selection
    document.querySelectorAll('.time-slot').forEach(s => {
        s.style.background = '';
        s.style.fontWeight = '';
    });
    selectedSlot = null;
});

document.getElementById('cancelBtn').addEventListener('click', () => {
    bookingForm.style.display = 'none';
    
    // Reset selection
    document.querySelectorAll('.time-slot').forEach(s => {
        s.style.background = '';
        s.style.fontWeight = '';
    });
    selectedSlot = null;
});

// Initialize calendar
generateCalendar();

// Smooth scroll for all sections
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Parallax effect on scroll
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

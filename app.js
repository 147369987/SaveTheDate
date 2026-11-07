/**
 * Wedding E-Invitation Interactive Application
 * Groom: Dr. Naveen Kumar, M.B.B.S., M.S.
 * Bride: Dr. Niranjana, M.B.B.S., M.D.
 * Ceremonies: Nichayathartham, Thirumanam & Valaikappu / Virunthu
 * Dates: 12th, 13th & 20th December 2026
 */

// ========================================================
// 1. STATE & GLOBAL VARIABLES
// ========================================================
const WEDDING_TARGET_DATE = new Date("2026-12-13T07:30:00+05:30").getTime();
let isMusicPlaying = false;
let audioContext = null;
let synthInterval = null;
let tanpuraGain = null;
let isAudioSynthActive = false;

// ========================================================
// 2. DAY & NIGHT MODE TOGGLE CONTROLLER
// ========================================================
const themeToggleBtn = document.getElementById("theme-toggle-btn");
const themeIcon = document.getElementById("theme-icon");
const themeLabel = document.getElementById("theme-label");

function initThemeMode() {
  const savedTheme = localStorage.getItem("wedding_theme_mode") || "day";
  applyTheme(savedTheme);
}

function applyTheme(theme) {
  if (theme === "night") {
    document.documentElement.classList.add("night-mode");
    if (themeIcon) themeIcon.className = "fa-solid fa-sun text-amber-400 text-sm";
    if (themeLabel) themeLabel.textContent = "Day";
    localStorage.setItem("wedding_theme_mode", "night");
  } else {
    document.documentElement.classList.remove("night-mode");
    if (themeIcon) themeIcon.className = "fa-solid fa-moon text-amber-700 text-sm";
    if (themeLabel) themeLabel.textContent = "Night";
    localStorage.setItem("wedding_theme_mode", "day");
  }
}

function toggleThemeMode() {
  const isNight = document.documentElement.classList.contains("night-mode");
  applyTheme(isNight ? "day" : "night");
}

if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", toggleThemeMode);
}

initThemeMode();

// ========================================================
// 3. SOOTHING WEDDING MUSIC ENGINE (DUAL ENGINE)
// ========================================================
const audioElement = document.getElementById("wedding-audio");
const musicToggleBtn = document.getElementById("music-toggle-btn");
const musicLabel = document.getElementById("music-label");
const musicIcon = document.getElementById("music-icon");

// Web Audio API Synthesizer Fallback (Raag Bhupali / Flute & Tanpura Drone)
function initSynthesizer() {
  if (audioContext) return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioCtx();
  } catch (e) {
    console.warn("Web Audio API not supported", e);
  }
}

function startIndianWeddingSynth() {
  if (!audioContext) initSynthesizer();
  if (!audioContext) return;

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  isAudioSynthActive = true;

  // Master Gain
  const masterGain = audioContext.createGain();
  masterGain.gain.setValueAtTime(0.2, audioContext.currentTime);
  masterGain.connect(audioContext.destination);

  // Tanpura Ambient Drone (Sa & Pa)
  const osc1 = audioContext.createOscillator();
  const osc2 = audioContext.createOscillator();
  const filter = audioContext.createBiquadFilter();
  tanpuraGain = audioContext.createGain();

  osc1.type = "sine";
  osc1.frequency.setValueAtTime(130.81, audioContext.currentTime); // C3 (Sa)

  osc2.type = "triangle";
  osc2.frequency.setValueAtTime(196.00, audioContext.currentTime); // G3 (Pa)

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(480, audioContext.currentTime);

  tanpuraGain.gain.setValueAtTime(0.08, audioContext.currentTime);

  osc1.connect(tanpuraGain);
  osc2.connect(tanpuraGain);
  tanpuraGain.connect(filter);
  filter.connect(masterGain);

  osc1.start();
  osc2.start();

  // Gentle Meditative Melodic Flute/Harp Sequence (Raag Bhupali Pentatonic Notes)
  // C4, D4, E4, G4, A4, C5, D5, E5
  const scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25];
  const melodyPattern = [0, 1, 2, 4, 3, 2, 1, 0, 2, 3, 4, 5, 4, 3, 2, 0];
  let step = 0;

  function playFluteNote(freq) {
    if (!isAudioSynthActive || !audioContext) return;
    const osc = audioContext.createOscillator();
    const noteGain = audioContext.createGain();
    const noteFilter = audioContext.createBiquadFilter();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, audioContext.currentTime);

    noteFilter.type = "lowpass";
    noteFilter.frequency.setValueAtTime(950, audioContext.currentTime);

    const now = audioContext.currentTime;
    noteGain.gain.setValueAtTime(0.001, now);
    noteGain.gain.exponentialRampToValueAtTime(0.12, now + 0.25);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);

    osc.connect(noteGain);
    noteGain.connect(noteFilter);
    noteFilter.connect(masterGain);

    osc.start(now);
    osc.stop(now + 1.7);
  }

  synthInterval = setInterval(() => {
    if (isAudioSynthActive) {
      const noteIdx = melodyPattern[step % melodyPattern.length];
      playFluteNote(scale[noteIdx]);
      step++;
    }
  }, 1100);
}

function stopIndianWeddingSynth() {
  isAudioSynthActive = false;
  if (synthInterval) {
    clearInterval(synthInterval);
    synthInterval = null;
  }
  if (tanpuraGain && audioContext) {
    tanpuraGain.gain.setValueAtTime(0, audioContext.currentTime);
  }
}

async function playBackgroundMusic() {
  initSynthesizer();
  if (audioContext && audioContext.state === "suspended") {
    await audioContext.resume();
  }

  isMusicPlaying = true;
  if (musicToggleBtn) musicToggleBtn.classList.add("music-playing");
  if (musicLabel) musicLabel.textContent = "Music: Playing";
  if (musicIcon) musicIcon.className = "fa-solid fa-volume-high text-xs ml-0.5";

  // Attempt HTML5 audio first; fallback to synthesizer if blocked or network failure
  if (audioElement) {
    audioElement.volume = 0.55;
    const playPromise = audioElement.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn("Audio element failed to play, switching to Web Audio synthesizer fallback:", err);
        startIndianWeddingSynth();
      });
    }
  } else {
    startIndianWeddingSynth();
  }
}

function pauseBackgroundMusic() {
  isMusicPlaying = false;
  if (musicToggleBtn) musicToggleBtn.classList.remove("music-playing");
  if (musicLabel) musicLabel.textContent = "Music: Muted";
  if (musicIcon) musicIcon.className = "fa-solid fa-volume-xmark text-xs ml-0.5";

  if (audioElement) {
    audioElement.pause();
  }
  stopIndianWeddingSynth();
}

function toggleMusic() {
  if (isMusicPlaying) {
    pauseBackgroundMusic();
  } else {
    playBackgroundMusic();
  }
}

if (musicToggleBtn) {
  musicToggleBtn.addEventListener("click", toggleMusic);
}

// ========================================================
// 4. REFINED ENVELOPE OPENING REVEAL ANIMATION
// ========================================================
const envelopeScreen = document.getElementById("envelope-screen");
const envelopeBox = document.getElementById("envelope-box");
const openEnvelopeBtn = document.getElementById("open-envelope-btn");
const waxSealBtn = document.getElementById("wax-seal-btn");

let isEnvelopeOpened = false;

function openInvitationEnvelope() {
  if (isEnvelopeOpened) return;
  isEnvelopeOpened = true;

  // Visual flap opening
  if (envelopeBox) {
    envelopeBox.classList.add("is-opening");
  }

  // Celebratory Confetti Burst
  triggerCelebrationConfetti();

  // Play Music
  playBackgroundMusic();

  // Smooth transition after animation unfolds
  setTimeout(() => {
    if (envelopeScreen) {
      envelopeScreen.classList.add("opened");
    }
    // Secondary wider confetti shower
    setTimeout(() => {
      triggerCelebrationConfetti();
    }, 400);
  }, 950);
}

if (envelopeScreen) {
  envelopeScreen.addEventListener("click", (e) => {
    openInvitationEnvelope();
  });
}
if (openEnvelopeBtn) {
  openEnvelopeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    openInvitationEnvelope();
  });
}
if (waxSealBtn) {
  waxSealBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    openInvitationEnvelope();
  });
}
if (envelopeBox) {
  envelopeBox.addEventListener("click", (e) => {
    e.stopPropagation();
    openInvitationEnvelope();
  });
  envelopeBox.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      openInvitationEnvelope();
    }
  });
}

function triggerCelebrationConfetti() {
  if (typeof confetti !== "function") return;

  const colors = ["#c5a059", "#dfc27d", "#d97786", "#c25464", "#f7e7b4", "#4a0e17"];

  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: colors,
    shapes: ["circle", "square"],
    scalar: 1.1
  });

  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: colors
    });
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: colors
    });
  }, 250);
}

// ========================================================
// 5. FLOATING ROSE PETALS & SPARKLES CANVAS
// ========================================================
const canvas = document.getElementById("petals-canvas");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const PETAL_COUNT = window.innerWidth < 768 ? 20 : 38;
  const petals = [];

  class Petal {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -20;
      this.size = Math.random() * 8 + 7;
      this.speedY = Math.random() * 1.1 + 0.5;
      this.speedX = Math.random() * 1.0 - 0.5;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = Math.random() * 0.02 - 0.01;
      this.opacity = Math.random() * 0.45 + 0.35;
      this.isSparkle = Math.random() > 0.68;
      this.color = this.isSparkle
        ? "rgba(197, 160, 89, " + this.opacity + ")"
        : "rgba(217, 119, 134, " + this.opacity + ")";
    }

    update() {
      this.y += this.speedY;
      this.x += Math.sin(this.y * 0.01) * 0.7 + this.speedX;
      this.rotation += this.rotationSpeed;

      if (this.y > height + 20 || this.x < -30 || this.x > width + 30) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);

      if (this.isSparkle) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.22, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(0, -this.size * 0.6);
        ctx.bezierCurveTo(this.size * 0.6, -this.size * 0.5, this.size * 0.7, this.size * 0.4, 0, this.size * 0.7);
        ctx.bezierCurveTo(-this.size * 0.7, this.size * 0.4, -this.size * 0.6, -this.size * 0.5, 0, -this.size * 0.6);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  for (let i = 0; i < PETAL_COUNT; i++) {
    petals.push(new Petal());
  }

  function animatePetals() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < petals.length; i++) {
      petals[i].update();
      petals[i].draw();
    }
    requestAnimationFrame(animatePetals);
  }

  animatePetals();
}

// ========================================================
// 6. LIVE COUNTDOWN TIMER
// ========================================================
const daysEl = document.getElementById("cd-days");
const hoursEl = document.getElementById("cd-hours");
const minutesEl = document.getElementById("cd-minutes");
const secondsEl = document.getElementById("cd-seconds");

function updateCountdown() {
  const now = new Date().getTime();
  const distance = WEDDING_TARGET_DATE - now;

  if (distance < 0) {
    if (daysEl) daysEl.textContent = "00";
    if (hoursEl) hoursEl.textContent = "00";
    if (minutesEl) minutesEl.textContent = "00";
    if (secondsEl) secondsEl.textContent = "00";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  if (daysEl) daysEl.textContent = String(days).padStart(2, "0");
  if (hoursEl) hoursEl.textContent = String(hours).padStart(2, "0");
  if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, "0");
  if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, "0");
}

setInterval(updateCountdown, 1000);
updateCountdown();

// ========================================================
// 7. TRADITIONAL TAMIL CALENDAR INTEGRATION
// ========================================================
const EVENT_CALENDAR_DATA = {
  engagement: {
    title: "நிச்சயதார்த்தம் (Nichayathartham): Dr. Naveen Kumar & Dr. Niranjana",
    description: "மாங்கல்ய நிச்சயதார்த்த வைபவம் - Join us in celebrating the Engagement Ceremony (Nischayathartham) of Dr. Naveen Kumar & Dr. Niranjana.",
    location: "Vijaya Mahal, Chinnalapatti, Dindigul District, Tamil Nadu",
    startUTC: "20261212T130000Z", // 6:30 PM IST (UTC + 5:30)
    endUTC: "20261212T163000Z",
    startDate: "20261212T183000",
    endDate: "20261212T220000"
  },
  wedding: {
    title: "திருமணம் (Thirumanam - Muhurtham): Dr. Naveen Kumar & Dr. Niranjana",
    description: "சுப முகூர்த்தத் திருக்கல்யாண நல்வைபவம் - Auspicious Wedding Ceremony (Kalyanam) of Dr. Naveen Kumar and Dr. Niranjana.",
    location: "Vijaya Mahal, Chinnalapatti, Dindigul District, Tamil Nadu",
    startUTC: "20261213T020000Z", // 7:30 AM IST
    endUTC: "20261213T050000Z",   // 10:30 AM IST
    startDate: "20261213T073000",
    endDate: "20261213T103000"
  },
  reception: {
    title: "மணவிருந்து (Valaikappu / Virunthu): Dr. Naveen Kumar & Dr. Niranjana",
    description: "மங்கல மணவிருந்து - Grand Wedding Reception celebration and feast in honour of Dr. Naveen Kumar and Dr. Niranjana.",
    location: "GVN Mahal, Thirukazhukundram, Chengalpattu District, Tamil Nadu",
    startUTC: "20261220T130000Z", // 6:30 PM IST
    endUTC: "20261220T170000Z",
    startDate: "20261220T183000",
    endDate: "20261220T223000"
  }
};

window.addToCalendar = function(eventType) {
  const ev = EVENT_CALENDAR_DATA[eventType];
  if (!ev) return;

  const modal = document.getElementById("calendar-modal");
  const modalTitle = document.getElementById("calendar-modal-title");
  const modalDesc = document.getElementById("calendar-modal-desc");
  const googleBtn = document.getElementById("cal-btn-google");
  const icsBtn = document.getElementById("cal-btn-ics");

  if (modalTitle) modalTitle.textContent = ev.title.split(":")[0];
  if (modalDesc) modalDesc.textContent = `${ev.startDate.slice(0, 4)}-${ev.startDate.slice(4, 6)}-${ev.startDate.slice(6, 8)} • Choose Calendar:`;

  if (googleBtn) {
    googleBtn.onclick = () => {
      const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(ev.title)}&dates=${ev.startUTC}/${ev.endUTC}&details=${encodeURIComponent(ev.description)}&location=${encodeURIComponent(ev.location)}`;
      window.open(gcalUrl, "_blank", "noopener,noreferrer");
      closeCalendarModal();
    };
  }

  if (icsBtn) {
    icsBtn.onclick = () => {
      downloadICS(ev);
      closeCalendarModal();
    };
  }

  if (modal) {
    modal.classList.remove("hidden");
  }
};

window.closeCalendarModal = function() {
  const modal = document.getElementById("calendar-modal");
  if (modal) {
    modal.classList.add("hidden");
  }
};

const calModal = document.getElementById("calendar-modal");
if (calModal) {
  calModal.addEventListener("click", (e) => {
    if (e.target === calModal) {
      closeCalendarModal();
    }
  });
}

function downloadICS(ev) {
  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Dr Naveen and Dr Niranjana Wedding//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `SUMMARY:${ev.title}`,
    `DESCRIPTION:${ev.description}`,
    `LOCATION:${ev.location}`,
    `DTSTART:${ev.startUTC}`,
    `DTEND:${ev.endUTC}`,
    "STATUS:CONFIRMED",
    "SEQUENCE:0",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${ev.title.replace(/[^a-zA-Z0-9]/g, "_")}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ========================================================
// 8. VENUE TAB SWITCHER
// ========================================================
window.switchVenue = function(venueNum) {
  const tab1 = document.getElementById("venue-tab-1");
  const tab2 = document.getElementById("venue-tab-2");
  const pane1 = document.getElementById("venue-pane-1");
  const pane2 = document.getElementById("venue-pane-2");

  if (venueNum === 1) {
    pane1.classList.remove("hidden");
    pane2.classList.add("hidden");

    tab1.style.backgroundColor = "var(--text-burgundy)";
    tab1.style.color = "#ffffff";
    tab2.style.backgroundColor = "transparent";
    tab2.style.color = "var(--text-charcoal)";
  } else {
    pane1.classList.add("hidden");
    pane2.classList.remove("hidden");

    tab2.style.backgroundColor = "var(--text-burgundy)";
    tab2.style.color = "#ffffff";
    tab1.style.backgroundColor = "transparent";
    tab1.style.color = "var(--text-charcoal)";
  }
};

// ========================================================
// 9. GUEST WISHES WALL (LOCAL STORAGE & INTERACTION)
// ========================================================
const WISHES_STORAGE_KEY = "wedding_wishes_naveen_niranjana_v2";

const DEFAULT_PRESEEDED_WISHES = [
  {
    id: "wish_1",
    name: "Dr. Arvind & Dr. Deepa",
    relation: "Colleague / Doctor",
    message: "மனமார்ந்த திருமண நல்வாழ்த்துகள் Dr. நவீன் & Dr. நிரஞ்சனா! From college days to walking the sacred wedding steps together, we are so happy for you both. Wishing you endless love and happiness!",
    emoji: "❤️",
    timestamp: "2 hours ago",
    likes: 12
  },
  {
    id: "wish_2",
    name: "Priya & Karthik S.",
    relation: "College Batchmate",
    message: "The most awaited wedding of our batch! Dearest Niru and Naveen, you two are truly made for each other. Can't wait to celebrate the Muhurtham in Chinnalapatti!",
    emoji: "💐",
    timestamp: "5 hours ago",
    likes: 18
  },
  {
    id: "wish_3",
    name: "S. Rajendran & Family",
    relation: "Family & Relative",
    message: "மணமக்கள் இருவரும் எல்லா வளமும், நலமும், நீண்ட ஆயுளும் பெற்று சீரோடும் சிறப்போடும் வாழ எல்லாம் வல்ல இறைவனை பிரார்த்திக்கிறோம்.",
    emoji: "🪔",
    timestamp: "Yesterday",
    likes: 24
  },
  {
    id: "wish_4",
    name: "Dr. Meenakshi Sundaram (HOD)",
    relation: "Colleague / Doctor",
    message: "Heartiest congratulations to the wonderful doctor couple. May your shared dedication to healing and your bond of love flourish wonderfully together.",
    emoji: "✨",
    timestamp: "2 days ago",
    likes: 9
  }
];

function getStoredWishes() {
  try {
    const data = localStorage.getItem(WISHES_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(WISHES_STORAGE_KEY, JSON.stringify(DEFAULT_PRESEEDED_WISHES));
      return DEFAULT_PRESEEDED_WISHES;
    }
    return JSON.parse(data);
  } catch (e) {
    return DEFAULT_PRESEEDED_WISHES;
  }
}

function saveWishes(wishes) {
  try {
    localStorage.setItem(WISHES_STORAGE_KEY, JSON.stringify(wishes));
  } catch (e) {
    console.error("Failed to save wishes to localStorage", e);
  }
}

function renderWishes() {
  const container = document.getElementById("wishes-container");
  const countEl = document.getElementById("wishes-count");
  if (!container) return;

  const wishes = getStoredWishes();
  if (countEl) countEl.textContent = wishes.length;

  container.innerHTML = wishes.map((wish) => {
    const initials = wish.name
      .replace(/Dr\.\s*/i, "")
      .trim()
      .split(" ")
      .map(n => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "W";

    return `
      <div class="event-card p-5 shadow-sm flex flex-col justify-between">
        <div class="flex items-start justify-between gap-3 mb-2">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full flex items-center justify-center font-cinzel font-bold text-xs shadow-inner"
              style="background-color: var(--text-burgundy); color: #fff;">
              ${initials}
            </div>
            <div>
              <h5 class="font-bold text-sm text-high-contrast">${escapeHtml(wish.name)}</h5>
              <div class="flex items-center gap-2">
                <span class="text-[10px] px-2 py-0.5 rounded-full font-cinzel font-semibold tracking-wide border"
                  style="background-color: var(--bg-blush-soft); border-color: var(--border-blush); color: var(--text-burgundy);">
                  ${escapeHtml(wish.relation)}
                </span>
                <span class="text-[11px] text-muted-contrast">${escapeHtml(wish.timestamp)}</span>
              </div>
            </div>
          </div>
          <span class="text-2xl">${wish.emoji || "❤️"}</span>
        </div>

        <p class="text-sm leading-relaxed my-2 text-charcoal-contrast font-medium">
          ${escapeHtml(wish.message)}
        </p>

        <div class="flex items-center justify-end pt-2 border-t" style="border-color: var(--border-gold);">
          <button onclick="likeWish('${wish.id}')"
            class="flex items-center gap-1.5 text-xs font-bold text-blush-500 hover:scale-105 active:scale-95 transition min-h-[36px] px-2">
            <i class="fa-solid fa-heart"></i>
            <span>${wish.likes || 0}</span>
          </button>
        </div>
      </div>
    `;
  }).join("");
}

window.likeWish = function(id) {
  const wishes = getStoredWishes();
  const wish = wishes.find(w => w.id === id);
  if (wish) {
    wish.likes = (wish.likes || 0) + 1;
    saveWishes(wishes);
    renderWishes();
  }
};

window.selectEmoji = function(emoji) {
  const input = document.getElementById("selected-emoji");
  if (input) input.value = emoji;

  document.querySelectorAll(".emoji-btn").forEach(btn => {
    if (btn.textContent === emoji) {
      btn.classList.add("bg-gold-300", "scale-110");
    } else {
      btn.classList.remove("bg-gold-300", "scale-110");
    }
  });
};

const wishForm = document.getElementById("wish-form");
if (wishForm) {
  wishForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const nameInput = document.getElementById("guest-name");
    const relationInput = document.getElementById("guest-relation");
    const messageInput = document.getElementById("guest-message");
    const emojiInput = document.getElementById("selected-emoji");

    const name = nameInput.value.trim();
    const relation = relationInput.value;
    const message = messageInput.value.trim();
    const emoji = emojiInput ? emojiInput.value : "❤️";

    if (!name || !message) return;

    const newWish = {
      id: "wish_" + Date.now(),
      name: name,
      relation: relation,
      message: message,
      emoji: emoji,
      timestamp: "Just now",
      likes: 1
    };

    const wishes = getStoredWishes();
    wishes.unshift(newWish);
    saveWishes(wishes);
    renderWishes();

    wishForm.reset();
    if (emojiInput) emojiInput.value = "❤️";

    triggerCelebrationConfetti();
  });
}

function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

renderWishes();

// ========================================================
// 10. POLISHED FLAT-VECTOR E-CARD GENERATOR (HTML2CANVAS)
// ========================================================
window.updateCardGuestName = function() {
  const input = document.getElementById("custom-guest-name");
  const display = document.getElementById("ecard-guest-display");
  if (input && display) {
    display.textContent = input.value.trim() || "Distinguished Guest & Family";
  }
};

const guestNameInput = document.getElementById("custom-guest-name");
if (guestNameInput) {
  guestNameInput.addEventListener("input", window.updateCardGuestName);
}

window.downloadInvitationCard = async function() {
  const cardElement = document.getElementById("ecard-canvas-source");
  const downloadBtn = document.getElementById("download-ecard-btn");
  if (!cardElement) return;

  const originalBtnHTML = downloadBtn ? downloadBtn.innerHTML : "";
  if (downloadBtn) {
    downloadBtn.disabled = true;
    downloadBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Generating High-Res Card...`;
  }

  try {
    if (typeof html2canvas === "function") {
      const canvas = await html2canvas(cardElement, {
        scale: 2.5,
        backgroundColor: "#fffdfa",
        useCORS: true,
        logging: false
      });

      const image = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = image;
      a.download = "Dr_Naveen_Dr_Niranjana_Wedding_Invitation.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      triggerCelebrationConfetti();
    } else {
      window.print();
    }
  } catch (err) {
    console.error("Card generation failed", err);
    window.print();
  } finally {
    if (downloadBtn) {
      downloadBtn.disabled = false;
      downloadBtn.innerHTML = originalBtnHTML;
    }
  }
};

// ========================================================
// 11. WHATSAPP RSVP & SHARE
// ========================================================
window.sendWhatsAppRSVP = function() {
  const text = encodeURIComponent(
    "வணக்கம் Dr. Naveen Kumar & Dr. Niranjana, தங்களின் திருமண நல்விழாவிற்கு எனது மனமார்ந்த நல்வாழ்த்துகள்! I am delighted to confirm my attendance for your wedding celebrations! Wishing you both a lifetime of happiness, health, and togetherness."
  );
  window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank", "noopener,noreferrer");
};

window.shareInvitationLink = function() {
  const shareData = {
    title: "Dr. Naveen Kumar & Dr. Niranjana - Wedding E-Invitation",
    text: "You are cordially invited to celebrate the wedding of Dr. Naveen Kumar & Dr. Niranjana on 12th, 13th & 20th December 2026. Explore the ceremonies, timings, and venues here:",
    url: window.location.href
  };

  if (navigator.share) {
    navigator.share(shareData).catch((e) => console.log("Share dismissed", e));
  } else {
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert("Invitation link copied to clipboard! You can paste and share it with your family & friends.");
    }).catch(() => {
      prompt("Copy and share this invitation link:", window.location.href);
    });
  }
};

// Mobile Bottom Nav Highlight on Scroll
window.addEventListener("scroll", () => {
  const sections = ["hero", "countdown-section", "events", "venues", "wishes", "ecard-section"];
  const scrollPos = window.scrollY + 200;

  sections.forEach((secId) => {
    const el = document.getElementById(secId);
    if (el) {
      const top = el.offsetTop;
      const height = el.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        document.querySelectorAll(".mobile-nav-item").forEach((item) => {
          if (item.getAttribute("href") === `#${secId}`) {
            item.classList.add("active");
          } else {
            item.classList.remove("active");
          }
        });
      }
    }
  });
});

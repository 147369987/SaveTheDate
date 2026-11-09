# Dr. Naveen Kumar & Dr. Niranjana — Wedding E-Invitation Web Application • திருக்கல்யாண அழைப்பிதழ்

A luxurious, responsive, mobile-optimized Wedding E-Invitation single-page web application crafted with HTML5, Tailwind CSS, and vanilla JavaScript.

---

## 💍 Wedding Couple & Event Details

- **Groom:** Dr. Naveen Kumar, M.B.B.S., M.S.
- **Bride:** Dr. Niranjana, M.B.B.S., M.D.

### Ceremonies & Venues (Traditional Tamil Schedule):
1. **நிச்சயதார்த்தம் — Nichayathartham (Engagement & Ring Ceremony):**
   - **Date & Time:** Saturday, 12th December 2026 | மாலை 6:30 மணி முதல் (6:30 PM Onwards)
   - **Venue:** Vijaya Mahal (விஜயா மஹால்), Chinnalapatti, Dindigul District
   - **Significance:** மாங்கல்ய நிச்சயதார்த்த சுப வைபவம்
2. **திருமணம் — Thirumanam (Auspicious Kalyana Muhurtham):**
   - **Date & Time:** Sunday, 13th December 2026 | காலை 7:30 முதல் 10:30 வரை (7:30 AM to 10:30 AM IST)
   - **Lagnam:** தனுர் லக்னம் (Dhanur Lagnam)
   - **Venue:** Vijaya Mahal (விஜயா மஹால்), Chinnalapatti, Dindigul District
   - **Significance:** சுப முகூர்த்தத் திருக்கல்யாண நல்வைபவம்
3. **மணவிருந்து — Valaikappu / Virunthu (Grand Wedding Reception & Feast):**
   - **Date & Time:** Sunday, 20th December 2026 | மாலை 6:30 மணி முதல் (6:30 PM Onwards)
   - **Venue:** GVN Mahal (ஜிவிஎன் மஹால்), Thirukazhukundram, Chengalpattu District
   - **Significance:** அன்புடன் வரவேற்கும் மங்கல மணவிருந்து

---

## ✨ Features & Latest Updates Applied

### 1. 🖼️ Hero Section Photo (`wed.png`)
- Embedded the exact uploaded couple photo **`"wed.png"`** within the ornate gold-bordered frame in the Hero section.
- Framed with double filigree borders, corner flourishes, hanging temple bells, and responsive scaling that adapts flawlessly across phones, tablets, and wide monitors.

### 2. ⚡ Instantaneous & Robust Day / Night Mode Toggle
- Fixed all lag and text-visibility issues with an atomic, synchronized CSS variable architecture.
- **Day Mode:** Warm Blush Rose (`#FCECEE`, `#D97786`), Ivory (`#FFFDF9`), and Gold (`#C5A059`) with rich dark text (**Deep Burgundy `#380710`** & **Charcoal `#2C2C2C`**).
- **Night Mode:** Deep Midnight Maroon (`#140407` / `#1D070D`) with glowing gold accents, bright gold buttons with dark text, and luminous cream-gold text (**`#FDE8D7`** & **`#F5E6D8`**) for zero invisible text or unstyled elements.
- Snappy 0.15s transitions eliminate visual desynchronization and lag.
- Remembers preference across visits using `localStorage`.

### 3. 💌 Realistic Envelope Opener
- 3D luxury wedding stationery envelope in Blush Rose and Champagne Gold with a custom **N & N** monogram wax seal.
- Completely secular, romantic, and dignified invitation wording.
- Tap anywhere on the cover screen or envelope to smoothly trigger the 3D flap opening, celebratory confetti / rose petals shower, and background music.

### 4. 🌺 Traditional Tamil Terminology & Heartfelt "நன்றி" Footer
- Full traditional Tamil ceremony naming: **நிச்சயதார்த்தம் (Nichayathartham)**, **திருமணம் (Thirumanam)**, and **மணவிருந்து (Valaikappu / Virunthu)**.
- Heartfelt Tamil gratitude in the footer:
  - **"நன்றி"** (Thank You)
  - *"தங்களின் அன்பான வருகையும், பொன்னான ஆசிகளும் எங்கள் மணவாழ்வின் உன்னத பரிசாகும்."*
  - *"அன்புடன் அழைக்கும் மணமக்கள் & குடும்பத்தினர்"*

### 5. 🎴 Polished Flat-Vector E-Card Downloader
- Designed in a clean, luxury flat-vector stationery layout on crisp ivory stationery (`#FFFDF9`).
- Refined gold hairline borders, traditional Tamil headings, and personalized guest name customizer.
- Generates high-definition 2.5x retina PNG images via `html2canvas`.

### 6. 🎵 Dual-Engine Wedding Music Player
- Plays local **`music.mp3`** instantly with online CDN fallback and a built-in **Web Audio API synthesizer fallback** (Raag Bhupali flute & tanpura drone).
- Floating toggle pill with live animated equalizer wave bars.

---

## 🚀 How to Run Locally

Open `index.html` directly in any web browser (Chrome, Edge, Safari, Firefox), or run a local static server:

```bash
# Using Node.js
npx serve .

# Or using Python
python -m http.server 8080
```

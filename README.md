# The Ninety-Nine Names of Allah (أسماء الله الحسنى)

> **Live Web Application & PWA:**  
> 🌐 **[https://nine9namesofallahapp.onrender.com](https://nine9namesofallahapp.onrender.com/)**

A digital 3D book, situational dhikr advisor, and automated family email reminder system based strictly on the 1978 edition of ***The Ninety-Nine Names of Allah*** by **Shems Friedlander** (*Harper Colophon Books*, ISBN 0-06-090621-9, Istanbul Jerrahi Halveti Sufi tradition).

---

## 🌟 Key Highlights

### 1. 📖 Hyper-Realistic 3D Book Experience
* **True 3D Page Turn Animation (`rotateY` + `transform-style: preserve-3d`):** A double-sided physical leaf lifts up, rotates 180° through 3D space around the central spine, revealing the next page with sweeping dynamic shadow lighting.
* **Dynamic Fore-Edge Paper Stack Depth:** Realistic ribbed paper block thickness on the left and right outer sides. The left stack thickens (5px → 22px) and the right stack thins as you progress through the 128-page volume.
* **Cylindrical Paper Curvature:** Soft ambient lighting reflections (`page-curve-left` & `page-curve-right`) simulate pages curving up out of the stack and dipping into the central spine crevice.
* **Tactile Parchment Rustle Sound (Web Audio API):** Authentic, procedural audio feedback when turning pages without external MP3 dependencies (with a one-click mute/unmute toggle).
* **Traditional Islamic Hardcover Details:** Deep Moroccan calfskin leather binding, embossed gold filigree corner brackets, woven emerald-and-gold silk headbands, and a crimson satin bookmark ribbon.
* **Interactive "Dog-Ear" Corner Peels:** Hovering over the bottom page corners curls the paper upward with a soft shadow; clicking flips the page immediately.
* **Desktop 3D Parallax Tilt:** The hardcover folio tilts subtly with your mouse cursor across the workspace for real tactile depth.

---

### 2. 📱 Mobile First & Progressive Web App (PWA)
* **Zero Visual Clutter:** Spine shadows automatically adapt with responsive hiding (`hidden md:block`), guaranteeing no dark lines or visual artifacts on phone screens.
* **Segmented Mobile Page Switcher:** Easily toggle between **Page 1**, **Page 2**, or **Both Pages** on mobile screens with zero layout distortion.
* **Install as a Mobile App (Android & iPhone):**
  * **Android (Chrome):** Tap **⋮** → **"Install app"** or **"Add to Home screen"**.
  * **iPhone (Safari):** Tap **Share** → **"Add to Home Screen"**.
  * Launches in **fullscreen standalone mode** with the dedicated Islamic gold medallion icon and no browser address bars.

---

### 3. 📧 Automated Family Email Reminder System
Configured for automated, simultaneous dispatch to both husband and wife:
* **Husband:** `ashraks97@gmail.com`
* **Wife:** `shanjidaonna@gmail.com`
* **Family Greeting:** *Ashrak & Shanjida (Onna)*

#### Four Specialized Wazifa Reminder Types:
1. **🌟 Blessed Friday Jumu'ah Reminder:**  
   * **AL-BASIR (#27):** 100× between Farz & Sunnah at Friday prayer for esteem and divine illumination.  
   * **AL-AWWAL (#73):** 1,000× on 40 consecutive Fridays for righteous children and family reunion.
2. **🌅 Daily Morning Post-Fajr Reminder:**  
   * **AR-RAHĪM (#2):** 100× after Fajr prayer for peace, security from tribulations, and friendly relations with all creation.
3. **🕌 Thursday Post-Zuhr Reminder:**  
   * **AS-SAMĪ' (#26):** 100× after Zuhr in complete silence without speaking to anyone for fulfillment of heart's desires.
4. **❤️ Special Spouse & Family Harmony Reminder:**  
   * **AL-WADŪD (#47):** 1,000× over food eaten together with spouse to eliminate disputes and foster lasting mutual love.

*Includes one-click instant testing buttons in the Email Settings center and browser HTML preview.*

---

### 4. 🔍 Situational & Prayer Search Advisor
* **By Prayer Time:** Filter wazaif prescribed specifically for *After Fajr (Morning)*, *After Zuhr (Thursday)*, *Friday Jumu'ah*, *Between Maghrib & Isha*, *Night / Tahajjud*, or *Fasting / Iftar*.
* **By Life Situation:** Filter by *Anxiety & Heavy Heart*, *Sustenance & Debt (Rizq)*, *Children & Pregnancy*, *Physical Healing*, *Protection & Safety*, and *Spousal Harmony*.
* Displays the exact Arabic invocation (`YA-...`), prescribed repetition count, timing rules, and verbatim benefits from Friedlander's 1978 edition.

---

### 5. 📿 Built-in Digital Tasbih Counter
* Target counts automatically locked to the book prescription (e.g. 21×, 40×, 70×, 100×, 1,000×, 3,000×).
* Tactile click sounds and vibration feedback.
* Celebration confetti upon completing the prescribed count.

---

### 6. 📜 Authentic 1978 Book Scans & Scholarly Verification
* **High-Res Original Scans:** Inspect the uncompressed 3154×1956 scans directly from Shems Friedlander's 1978 print with an interactive zoom and pan modal.
* **Scholarly Authenticity Notes:** Transparent 3-tier classification:
  1. **Divine Names:** 100% Quranic and Sahih Hadith (Mutawatir).
  2. **Repetition Numbers & Formulas:** Classical Sufi *Mujarrabat* (experiential spiritual practices of righteous predecessors like Imam Al-Ghazali and Sheikh Abdul Qadir Jilani).
  3. **Textual Fidelity:** Verbatim quotes and page references from the 1978 Harper Colophon volume.

---

## 🛠️ Tech Stack & Architecture

* **Frontend:** React 19, Vite, Tailwind CSS v4, Lucide Icons, Canvas Confetti, Web Audio API, PWA Web App Manifest.
* **Backend:** Node.js, Express, Nodemailer, Node-Cron, CORS.
* **Cloud Hosting:** Render.com (Web Service with 24/7 background cron scheduling).

---

## 💻 Local Run Instructions

### One-Click Desktop Launcher
Simply double-click:
```text
G:\APPS\99NamesOfAllahApp\LaunchApp.bat
```

### Manual Command Line
```bash
# 1. Install & Build Frontend
cd frontend
npm install
npm run build

# 2. Install & Start Backend
cd ../backend
npm install
node server.js
```
The app will be available locally at:
* **PC Browser:** `http://localhost:5000`
* **Mobile (Home Wi-Fi):** `http://<your-pc-ip>:5000` (e.g., `http://192.168.0.102:5000`)

---

## ☁️ Cloud Deployment (Render.com)

1. **Repository:** `https://github.com/AshrakShohas/99NamesOfAllahApp`
2. **Runtime:** `Node`
3. **Region:** `Singapore (Southeast Asia)`
4. **Build Command:** `npm run build`
5. **Start Command:** `npm run start`
6. **Environment Variables:**
   * `SMTP_USER` : `a3.shohas@gmail.com`
   * `SMTP_PASS` : `atbv nbzh bfzw puwb`

---

## 📄 License & Attribution
Content compiled strictly from Shems Friedlander's 1978 edition of *The Ninety-Nine Names of Allah* (*Harper Colophon Books*). Built for personal family dhikr, study, and reflection.

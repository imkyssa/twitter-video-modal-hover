# 🎥 Twitter Video Modal Hover

A userscript that enhances **Twitter / X** by displaying videos in a **hover-activated modal preview** — smooth, high-resolution, and completely blob-safe.

⚡ Built for Tampermonkey.  
🔥 Works seamlessly with X’s virtual DOM and lazy-loaded media.

---

## ✨ Features

✅ Canvas-based live mirroring (no `blob:` errors)  
✅ Hover to enlarge — no clicks required  
✅ Dark overlay background with smooth scale animation  
✅ ESC / click-outside to close  
✅ Custom UI controls (Play / Pause / Time)  
✅ Hover indicator + subtle transitions  
✅ MutationObserver-based auto-binding for infinite scroll  
✅ Performance-friendly (doesn’t reflow or clone DOM nodes)

---

## 🧠 Technical Highlights

- **Blob-safe rendering:**  
  X’s videos use temporary `blob:` URLs, which normally break when detached.  
  This script mirrors the video frames directly into a `<canvas>` — no DOM transfer, no fetch errors.

- **Virtual DOM compatible:**  
  React re-renders and tweet updates don’t interfere.

- **Custom UI Layer:**  
  Includes close button, playback controls, and a live timer.

- **Dynamic Detection:**  
  Uses a throttled `MutationObserver` to detect new tweets in real-time.

---

## 🚀 Installation

1. Install the [**Tampermonkey** extension](https://tampermonkey.net/).  
2. Click **Create a new script**.  
3. Replace everything with the content of  
   [`twitter-video-modal-hover.user.js`](./twitter-video-modal-hover.user.js).  
4. Save (`Ctrl + S`) and reload **Twitter / X**.  
5. Hover over any video and enjoy the smooth modal preview! 🎬

---

## 💻 Browser Compatibility

| Browser | Support |
|----------|----------|
| Chrome | ✅ |
| Edge | ✅ |
| Firefox | ✅ |
| Brave | ✅ |
| Opera | ✅ |
| Safari (Tampermonkey Beta) | ⚠️ Experimental |

---

## 🧩 Why It’s Different

Most “hover video preview” scripts fail on X because of:
- `blob:` video URLs that vanish outside their scope  
- `pointer-events: none` wrappers  
- React’s dynamic DOM recycling  

This script solves all of them — by rendering the video onto a canvas overlay in real-time.  
Effectively, it acts as a **mini mirroring video engine** built on top of Twitter’s player.

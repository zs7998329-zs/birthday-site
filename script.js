// Core interactions: music control, confetti toggle, simple confetti canvas, messages saved to localStorage, and extra confetti for surprise.

const audio = document.getElementById('birthdaySong') || document.getElementById('song2');
const playBtn = document.getElementById('playMusicBtn');

function togglePlayPause() {
  if (!audio) return;
  if (audio.paused) { audio.play(); if(playBtn) playBtn.textContent = '⏸ Pause Music'; }
  else { audio.pause(); if(playBtn) playBtn.textContent = '▶ Play Music'; }
}
if (playBtn) playBtn.addEventListener('click', togglePlayPause);

// Confetti (simple particle system)
const confettiCanvas = document.getElementById('confetti') || document.getElementById('confetti2');
let confettiCtx, W, H, confettiParts = [], confettiRunning = false;
if (confettiCanvas) {
  confettiCtx = confettiCanvas.getContext('2d');
  function resizeCanvas(){
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
    W = confettiCanvas.width; H = confettiCanvas.height;
  }
  resizeCanvas(); window.addEventListener('resize', resizeCanvas);
  function initConfetti(){
    confettiParts = [];
    for (let i=0;i<120;i++){
      confettiParts.push({
        x: Math.random()*W,
        y: Math.random()*H - H,
        r: 6 + Math.random()*8,
        d: Math.random()*Math.PI*2,
        color: ['#ff7b8f','#78c6ff','#ffd27a','#ffdf66','#122c58'][Math.floor(Math.random()*5)],
        tilt: Math.random()*10 - 10,
        tiltAngleIncrement: Math.random()*0.07 + 0.05
      });
    }
  }
  function drawConfetti(){
    if (!confettiRunning) return;
    confettiCtx.clearRect(0,0,W,H);
    confettiParts.forEach(p=>{
      p.tilt += p.tiltAngleIncrement;
      p.y += Math.cos(p.d) + 1 + p.r/20;
      p.x += Math.sin(p.d);
      confettiCtx.beginPath();
      confettiCtx.lineWidth = p.r;
      confettiCtx.strokeStyle = p.color;
      confettiCtx.moveTo(p.x + p.tilt + p.r/2, p.y);
      confettiCtx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r);
      confettiCtx.stroke();
    });
    requestAnimationFrame(drawConfetti);
  }
  function startConfetti(){
    if (confettiRunning) return;
    confettiRunning = true;
    initConfetti();
    drawConfetti();
  }
  function stopConfetti(){
    confettiRunning = false;
    if (confettiCtx) confettiCtx.clearRect(0,0,W,H);
  }
  // Expose toggleConfetti globally
  window.toggleConfetti = () => {
    if (confettiRunning) stopConfetti(); else startConfetti();
  };
  // Start by default on home page
  if (document.body.contains(confettiCanvas) && confettiCanvas.id === 'confetti') startConfetti();
}

// Message form handling (localStorage-based)
function renderMessages() {
  const listEl = document.getElementById('messagesList');
  if (!listEl) return;
  const data = JSON.parse(localStorage.getItem('zain_messages') || '[]').reverse();
  listEl.innerHTML = data.length ? data.map(item =>
    `<div class="msg-item"><div class="msg-name">${escapeHtml(item.name)}</div><div class="msg-text">${escapeHtml(item.msg)}</div></div>`
  ).join('') : '<p class="muted">No messages yet — be the first to wish Zain!</p>';
}

function saveMessage(e) {
  if (e) e.preventDefault();
  const name = document.getElementById('visitorName')?.value?.trim();
  const msg = document.getElementById('visitorMsg')?.value?.trim();
  if (!name || !msg) return alert('Please enter both name and message.');
  const list = JSON.parse(localStorage.getItem('zain_messages') || '[]');
  list.push({name, msg, time: Date.now()});
  localStorage.setItem('zain_messages', JSON.stringify(list));
  if (document.getElementById('visitorName')) { document.getElementById('visitorName').value=''; document.getElementById('visitorMsg').value=''; }
  renderMessages();
  alert('Thanks! Your message was saved for Zain.');
}

function clearMessages(){
  if (!confirm('Clear all messages?')) return;
  localStorage.removeItem('zain_messages');
  renderMessages();
}

// Utility: simple HTML escape
function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, function(m){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]; });
}

// Init on load
document.addEventListener('DOMContentLoaded', () => {
  renderMessages();
  // Make play button label accurate
  if (playBtn && audio && !audio.paused) { playBtn.textContent = '⏸ Pause Music'; }
});

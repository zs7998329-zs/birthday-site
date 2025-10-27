// script.js — controls surprise, confetti, music toggle, and simple preview
const surpriseBtn = document.getElementById('surpriseBtn');
const surpriseBox = document.getElementById('surprise');
const confettiCanvas = document.getElementById('confettiCanvas');
const music = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');

function toggleSurprise(){
  surpriseBox.classList.toggle('hidden');
  startConfetti();
}

surpriseBtn && surpriseBtn.addEventListener('click', toggleSurprise);

musicToggle && musicToggle.addEventListener('click', ()=>{
  if(!music) return;
  if(music.paused){ music.play(); musicToggle.textContent='Pause Music'; }
  else { music.pause(); musicToggle.textContent='Play Music'; }
});

// Simple confetti (lightweight)
function startConfetti() {
  const canvas = confettiCanvas;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  const pieces = Array.from({ length: 120 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * -canvas.height,
    r: Math.random() * 6 + 4,
    dx: (Math.random() - 0.5) * 2,
    dy: Math.random() * 3 + 2,
    color: `hsl(${Math.random() * 360},80%,60%)`
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of pieces) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      p.x += p.dx;
      p.y += p.dy;

      // agar neeche chala jaye to wapas upar se start ho
      if (p.y > canvas.height) {
        p.y = -10;
        p.x = Math.random() * canvas.width;
      }
    }
    requestAnimationFrame(draw);
  }

  draw(); // start animation
}


// Message preview (on message.html)
const showMsg = document.getElementById('showMsg');
if(showMsg){
  showMsg.addEventListener('click', ()=>{
    const name = document.getElementById('name').value || 'Someone';
    const text = document.getElementById('msg').value || 'Wishing you all the best!';
    document.getElementById('previewText').textContent = `${name} says: ${text}`;
    document.getElementById('preview').classList.remove('hidden');
  });
}

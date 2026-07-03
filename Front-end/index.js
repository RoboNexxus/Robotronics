// Use localhost for local dev, relative path for Vercel deployment
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? "http://localhost:3001/api/register"
  : "/api/register";

function onEvent(){
  var max=+event.target.selectedOptions[0].dataset.max||3;
  var size=document.getElementById('size');
  [...size.options].forEach(o=>{ if(o.value) o.hidden = +o.value>max });
  if(+size.value>max){ size.value=''; onSize(); }
}
function onSize(){
  var n=+document.getElementById('size').value;
  document.getElementById('m2').style.display = n>=2 ? 'block':'none';
  document.getElementById('m3').style.display = n>=3 ? 'block':'none';
}

document.getElementById('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  var btn = document.getElementById('submitBtn');
  var msg = document.getElementById('msg');
  btn.disabled = true; btn.textContent = 'Submitting...'; msg.textContent = '';

  var payload = {
    eventName: document.getElementById('event').value,
    teamName: document.getElementById('teamName').value,
    leaderName: document.getElementById('leaderName').value,
    school: document.getElementById('school').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    discordId: document.getElementById('discordId').value,
    teamSize: document.getElementById('size').value,
    member2: document.getElementById('member2').value,
    member3: document.getElementById('member3').value,
  };

  try {
    var res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    
    // Handle network errors
    if (!res.ok) {
      const data = await res.json().catch(() => ({ error: `Server error: ${res.status}` }));
      throw new Error(data.error || 'Registration failed');
    }
    
    var data = await res.json();

    msg.style.color = '#22D3EE';
    msg.textContent = `Registered! Your ID: ${data.regId}. Check your email.`;
    document.getElementById('form').reset();
    onSize();
  } catch (err) {
    msg.style.color = '#f87171';
    // Show more detailed error for debugging
    msg.textContent = err.message || 'Failed to connect to server. Is the backend running?';
    console.error('Registration error:', err);
  } finally {
    btn.disabled = false; btn.textContent = 'Continue';
  }
});

const $ = (id) => document.getElementById(id);

function setPrecip(type) {
  const box = $('precip');
  box.innerHTML = '';
  if (type !== 'rain' && type !== 'snow') return;
  const count = type === 'rain' ? 90 : 60;
  for (let i = 0; i < count; i++) {
    const d = document.createElement('div');
    d.className = 'drop';
    d.style.left = Math.random() * 100 + '%';
    d.style.animationDuration = (type === 'rain' ? 0.6 + Math.random() * 0.6 : 4 + Math.random() * 4) + 's';
    d.style.animationDelay = -Math.random() * 5 + 's';
    box.appendChild(d);
  }
}

async function calculate() {
  $('error').textContent = '';
  const q = new URLSearchParams({
    temp: $('temp').value, humidity: $('humidity').value, wind: $('wind').value
  });
  try {
    const res = await fetch('/api/calculate?' + q);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    $('f').textContent = data.fahrenheit + ' °F';
    $('k').textContent = data.kelvin + ' K';
    $('feels').textContent = data.feelsLike + ' °C';
    $('dew').textContent = data.dewPoint + ' °C';
    $('cond').textContent = data.condition;
    $('results').hidden = false;
    $('results').style.animation = 'none'; void $('results').offsetWidth; $('results').style.animation = '';
    document.body.className = data.condition;
    setPrecip(data.condition);
  } catch (e) {
    $('error').textContent = e.message;
  }
}

$('go').addEventListener('click', calculate);

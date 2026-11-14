const steps = [
  { title: 'Beekeeper Registration', description: 'Local beekeepers who pride themselves on producing pure, ethical honey through sustainable beekeeping practices join our BeeSustain platform and get their hives verified.', detail: 'Verification ensures the apiary’s location, honey origin, and quality, enabling beekeepers to receive fair compensation and secure a consistent monthly income.', images: ['assets/registration.jpg', 'assets/registration-detail.jpg'], alt: ['Beekeeper at work', 'Local apiary'] },
  { title: 'Company Subscription', description: 'A bee-loving company joins our program and selects its preferred region for a hive and beekeeper, along with a monthly honey and hive subscription plan.', detail: 'Together we make sustainability part of your corporate identity and support eco-friendly ESG practices that protect pollinators, plants, and soil.', images: ['assets/beekeepers.jpg', 'assets/registration.jpg'], alt: ['A beekeeper tends to hives', 'Beehives in a green landscape'] },
  { title: 'Technology Enhancement', description: 'BeeSustain equips beekeepers with AI, IoT, satellite, and sensor-based technology to create a sustainable, healthy beekeeping environment.', detail: 'Hive monitoring helps improve productivity and protect honey purity, blending tradition with innovation to deliver honey that’s as real as it gets.', images: ['assets/technology.jpg', 'assets/registration-detail.jpg'], alt: ['Technology for hive monitoring', 'Beehives'] },
  { title: 'AI Data Analysis', description: 'BeeSustain uses AI to analyze hive data, weather patterns, and beekeeper inputs, helping keep colonies healthy and honey pure.', detail: 'Companies receive clear reports on production, hive health, and the positive sustainability impact of their support.', images: ['assets/technology.jpg', 'assets/beekeepers.jpg'], alt: ['Hive data and technology', 'Beekeepers in the apiary'] },
  { title: 'Honey Delivery', description: 'Each company receives 100% pure and delicious honey straight from the hive it supports.', detail: 'Every delivery comes with an ESG certificate recognizing your contribution to economic and environmental sustainability.', images: ['assets/registration-detail.jpg', 'assets/uvodna-scena.jpg'], alt: ['Honey from a local apiary', 'Beekeeper collecting honey'] }
];
const tabs = [...document.querySelectorAll('.izbor-koraka')];
function showStep(index) {
  const step = steps[index];
  tabs.forEach((tab, i) => { const selected = i === index; tab.classList.toggle('odabrano', selected); tab.setAttribute('aria-selected', String(selected)); });
  document.querySelector('#brojac-koraka').textContent = `${String(index + 1).padStart(2, '0')} / 05`;
  document.querySelector('#naziv-koraka').textContent = step.title;
  document.querySelector('#opis-koraka').textContent = step.description;
  document.querySelector('#dodatni-opis-koraka').textContent = step.detail;
  ['#slika-koraka', '#druga-slika-koraka'].forEach((selector, i) => { const image = document.querySelector(selector); image.src = step.images[i]; image.alt = step.alt[i]; });
}
tabs.forEach(tab => tab.addEventListener('click', () => showStep(Number(tab.dataset.step))));
const menuButton = document.querySelector('.meni-otvarac');
menuButton.addEventListener('click', () => { const open = menuButton.getAttribute('aria-expanded') !== 'true'; menuButton.setAttribute('aria-expanded', String(open)); document.querySelector('.navigacija-linkovi').classList.toggle('open', open); });
document.querySelectorAll('.navigacija-linkovi a').forEach(link => link.addEventListener('click', () => { menuButton.setAttribute('aria-expanded', 'false'); document.querySelector('.navigacija-linkovi').classList.remove('open'); }));
document.querySelector('#forma-novosti').addEventListener('submit', async event => {
  event.preventDefault();
  const email = document.querySelector('#email-novosti');
  const message = document.querySelector('.poruka-forme');
  if (!email.checkValidity()) { email.reportValidity(); return; }
  message.textContent = 'Sending…';
  try {
    const response = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value })
    });
    const result = await response.json();
    message.textContent = result.message || 'Došlo je do greške. Pokušajte ponovo.';
    if (response.ok && result.ok) email.value = '';
  } catch {
    message.textContent = 'Server trenutno nije dostupan. Pokušajte ponovo kasnije.';
  }
});

(function () {
  // Read script attributes
  const scripts = document.getElementsByTagName('script');
  const currentScript = scripts[scripts.length - 1];

  // Config parameters with fallbacks
  const name = currentScript.getAttribute('name') || 'Anonymous';
  const avatar = currentScript.getAttribute('avatarImage') || 'https://via.placeholder.com/80/f8a5c2/ffffff?text=♥';
  const bio = currentScript.getAttribute('bio') || 'Welcome to my cozy blog corner!';
  const bloglink = currentScript.getAttribute('bloglink') || '#';
  const niche = currentScript.getAttribute('niche') || 'Personal Blog';
  const textFont = currentScript.getAttribute('textFont') || "'Palatino Linotype', 'Book Antiqua', Palatino, serif";
  const textSize = currentScript.getAttribute('textSize') || '14';
  const cardColor = currentScript.getAttribute('cardColor') || '#fff0f5'; // Light pastel pink
  const accentColor = currentScript.getAttribute('accentColor') || '#ff6b81'; // Cute vibrant accent
  const sparkles = currentScript.getAttribute('sparkles') === 'true'; // Sparkle toggle

  // URL to raw webring directory JSON on GitHub
  const WEBRING_JSON_URL = 'https://cdn.jsdelivr.net/gh/didanim/blogger-widget@refs/heads/main/webring.json';

  const widgetId = 'kawaii-webring-' + Math.floor(Math.random() * 100000);

  // Inject Styles dynamically
  const style = document.createElement('style');
  style.textContent = `
    .#${widgetId}-container {
      width: 100%;
      max-width: 320px;
      margin: 15px auto;
      font-family: ${textFont};
      font-size: ${textSize}px;
      color: #2d3436;
      box-sizing: border-box;
    }
    .#${widgetId}-perspective {
      perspective: 1000px;
      height: 250px;
      width: 100%;
    }
    .#${widgetId}-card {
      width: 100%;
      height: 100%;
      position: relative;
      transform-style: preserve-3d;
      transition: transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1);
      border-radius: 16px;
      box-shadow: 0 8px 18px rgba(0,0,0,0.08);
    }
    .#${widgetId}-card.flipped {
      transform: rotateY(180deg);
    }
    .#${widgetId}-face {
      position: absolute;
      width: 100%;
      height: 100%;
      backface-visibility: hidden;
      border-radius: 16px;
      border: 2px dashed ${accentColor};
      background-color: ${cardColor};
      box-sizing: border-box;
      padding: 12px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    /* Sparkle Particle Animations */
    @keyframes ${widgetId}-twinkle {
      0%, 100% { opacity: 0.2; transform: scale(0.8) rotate(0deg); }
      50% { opacity: 0.9; transform: scale(1.2) rotate(180deg); }
    }
    .#${widgetId}-sparkles {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      pointer-events: none;
      z-index: 1;
      overflow: hidden;
    }
    .#${widgetId}-sparkle {
      position: absolute;
      color: ${accentColor};
      font-size: 12px;
      animation: ${widgetId}-twinkle 3s infinite ease-in-out;
    }
    .#${widgetId}-s1 { top: 10%; left: 8%; animation-delay: 0s; }
    .#${widgetId}-s2 { top: 15%; right: 10%; animation-delay: 0.7s; font-size: 16px; }
    .#${widgetId}-s3 { bottom: 25%; left: 12%; animation-delay: 1.4s; font-size: 14px; }
    .#${widgetId}-s4 { bottom: 15%; right: 12%; animation-delay: 2.1s; }

    /* Front Card Layout */
    .#${widgetId}-top-row {
      display: flex;
      gap: 12px;
      align-items: center;
      z-index: 2;
    }
    .#${widgetId}-avatar {
      width: 65px;
      height: 65px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid #ffffff;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
      flex-shrink: 0;
    }
    .#${widgetId}-header-info {
      flex-grow: 1;
      overflow: hidden;
    }
    .#${widgetId}-name {
      font-weight: bold;
      font-size: 1.05em;
      color: ${accentColor};
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin: 0 0 2px 0;
    }
    .#${widgetId}-niche {
      display: inline-block;
      background: #ffffff;
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 0.78em;
      color: #636e72;
      border: 1px solid #dfe6e9;
    }
    .#${widgetId}-bio {
      margin: 6px 0;
      font-size: 0.85em;
      line-height: 1.3;
      color: #4a4a4a;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      z-index: 2;
    }
    .#${widgetId}-bloglink {
      display: block;
      font-size: 0.82em;
      color: ${accentColor};
      text-decoration: none;
      font-weight: bold;
      word-break: break-all;
      z-index: 2;
    }

    /* Webring Quick Navigation Controls */
    .#${widgetId}-nav-controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(255, 255, 255, 0.7);
      border-radius: 12px;
      padding: 4px 8px;
      margin-top: 4px;
      border: 1px solid rgba(0,0,0,0.05);
      z-index: 2;
    }
    .#${widgetId}-nav-btn {
      color: ${accentColor};
      text-decoration: none;
      font-weight: bold;
      font-size: 0.8em;
      padding: 2px 6px;
      border-radius: 6px;
      transition: background 0.2s;
    }
    .#${widgetId}-nav-btn:hover {
      background: ${accentColor};
      color: #ffffff;
    }

    .#${widgetId}-credit {
      text-align: center;
      font-size: 0.75em;
      color: #7f8c8d;
      border-top: 1px dashed rgba(0,0,0,0.1);
      padding-top: 4px;
      margin-top: 4px;
      z-index: 2;
    }
    .#${widgetId}-credit a {
      color: ${accentColor};
      text-decoration: none;
      font-weight: bold;
    }

    /* Back Directory Layout */
    .#${widgetId}-back {
      transform: rotateY(180deg);
      padding: 10px;
    }
    .#${widgetId}-back-title {
      font-weight: bold;
      text-align: center;
      margin: 0 0 6px 0;
      color: ${accentColor};
      font-size: 0.9em;
    }
    .#${widgetId}-table-wrapper {
      flex: 1;
      overflow-y: auto;
      border: 1px solid rgba(0,0,0,0.08);
      border-radius: 8px;
      background: rgba(255,255,255,0.85);
    }
    .#${widgetId}-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.8em;
    }
    .#${widgetId}-table th, .#${widgetId}-table td {
      padding: 5px 8px;
      text-align: left;
      border-bottom: 1px solid #f1f2f6;
    }
    .#${widgetId}-table th {
      background: ${accentColor};
      color: #fff;
      position: sticky;
      top: 0;
      z-index: 2;
    }
    .#${widgetId}-table a {
      color: #2d3436;
      text-decoration: none;
      font-weight: bold;
    }
    .#${widgetId}-table a:hover {
      color: ${accentColor};
      text-decoration: underline;
    }

    /* Instruction Button */
    .#${widgetId}-instruction {
      text-align: center;
      margin-top: 8px;
      font-size: 0.8em;
      color: ${accentColor};
      cursor: pointer;
      user-select: none;
      font-weight: bold;
      transition: transform 0.2s;
    }
    .#${widgetId}-instruction:hover {
      transform: scale(1.02);
    }
  `;
  document.head.appendChild(style);

  // Sparkle HTML Template
  const sparkleHTML = sparkles ? `
    <div class="${widgetId}-sparkles">
      <span class="${widgetId}-sparkle ${widgetId}-s1">✦</span>
      <span class="${widgetId}-sparkle ${widgetId}-s2">✨</span>
      <span class="${widgetId}-sparkle ${widgetId}-s3">💖</span>
      <span class="${widgetId}-sparkle ${widgetId}-s4">✦</span>
    </div>
  ` : '';

  // Build Container HTML
  const container = document.createElement('div');
  container.className = `${widgetId}-container`;
  container.innerHTML = `
    <div class="${widgetId}-perspective">
      <div class="${widgetId}-card" id="${widgetId}-card">
        
        <!-- FRONT SIDE -->
        <div class="${widgetId}-face">
          ${sparkleHTML}
          <div class="${widgetId}-top-row">
            <img class="${widgetId}-avatar" src="${avatar}" alt="${name}'s Avatar" />
            <div class="${widgetId}-header-info">
              <div class="${widgetId}-name">${name}</div>
              <span class="${widgetId}-niche">${niche}</span>
            </div>
          </div>
          <div class="${widgetId}-bio">${bio}</div>
          <a class="${widgetId}-bloglink" href="${bloglink}" target="_blank" rel="nofollow noopener noreferrer">🌐 ${bloglink.replace(/^https?:\/\//, '')}</a>
          
          <!-- Prev / Random / Next Quick Controls -->
          <div class="${widgetId}-nav-controls">
            <a class="${widgetId}-nav-btn" id="${widgetId}-prev" href="#" target="_blank" rel="nofollow noopener noreferrer">◀ Prev</a>
            <a class="${widgetId}-nav-btn" id="${widgetId}-rand" href="#" target="_blank" rel="nofollow noopener noreferrer">🎲 Random</a>
            <a class="${widgetId}-nav-btn" id="${widgetId}-next" href="#" target="_blank" rel="nofollow noopener noreferrer">Next ▶</a>
          </div>

          <div class="${widgetId}-credit">
            Made by <a href="https://itsdida.neocities.org" target="_blank" rel="nofollow noopener noreferrer">Dida</a> ♡
          </div>
        </div>

        <!-- BACK SIDE (Directory Table) -->
        <div class="${widgetId}-face ${widgetId}-back">
          ${sparkleHTML}
          <div class="${widgetId}-back-title">🌸 Webring Directory</div>
          <div class="${widgetId}-table-wrapper">
            <table class="${widgetId}-table">
              <thead>
                <tr>
                  <th>Blog Name</th>
                  <th>Niche</th>
                </tr>
              </thead>
              <tbody id="${widgetId}-list">
                <tr><td colspan="2" style="text-align:center;">Loading directory...</td></tr>
              </tbody>
            </table>
          </div>
          <div class="${widgetId}-credit">
            Made by <a href="https://itsdida.neocities.org" target="_blank" rel="nofollow noopener noreferrer">Dida</a> ♡
          </div>
        </div>

      </div>
    </div>
    <div class="${widgetId}-instruction" id="${widgetId}-flip-btn">
      🔄 Click to flip card & view members list
    </div>
  `;

  currentScript.parentNode.insertBefore(container, currentScript);

  // Flip Toggle Event
  const cardElement = document.getElementById(`${widgetId}-card`);
  const flipBtn = document.getElementById(`${widgetId}-flip-btn`);
  
  let isFlipped = false;
  flipBtn.addEventListener('click', () => {
    isFlipped = !isFlipped;
    if (isFlipped) {
      cardElement.classList.add('flipped');
      flipBtn.textContent = '🔄 Click to flip back to Profile ID';
    } else {
      cardElement.classList.remove('flipped');
      flipBtn.textContent = '🔄 Click to flip card & view members list';
    }
  });

  // Fetch Member Directory and Bind Prev/Next Logic
  fetch(WEBRING_JSON_URL)
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById(`${widgetId}-list`);
      tbody.innerHTML = '';
      
      if (data && data.length > 0) {
        // Populate Table
        data.forEach(item => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td><a href="${item.url}" target="_blank" rel="nofollow noopener noreferrer">${item.name}</a></td>
            <td>${item.niche}</td>
          `;
          tbody.appendChild(tr);
        });

        // Determine current site position in index
        const currentCleanUrl = bloglink.replace(/\/$/, '').toLowerCase();
        let currentIndex = data.findIndex(item => item.url.replace(/\/$/, '').toLowerCase() === currentCleanUrl);
        if (currentIndex === -1) currentIndex = 0;

        // Calculate Prev / Next circular indices
        const prevIndex = (currentIndex - 1 + data.length) % data.length;
        const nextIndex = (currentIndex + 1) % data.length;
        
        // Random Index (excluding current if possible)
        let randIndex = Math.floor(Math.random() * data.length);
        if (data.length > 1 && randIndex === currentIndex) {
          randIndex = (currentIndex + 1) % data.length;
        }

        // Set Navigation Links
        document.getElementById(`${widgetId}-prev`).href = data[prevIndex].url;
        document.getElementById(`${widgetId}-next`).href = data[nextIndex].url;
        document.getElementById(`${widgetId}-rand`).href = data[randIndex].url;

      } else {
        tbody.innerHTML = '<tr><td colspan="2">No members found.</td></tr>';
      }
    })
    .catch(() => {
      const tbody = document.getElementById(`${widgetId}-list`);
      tbody.innerHTML = '<tr><td colspan="2">Unable to load directory.</td></tr>';
    });
})();

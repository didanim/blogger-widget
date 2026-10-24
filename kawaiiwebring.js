(function () {
  // Find current script tag to read user parameters
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
  const primaryColor = currentScript.getAttribute('cardColor') || '#ffeaa7'; // Customizable background
  const accentColor = currentScript.getAttribute('accentColor') || '#ff7675'; // Cute pastel accent
  const sparkles = currentScript.getAttribute('sparkles') === 'true'; // Sparkle overlay option

  // URL to raw webring directory JSON on GitHub
  const WEBRING_JSON_URL = 'https://raw.githubusercontent.com/YOUR_GITHUB_USERNAME/YOUR_REPO/main/webring.json';

  // Create unique widget container ID
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
      height: 220px;
      width: 100%;
    }
    .#${widgetId}-card {
      width: 100%;
      height: 100%;
      position: relative;
      transform-style: preserve-3d;
      transition: transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1);
      border-radius: 16px;
      box-shadow: 0 8px 16px rgba(0,0,0,0.08);
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
      background-color: ${primaryColor};
      box-sizing: border-box;
      padding: 12px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    ${sparkles ? `
    .#${widgetId}-face::before {
      content: '✨ ★ 💖 ✨ ✦';
      position: absolute;
      top: -10px; left: -10px; right: -10px; bottom: -10px;
      opacity: 0.15;
      font-size: 18px;
      word-spacing: 15px;
      line-height: 25px;
      pointer-events: none;
      z-index: 1;
    }` : ''}
    
    /* Front Layout */
    .#${widgetId}-top-row {
      display: flex;
      gap: 12px;
      align-items: center;
      z-index: 2;
    }
    .#${widgetId}-avatar {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid #fff;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
      flex-shrink: 0;
    }
    .#${widgetId}-header-info {
      flex-grow: 1;
      overflow: hidden;
    }
    .#${widgetId}-name {
      font-weight: bold;
      font-size: 1.1em;
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
      font-size: 0.8em;
      color: #636e72;
      border: 1px solid #dfe6e9;
    }
    .#${widgetId}-bio {
      margin: 8px 0;
      font-size: 0.88em;
      line-height: 1.3;
      color: #4a4a4a;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      z-index: 2;
    }
    .#${widgetId}-bloglink {
      display: block;
      font-size: 0.85em;
      color: ${accentColor};
      text-decoration: none;
      font-weight: bold;
      word-break: break-all;
      z-index: 2;
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

    /* Back Layout (Directory Table) */
    .#${widgetId}-back {
      transform: rotateY(180deg);
      padding: 10px;
    }
    .#${widgetId}-back-title {
      font-weight: bold;
      text-align: center;
      margin: 0 0 6px 0;
      color: ${accentColor};
      font-size: 0.95em;
    }
    .#${widgetId}-table-wrapper {
      flex: 1;
      overflow-y: auto;
      border: 1px solid rgba(0,0,0,0.08);
      border-radius: 8px;
      background: rgba(255,255,255,0.8);
    }
    .#${widgetId}-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.82em;
    }
    .#${widgetId}-table th, .#${widgetId}-table td {
      padding: 6px 8px;
      text-align: left;
      border-bottom: 1px solid #f1f2f6;
    }
    .#${widgetId}-table th {
      background: #f8a5c2;
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
      transform: scale(1.03);
    }
  `;
  document.head.appendChild(style);

  // Build HTML Structure
  const container = document.createElement('div');
  container.className = `${widgetId}-container`;
  container.innerHTML = `
    <div class="${widgetId}-perspective">
      <div class="${widgetId}-card" id="${widgetId}-card">
        
        <!-- FRONT SIDE -->
        <div class="${widgetId}-face">
          <div class="${widgetId}-top-row">
            <img class="${widgetId}-avatar" src="${avatar}" alt="${name}'s Avatar" />
            <div class="${widgetId}-header-info">
              <div class="${widgetId}-name">${name}</div>
              <span class="${widgetId}-niche">${niche}</span>
            </div>
          </div>
          <div class="${widgetId}-bio">${bio}</div>
          <a class="${widgetId}-bloglink" href="${bloglink}" target="_blank" rel="nofollow noopener noreferrer">🌐 ${bloglink.replace(/^https?:\/\//, '')}</a>
          <div class="${widgetId}-credit">
            Made by <a href="https://writewhim.blogspot.com" target="_blank" rel="nofollow noopener noreferrer">Dida</a> ♡
          </div>
        </div>

        <!-- BACK SIDE (Webring Table) -->
        <div class="${widgetId}-face ${widgetId}-back">
          <div class="${widgetId}-back-title">🌸 Webring Members Directory</div>
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
          <div class="${widgetId}-credit" style="margin-top:6px;">
            Made by <a href="https://writewhim.blogspot.com" target="_blank" rel="nofollow noopener noreferrer">Dida</a> ♡
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

  // Fetch Directory JSON dynamically from GitHub
  fetch(WEBRING_JSON_URL)
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById(`${widgetId}-list`);
      tbody.innerHTML = '';
      
      if (data && data.length > 0) {
        data.forEach(item => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td><a href="${item.url}" target="_blank" rel="nofollow noopener noreferrer">${item.name}</a></td>
            <td>${item.niche}</td>
          `;
          tbody.appendChild(tr);
        });
      } else {
        tbody.innerHTML = '<tr><td colspan="2">No members found.</td></tr>';
      }
    })
    .catch(() => {
      const tbody = document.getElementById(`${widgetId}-list`);
      tbody.innerHTML = '<tr><td colspan="2">Unable to load directory.</td></tr>';
    });
})();

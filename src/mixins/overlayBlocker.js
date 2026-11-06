// overlayBlocker.js

const overlayId = 'global-overlay-blocker';

export function showOverlay(message = 'Por favor espera...') {
  // Evitar crear varios overlays
  if (document.getElementById(overlayId)) return;

  const overlayDiv = document.createElement('div');
  overlayDiv.id = overlayId;
  overlayDiv.style.position = 'fixed';
  overlayDiv.style.top = '0';
  overlayDiv.style.left = '0';
  overlayDiv.style.width = '100vw';
  overlayDiv.style.height = '100vh';
  overlayDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.85)';
  overlayDiv.style.zIndex = '99999';
  overlayDiv.style.display = 'flex';
  overlayDiv.style.flexDirection = 'column';
  overlayDiv.style.justifyContent = 'center';
  overlayDiv.style.alignItems = 'center';
  overlayDiv.style.fontSize = '18px';
  overlayDiv.style.color = '#000';
  overlayDiv.style.userSelect = 'none';
  overlayDiv.style.pointerEvents = 'auto';

  const cardDiv = document.createElement('div');
  cardDiv.style.background = 'white';
  cardDiv.style.padding = '30px 40px';
  cardDiv.style.borderRadius = '12px';
  cardDiv.style.boxShadow = '0 5px 20px rgba(0,0,0,0.2)';
  cardDiv.style.textAlign = 'center';
  cardDiv.style.minWidth = '280px';
  cardDiv.style.maxWidth = '90%';

  const h3 = document.createElement('h3');
  h3.textContent = message;

  const p = document.createElement('p');
  p.textContent = 'Por favor espere...';

  cardDiv.appendChild(h3);
  cardDiv.appendChild(p);
  overlayDiv.appendChild(cardDiv);

  document.body.appendChild(overlayDiv);
}

export function hideOverlay() {
  const existing = document.getElementById(overlayId);
  if (existing) {
    document.body.removeChild(existing);
  }
}

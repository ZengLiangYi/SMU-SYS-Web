(function () {
  const root = document.getElementById('root');
  if (!root || root.innerHTML.trim()) return;

  root.innerHTML = `
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      
      html, body, #root { height: 100%; }

      .loading-container {
        display: grid;
        place-items: center;
        height: 100%;
        min-height: 362px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        text-align: center;
      }

      .loading-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
      }

      .spinner {
        width: 40px;
        height: 40px;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 6px;
        animation: spin 1.2s linear infinite;
      }

      .spinner i {
        background: #336fff;
        border-radius: 50%;
        animation: pulse 1.2s ease-in-out infinite;
      }

      .spinner i:nth-child(2) { animation-delay: 0.15s; }
      .spinner i:nth-child(3) { animation-delay: 0.45s; }
      .spinner i:nth-child(4) { animation-delay: 0.3s; }

      .loading-title {
        font-size: 1.1rem;
        color: #333;
        font-weight: 500;
      }

      .loading-sub-title {
        font-size: 0.9rem;
        color: #999;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      @keyframes pulse {
        0%, 100% { opacity: 0.3; transform: scale(0.8); }
        50% { opacity: 1; transform: scale(1); }
      }
    </style>

    <div class="loading-container">
      <div class="loading-content">
        <div class="spinner">
          <i></i><i></i><i></i><i></i>
        </div>
      </div>
    </div>
  `;
})();
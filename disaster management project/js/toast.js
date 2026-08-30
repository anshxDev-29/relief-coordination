// ============================================================
// Toast Notification System — shared across all pages
// Usage: showToast("Message here", "success" | "error" | "info", 4000)
// ============================================================

(function () {
  const styleId = "relief-toast-styles";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      #relief-toast-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-width: 360px;
      }
      .relief-toast {
        background: #ffffff;
        border-radius: 12px;
        padding: 14px 18px;
        box-shadow: 0 12px 30px -8px rgba(0,0,0,0.25);
        border-left: 4px solid #2563eb;
        font-family: 'Inter', sans-serif;
        font-size: 0.9rem;
        color: #14181c;
        display: flex;
        align-items: flex-start;
        gap: 10px;
        animation: relief-toast-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        line-height: 1.4;
      }
      .relief-toast.success { border-left-color: #16a34a; }
      .relief-toast.error { border-left-color: #dc2626; }
      .relief-toast.info { border-left-color: #2563eb; }
      .relief-toast .icon { font-size: 1.1rem; flex-shrink: 0; }
      .relief-toast.leaving { animation: relief-toast-out 0.25s ease forwards; }
      @keyframes relief-toast-in {
        from { transform: translateX(120%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes relief-toast-out {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(120%); opacity: 0; }
      }
      @media (max-width: 480px) {
        #relief-toast-container { left: 12px; right: 12px; max-width: none; }
      }
    `;
    document.head.appendChild(style);
  }

  let container = document.getElementById("relief-toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "relief-toast-container";
    document.body.appendChild(container);
  }

  const icons = { success: "✅", error: "⚠️", info: "ℹ️" };

  window.showToast = function (message, type = "info", duration = 4000) {
    const toast = document.createElement("div");
    toast.className = `relief-toast ${type}`;
    toast.innerHTML = `<span class="icon">${icons[type] || icons.info}</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("leaving");
      setTimeout(() => toast.remove(), 250);
    }, duration);
  };
})();

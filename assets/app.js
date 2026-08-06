(() => {
  "use strict";

  const config = window.MMP_CONFIG || {};
  const accountBase = String(config.accountBaseUrl || "").replace(/\/$/, "");

  function setAccountLinks() {
    const routeMap = {
      login: config.loginPath || "/login",
      register: config.registerPath || "/register",
      profile: config.profilePath || "/profile",
      characters: config.charactersPath || "/account"
    };

    document.querySelectorAll("[data-account-link]").forEach((element) => {
      const key = element.getAttribute("data-account-link");
      const route = routeMap[key];
      if (accountBase && route) element.href = accountBase + route;
    });
  }

  function setupMenu() {
    const header = document.querySelector(".site-header");
    const toggle = document.querySelector(".menu-toggle");
    if (!header || !toggle) return;

    toggle.addEventListener("click", () => {
      const isOpen = header.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  function readableStatus(value) {
    return value ? "Online" : "Offline";
  }

  function setText(selector, value) {
    document.querySelectorAll(selector).forEach((node) => {
      node.textContent = String(value);
      node.classList.remove("loading-shimmer");
    });
  }

  function setStatusDot(isOnline) {
    document.querySelectorAll("[data-status-dot]").forEach((dot) => {
      dot.classList.remove("online", "offline");
      dot.classList.add(isOnline ? "online" : "offline");
    });
  }

  function showStatusError(message) {
    setText("[data-server-status]", "Status unavailable");
    setText("[data-server-message]", message || "The live status endpoint could not be reached from this page.");
    setText("[data-player-count]", "—");
    setText("[data-server-version]", "—");
    setText("[data-social-count]", "—");
    setStatusDot(false);
  }

  async function loadServerStatus() {
    if (!config.statusApiUrl) {
      showStatusError("No public status API is configured.");
      return;
    }

    try {
      const response = await fetch(config.statusApiUrl, {
        method: "GET",
        mode: "cors",
        credentials: "omit",
        cache: "no-store",
        headers: { "Accept": "application/json" }
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const online = Boolean(data.online);
      const name = data.serverName || "MMOnsterpatch Server";

      setText("[data-server-status]", `${name} is ${readableStatus(online).toLowerCase()}`);
      setText("[data-server-message]", online ? "Account, world, trading-post, and social services are reporting live status." : "The server is currently reporting offline.");
      setText("[data-player-count]", Number.isFinite(Number(data.playersOnline)) ? Number(data.playersOnline) : 0);
      setText("[data-social-count]", Number.isFinite(Number(data.socialClients)) ? Number(data.socialClients) : 0);
      setText("[data-server-version]", data.serverVersion || "Unknown");
      setStatusDot(online);
    } catch (error) {
      console.warn("MMOnsterpatch status request failed:", error);
      showStatusError("The account server may need to allow this domain through CORS. Account links still work normally.");
    }
  }

  function setupDemoReactions() {
    document.querySelectorAll("[data-demo-like]").forEach((button) => {
      button.addEventListener("click", () => {
        const active = button.classList.toggle("active");
        button.setAttribute("aria-pressed", String(active));
        button.textContent = active ? "♥ Liked" : "♡ Like";
      });
    });
  }

  function stampYear() {
    setText("[data-current-year]", new Date().getFullYear());
  }

  document.addEventListener("DOMContentLoaded", () => {
    setAccountLinks();
    setupMenu();
    setupDemoReactions();
    stampYear();
    loadServerStatus();

    const refreshMs = Math.max(15000, Number(config.statusRefreshMs) || 60000);
    window.setInterval(loadServerStatus, refreshMs);
  });
})();

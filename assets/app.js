(() => {
  "use strict";

  const config = window.MMP_CONFIG || {};
  const API_BASE = String(config.apiBaseUrl || "").replace(/\/$/, "");
  const state = {
    me: null,
    characters: [],
    friends: [],
    incomingFriendRequests: [],
    outgoingFriendRequests: [],
    status: null,
    notifications: [],
    activeThreadId: null,
    reportPostId: null,
    selectedMedia: null,
    currentRoute: "feed",
    themePresets: [
      { id: "grove", name: "Grove", primary: "#285b46", accent: "#d7a84a" },
      { id: "sunstone", name: "Sunstone", primary: "#8a5b2e", accent: "#f0c65d" },
      { id: "ember", name: "Ember", primary: "#8b4637", accent: "#e08a55" },
      { id: "tide", name: "Tide", primary: "#356b78", accent: "#7fc7b9" },
      { id: "moon", name: "Moon", primary: "#55537f", accent: "#b8a6dc" },
      { id: "sprout", name: "Sprout", primary: "#4e7652", accent: "#a7cf72" },
      { id: "berry", name: "Berry", primary: "#7d465f", accent: "#dda2b2" },
      { id: "stone", name: "Stone", primary: "#50615a", accent: "#bac3a9" },
      { id: "sats", name: "SATS Gold", primary: "#5c4827", accent: "#e3b94f" }
    ]
  };

  const icons = {
    "home": '<svg class="icon" viewBox="0 0 24 24"><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/></svg>',
    "user": '<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
    "user-check": '<svg class="icon" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="m16 11 2 2 4-4"/></svg>',
    "users": '<svg class="icon" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M20 8v6M23 11h-6"/></svg>',
    "message-circle": '<svg class="icon" viewBox="0 0 24 24"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 9 9 0 0 1-4-.9L3 21l1.9-5a9 9 0 1 1 16.1-4.5Z"/></svg>',
    "search": '<svg class="icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>',
    "bell": '<svg class="icon" viewBox="0 0 24 24"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></svg>',
    "chevron-down": '<svg class="icon" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>',
    "settings": '<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6 1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z"/></svg>',
    "palette": '<svg class="icon" viewBox="0 0 24 24"><path d="M12 3a9 9 0 0 0 0 18h1.5a2 2 0 0 0 0-4H12a1.5 1.5 0 0 1 0-3h3a6 6 0 0 0 0-12Z"/><circle cx="7.5" cy="10" r="1"/><circle cx="10" cy="6.5" r="1"/><circle cx="15" cy="6.5" r="1"/></svg>',
    "moon": '<svg class="icon" viewBox="0 0 24 24"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z"/></svg>',
    "log-out": '<svg class="icon" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/></svg>',
    "sparkles": '<svg class="icon" viewBox="0 0 24 24"><path d="m12 3-1.2 3.3L7.5 7.5l3.3 1.2L12 12l1.2-3.3 3.3-1.2-3.3-1.2Z"/><path d="m19 13-.8 2.2L16 16l2.2.8L19 19l.8-2.2L22 16l-2.2-.8Z"/><path d="m5 13-.7 1.8-1.8.7 1.8.7L5 18l.7-1.8 1.8-.7-1.8-.7Z"/></svg>',
    "bookmark": '<svg class="icon" viewBox="0 0 24 24"><path d="M6 3h12v18l-6-4-6 4Z"/></svg>',
    "more-horizontal": '<svg class="icon" viewBox="0 0 24 24"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg>',
    "heart": '<svg class="icon" viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/></svg>',
    "share": '<svg class="icon" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4"/></svg>',
    "send": '<svg class="icon" viewBox="0 0 24 24"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>',
    "image": '<svg class="icon" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>',
    "x": '<svg class="icon" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    "flag": '<svg class="icon" viewBox="0 0 24 24"><path d="M5 21V4M5 4h12l-2 4 2 4H5"/></svg>',
    "eye-off": '<svg class="icon" viewBox="0 0 24 24"><path d="m3 3 18 18"/><path d="M10.6 10.7a2 2 0 0 0 2.8 2.8"/><path d="M9.9 4.2A10.6 10.6 0 0 1 12 4c7 0 10 8 10 8a16 16 0 0 1-2.1 3.2M6.6 6.6C3.5 8.6 2 12 2 12s3 8 10 8a10.8 10.8 0 0 0 5.4-1.4"/></svg>',
    "trash": '<svg class="icon" viewBox="0 0 24 24"><path d="M3 6h18M8 6V4h8v2M19 6l-1 15H6L5 6M10 11v6M14 11v6"/></svg>',
    "check-circle": '<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></svg>',
    "plus": '<svg class="icon" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
    "arrow-left": '<svg class="icon" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>',
    "refresh": '<svg class="icon" viewBox="0 0 24 24"><path d="M20 11a8 8 0 1 0-2.3 5.7L20 14"/><path d="M20 8v6h-6"/></svg>',
    "shield-check": '<svg class="icon" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></svg>',
    "globe": '<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>',
    "lock": '<svg class="icon" viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>',
    "edit": '<svg class="icon" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/></svg>'
  };

  function injectIcons(root = document) {
    root.querySelectorAll("[data-icon]").forEach(el => {
      const name = el.dataset.icon;
      if (icons[name]) el.innerHTML = icons[name];
    });
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>'"]/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "'":"&#39;", '"':"&quot;" }[c]));
  }

  function attr(value) { return escapeHtml(value); }
  function formatDate(value) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;
    return date.toLocaleDateString();
  }

  async function api(path, options = {}) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), Number(config.requestTimeoutMs || 15000));
    const headers = new Headers(options.headers || {});
    if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
    try {
      const response = await fetch(API_BASE + path, {
        ...options,
        headers,
        credentials: "include",
        signal: controller.signal
      });
      const type = response.headers.get("content-type") || "";
      const data = type.includes("application/json") ? await response.json() : await response.text();
      if (!response.ok) {
        const message = typeof data === "object" ? (data.message || data.error || `Request failed (${response.status})`) : (data || `Request failed (${response.status})`);
        const error = new Error(message);
        error.status = response.status;
        error.data = data;
        throw error;
      }
      return data;
    } finally {
      clearTimeout(timer);
    }
  }

  function toast(message) {
    const el = document.querySelector("[data-toast]");
    if (!el) return;
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => el.classList.remove("show"), 2800);
  }

  function showScreen(name) {
    document.querySelector("#boot-screen")?.classList.toggle("hidden", name !== "boot");
    document.querySelector("#auth-screen")?.classList.toggle("hidden", name !== "auth");
    document.querySelector("#app-screen")?.classList.toggle("hidden", name !== "app");
  }

  function avatarHtml(person, classes = "") {
    const name = person?.displayName || person?.name || person?.username || "Player";
    const url = person?.avatarUrl || person?.avatar_url || "";
    return `<span class="avatar ${classes}">${url ? `<img src="${attr(url)}" alt="${attr(name)}">` : `<img class="avatar-fallback" src="assets/default-player.png" alt="${attr(name)}">`}</span>`;
  }

  function currentMainCharacter() {
    const id = state.me?.profile?.mainCharacterId;
    return state.characters.find(c => c.characterId === id) || null;
  }

  function applyTheme(preferences = {}) {
    const mode = preferences.themeMode || "light";
    const primary = preferences.primaryColor || "#285b46";
    const accent = preferences.accentColor || "#d7a84a";
    const fontScaleRaw = Number(preferences.fontScale ?? 1);
    const fontScale = Math.max(.8, Math.min(1.4, Number.isFinite(fontScaleRaw) ? fontScaleRaw : 1));
    const fontStyle = ["game","comfortable","system"].includes(preferences.fontStyle) ? preferences.fontStyle : "game";
    document.documentElement.dataset.mode = mode === "dark" ? "dark" : "light";
    document.documentElement.dataset.font = fontStyle;
    document.documentElement.style.setProperty("--font-scale", String(fontScale));
    document.documentElement.style.setProperty("--primary", primary);
    document.documentElement.style.setProperty("--primary-strong", shadeColor(primary, -25));
    document.documentElement.style.setProperty("--primary-soft", mixColor(primary, mode === "dark" ? "#101713" : "#ffffff", mode === "dark" ? .62 : .82));
    document.documentElement.style.setProperty("--accent", accent);
    document.documentElement.style.setProperty("--accent-soft", mixColor(accent, mode === "dark" ? "#101713" : "#ffffff", mode === "dark" ? .68 : .74));
    document.querySelectorAll("[data-dark-toggle]").forEach(el => { el.checked = mode === "dark"; });
    document.querySelectorAll("[data-font-scale-value]").forEach(el => { el.textContent = `${Math.round(fontScale * 100)}%`; });
  }

  function hexToRgb(hex) {
    const clean = String(hex || "").replace("#", "");
    const value = clean.length === 3 ? clean.split("").map(x => x + x).join("") : clean;
    if (!/^[0-9a-f]{6}$/i.test(value)) return { r:31,g:90,b:70 };
    return { r:parseInt(value.slice(0,2),16), g:parseInt(value.slice(2,4),16), b:parseInt(value.slice(4,6),16) };
  }

  function rgbToHex({r,g,b}) { return `#${[r,g,b].map(v => Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,"0")).join("")}`; }
  function shadeColor(hex, percent) { const c=hexToRgb(hex); const f=1+percent/100; return rgbToHex({r:c.r*f,g:c.g*f,b:c.b*f}); }
  function mixColor(a,b,weight) { const x=hexToRgb(a),y=hexToRgb(b); return rgbToHex({r:x.r*(1-weight)+y.r*weight,g:x.g*(1-weight)+y.g*weight,b:x.b*(1-weight)+y.b*weight}); }

  function updateSharedUI() {
    if (!state.me) return;
    const user = state.me.account || {};
    const profile = state.me.profile || {};
    const main = currentMainCharacter();
    const avatarUrl = profile.avatarUrl || main?.avatarUrl || "";
    document.querySelectorAll("[data-current-name]").forEach(el => el.textContent = user.displayName || user.username || "Player");
    document.querySelectorAll("[data-current-rank]").forEach(el => el.textContent = main ? `Main Character · Rank ${main.rank || "E"}` : (profile.verifiedPlayer ? "Choose a main character" : "No linked character yet"));
    document.querySelectorAll("[data-current-avatar]").forEach(el => {
      el.innerHTML = avatarUrl ? `<img src="${attr(avatarUrl)}" alt="">` : `<img class="avatar-fallback" src="assets/default-player.png" alt="">`;
    });
    applyTheme(profile.preferences || {});
  }

  async function loadStatus() {
    try {
      const status = await api("/launcher/status");
      state.status = status;
      const online = Boolean(status.online);
      const players = Number(status.playersOnline || 0);
      document.querySelectorAll("[data-status-dot],[data-auth-status-dot]").forEach(el => { el.classList.toggle("online",online); el.classList.toggle("offline",!online); });
      document.querySelectorAll("[data-status-title],[data-auth-status-title]").forEach(el => el.textContent = online ? "Online" : "Offline");
      document.querySelectorAll("[data-player-count],[data-auth-player-count]").forEach(el => el.textContent = String(players));
    } catch {
      document.querySelectorAll("[data-status-dot],[data-auth-status-dot]").forEach(el => { el.classList.remove("online"); el.classList.add("offline"); });
      document.querySelectorAll("[data-status-title],[data-auth-status-title]").forEach(el => el.textContent = "Status unavailable");
      document.querySelectorAll("[data-player-count],[data-auth-player-count]").forEach(el => el.textContent = "—");
    }
  }

  async function loadMe() {
    const payload = await api("/account/me");
    state.me = payload;
    state.characters = payload.characters || [];
    updateSharedUI();
    return payload;
  }

  async function loadFriends() {
    try {
      const data = await api("/community/friends");
      state.friends = data.friends || [];
      state.incomingFriendRequests = data.incomingRequests || [];
      state.outgoingFriendRequests = data.outgoingRequests || [];
    }
    catch {
      state.friends = [];
      state.incomingFriendRequests = [];
      state.outgoingFriendRequests = [];
    }
    renderRightFriends();
  }

  async function loadMessageCount() {
    try {
      const data = await api("/community/messages/threads");
      const count = (data.threads || []).reduce((sum, thread) => sum + Number(thread.unreadCount || 0), 0);
      document.querySelectorAll("[data-message-count]").forEach(el => {
        el.textContent = count > 99 ? "99+" : String(count);
        el.classList.toggle("hidden", count === 0);
      });
    } catch { /* silent */ }
  }

  async function loadNotifications() {
    try {
      const data = await api("/community/notifications");
      state.notifications = data.notifications || [];
      const count = state.notifications.filter(n => !n.read).length;
      document.querySelectorAll("[data-notification-count]").forEach(el => { el.textContent = count > 99 ? "99+" : count; el.classList.toggle("hidden", count === 0); });
      renderNotifications();
    } catch { /* silent */ }
  }

  function renderRightFriends() {
    const root = document.querySelector("[data-right-friends]");
    if (!root) return;
    if (!state.friends.length) {
      root.innerHTML = '<div class="empty-card" style="padding:18px 8px"><p>No friends yet.</p></div>';
      return;
    }
    root.innerHTML = state.friends.slice(0,8).map(friend => `
      <button class="friend-row" type="button" data-open-thread-user="${attr(friend.accountId)}">
        ${avatarHtml(friend,"avatar-small")}
        <span><strong>${escapeHtml(friend.displayName)}</strong><small>${friend.mainCharacterName ? `${escapeHtml(friend.mainCharacterName)} · Rank ${escapeHtml(friend.rank || "E")}` : "MMOnsterpatch account"}</small></span>
        <i class="presence ${friend.online ? "online" : ""}"></i>
      </button>`).join("");
    root.querySelectorAll("[data-open-thread-user]").forEach(btn => btn.addEventListener("click", () => startThread(btn.dataset.openThreadUser)));
  }

  function renderNotifications() {
    const root = document.querySelector("[data-notification-list]");
    if (!root) return;
    if (!state.notifications.length) { root.innerHTML = '<div class="empty-card" style="padding:24px"><p>No notifications yet.</p></div>'; return; }
    root.innerHTML = state.notifications.map(n => `
      <a class="notification-item ${n.read ? "" : "unread"}" href="${attr(n.url || "#/feed")}" data-notification-id="${attr(n.notificationId)}">
        ${avatarHtml(n.actor || {},"avatar-small")}
        <span><strong>${escapeHtml(n.text || "Notification")}</strong><small>${formatDate(n.createdUtc)}</small></span>
      </a>`).join("");
  }

  function setActiveNav(route) {
    document.querySelectorAll("[data-route-link]").forEach(link => link.classList.toggle("active", link.dataset.routeLink === route));
  }

  function routeName() {
    const raw = location.hash.replace(/^#\/?/, "").split(/[?\/]/)[0];
    return raw || (state.me ? "feed" : "");
  }

  async function navigate() {
    if (!state.me) return;
    const route = routeName() || "feed";
    state.currentRoute = route;
    setActiveNav(route);
    closeFloatingPanels();
    const root = document.querySelector("#view-root");
    root.innerHTML = '<section class="content-card loading-card">Loading…</section>';
    try {
      switch (route) {
        case "profile": await renderProfile(); break;
        case "characters": await renderCharacters(); break;
        case "friends": await renderFriends(); break;
        case "messages": await renderMessages(); break;
        case "saved": await renderSaved(); break;
        case "settings": await renderSettings(); break;
        case "post": await renderSinglePost(); break;
        default: await renderFeed(); break;
      }
      root.focus({ preventScroll:true });
    } catch (error) {
      if (error.status === 401) return logout(false);
      root.innerHTML = errorCard(error.message || "This page could not be loaded.");
      bindRetry();
    }
  }

  function errorCard(message) {
    return `<section class="content-card error-card"><div class="empty-icon" data-icon="refresh"></div><h2>Something went wrong</h2><p>${escapeHtml(message)}</p><button class="primary-button" style="margin-top:14px" data-retry>Try again</button></section>`;
  }
  function bindRetry() { injectIcons(document.querySelector("#view-root")); document.querySelector("[data-retry]")?.addEventListener("click",navigate); }

  async function renderFeed() {
    const root = document.querySelector("#view-root");
    const data = await api("/community/feed");
    const posts = data.posts || [];
    root.innerHTML = `<div class="feed-stack">
      <section class="content-card composer-card">
        <div class="composer-top">${avatarHtml({ displayName:state.me.account.displayName, avatarUrl:state.me.profile.avatarUrl || currentMainCharacter()?.avatarUrl },"avatar-small")}<button type="button" class="composer-launch" data-open-post>What's happening in MMOnsterpatch?</button></div>
        <div class="composer-bottom"><button type="button" class="composer-photo" data-open-post-photo><span data-icon="image"></span>Add photo</button></div>
      </section>
      <div data-post-list>${posts.length ? posts.map(postHtml).join("") : emptyPostsHtml()}</div>
    </div>`;
    injectIcons(root);
    root.querySelector("[data-open-post]")?.addEventListener("click", () => openModal("post"));
    root.querySelector("[data-open-post-photo]")?.addEventListener("click", () => { openModal("post"); setTimeout(() => document.querySelector("[data-post-image]")?.click(),50); });
    bindPosts(root);
  }

  async function renderSinglePost() {
    const root = document.querySelector("#view-root");
    const postId = location.hash.replace(/^#\/post\//, "").split(/[?]/)[0];
    if (!postId || postId === location.hash) throw new Error("Post link is invalid.");
    const data = await api(`/community/posts/${encodeURIComponent(postId)}`);
    root.innerHTML = `<div class="page-head"><div><h1>Post</h1><p>Shared from the MMOnsterpatch community.</p></div><a class="secondary-button" href="#/feed"><span data-icon="arrow-left"></span>Back to Feed</a></div><div class="feed-stack">${postHtml(data.post)}</div>`;
    injectIcons(root);
    bindPosts(root);
  }

  function emptyPostsHtml() {
    return `<section class="content-card empty-card"><div class="empty-icon" data-icon="message-circle"></div><h2>No posts yet</h2><p>The community feed is empty. Be the first player to post.</p></section>`;
  }

  function postHtml(post) {
    const mine = post.author?.accountId === state.me.account.accountId;
    const verified = Boolean(post.author?.verifiedPlayer);
    const rank = post.author?.rank;
    const comments = post.comments || [];
    return `<article class="post-card" data-post-id="${attr(post.postId)}">
      <header class="post-head">
        ${avatarHtml(post.author || {},"avatar-small")}
        <div class="post-author">
          <div class="post-author-line"><strong>${escapeHtml(post.author?.displayName || "Player")}</strong>${verified ? '<span class="verified-badge"><span data-icon="shield-check"></span>Verified Player</span>' : ""}${verified && rank ? `<span class="rank-badge">Rank ${escapeHtml(rank)}</span>` : ""}</div>
          <div class="post-meta"><span>${formatDate(post.createdUtc)}</span><span>·</span><span data-icon="${post.visibility === "friends" ? "users" : "globe"}"></span></div>
        </div>
        <div class="post-menu-wrap"><button class="post-menu-button" type="button" aria-label="Post options" data-post-menu><span data-icon="more-horizontal"></span></button>
          <div class="context-menu hidden" data-post-context>
            <button type="button" data-save-post="personal"><span data-icon="bookmark"></span><span>Save privately<span class="context-subtitle">Only you can see it</span></span></button>
            <button type="button" data-save-post="global"><span data-icon="globe"></span><span>Save to Global<span class="context-subtitle">Add to community bookmarks</span></span></button>
            <button type="button" data-hide-post><span data-icon="eye-off"></span><span>Hide post<span class="context-subtitle">Remove it from your feed</span></span></button>
            <button type="button" data-report-post><span data-icon="flag"></span><span>Report post<span class="context-subtitle">Send it to moderators</span></span></button>
            ${mine ? '<button type="button" class="danger" data-delete-post><span data-icon="trash"></span><span>Delete post</span></button>' : ""}
          </div>
        </div>
      </header>
      <div class="post-body">${escapeHtml(post.body)}</div>
      ${post.mediaUrl ? `<img class="post-media" src="${attr(post.mediaUrl)}" alt="Post image" loading="lazy">` : ""}
      <div class="post-summary"><span>${Number(post.reactionCount || 0)} ${Number(post.reactionCount || 0) === 1 ? "reaction" : "reactions"}</span><span>${Number(post.commentCount || comments.length || 0)} ${Number(post.commentCount || comments.length || 0) === 1 ? "comment" : "comments"}</span></div>
      <div class="post-actions">
        <button type="button" class="${post.reacted ? "active" : ""}" data-react><span data-icon="heart"></span>${post.reacted ? "Liked" : "Like"}</button>
        <button type="button" data-comment-toggle><span data-icon="message-circle"></span>Comment</button>
        <button type="button" data-share><span data-icon="share"></span>Share</button>
      </div>
      <div class="comment-area ${comments.length ? "" : "hidden"}" data-comment-area>
        <div class="comment-list">${comments.map(commentHtml).join("")}</div>
        <form class="comment-form" data-comment-form><input name="body" maxlength="1200" placeholder="Write a comment…" required><button type="submit" aria-label="Send comment"><span data-icon="send"></span></button></form>
      </div>
    </article>`;
  }

  function commentHtml(comment) {
    return `<div class="comment-row">${avatarHtml(comment.author || {},"avatar-small")}<div class="comment-bubble"><strong>${escapeHtml(comment.author?.displayName || "Player")}</strong><p>${escapeHtml(comment.body)}</p></div></div>`;
  }

  function bindPosts(root) {
    injectIcons(root);
    root.querySelectorAll("[data-post-id]").forEach(card => {
      const id = card.dataset.postId;
      card.querySelector("[data-post-menu]")?.addEventListener("click", event => {
        event.stopPropagation();
        document.querySelectorAll("[data-post-context]").forEach(menu => { if (menu !== card.querySelector("[data-post-context]")) menu.classList.add("hidden"); });
        card.querySelector("[data-post-context]").classList.toggle("hidden");
      });
      card.querySelectorAll("[data-save-post]").forEach(btn => btn.addEventListener("click", async () => {
        await api(`/community/posts/${encodeURIComponent(id)}/save`, { method:"POST", body:JSON.stringify({ scope:btn.dataset.savePost }) });
        toast(btn.dataset.savePost === "global" ? "Saved to Global." : "Saved privately.");
        card.querySelector("[data-post-context]").classList.add("hidden");
      }));
      card.querySelector("[data-hide-post]")?.addEventListener("click", async () => {
        await api(`/community/posts/${encodeURIComponent(id)}/hide`, { method:"POST" });
        card.remove(); toast("Post hidden from your feed.");
      });
      card.querySelector("[data-report-post]")?.addEventListener("click", () => { state.reportPostId = id; openModal("report"); card.querySelector("[data-post-context]").classList.add("hidden"); });
      card.querySelector("[data-delete-post]")?.addEventListener("click", async () => {
        if (!confirm("Delete this post? This cannot be undone.")) return;
        await api(`/community/posts/${encodeURIComponent(id)}`, { method:"DELETE" }); card.remove(); toast("Post deleted.");
      });
      card.querySelector("[data-react]")?.addEventListener("click", async btnEvent => {
        const result = await api(`/community/posts/${encodeURIComponent(id)}/reaction`, { method:"POST", body:JSON.stringify({ type:"like" }) });
        const button = btnEvent.currentTarget; button.classList.toggle("active",result.reacted); button.childNodes[button.childNodes.length-1].nodeValue = result.reacted ? "Liked" : "Like";
        const count = card.querySelector(".post-summary span"); if (count) count.textContent = `${result.reactionCount} ${result.reactionCount === 1 ? "reaction" : "reactions"}`;
      });
      card.querySelector("[data-comment-toggle]")?.addEventListener("click", () => { const area=card.querySelector("[data-comment-area]"); area.classList.remove("hidden"); area.querySelector("input")?.focus(); });
      card.querySelector("[data-comment-form]")?.addEventListener("submit", async event => {
        event.preventDefault(); const input=event.currentTarget.elements.body; const body=input.value.trim(); if(!body) return;
        const result=await api(`/community/posts/${encodeURIComponent(id)}/comments`,{method:"POST",body:JSON.stringify({body})});
        card.querySelector(".comment-list").insertAdjacentHTML("beforeend",commentHtml(result.comment)); injectIcons(card.querySelector(".comment-list")); input.value="";
      });
      card.querySelector("[data-share]")?.addEventListener("click", async () => {
        const url = `${location.origin}${location.pathname}#/post/${id}`;
        if (navigator.share) await navigator.share({ title:"MMOnsterpatch post", url }); else { await navigator.clipboard.writeText(url); toast("Post link copied."); }
      });
    });
  }

  async function renderProfile() {
    await loadMe();
    const root=document.querySelector("#view-root"), profile=state.me.profile||{}, account=state.me.account||{}, main=currentMainCharacter();
    root.innerHTML=`<section class="content-card profile-card">
      <div class="profile-cover"></div>
      <div class="profile-main">
        ${avatarHtml({displayName:account.displayName,avatarUrl:profile.avatarUrl||main?.avatarUrl},"avatar-xl")}
        <div class="profile-title"><h1>${escapeHtml(account.displayName||account.username)}</h1><div class="profile-badges">${profile.verifiedPlayer?'<span class="verified-badge"><span data-icon="shield-check"></span>Verified MMOnsterpatch Player</span>':""}${main?`<span class="rank-badge">Rank ${escapeHtml(main.rank||"E")}</span>`:""}</div></div>
        <a class="secondary-button" href="#/settings"><span data-icon="edit"></span>Edit Profile</a>
      </div>
      <nav class="profile-tabs"><a class="active" href="#/profile">Posts</a><a href="#/characters">Characters</a><a href="#/friends">Friends</a></nav>
    </section>
    <section class="content-card section-card"><h2>About</h2><p>${profile.bio?escapeHtml(profile.bio):'<span style="color:var(--muted)">No biography added yet.</span>'}</p></section>
    <section class="feed-stack" style="margin-top:12px" data-profile-posts></section>`;
    injectIcons(root);
    const data=await api(`/community/profiles/${encodeURIComponent(account.accountId)}/posts`);
    const target=root.querySelector("[data-profile-posts]"); target.innerHTML=(data.posts||[]).length?(data.posts||[]).map(postHtml).join(""):emptyPostsHtml(); bindPosts(target);
  }

  async function renderCharacters() {
    await loadMe();
    const root=document.querySelector("#view-root"), mainId=state.me.profile?.mainCharacterId;
    root.innerHTML=`<div class="page-head"><div><h1>Characters</h1><p>Select one linked save as your main character.</p></div></div>
      <section class="content-card section-card">
        ${state.characters.length?`<div class="character-grid">${state.characters.map(c=>characterHtml(c,c.characterId===mainId)).join("")}</div>`:`<div class="empty-card"><div class="empty-icon" data-icon="sparkles"></div><h2>No linked characters</h2><p>Create or load an Online Play save slot. The verified badge appears after a server character exists.</p></div>`}
      </section>`;
    injectIcons(root);
    root.querySelectorAll("[data-main-character]").forEach(input=>input.addEventListener("change",async()=>{
      if(!input.checked)return;
      await api("/community/profile/main-character",{method:"PUT",body:JSON.stringify({characterId:input.value})});
      await loadMe(); toast("Main character updated."); await renderCharacters();
    }));
  }

  function characterHtml(c,isMain) {
    return `<article class="character-card ${isMain?"main":""}">${isMain?'<span class="main-character-label">Main Character</span>':""}<div class="character-art"><img src="${attr(c.avatarUrl)}" alt="${attr(c.displayName)} appearance"></div><div class="character-info"><h3>${escapeHtml(c.displayName)}</h3><div class="character-meta"><span>Save Slot ${Number(c.saveSlot||c.slotIndex+1)}</span><span>Rank ${escapeHtml(c.rank||"E")}</span></div><label class="main-character-control"><input type="radio" name="mainCharacter" value="${attr(c.characterId)}" data-main-character ${isMain?"checked":""}>Make Main Character</label></div></article>`;
  }

  async function renderFriends() {
    await loadFriends();
    const root=document.querySelector("#view-root");
    const incoming = state.incomingFriendRequests || [];
    const requests = incoming.length ? `<section class="content-card section-card"><div class="section-heading"><h2>Friend Requests</h2><span>${incoming.length}</span></div><div class="member-grid compact-grid">${incoming.map(friend=>`<article class="member-card request-card">${avatarHtml(friend,"avatar-large")}<span><strong>${escapeHtml(friend.displayName)}</strong><small>${friend.verifiedPlayer?`Verified Player${friend.rank?` · Rank ${escapeHtml(friend.rank)}`:""}`:"MMOnsterpatch account"}</small></span><div class="request-actions"><button class="primary-button" type="button" data-accept-friend="${attr(friend.accountId)}">Accept</button><button class="secondary-button" type="button" data-open-thread-user="${attr(friend.accountId)}">Message</button></div></article>`).join("")}</div></section>` : "";
    root.innerHTML=`<div class="page-head"><div><h1>Friends</h1><p>Players you have connected with.</p></div><button class="primary-button" data-find-people><span data-icon="plus"></span>Find Players</button></div>
      ${requests}
      ${state.friends.length?`<div class="member-grid">${state.friends.map(friend=>`<article class="content-card member-card">${avatarHtml(friend,"avatar-large")}<span><strong>${escapeHtml(friend.displayName)}</strong><small>${friend.mainCharacterName?`${escapeHtml(friend.mainCharacterName)} · Rank ${escapeHtml(friend.rank||"E")}`:"MMOnsterpatch account"}</small></span><div class="member-card-actions"><button type="button" aria-label="Message" data-open-thread-user="${attr(friend.accountId)}"><span data-icon="message-circle"></span></button></div></article>`).join("")}</div>`:`<section class="content-card empty-card"><div class="empty-icon" data-icon="users"></div><h2>No friends yet</h2><p>Use Find Players to connect with other MMOnsterpatch members.</p></section>`}`;
    injectIcons(root);
    root.querySelector("[data-find-people]")?.addEventListener("click",()=>{openModal("new-message");const input=document.querySelector("[data-member-search]");if(input){input.value="";input.focus();document.querySelector("[data-member-results]").innerHTML="";}});
    root.querySelectorAll("[data-open-thread-user]").forEach(btn=>btn.addEventListener("click",()=>startThread(btn.dataset.openThreadUser)));
    root.querySelectorAll("[data-accept-friend]").forEach(btn=>btn.addEventListener("click",async()=>{await api(`/community/friends/${encodeURIComponent(btn.dataset.acceptFriend)}/accept`,{method:"POST"});toast("Friend request accepted.");await renderFriends();}));
  }

  async function renderSaved(scope="personal") {
    const root=document.querySelector("#view-root");
    const data=await api(`/community/saved?scope=${encodeURIComponent(scope)}`);
    const posts=data.posts||[];
    root.innerHTML=`<div class="page-head"><div><h1>Saved</h1><p>Keep important posts easy to find.</p></div></div>
      <section class="content-card tab-bar"><button class="${scope==="personal"?"active":""}" data-saved-tab="personal"><span data-icon="lock"></span> My Saved</button><button class="${scope==="global"?"active":""}" data-saved-tab="global"><span data-icon="globe"></span> Global Saved</button></section>
      <div class="feed-stack" data-saved-posts>${posts.length?posts.map(postHtml).join(""):`<section class="content-card empty-card"><div class="empty-icon" data-icon="bookmark"></div><h2>Nothing saved here</h2><p>Use the three-dot menu on a post to save it.</p></section>`}</div>`;
    injectIcons(root); bindPosts(root.querySelector("[data-saved-posts]"));
    root.querySelectorAll("[data-saved-tab]").forEach(btn=>btn.addEventListener("click",()=>renderSaved(btn.dataset.savedTab)));
  }

  async function renderSettings() {
    const root=document.querySelector("#view-root"),account=state.me.account,profile=state.me.profile||{},prefs=profile.preferences||{};
    const fontScale=Math.max(.8,Math.min(1.4,Number(prefs.fontScale||1)));
    const fontStyle=["game","comfortable","system"].includes(prefs.fontStyle)?prefs.fontStyle:"game";
    root.innerHTML=`<div class="page-head"><div><h1>Preferences & Account</h1><p>Profile details, appearance, accessibility, and community preferences.</p></div></div>
      <section class="content-card settings-section">
        <div class="settings-section-head"><div class="settings-pixel-icon"><img src="assets/profile-icon.png" alt=""></div><div><h2>Profile</h2><p>Information shown to other MMOnsterpatch players.</p></div></div>
        <form class="settings-form" data-settings-form>
          <label>Display name<input name="displayName" maxlength="32" value="${attr(account.displayName||"")}" required></label>
          <label>Biography<textarea name="bio" maxlength="500" placeholder="Tell the community about yourself">${escapeHtml(profile.bio||"")}</textarea></label>
          <label>Email<input type="email" value="${attr(account.email||"")}" disabled><small>Email changes require account verification and are not enabled in this release.</small></label>
          <div class="form-error" data-settings-error></div>
          <div><button class="primary-button" type="submit">Save Profile</button></div>
        </form>
      </section>
      <section class="content-card settings-section">
        <div class="settings-section-head"><div class="settings-pixel-icon"><img src="assets/game-star.png" alt=""></div><div><h2>Display Preferences</h2><p>These settings are stored with your account and follow you between browsers.</p></div></div>
        <form class="settings-form preferences-form" data-preferences-form>
          <label>Text style
            <select name="fontStyle">
              <option value="game" ${fontStyle==="game"?"selected":""}>Game style</option>
              <option value="comfortable" ${fontStyle==="comfortable"?"selected":""}>Comfortable rounded</option>
              <option value="system" ${fontStyle==="system"?"selected":""}>System font</option>
            </select>
            <small>The game style first checks for the original Mintsoda Lime Green font and uses a pixel-style fallback when it is not installed.</small>
          </label>
          <div class="font-size-setting">
            <div class="font-size-label"><span>Displayed text size</span><strong data-font-scale-value>${Math.round(fontScale*100)}%</strong></div>
            <div class="font-size-controls">
              <button type="button" class="secondary-button font-step" data-font-step="-0.05" aria-label="Decrease font size">A−</button>
              <input type="range" name="fontScale" min="0.8" max="1.4" step="0.05" value="${fontScale}" aria-label="Displayed text size">
              <button type="button" class="secondary-button font-step" data-font-step="0.05" aria-label="Increase font size">A+</button>
              <button type="button" class="text-button inline-reset" data-font-reset>Reset</button>
            </div>
          </div>
          <div class="font-preview" data-font-preview>
            <img src="assets/default-player.png" alt="">
            <span><strong>MMOnsterpatch text preview</strong><small>Posts, menus, messages, and account pages use this size.</small></span>
          </div>
          <label class="preference-check"><span><strong>Dark mode</strong><small>Use the darker community appearance.</small></span><input type="checkbox" name="darkMode" ${prefs.themeMode==="dark"?"checked":""}></label>
          <div class="settings-actions"><button class="primary-button" type="submit">Save Display Preferences</button><button class="secondary-button" type="button" data-open-theme-settings>Choose Theme Colors</button></div>
          <div class="form-error" data-preferences-error></div>
        </form>
      </section>`;
    injectIcons(root);
    root.querySelector("[data-settings-form]").addEventListener("submit",async event=>{
      event.preventDefault(); const data=new FormData(event.currentTarget); const error=event.currentTarget.querySelector("[data-settings-error]"); error.textContent="";
      try { await api("/community/profile",{method:"PUT",body:JSON.stringify({displayName:data.get("displayName"),bio:data.get("bio")})}); await loadMe(); toast("Profile saved."); }
      catch(ex){error.textContent=ex.message;}
    });
    const prefForm=root.querySelector("[data-preferences-form]");
    const range=prefForm.elements.fontScale;
    const updatePreview=()=>{
      const value=Math.max(.8,Math.min(1.4,Number(range.value||1)));
      root.querySelector("[data-font-scale-value]").textContent=`${Math.round(value*100)}%`;
      root.querySelector("[data-font-preview]").style.setProperty("--preview-scale",String(value));
      document.documentElement.style.setProperty("--font-scale",String(value));
      document.documentElement.dataset.font=prefForm.elements.fontStyle.value;
    };
    range.addEventListener("input",updatePreview);
    prefForm.elements.fontStyle.addEventListener("change",updatePreview);
    prefForm.querySelectorAll("[data-font-step]").forEach(btn=>btn.addEventListener("click",()=>{range.value=String(Math.max(.8,Math.min(1.4,Number(range.value)+Number(btn.dataset.fontStep))));updatePreview();}));
    prefForm.querySelector("[data-font-reset]").addEventListener("click",()=>{range.value="1";updatePreview();});
    prefForm.querySelector("[data-open-theme-settings]").addEventListener("click",()=>{renderThemePresets();openModal("theme");});
    prefForm.addEventListener("submit",async event=>{
      event.preventDefault();const error=event.currentTarget.querySelector("[data-preferences-error]");error.textContent="";
      const next={...(state.me.profile.preferences||{}),fontStyle:event.currentTarget.elements.fontStyle.value,fontScale:Number(event.currentTarget.elements.fontScale.value),themeMode:event.currentTarget.elements.darkMode.checked?"dark":"light"};
      try{applyTheme(next);await savePreferences(next);toast("Display preferences saved.");}
      catch(ex){error.textContent=ex.message;applyTheme(state.me.profile.preferences||{});}
    });
    updatePreview();
  }

  async function renderMessages() {
    const root=document.querySelector("#view-root");
    const data=await api("/community/messages/threads");
    const threads=data.threads||[];
    if(!state.activeThreadId&&threads.length) state.activeThreadId=threads[0].threadId;
    root.innerHTML=`<section class="content-card messages-layout ${state.activeThreadId?"thread-selected":""}" data-messages-layout>
      <aside class="thread-column"><div class="thread-head"><h1>Messages</h1><button class="icon-button" type="button" data-new-message aria-label="New message"><span data-icon="edit"></span></button></div><label class="thread-search"><span data-icon="search"></span><input type="search" placeholder="Search messages" data-thread-filter></label><div class="thread-list" data-thread-list>${threads.length?threads.map(threadHtml).join(""):'<div class="empty-card"><p>No conversations yet.</p></div>'}</div></aside>
      <section class="chat-column" data-chat-column>${state.activeThreadId?'<div class="loading-card">Loading conversation…</div>':'<div class="empty-card"><div class="empty-icon" data-icon="message-circle"></div><h2>Select a conversation</h2><p>Private messages appear here.</p></div>'}</section>
    </section>`;
    injectIcons(root);
    root.querySelector("[data-new-message]")?.addEventListener("click",()=>openModal("new-message"));
    root.querySelectorAll("[data-thread-id]").forEach(btn=>btn.addEventListener("click",async()=>{state.activeThreadId=btn.dataset.threadId; await renderMessages();}));
    root.querySelector("[data-thread-filter]")?.addEventListener("input",event=>{const q=event.target.value.toLowerCase();root.querySelectorAll("[data-thread-id]").forEach(row=>row.classList.toggle("hidden",!row.textContent.toLowerCase().includes(q)));});
    if(state.activeThreadId) await renderActiveThread(state.activeThreadId);
  }

  function threadHtml(t) { return `<button class="thread-row ${String(t.threadId)===String(state.activeThreadId)?"active":""}" type="button" data-thread-id="${attr(t.threadId)}">${avatarHtml(t.otherMember||{},"avatar-small")}<span><strong>${escapeHtml(t.otherMember?.displayName||"Conversation")}</strong><small>${escapeHtml(t.lastMessage||"No messages yet")}</small></span>${t.unreadCount?`<b class="nav-badge" style="position:static">${Number(t.unreadCount)}</b>`:""}</button>`; }

  async function renderActiveThread(id) {
    const column=document.querySelector("[data-chat-column]"); if(!column)return;
    const data=await api(`/community/messages/threads/${encodeURIComponent(id)}`), other=data.otherMember||{}, messages=data.messages||[];
    column.innerHTML=`<header class="chat-head"><button class="icon-button" type="button" data-back-threads aria-label="Back"><span data-icon="arrow-left"></span></button>${avatarHtml(other,"avatar-small")}<span><strong>${escapeHtml(other.displayName||"Player")}</strong><small>${other.online?"Online":"Offline"}</small></span></header><div class="message-list" data-message-list>${messages.length?messages.map(messageHtml).join(""):'<div class="empty-card"><p>No messages yet. Say hello.</p></div>'}</div><form class="chat-form" data-message-form><input name="body" maxlength="4000" autocomplete="off" placeholder="Write a message…" required><button type="submit" aria-label="Send"><span data-icon="send"></span></button></form>`;
    injectIcons(column);
    column.querySelector("[data-back-threads]")?.addEventListener("click",()=>{state.activeThreadId=null;renderMessages();});
    column.querySelector("[data-message-form]").addEventListener("submit",async event=>{event.preventDefault();const input=event.currentTarget.elements.body,body=input.value.trim();if(!body)return;const result=await api(`/community/messages/threads/${encodeURIComponent(id)}`,{method:"POST",body:JSON.stringify({body})});input.value="";const list=column.querySelector("[data-message-list]");if(list.querySelector(".empty-card"))list.innerHTML="";list.insertAdjacentHTML("beforeend",messageHtml(result.message));injectIcons(list);bindMessageDeletes(list);list.scrollTop=list.scrollHeight;});
    bindMessageDeletes(column); const list=column.querySelector("[data-message-list]"); list.scrollTop=list.scrollHeight;
  }

  function messageHtml(m) {
    return `<div class="message-row ${m.mine?"mine":""} ${m.deleted?"deleted":""}" data-message-id="${attr(m.messageId)}"><div class="message-bubble">${m.deleted?"Message deleted":escapeHtml(m.body)}</div>${m.mine&&!m.deleted&&m.canDelete?`<div class="message-options"><button type="button" aria-label="Delete your message" data-delete-message><span data-icon="trash"></span></button></div>`:""}</div>`;
  }

  function bindMessageDeletes(root) {
    root.querySelectorAll("[data-delete-message]").forEach(btn=>btn.addEventListener("click",async()=>{const row=btn.closest("[data-message-id]");if(!confirm("Delete your message for everyone?"))return;await api(`/community/messages/${encodeURIComponent(row.dataset.messageId)}`,{method:"DELETE"});row.classList.add("deleted");row.querySelector(".message-bubble").textContent="Message deleted";row.querySelector(".message-options")?.remove();toast("Message deleted.");}));
  }

  async function startThread(accountId) {
    try { const result=await api("/community/messages/threads",{method:"POST",body:JSON.stringify({recipientAccountId:accountId})});state.activeThreadId=result.threadId;location.hash="#/messages";if(state.currentRoute==="messages")await renderMessages();closeModal("new-message"); }
    catch(ex){toast(ex.message);}
  }

  function openModal(name) { document.querySelector(`[data-modal="${name}"]`)?.classList.remove("hidden"); document.body.style.overflow="hidden"; }
  function closeModal(name) { document.querySelector(`[data-modal="${name}"]`)?.classList.add("hidden"); if(!document.querySelector(".modal-backdrop:not(.hidden)"))document.body.style.overflow=""; }
  function closeFloatingPanels(){document.querySelectorAll(".floating-panel").forEach(p=>p.classList.add("hidden"));document.querySelector("[data-account-menu-toggle]")?.setAttribute("aria-expanded","false");}

  function bindGlobalUI() {
    document.querySelectorAll("[data-auth-tab]").forEach(btn=>btn.addEventListener("click",()=>{
      document.querySelectorAll("[data-auth-tab]").forEach(x=>x.classList.toggle("active",x===btn));
      document.querySelector("#login-form").classList.toggle("hidden",btn.dataset.authTab!=="login");
      document.querySelector("#register-form").classList.toggle("hidden",btn.dataset.authTab!=="register");
    }));

    document.querySelector("#login-form").addEventListener("submit",async event=>{
      event.preventDefault();const form=event.currentTarget,error=form.querySelector("[data-login-error]");error.textContent="";const data=new FormData(form);
      try{await api("/account/login",{method:"POST",body:JSON.stringify({usernameOrEmail:data.get("usernameOrEmail"),password:data.get("password")})});await enterApp();location.hash="#/feed";}
      catch(ex){error.textContent=ex.message;}
    });
    document.querySelector("#register-form").addEventListener("submit",async event=>{
      event.preventDefault();const form=event.currentTarget,error=form.querySelector("[data-register-error]");error.textContent="";const data=new FormData(form);if(data.get("password")!==data.get("confirmPassword")){error.textContent="Passwords do not match.";return;}
      try{await api("/account/register",{method:"POST",body:JSON.stringify({username:data.get("username"),displayName:data.get("displayName"),email:data.get("email"),password:data.get("password")})});await enterApp();location.hash="#/characters";}
      catch(ex){error.textContent=ex.message;}
    });
    document.querySelector("[data-forgot-password]")?.addEventListener("click",()=>toast("Password-reset email support is not enabled yet."));

    document.querySelector("[data-account-menu-toggle]")?.addEventListener("click",event=>{event.stopPropagation();const panel=document.querySelector("[data-account-menu]");const open=panel.classList.toggle("hidden");document.querySelector("[data-notification-panel]").classList.add("hidden");event.currentTarget.setAttribute("aria-expanded",String(!open));});
    document.querySelector("[data-notification-toggle]")?.addEventListener("click",event=>{event.stopPropagation();document.querySelector("[data-notification-panel]").classList.toggle("hidden");document.querySelector("[data-account-menu]").classList.add("hidden");});
    document.addEventListener("click",event=>{if(!event.target.closest(".floating-panel")&&!event.target.closest("[data-account-menu-toggle]")&&!event.target.closest("[data-notification-toggle]"))closeFloatingPanels();document.querySelectorAll("[data-post-context]").forEach(menu=>{if(!event.target.closest(".post-menu-wrap"))menu.classList.add("hidden");});});
    document.querySelector("[data-logout]")?.addEventListener("click",()=>logout(true));
    document.querySelectorAll("[data-theme-open]").forEach(btn=>btn.addEventListener("click",()=>{renderThemePresets();openModal("theme");closeFloatingPanels();}));
    document.querySelectorAll("[data-dark-toggle]").forEach(toggle=>toggle.addEventListener("change",async()=>{const prefs={...(state.me.profile.preferences||{}),themeMode:toggle.checked?"dark":"light"};applyTheme(prefs);try{await savePreferences(prefs);}catch(ex){toast(ex.message);}}));
    document.querySelectorAll("[data-modal-close]").forEach(btn=>btn.addEventListener("click",()=>closeModal(btn.closest("[data-modal]").dataset.modal)));
    document.querySelectorAll(".modal-backdrop").forEach(backdrop=>backdrop.addEventListener("click",event=>{if(event.target===backdrop)closeModal(backdrop.dataset.modal);}));

    document.querySelector("[data-post-image]")?.addEventListener("change",event=>{const file=event.target.files?.[0];state.selectedMedia=file||null;const preview=document.querySelector("[data-media-preview]");if(file){preview.style.backgroundImage=`url(${URL.createObjectURL(file)})`;preview.classList.remove("hidden");}else preview.classList.add("hidden");});
    document.querySelector("[data-post-form]")?.addEventListener("submit",submitPost);
    document.querySelector("[data-report-form]")?.addEventListener("submit",submitReport);
    document.querySelector("[data-theme-form]")?.addEventListener("submit",submitTheme);
    document.querySelector("[data-theme-reset]")?.addEventListener("click",()=>{const p=state.themePresets[0];document.querySelector("[data-theme-form] [name=primaryColor]").value=p.primary;document.querySelector("[data-theme-form] [name=accentColor]").value=p.accent;});
    document.querySelector("[data-mark-notifications]")?.addEventListener("click",async()=>{await api("/community/notifications/read-all",{method:"POST"});await loadNotifications();});

    const globalSearch=document.querySelector("[data-global-search]");
    globalSearch?.addEventListener("keydown",event=>{
      if(event.key!=="Enter")return;
      event.preventDefault();
      const q=globalSearch.value.trim();
      if(q.length<2){toast("Enter at least two characters.");return;}
      openModal("new-message");
      const input=document.querySelector("[data-member-search]");
      if(input)input.value=q;
      searchMembers(q);
    });

    let memberTimer;
    document.querySelector("[data-member-search]")?.addEventListener("input",event=>{clearTimeout(memberTimer);const q=event.target.value.trim();memberTimer=setTimeout(()=>searchMembers(q),250);});
    window.addEventListener("hashchange",navigate);
  }

  async function submitPost(event) {
    event.preventDefault();const form=event.currentTarget,error=form.querySelector("[data-post-error]");error.textContent="";const body=form.elements.body.value.trim();if(!body){error.textContent="Write something first.";return;}
    try{let mediaUrl=null;if(state.selectedMedia){const upload=new FormData();upload.append("file",state.selectedMedia);const result=await api("/community/media",{method:"POST",body:upload});mediaUrl=result.mediaUrl;}
      await api("/community/posts",{method:"POST",body:JSON.stringify({body,visibility:form.elements.visibility?.value||"global",mediaUrl})});form.reset();state.selectedMedia=null;document.querySelector("[data-media-preview]").classList.add("hidden");closeModal("post");toast("Post published.");if(state.currentRoute==="feed")await renderFeed();
    }catch(ex){error.textContent=ex.message;}
  }

  async function submitReport(event) { event.preventDefault();const form=event.currentTarget,error=form.querySelector("[data-report-error]");error.textContent="";const data=new FormData(form);try{await api(`/community/posts/${encodeURIComponent(state.reportPostId)}/report`,{method:"POST",body:JSON.stringify({reason:data.get("reason"),details:data.get("details")})});form.reset();closeModal("report");toast("Report submitted to moderators.");}catch(ex){error.textContent=ex.message;} }

  function renderThemePresets() {
    const root=document.querySelector("[data-theme-presets]"),prefs=state.me.profile.preferences||{};
    root.innerHTML=state.themePresets.map(p=>`<button type="button" class="theme-preset ${prefs.themePreset===p.id?"active":""}" data-theme-preset="${p.id}"><div class="theme-swatch" style="background:linear-gradient(135deg,${p.primary},${p.accent})"></div><strong>${p.name}</strong></button>`).join("");
    root.querySelectorAll("[data-theme-preset]").forEach(btn=>btn.addEventListener("click",()=>{const p=state.themePresets.find(x=>x.id===btn.dataset.themePreset);root.querySelectorAll(".theme-preset").forEach(x=>x.classList.toggle("active",x===btn));document.querySelector("[data-theme-form]").dataset.preset=p.id;document.querySelector("[data-theme-form] [name=primaryColor]").value=p.primary;document.querySelector("[data-theme-form] [name=accentColor]").value=p.accent;}));
    document.querySelector("[data-theme-form] [name=primaryColor]").value=prefs.primaryColor||"#285b46";document.querySelector("[data-theme-form] [name=accentColor]").value=prefs.accentColor||"#d7a84a";
  }

  async function submitTheme(event) {event.preventDefault();const form=event.currentTarget;const prefs={...(state.me.profile.preferences||{}),themePreset:form.dataset.preset||"custom",primaryColor:form.elements.primaryColor.value,accentColor:form.elements.accentColor.value};applyTheme(prefs);await savePreferences(prefs);closeModal("theme");toast("Theme saved to your account.");}
  async function savePreferences(prefs){const result=await api("/community/profile/preferences",{method:"PUT",body:JSON.stringify(prefs)});state.me.profile.preferences=result.preferences||prefs;}

  async function searchMembers(q) {
    const root=document.querySelector("[data-member-results]");
    if(q.length<2){root.innerHTML="";return;}
    try{
      const data=await api(`/community/members/search?q=${encodeURIComponent(q)}`);
      const members=(data.members||[]).filter(m=>m.accountId!==state.me.account.accountId);
      const friendIds=new Set(state.friends.map(x=>x.accountId));
      const incomingIds=new Set(state.incomingFriendRequests.map(x=>x.accountId));
      const outgoingIds=new Set(state.outgoingFriendRequests.map(x=>x.accountId));
      root.innerHTML=members.length?members.map(m=>{
        let friendshipButton="";
        if(friendIds.has(m.accountId)) friendshipButton='<span class="relationship-label">Friends</span>';
        else if(incomingIds.has(m.accountId)) friendshipButton=`<button type="button" class="primary-button small" data-accept-member="${attr(m.accountId)}">Accept Request</button>`;
        else if(outgoingIds.has(m.accountId)) friendshipButton='<span class="relationship-label">Request Sent</span>';
        else friendshipButton=`<button type="button" class="secondary-button small" data-add-member="${attr(m.accountId)}">Add Friend</button>`;
        return `<div class="member-result">${avatarHtml(m,"avatar-small")}<span class="member-result-copy"><strong>${escapeHtml(m.displayName)}</strong><small>${m.verifiedPlayer?`Verified Player${m.rank?` · Rank ${escapeHtml(m.rank)}`:""}`:"MMOnsterpatch account"}</small></span><div class="member-result-actions">${friendshipButton}<button type="button" class="icon-button" aria-label="Message" data-message-member="${attr(m.accountId)}"><span data-icon="message-circle"></span></button></div></div>`;
      }).join(""):'<div class="empty-card"><p>No players found.</p></div>';
      injectIcons(root);
      root.querySelectorAll("[data-message-member]").forEach(btn=>btn.addEventListener("click",()=>startThread(btn.dataset.messageMember)));
      root.querySelectorAll("[data-add-member]").forEach(btn=>btn.addEventListener("click",async()=>{try{await api("/community/friends/request",{method:"POST",body:JSON.stringify({accountId:btn.dataset.addMember})});toast("Friend request sent.");await loadFriends();await searchMembers(q);}catch(ex){toast(ex.message);}}));
      root.querySelectorAll("[data-accept-member]").forEach(btn=>btn.addEventListener("click",async()=>{try{await api(`/community/friends/${encodeURIComponent(btn.dataset.acceptMember)}/accept`,{method:"POST"});toast("Friend request accepted.");await loadFriends();await searchMembers(q);}catch(ex){toast(ex.message);}}));
    }catch(ex){root.innerHTML=`<div class="form-error">${escapeHtml(ex.message)}</div>`;}
  }

  async function logout(callApi) {try{if(callApi)await api("/account/logout",{method:"POST"});}catch{}state.me=null;state.characters=[];state.friends=[];state.incomingFriendRequests=[];state.outgoingFriendRequests=[];state.activeThreadId=null;showScreen("auth");history.replaceState(null,"",location.pathname+location.search);}

  async function enterApp() {await loadMe();showScreen("app");await Promise.all([loadFriends(),loadNotifications(),loadMessageCount(),loadStatus()]);updateSharedUI();await navigate();}

  async function bootstrap() {
    injectIcons(); bindGlobalUI(); await loadStatus();
    try { await loadMe(); showScreen("app"); await Promise.all([loadFriends(),loadNotifications(),loadMessageCount()]); if(!location.hash)location.hash="#/feed"; else await navigate(); }
    catch(error) { state.me=null; showScreen("auth"); }
    setInterval(loadStatus,Number(config.statusRefreshMs||30000));
    setInterval(()=>{if(state.me){loadNotifications();loadMessageCount();loadFriends();}},60000);
  }

  document.addEventListener("DOMContentLoaded",bootstrap);
})();

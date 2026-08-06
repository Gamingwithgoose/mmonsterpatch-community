(() => {
  "use strict";

  const config = window.MMP_CONFIG || {};
  const STORE = {
    users: "mmp_demo_users_v2",
    session: "mmp_demo_session_v2",
    posts: "mmp_demo_posts_v2",
    messages: "mmp_demo_messages_v2",
    mainCharacter: "mmp_demo_main_character_v2"
  };

  const demoFriends = [
    { id: "alex", name: "AlexR", initial: "A", online: true, subtitle: "Exploring the coast" },
    { id: "maple", name: "MapleFox", initial: "M", online: true, subtitle: "Rank B · Online" },
    { id: "nova", name: "NovaByte", initial: "N", online: false, subtitle: "Last active 2h ago" },
    { id: "rune", name: "RuneKeeper", initial: "R", online: true, subtitle: "Looking to trade" },
    { id: "moss", name: "Mossling", initial: "M", online: false, subtitle: "Last active yesterday" }
  ];

  const demoCharacters = [
    { id: "slot-1", name: "Goose", slot: 1, level: 42, rank: "S", species: "G" },
    { id: "slot-2", name: "Marsh", slot: 2, level: 31, rank: "B", species: "M" },
    { id: "slot-3", name: "Cinder", slot: 3, level: 18, rank: "D", species: "C" },
    { id: "slot-4", name: "Empty Slot", slot: 4, level: 0, rank: "—", species: "+", empty: true }
  ];

  const seedPosts = [
    { id: "seed-1", author: "Goose", initial: "G", time: "18 minutes ago", rank: "S", text: "Welcome to the MMOnsterpatch community prototype. This feed will only be available after a player signs in.", media: true, likes: 14, comments: 5, liked: false },
    { id: "seed-2", author: "MapleFox", initial: "M", time: "1 hour ago", rank: "B", text: "Finally reached Rank B today. Anyone want to run a few battles later?", media: false, likes: 8, comments: 3, liked: false }
  ];

  const seedMessages = {
    alex: [
      { id: "a1", mine: false, text: "Hey! Are you joining the server tonight?" },
      { id: "a2", mine: true, text: "Yep, I should be online after the update." }
    ],
    maple: [{ id: "m1", mine: false, text: "Can you help me test character linking later?" }],
    rune: [{ id: "r1", mine: false, text: "I have a trade offer whenever you're free." }]
  };

  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch { return fallback; }
  }

  function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
  }

  function currentUser() {
    return read(STORE.session, null);
  }

  function requireAuth() {
    if (!document.body.dataset.protected) return;
    if (!currentUser()) {
      location.replace("index.html?return=" + encodeURIComponent(location.pathname.split("/").pop() || "feed.html"));
      return;
    }
    document.body.classList.remove("auth-pending");
  }

  function updateUserUI() {
    const user = currentUser() || { username: "Player", displayName: "Player" };
    const name = user.displayName || user.username;
    document.querySelectorAll("[data-user-name]").forEach(el => el.textContent = name);
    document.querySelectorAll("[data-user-handle]").forEach(el => el.textContent = "@" + user.username);
    document.querySelectorAll("[data-user-initial]").forEach(el => el.textContent = name.slice(0, 1).toUpperCase());
  }

  function toast(message) {
    const node = document.querySelector("[data-toast]");
    if (!node) return;
    node.textContent = message;
    node.classList.add("show");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => node.classList.remove("show"), 2600);
  }

  function setupAuthTabs() {
    const tabs = document.querySelectorAll("[data-auth-tab]");
    const forms = document.querySelectorAll("[data-auth-form]");
    tabs.forEach(tab => tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.toggle("active", t === tab));
      forms.forEach(form => form.classList.toggle("hidden", form.dataset.authForm !== tab.dataset.authTab));
    }));
  }

  function setupAuthForms() {
    const login = document.querySelector("#login-form");
    const signup = document.querySelector("#signup-form");
    if (!login || !signup) return;

    const existing = currentUser();
    if (existing) location.replace("feed.html");

    login.addEventListener("submit", event => {
      event.preventDefault();
      const data = new FormData(login);
      const username = String(data.get("username") || "").trim();
      const password = String(data.get("password") || "");
      const error = login.querySelector("[data-form-error]");
      if (!username || !password) { error.textContent = "Enter your username and password."; return; }

      const users = read(STORE.users, []);
      const found = users.find(u => u.username.toLowerCase() === username.toLowerCase());
      if (config.mode === "prototype" && !found) {
        const demo = { username, displayName: username, accountId: "demo-" + Date.now() };
        write(STORE.session, demo);
      } else if (found) {
        write(STORE.session, found);
      } else {
        error.textContent = "The account could not be found.";
        return;
      }
      location.href = new URLSearchParams(location.search).get("return") || "feed.html";
    });

    signup.addEventListener("submit", event => {
      event.preventDefault();
      const data = new FormData(signup);
      const username = String(data.get("username") || "").trim();
      const displayName = String(data.get("displayName") || "").trim();
      const email = String(data.get("email") || "").trim();
      const password = String(data.get("password") || "");
      const confirm = String(data.get("confirm") || "");
      const error = signup.querySelector("[data-form-error]");
      if (!/^[A-Za-z0-9_]{3,24}$/.test(username)) { error.textContent = "Username must be 3–24 letters, numbers, or underscores."; return; }
      if (!displayName || !email || password.length < 8) { error.textContent = "Complete every field. Password must be at least 8 characters."; return; }
      if (password !== confirm) { error.textContent = "The passwords do not match."; return; }
      const users = read(STORE.users, []);
      if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) { error.textContent = "That username is already in use."; return; }
      const user = { username, displayName, email, accountId: "demo-" + Date.now() };
      users.push(user);
      write(STORE.users, users);
      write(STORE.session, user);
      location.href = "feed.html";
    });
  }

  function setupLogout() {
    document.querySelectorAll("[data-logout]").forEach(button => button.addEventListener("click", () => {
      localStorage.removeItem(STORE.session);
      location.href = "index.html";
    }));
  }

  function renderFriends() {
    document.querySelectorAll("[data-friend-list]").forEach(list => {
      list.innerHTML = demoFriends.map(friend => `
        <button class="friend" type="button" data-open-thread="${friend.id}">
          <span class="avatar sm">${escapeHtml(friend.initial)}</span>
          <span class="friend-info"><strong>${escapeHtml(friend.name)}</strong><small>${escapeHtml(friend.subtitle)}</small></span>
          <span class="presence ${friend.online ? "online" : ""}" aria-label="${friend.online ? "Online" : "Offline"}"></span>
        </button>`).join("");
    });
    document.querySelectorAll("[data-open-thread]").forEach(btn => btn.addEventListener("click", () => {
      location.href = "messages.html?friend=" + encodeURIComponent(btn.dataset.openThread);
    }));
  }

  async function loadServerStatus() {
    const status = document.querySelector("[data-server-status]");
    if (!status) return;
    try {
      const response = await fetch(config.statusApiUrl, { headers: { Accept: "application/json" }, cache: "no-store", credentials: "omit" });
      if (!response.ok) throw new Error(String(response.status));
      const data = await response.json();
      const online = Boolean(data.online);
      document.querySelectorAll("[data-status-dot]").forEach(dot => { dot.className = "status-dot " + (online ? "online" : "offline"); });
      status.textContent = online ? "Server Online" : "Server Offline";
      setText("[data-player-count]", Number(data.playersOnline || 0));
      setText("[data-social-count]", Number(data.socialClients || 0));
      setText("[data-server-version]", data.serverVersion || "—");
    } catch {
      document.querySelectorAll("[data-status-dot]").forEach(dot => dot.className = "status-dot offline");
      status.textContent = "Status unavailable";
      setText("[data-player-count]", "—"); setText("[data-social-count]", "—"); setText("[data-server-version]", "—");
    }
  }

  function setText(selector, value) {
    document.querySelectorAll(selector).forEach(el => el.textContent = String(value));
  }

  function getPosts() {
    const custom = read(STORE.posts, []);
    return [...custom, ...seedPosts];
  }

  function renderFeed() {
    const host = document.querySelector("[data-feed]");
    if (!host) return;
    host.innerHTML = getPosts().map(post => `
      <article class="panel post-card" data-post-id="${escapeHtml(post.id)}">
        <div class="post-head">
          <span class="avatar">${escapeHtml(post.initial)}</span>
          <div class="post-author"><strong>${escapeHtml(post.author)}</strong><small>${escapeHtml(post.time)} · <span class="rank-badge">Rank ${escapeHtml(post.rank)}</span></small></div>
          <button class="menu-dots" aria-label="Post options">•••</button>
        </div>
        <div class="post-body"><p>${escapeHtml(post.text)}</p></div>
        ${post.media ? '<div class="post-media">MMOnsterpatch<br>Community</div>' : ''}
        <div class="post-stats"><span>${Number(post.likes)} reactions</span><span>${Number(post.comments)} comments</span></div>
        <div class="post-actions"><button class="post-action ${post.liked ? "active" : ""}" data-like-post="${escapeHtml(post.id)}">♡ Like</button><button class="post-action">◯ Comment</button><button class="post-action">↗ Share</button></div>
      </article>`).join("");

    host.querySelectorAll("[data-like-post]").forEach(button => button.addEventListener("click", () => {
      const id = button.dataset.likePost;
      const custom = read(STORE.posts, []);
      const customPost = custom.find(p => p.id === id);
      if (customPost) { customPost.liked = !customPost.liked; customPost.likes += customPost.liked ? 1 : -1; write(STORE.posts, custom); }
      else {
        const seed = seedPosts.find(p => p.id === id);
        if (seed) { seed.liked = !seed.liked; seed.likes += seed.liked ? 1 : -1; }
      }
      renderFeed();
    }));
  }

  function setupComposer() {
    const openers = document.querySelectorAll("[data-open-composer]");
    const modal = document.querySelector("[data-composer-modal]");
    if (!modal) return;
    const close = () => modal.classList.add("hidden");
    openers.forEach(btn => btn.addEventListener("click", () => { modal.classList.remove("hidden"); modal.querySelector("textarea").focus(); }));
    modal.querySelectorAll("[data-close-modal]").forEach(btn => btn.addEventListener("click", close));
    modal.addEventListener("click", e => { if (e.target === modal) close(); });
    modal.querySelector("form").addEventListener("submit", e => {
      e.preventDefault();
      const textarea = modal.querySelector("textarea");
      const text = textarea.value.trim();
      if (!text) return;
      const user = currentUser();
      const posts = read(STORE.posts, []);
      posts.unshift({ id: "post-" + Date.now(), author: user.displayName || user.username, initial: (user.displayName || user.username)[0].toUpperCase(), time: "Just now", rank: "E", text, media: false, likes: 0, comments: 0, liked: false });
      write(STORE.posts, posts);
      textarea.value = "";
      close(); renderFeed(); toast("Your post was added to the prototype feed.");
    });
  }

  function renderCharacters() {
    const host = document.querySelector("[data-character-grid]");
    if (!host) return;
    let main = read(STORE.mainCharacter, "slot-1");
    host.innerHTML = demoCharacters.map(character => {
      const isMain = character.id === main && !character.empty;
      return `<article class="character-card ${isMain ? "main" : ""}" data-character-card="${character.id}">
        ${isMain ? '<span class="main-label">Main Character</span>' : ''}
        <div class="character-art">${escapeHtml(character.species)}</div>
        <h3>${escapeHtml(character.name)}</h3>
        <div class="character-meta"><span>Save Slot ${character.slot}</span><span>Level ${character.level}</span><span>Rank ${escapeHtml(character.rank)}</span></div>
        ${character.empty ? '<p class="form-note">No linked character in this slot.</p>' : `<label class="main-character-control"><input type="radio" name="mainCharacter" value="${character.id}" ${isMain ? "checked" : ""}> Make Main Character</label>`}
      </article>`;
    }).join("");
    host.querySelectorAll('input[name="mainCharacter"]').forEach(input => input.addEventListener("change", () => {
      write(STORE.mainCharacter, input.value);
      renderCharacters();
      toast("Main character updated. Only one character can be active.");
    }));
    const selected = demoCharacters.find(c => c.id === main) || demoCharacters[0];
    setText("[data-main-character-name]", selected.name);
  }

  function getMessages() {
    return read(STORE.messages, JSON.parse(JSON.stringify(seedMessages)));
  }

  function saveMessages(messages) { write(STORE.messages, messages); }

  function setupMessages() {
    const list = document.querySelector("[data-thread-list]");
    const pane = document.querySelector("[data-chat-pane]");
    if (!list || !pane) return;
    const messages = getMessages();
    const activeId = new URLSearchParams(location.search).get("friend") || "alex";

    list.innerHTML = demoFriends.map(friend => {
      const thread = messages[friend.id] || [];
      const last = thread[thread.length - 1];
      return `<button class="thread-button ${friend.id === activeId ? "active" : ""}" data-thread-id="${friend.id}"><span class="avatar sm">${friend.initial}</span><span class="thread-copy"><strong>${escapeHtml(friend.name)}</strong><small>${escapeHtml(last ? last.text : "Start a conversation")}</small></span></button>`;
    }).join("");
    list.querySelectorAll("[data-thread-id]").forEach(btn => btn.addEventListener("click", () => { location.href = "messages.html?friend=" + btn.dataset.threadId; }));

    const friend = demoFriends.find(f => f.id === activeId) || demoFriends[0];
    const thread = messages[friend.id] || [];
    pane.innerHTML = `
      <header class="chat-head"><span class="avatar sm">${friend.initial}</span><div><strong>${escapeHtml(friend.name)}</strong><small>${friend.online ? "Online now" : "Offline"}</small></div></header>
      <div class="message-list" data-message-list>${thread.length ? thread.map(m => `<div class="message-row ${m.mine ? "mine" : ""}" data-message-id="${m.id}"><div class="message-bubble">${escapeHtml(m.text)}</div><button class="message-delete" data-delete-message="${m.id}" title="Delete this message">Delete</button></div>`).join("") : '<div class="empty-state"><div><strong>No messages yet</strong>Send the first private message.</div></div>'}</div>
      <form class="chat-compose" data-chat-form><input name="message" autocomplete="off" placeholder="Message ${escapeHtml(friend.name)}" aria-label="Message"><button aria-label="Send">➤</button></form>`;

    const messageList = pane.querySelector("[data-message-list]");
    messageList.scrollTop = messageList.scrollHeight;
    pane.querySelectorAll("[data-delete-message]").forEach(btn => btn.addEventListener("click", () => {
      const all = getMessages();
      all[friend.id] = (all[friend.id] || []).filter(m => m.id !== btn.dataset.deleteMessage);
      saveMessages(all); setupMessages(); toast("Message deleted from this prototype conversation.");
    }));
    pane.querySelector("[data-chat-form]").addEventListener("submit", e => {
      e.preventDefault();
      const input = e.currentTarget.elements.message;
      const text = input.value.trim();
      if (!text) return;
      const all = getMessages();
      all[friend.id] ||= [];
      all[friend.id].push({ id: "msg-" + Date.now(), mine: true, text });
      saveMessages(all); setupMessages();
    });
  }

  function init() {
    requireAuth();
    setupAuthTabs(); setupAuthForms(); setupLogout(); updateUserUI();
    renderFriends(); loadServerStatus(); renderFeed(); setupComposer(); renderCharacters(); setupMessages();
    if (document.querySelector("[data-server-status]")) setInterval(loadServerStatus, Math.max(15000, Number(config.statusRefreshMs) || 60000));
  }

  document.addEventListener("DOMContentLoaded", init);
})();

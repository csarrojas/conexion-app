import React, { useState, useEffect, useRef, useCallback } from "react";

const SUPABASE_URL = "https://cvyqmqqwhwmitetfobso.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2eXFtcXF3aHdtaXRldGZvYnNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU2OTgwMTAsImV4cCI6MjEwMTI3NDAxMH0.lzDcjLUPA-h0TMXUwhmE3ZOw_MwPvJJF8outsUUN80Y";

// Shared secret required to register at all. Change and share only with
// people you invite.
const COMMUNITY_CODE = "OSCURO2026";

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&family=Inter:wght@400;500;600&display=swap');`;

const STYLES = `
${FONT_IMPORT}

.rv-root {
  --bg: #14171c;
  --surface: #1b1f26;
  --surface-2: #21262f;
  --paper: #f2ede1;
  --paper-2: #e8e0cf;
  --ink: #eceef2;
  --ink-soft: #97a0b0;
  --accent: #e34234;
  --accent-soft: #7a2a24;
  --flash: #f2c14e;
  --line: #2a2f38;
  font-family: 'Inter', sans-serif;
  background: var(--bg);
  color: var(--ink);
  min-height: 100%;
  width: 100%;
  box-sizing: border-box;
}
.rv-root *, .rv-root *::before, .rv-root *::after { box-sizing: border-box; }

.rv-mono { font-family: 'Space Mono', monospace; }
.rv-display {
  font-family: 'Bebas Neue', sans-serif;
  letter-spacing: 0.06em;
}

/* ---- Auth screen ---- */
.rv-auth-wrap {
  min-height: 560px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background:
    radial-gradient(circle at 20% 15%, rgba(227,66,52,0.10), transparent 45%),
    var(--bg);
}
.rv-auth-card {
  width: 100%;
  max-width: 380px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 4px;
  padding: 36px 32px 32px;
  position: relative;
}
.rv-auth-card::before {
  content: "";
  position: absolute;
  top: -1px; left: -1px; right: -1px;
  height: 3px;
  background: linear-gradient(90deg, var(--accent), var(--flash));
  border-radius: 4px 4px 0 0;
}
.rv-logo {
  font-size: 42px;
  line-height: 1;
  color: var(--paper);
  margin: 0 0 4px;
}
.rv-logo span { color: var(--accent); }
.rv-tagline {
  font-size: 12px;
  color: var(--ink-soft);
  margin: 0 0 24px;
  letter-spacing: 0.03em;
}
.rv-mode-tabs { display: flex; gap: 4px; margin-bottom: 20px; }
.rv-mode-tab {
  flex: 1;
  background: var(--bg);
  border: 1px solid var(--line);
  color: var(--ink-soft);
  padding: 9px;
  border-radius: 3px;
  font-size: 12px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;
  font-weight: 600;
}
.rv-mode-tab.active { background: var(--accent-soft); color: var(--flash); border-color: var(--accent); }
.rv-field-label {
  display: block;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--ink-soft);
  margin-bottom: 8px;
}
.rv-input {
  width: 100%;
  background: var(--bg);
  border: 1px solid var(--line);
  color: var(--ink);
  padding: 11px 13px;
  border-radius: 3px;
  font-size: 14px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s ease;
}
.rv-input:focus { border-color: var(--accent); }
.rv-password-wrap { position: relative; }
.rv-password-wrap .rv-input { padding-right: 42px; }
.rv-password-toggle {
  position: absolute;
  top: 50%;
  right: 4px;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--ink-soft);
  font-size: 16px;
  padding: 6px 8px;
  cursor: pointer;
  line-height: 1;
}
.rv-password-toggle:hover { color: var(--ink); }
.rv-btn {
  width: 100%;
  margin-top: 18px;
  background: var(--accent);
  color: #fff;
  border: none;
  padding: 12px;
  border-radius: 3px;
  font-family: 'Bebas Neue', sans-serif;
  font-size: 17px;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: background 0.15s ease, transform 0.1s ease;
}
.rv-btn:hover { background: #c73527; }
.rv-btn:active { transform: scale(0.98); }
.rv-btn:disabled { background: var(--line); cursor: not-allowed; }
.rv-btn-ghost {
  background: transparent;
  border: 1px solid var(--line);
  color: var(--ink);
}
.rv-btn-ghost:hover { background: var(--surface-2); border-color: var(--ink-soft); }
.rv-error {
  color: var(--accent);
  font-size: 12px;
  margin-top: 10px;
}
.rv-note {
  font-size: 11px;
  color: var(--ink-soft);
  margin-top: 20px;
  line-height: 1.5;
  border-top: 1px solid var(--line);
  padding-top: 16px;
}

/* ---- App shell ---- */
.rv-shell { min-height: 560px; display: flex; flex-direction: column; }
.rv-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 22px;
  background: var(--surface);
  border-bottom: 1px solid var(--line);
  position: sticky;
  top: 0;
  z-index: 5;
}
.rv-nav-left { display: flex; align-items: center; gap: 22px; }
.rv-nav-logo { font-size: 22px; color: var(--paper); }
.rv-nav-logo span { color: var(--accent); }
.rv-tabs { display: flex; gap: 4px; }
.rv-tab {
  background: transparent;
  border: none;
  color: var(--ink-soft);
  padding: 7px 14px;
  border-radius: 3px;
  font-size: 12px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
}
.rv-tab:hover { color: var(--ink); }
.rv-tab.active { background: var(--accent-soft); color: var(--flash); }
.rv-nav-right { display: flex; align-items: center; gap: 14px; }
.rv-user-chip {
  display: flex; align-items: center; gap: 8px;
  font-size: 12px; color: var(--ink-soft);
}
.rv-avatar {
  width: 26px; height: 26px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Bebas Neue', sans-serif; font-size: 13px; color: #14171c;
  flex-shrink: 0;
}
.rv-logout {
  background: none; border: none; color: var(--ink-soft);
  font-size: 11px; text-decoration: underline; cursor: pointer;
}
.rv-logout:hover { color: var(--accent); }

.rv-main { flex: 1; padding: 26px 20px 60px; max-width: 620px; margin: 0 auto; width: 100%; }

/* ---- Upload box ---- */
.rv-upload-box {
  background: var(--surface);
  border: 1px dashed var(--line);
  border-radius: 4px;
  padding: 18px;
  margin-bottom: 30px;
}
.rv-upload-row { display: flex; gap: 12px; align-items: flex-start; }
.rv-upload-preview {
  width: 64px; height: 64px; border-radius: 3px;
  background: var(--bg); border: 1px solid var(--line);
  display: flex; align-items: center; justify-content: center;
  overflow: hidden; flex-shrink: 0; position: relative;
}
.rv-upload-preview img { width: 100%; height: 100%; object-fit: cover; }
.rv-upload-preview span { font-size: 22px; color: var(--ink-soft); }
.rv-caption-input {
  flex: 1;
  background: var(--bg);
  border: 1px solid var(--line);
  color: var(--ink);
  padding: 10px 12px;
  border-radius: 3px;
  font-size: 13px;
  resize: none;
  font-family: inherit;
  min-height: 44px;
}
.rv-caption-input:focus { outline: none; border-color: var(--accent); }
.rv-upload-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 12px; }
.rv-upload-actions .rv-btn { width: auto; margin-top: 0; padding: 8px 20px; font-size: 14px; }

/* ---- Filmstrip post card ---- */
.rv-post { margin-bottom: 34px; }
.rv-sprockets {
  display: flex; justify-content: space-between;
  padding: 0 10px;
}
.rv-sprockets span {
  width: 8px; height: 8px; background: var(--bg);
  border-radius: 1px; margin-top: 3px; margin-bottom: 3px;
}
.rv-sprockets.top span { border-bottom: none; }
.rv-frame {
  background: #0d0f13;
  padding: 6px;
  border-left: 3px solid var(--line);
  border-right: 3px solid var(--line);
}
.rv-frame-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 6px 8px 8px;
}
.rv-frame-author { display: flex; align-items: center; gap: 8px; }
.rv-frame-username { font-size: 13px; font-weight: 600; }
.rv-frame-number { font-size: 11px; color: var(--ink-soft); }
.rv-frame-img-wrap { background: var(--paper); padding: 10px 10px 4px; }
.rv-frame-img { width: 100%; display: block; border-radius: 2px; background: #000; }
.rv-frame-caption {
  padding: 10px 4px 14px;
  font-size: 13px;
  color: #2a2620;
}
.rv-frame-meta {
  display: flex; justify-content: space-between; align-items: center;
  padding: 2px 8px 8px;
}
.rv-timestamp { font-size: 10px; color: var(--ink-soft); }
.rv-comment-toggle {
  background: none; border: none; color: var(--flash);
  font-size: 11px; cursor: pointer; padding: 4px 8px;
}
.rv-comment-toggle:hover { text-decoration: underline; }

.rv-comments { padding: 4px 10px 12px; }
.rv-comment {
  display: flex; gap: 8px; padding: 6px 0;
  font-size: 12px; border-top: 1px solid var(--line);
}
.rv-comment:first-child { border-top: none; }
.rv-comment-author { color: var(--flash); font-weight: 600; flex-shrink: 0; }
.rv-comment-text { color: var(--ink); word-break: break-word; }
.rv-comment-form { display: flex; gap: 8px; margin-top: 8px; }
.rv-comment-input {
  flex: 1; background: var(--bg); border: 1px solid var(--line);
  color: var(--ink); padding: 7px 10px; border-radius: 3px; font-size: 12px;
  font-family: inherit;
}
.rv-comment-input:focus { outline: none; border-color: var(--accent); }
.rv-send-mini {
  background: var(--surface-2); border: 1px solid var(--line); color: var(--flash);
  border-radius: 3px; padding: 0 12px; font-size: 12px; cursor: pointer;
}
.rv-send-mini:hover { border-color: var(--flash); }

.rv-empty {
  text-align: center; padding: 60px 20px; color: var(--ink-soft);
}
.rv-empty .rv-display { font-size: 28px; color: var(--ink); margin-bottom: 8px; }

/* ---- Chat ---- */
.rv-chat-wrap { display: flex; flex-direction: column; height: 480px; }
.rv-chat-log {
  flex: 1; overflow-y: auto; background: var(--surface);
  border: 1px solid var(--line); border-radius: 4px 4px 0 0;
  padding: 16px; display: flex; flex-direction: column; gap: 10px;
}
.rv-chat-msg { display: flex; gap: 8px; align-items: baseline; font-size: 13px; }
.rv-chat-author { font-weight: 600; flex-shrink: 0; }
.rv-chat-time { font-size: 10px; color: var(--ink-soft); margin-left: auto; flex-shrink: 0; }
.rv-chat-form {
  display: flex; gap: 8px; background: var(--surface-2);
  border: 1px solid var(--line); border-top: none;
  border-radius: 0 0 4px 4px; padding: 10px;
}
.rv-chat-input {
  flex: 1; background: var(--bg); border: 1px solid var(--line);
  color: var(--ink); padding: 9px 12px; border-radius: 3px; font-size: 13px;
  font-family: inherit;
}
.rv-chat-input:focus { outline: none; border-color: var(--accent); }

/* ---- Members ---- */
.rv-member-row {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 4px; border-bottom: 1px solid var(--line);
}
.rv-member-name { font-size: 14px; font-weight: 600; }
.rv-member-joined { font-size: 11px; color: var(--ink-soft); }

.rv-section-title {
  font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;
  color: var(--ink-soft); margin-bottom: 14px;
}

/* ---- Mobile ---- */
@media (max-width: 640px) {
  .rv-auth-wrap { padding: 24px 14px; min-height: auto; }
  .rv-auth-card { padding: 26px 18px 20px; max-width: 100%; }
  .rv-logo { font-size: 34px; }

  .rv-nav {
    flex-wrap: wrap;
    row-gap: 10px;
    padding: 10px 14px;
  }
  .rv-nav-left {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  .rv-nav-logo { font-size: 19px; }
  .rv-tabs {
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    padding-bottom: 2px;
  }
  .rv-tabs::-webkit-scrollbar { display: none; }
  .rv-tab {
    white-space: nowrap;
    padding: 7px 11px;
    font-size: 11px;
    flex-shrink: 0;
  }
  .rv-nav-right {
    width: 100%;
    justify-content: space-between;
  }

  .rv-main { padding: 16px 12px 60px; }

  .rv-upload-row { flex-direction: column; }
  .rv-upload-preview { width: 100%; height: 110px; }
  .rv-upload-actions { flex-wrap: wrap; }

  .rv-frame { border-left-width: 2px; border-right-width: 2px; }
  .rv-frame-username { max-width: 130px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  .rv-chat-wrap { height: 72vh; }
  .rv-chat-form { flex-wrap: nowrap; padding: 8px; }
  .rv-chat-input { min-width: 0; }
  .rv-chat-msg img { max-width: 85% !important; }

  .rv-member-row { padding: 12px 2px; flex-wrap: wrap; gap: 8px; }
  .rv-member-row > div[style*="flex: 1"] { min-width: 140px; }

  .rv-empty { padding: 40px 14px; }
  .rv-empty .rv-display { font-size: 22px; }
}
`;

const ACCENT_POOL = ["#e34234", "#f2c14e", "#5b8c5a", "#4d7ea8", "#a15fb0", "#c96f4a"];

function colorForName(name) {
  let hash = 0;
  for (let i = 0; i < (name || "").length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return ACCENT_POOL[Math.abs(hash) % ACCENT_POOL.length];
}

function timeAgo(iso) {
  const ts = new Date(iso).getTime();
  const diff = Math.max(0, Date.now() - ts);
  const m = Math.floor(diff / 60000);
  if (m < 1) return "ahora";
  if (m < 60) return `hace ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.floor(h / 24);
  return `hace ${d} d`;
}

function compressImageToBlob(file, maxWidth = 900, quality = 0.75) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("no blob"))), "image/jpeg", quality);
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ---------- Supabase helpers (plain fetch, no SDK) ----------

async function sbAuthRequest(pathAndQuery, body) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/${pathAndQuery}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: SUPABASE_ANON_KEY },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error_description || data.msg || data.error || "Error de autenticación");
  }
  return data;
}

async function sbRest(path, { method = "GET", body, token, extraHeaders = {} } = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${token || SUPABASE_ANON_KEY}`,
      ...(method !== "GET" ? { Prefer: "return=representation" } : {}),
      ...extraHeaders,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || err.hint || `Error ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

async function sbUpload(file, token, folder) {
  const ext = (file.type && file.type.split("/")[1]) || "jpg";
  const path = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/revelado-images/${path}`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${token}`,
      "Content-Type": file.type || "image/jpeg",
    },
    body: file,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "No se pudo subir la imagen");
  }
  return `${SUPABASE_URL}/storage/v1/object/public/revelado-images/${path}`;
}

function dmKey(a, b) {
  return [a, b].sort().join("|");
}

function AvatarCircle({ username, avatarUrl, size = 26, ring, onClick }) {
  const commonStyle = {
    width: size,
    height: size,
    borderRadius: "50%",
    flexShrink: 0,
    boxShadow: ring ? "0 0 0 2px var(--accent)" : "none",
    cursor: onClick ? "pointer" : "default",
  };
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={username}
        onClick={onClick}
        style={{ ...commonStyle, objectFit: "cover" }}
      />
    );
  }
  return (
    <div
      className="rv-avatar"
      onClick={onClick}
      style={{ ...commonStyle, fontSize: size * 0.5, background: colorForName(username) }}
    >
      {(username || "?").slice(0, 1).toUpperCase()}
    </div>
  );
}

export default class ReveladoBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    console.error("Revelado crash:", error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            background: "#14171c",
            color: "#eceef2",
            fontFamily: "monospace",
            padding: 24,
            fontSize: 13,
            lineHeight: 1.6,
            whiteSpace: "pre-wrap",
          }}
        >
          <div style={{ color: "#e34234", fontWeight: "bold", marginBottom: 10 }}>
            Ocurrió un error al cargar la app:
          </div>
          {String(this.state.error && this.state.error.message ? this.state.error.message : this.state.error)}
        </div>
      );
    }
    return <Revelado />;
  }
}

function Revelado() {
  const [booting, setBooting] = useState(true);
  const [session, setSession] = useState(null); // {accessToken, userId, email}
  const [profile, setProfile] = useState(null); // {id, username, is_admin, banned}
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [view, setView] = useState("feed");

  const [authMode, setAuthMode] = useState("signin"); // 'signin' | 'signup'
  const [recoveryToken, setRecoveryToken] = useState(null);
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [codeInput, setCodeInput] = useState("");
  const [signupAvatarPreview, setSignupAvatarPreview] = useState(null);
  const [signupAvatarBlob, setSignupAvatarBlob] = useState(null);
  const [signupSelfiePreview, setSignupSelfiePreview] = useState(null);
  const [signupSelfieBlob, setSignupSelfieBlob] = useState(null);
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [profileUsername, setProfileUsername] = useState(null);
  const [profileReturnView, setProfileReturnView] = useState("feed");
  const [avatarUploading, setAvatarUploading] = useState(false);
  const avatarEditInputRef = useRef(null);

  const [lightboxUrl, setLightboxUrl] = useState(null);

  const [verifications, setVerifications] = useState([]);
  const [adminPanel, setAdminPanel] = useState("conversations"); // 'conversations' | 'verification'
  const [myVerification, setMyVerification] = useState(null);
  const [selfVerifyLoading, setSelfVerifyLoading] = useState(false);
  const selfVerifyInputRef = useRef(null);

  const [uploadPreview, setUploadPreview] = useState(null);
  const [uploadBlob, setUploadBlob] = useState(null);
  const [uploadCaption, setUploadCaption] = useState("");
  const [publishing, setPublishing] = useState(false);
  const fileInputRef = useRef(null);

  const [commentDrafts, setCommentDrafts] = useState({});
  const [expanded, setExpanded] = useState({});

  const [activeDmUser, setActiveDmUser] = useState(null);
  const [dms, setDms] = useState({}); // key -> messages
  const [dmDraft, setDmDraft] = useState("");
  const [dmImagePreview, setDmImagePreview] = useState(null);
  const [dmImageBlob, setDmImageBlob] = useState(null);
  const chatLogRef = useRef(null);
  const dmFileInputRef = useRef(null);

  const [adminActiveConvo, setAdminActiveConvo] = useState(null);

  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productImagePreview, setProductImagePreview] = useState(null);
  const [productImageBlob, setProductImageBlob] = useState(null);
  const [publishingProduct, setPublishingProduct] = useState(false);
  const productFileInputRef = useRef(null);

  const isAdmin = !!(profile && profile.is_admin);

  // Detect a Supabase password-recovery link (#access_token=...&type=recovery)
  useEffect(() => {
    const hash = window.location.hash || "";
    if (hash.includes("type=recovery")) {
      const params = new URLSearchParams(hash.replace(/^#/, ""));
      const token = params.get("access_token");
      if (token) setRecoveryToken(token);
    }
  }, []);

  async function handleForgotPassword() {
    const email = emailInput.trim();
    if (!email) {
      setAuthError("Escribe tu correo arriba primero, y luego toca este enlace.");
      return;
    }
    setForgotLoading(true);
    setForgotMessage("");
    setAuthError("");
    try {
      await fetch(`${SUPABASE_URL}/auth/v1/recover`, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: SUPABASE_ANON_KEY },
        body: JSON.stringify({ email }),
      });
      setForgotMessage("Listo, revisa tu correo (y la carpeta de spam) para el enlace.");
    } catch (err) {
      setForgotMessage("No se pudo enviar el correo. Intenta de nuevo.");
    } finally {
      setForgotLoading(false);
    }
  }

  async function handleCompletePasswordReset() {
    if (newPasswordInput.length < 6) {
      setResetMessage("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    setResetLoading(true);
    setResetMessage("");
    try {
      const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${recoveryToken}`,
        },
        body: JSON.stringify({ password: newPasswordInput }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.msg || "El enlace venció o no es válido. Pide uno nuevo.");
      setResetMessage("¡Contraseña actualizada! Ya puedes iniciar sesión con ella.");
      setRecoveryToken(null);
      setNewPasswordInput("");
      window.location.hash = "";
      setAuthMode("signin");
    } catch (err) {
      setResetMessage(err.message);
    } finally {
      setResetLoading(false);
    }
  }


  // ---- Loading feed + members ----
  const loadFeed = useCallback(async (token) => {
    try {
      const data = await sbRest(
        "posts?select=*,author:profiles(username,avatar_url,verified),comments(id,text,created_at,author:profiles(username))&order=created_at.desc",
        { token }
      );
      setPosts(data || []);
    } catch (e) {
      console.error("loadFeed", e);
    }
  }, []);

  const loadUsers = useCallback(async (token) => {
    try {
      const data = await sbRest(
        "profiles?select=id,username,is_admin,banned,created_at,avatar_url,verified&banned=eq.false&order=created_at.asc",
        { token }
      );
      setUsers(data || []);
      setProfile((prev) => {
        if (!prev) return prev;
        const mine = (data || []).find((u) => u.id === prev.id);
        return mine && mine.verified !== prev.verified ? { ...prev, verified: mine.verified } : prev;
      });
    } catch (e) {
      console.error("loadUsers", e);
    }
  }, []);

  const loadDms = useCallback(async (token, myId) => {
    try {
      const data = await sbRest(
        `messages?select=*,sender:profiles!messages_sender_id_fkey(username),receiver:profiles!messages_receiver_id_fkey(username)&order=created_at.asc`,
        { token }
      );
      const grouped = {};
      (data || []).forEach((m) => {
        const key = dmKey(m.sender.username, m.receiver.username);
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(m);
      });
      setDms(grouped);
    } catch (e) {
      console.error("loadDms", e);
    }
  }, []);

  const loadProducts = useCallback(async (token) => {
    try {
      const data = await sbRest("products?select=*&order=created_at.desc", { token });
      setProducts(data || []);
    } catch (e) {
      console.error("loadProducts", e);
    }
  }, []);

  const loadVerifications = useCallback(async (token) => {
    try {
      const data = await sbRest(
        "verifications?select=*,profile:profiles!verifications_user_id_fkey(username,avatar_url,banned)&order=created_at.desc",
        { token }
      );
      setVerifications(data || []);
    } catch (e) {
      console.error("loadVerifications", e);
    }
  }, []);

  const loadMyVerification = useCallback(async (token, myId) => {
    try {
      const data = await sbRest(`verifications?user_id=eq.${myId}&select=verified,photo_url`, { token });
      setMyVerification(data && data[0] ? data[0] : false);
    } catch (e) {
      console.error("loadMyVerification", e);
    }
  }, []);

  const loadAll = useCallback(
    async (token, myId, admin) => {
      const calls = [
        loadFeed(token),
        loadUsers(token),
        loadDms(token, myId),
        loadProducts(token),
        loadMyVerification(token, myId),
      ];
      if (admin) calls.push(loadVerifications(token));
      await Promise.all(calls);
    },
    [loadFeed, loadUsers, loadDms, loadProducts, loadVerifications, loadMyVerification]
  );

  useEffect(() => {
    setBooting(false);
  }, []);

  useEffect(() => {
    if (!session || !profile) return;
    loadAll(session.accessToken, profile.id, profile.is_admin);
    const id = setInterval(() => loadAll(session.accessToken, profile.id, profile.is_admin), 5000);
    return () => clearInterval(id);
  }, [session, profile, loadAll]);

  useEffect(() => {
    if (view === "chat" && chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
    }
  }, [dms, view, activeDmUser]);

  function unreadCountWith(otherUsername) {
    if (!profile) return 0;
    const key = dmKey(profile.username, otherUsername);
    const msgs = dms[key] || [];
    return msgs.filter((m) => m.receiver.username === profile.username && !m.read_at).length;
  }
  const usersWithNewMessages = profile
    ? users.filter((u) => u.username !== profile.username).filter((u) => unreadCountWith(u.username) > 0)
    : [];
  const totalUnread = usersWithNewMessages.reduce((sum, u) => sum + unreadCountWith(u.username), 0);

  // Persist "read" status in the database (not just local state) so it
  // doesn't reset every time the page reloads or you log in again.
  useEffect(() => {
    if (!profile || !activeDmUser || view !== "chat" || !session) return;
    const key = dmKey(profile.username, activeDmUser);
    const unreadMsgs = (dms[key] || []).filter((m) => m.receiver.username === profile.username && !m.read_at);
    if (unreadMsgs.length === 0) return;
    const otherUser = users.find((u) => u.username === activeDmUser);
    if (!otherUser) return;
    (async () => {
      try {
        await sbRest(`messages?sender_id=eq.${otherUser.id}&receiver_id=eq.${profile.id}&read_at=is.null`, {
          method: "PATCH",
          token: session.accessToken,
          body: { read_at: new Date().toISOString() },
        });
        await loadDms(session.accessToken, profile.id);
      } catch (err) {
        console.error("mark as read failed", err);
      }
    })();
  }, [dms, activeDmUser, profile, view, session, users, loadDms]);

  // ---- Auth ----
  async function handleAuth() {
    const email = emailInput.trim();
    const password = passwordInput;
    const username = usernameInput.trim();
    const code = codeInput.trim();

    if (!email || !password) {
      setAuthError("Escribe tu correo y contraseña.");
      return;
    }
    if (authMode === "signup") {
      if (username.length < 2) {
        setAuthError("El nombre de usuario debe tener al menos 2 caracteres.");
        return;
      }
      if (!/^[a-zA-Z0-9_ñÑáéíóúÁÉÍÓÚ]+$/.test(username)) {
        setAuthError("El nombre de usuario solo puede tener letras, números y guion bajo.");
        return;
      }
      if (password.length < 6) {
        setAuthError("La contraseña debe tener al menos 6 caracteres.");
        return;
      }
      if (code !== COMMUNITY_CODE) {
        setAuthError("Código de acceso incorrecto.");
        return;
      }
      if (!signupSelfieBlob) {
        setAuthError("Toma una foto de verificación (selfie) para poder registrarte.");
        return;
      }
    }

    setAuthError("");
    setAuthLoading(true);
    try {
      if (authMode === "signup") {
        const data = await sbAuthRequest("signup", { email, password });
        const accessToken = data.access_token;
        const userId = data.user ? data.user.id : data.id;
        if (!accessToken || !userId) {
          throw new Error("No se pudo crear la cuenta. Intenta de nuevo.");
        }
        // Create the profile row for this new user.
        let avatarUrl = null;
        if (signupAvatarBlob) {
          try {
            avatarUrl = await sbUpload(signupAvatarBlob, accessToken, "avatars");
          } catch (avErr) {
            console.error("avatar upload failed", avErr);
          }
        }
        const newProfile = await sbRest("profiles", {
          method: "POST",
          token: accessToken,
          body: { id: userId, username, avatar_url: avatarUrl },
        });
        try {
          const selfieUrl = await sbUpload(signupSelfieBlob, accessToken, "verifications");
          await sbRest("verifications", {
            method: "POST",
            token: accessToken,
            body: { user_id: userId, photo_url: selfieUrl },
          });
        } catch (selfieErr) {
          console.error("selfie upload failed", selfieErr);
        }
        setSession({ accessToken, userId, email });
        setProfile(Array.isArray(newProfile) ? newProfile[0] : newProfile);
      } else {
        const data = await sbAuthRequest("token?grant_type=password", { email, password });
        const accessToken = data.access_token;
        const userId = data.user ? data.user.id : null;
        if (!accessToken || !userId) {
          throw new Error("Correo o contraseña incorrectos.");
        }
        const profiles = await sbRest(`profiles?id=eq.${userId}&select=*`, { token: accessToken });
        const myProfile = profiles && profiles[0];
        if (!myProfile) {
          throw new Error("No se encontró tu perfil. Contacta al administrador.");
        }
        if (myProfile.banned) {
          throw new Error("Has sido expulsado de esta comunidad.");
        }
        setSession({ accessToken, userId, email });
        setProfile(myProfile);
      }
      setActiveDmUser(null);
    } catch (err) {
      console.error("Revelado handleAuth error:", err);
      setAuthError(err.message || "Ocurrió un error.");
    } finally {
      setAuthLoading(false);
    }
  }

  function handleLogout() {
    setSession(null);
    setProfile(null);
    setPasswordInput("");
    setActiveDmUser(null);
    setPosts([]);
    setUsers([]);
    setDms({});
    setSignupAvatarPreview(null);
    setSignupAvatarBlob(null);
    setProfileUsername(null);
    setView("feed");
  }

  async function handleSignupAvatarPick(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    try {
      const blob = await compressImageToBlob(file, 500, 0.75);
      setSignupAvatarPreview(URL.createObjectURL(blob));
      setSignupAvatarBlob(blob);
    } catch (err) {
      setSignupAvatarPreview(null);
      setSignupAvatarBlob(null);
    }
  }

  async function handleSignupSelfiePick(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    try {
      const blob = await compressImageToBlob(file, 700, 0.75);
      setSignupSelfiePreview(URL.createObjectURL(blob));
      setSignupSelfieBlob(blob);
    } catch (err) {
      setSignupSelfiePreview(null);
      setSignupSelfieBlob(null);
    }
  }

  function openProfile(username) {
    setProfileReturnView(view === "profile" ? profileReturnView : view);
    setProfileUsername(username);
    setView("profile");
  }

  async function handleChangeAvatar(e) {
    const file = e.target.files && e.target.files[0];
    if (!file || !session) return;
    setAvatarUploading(true);
    try {
      const blob = await compressImageToBlob(file, 500, 0.75);
      const url = await sbUpload(blob, session.accessToken, "avatars");
      await sbRest(`profiles?id=eq.${profile.id}`, {
        method: "PATCH",
        token: session.accessToken,
        body: { avatar_url: url },
      });
      setProfile((p) => ({ ...p, avatar_url: url }));
      setUsers((prev) => prev.map((u) => (u.id === profile.id ? { ...u, avatar_url: url } : u)));
    } catch (err) {
      console.error(err);
      alert("No se pudo actualizar la foto de perfil.");
    } finally {
      setAvatarUploading(false);
      if (avatarEditInputRef.current) avatarEditInputRef.current.value = "";
    }
  }

  // ---- Feed ----
  async function handleFilePick(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    try {
      const blob = await compressImageToBlob(file);
      setUploadPreview(URL.createObjectURL(blob));
      setUploadBlob(blob);
    } catch (err) {
      setUploadPreview(null);
      setUploadBlob(null);
    }
  }

  async function handlePublish() {
    if (!uploadBlob || publishing || !session) return;
    setPublishing(true);
    try {
      const url = await sbUpload(uploadBlob, session.accessToken, "posts");
      await sbRest("posts", {
        method: "POST",
        token: session.accessToken,
        body: { author_id: profile.id, image_url: url, caption: uploadCaption.trim() },
      });
      setUploadPreview(null);
      setUploadBlob(null);
      setUploadCaption("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      await loadFeed(session.accessToken);
    } catch (err) {
      console.error(err);
      alert("No se pudo publicar: " + err.message);
    } finally {
      setPublishing(false);
    }
  }

  async function handleAddComment(postId) {
    const text = (commentDrafts[postId] || "").trim();
    if (!text || !session) return;
    setCommentDrafts((d) => ({ ...d, [postId]: "" }));
    try {
      await sbRest("comments", {
        method: "POST",
        token: session.accessToken,
        body: { post_id: postId, author_id: profile.id, text },
      });
      await loadFeed(session.accessToken);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDeletePost(postId) {
    if (!isAdmin || !session) return;
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    try {
      await sbRest(`posts?id=eq.${postId}`, { method: "DELETE", token: session.accessToken });
    } catch (err) {
      console.error(err);
      await loadFeed(session.accessToken);
    }
  }

  async function handleDeleteComment(commentId) {
    if (!isAdmin || !session) return;
    try {
      await sbRest(`comments?id=eq.${commentId}`, { method: "DELETE", token: session.accessToken });
      await loadFeed(session.accessToken);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleBanUser(userId, username) {
    if (!isAdmin || !session || username === profile.username) return;
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    try {
      await sbRest(`profiles?id=eq.${userId}`, {
        method: "PATCH",
        token: session.accessToken,
        body: { banned: true },
      });
    } catch (err) {
      console.error(err);
      await loadUsers(session.accessToken);
    }
  }

  // ---- Tienda ----
  async function handleProductFilePick(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    try {
      const blob = await compressImageToBlob(file, 900, 0.75);
      setProductImagePreview(URL.createObjectURL(blob));
      setProductImageBlob(blob);
    } catch (err) {
      setProductImagePreview(null);
      setProductImageBlob(null);
    }
  }

  async function handlePublishProduct() {
    if (!isAdmin || !session || !productName.trim() || publishingProduct) return;
    setPublishingProduct(true);
    try {
      let imageUrl = null;
      if (productImageBlob) {
        imageUrl = await sbUpload(productImageBlob, session.accessToken, "products");
      }
      await sbRest("products", {
        method: "POST",
        token: session.accessToken,
        body: {
          name: productName.trim(),
          description: productDescription.trim(),
          price: productPrice.trim() || null,
          image_url: imageUrl,
          created_by: profile.id,
        },
      });
      setProductName("");
      setProductDescription("");
      setProductPrice("");
      setProductImagePreview(null);
      setProductImageBlob(null);
      if (productFileInputRef.current) productFileInputRef.current.value = "";
      await loadProducts(session.accessToken);
    } catch (err) {
      console.error(err);
      alert("No se pudo agregar el producto: " + err.message);
    } finally {
      setPublishingProduct(false);
    }
  }

  async function handleDeleteProduct(productId) {
    if (!isAdmin || !session) return;
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    try {
      await sbRest(`products?id=eq.${productId}`, { method: "DELETE", token: session.accessToken });
    } catch (err) {
      console.error(err);
      await loadProducts(session.accessToken);
    }
  }

  async function handleToggleVerified(userId, currentlyVerified) {
    if (!isAdmin || !session) return;
    const next = !currentlyVerified;
    setVerifications((prev) => prev.map((v) => (v.user_id === userId ? { ...v, verified: next } : v)));
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, verified: next } : u)));
    try {
      await Promise.all([
        sbRest(`verifications?user_id=eq.${userId}`, {
          method: "PATCH",
          token: session.accessToken,
          body: { verified: next },
        }),
        sbRest(`profiles?id=eq.${userId}`, {
          method: "PATCH",
          token: session.accessToken,
          body: { verified: next },
        }),
      ]);
    } catch (err) {
      console.error(err);
      await loadVerifications(session.accessToken);
      await loadUsers(session.accessToken);
    }
  }

  async function handleSelfVerifyPick(e) {
    const file = e.target.files && e.target.files[0];
    if (!file || !session) return;
    setSelfVerifyLoading(true);
    try {
      const blob = await compressImageToBlob(file, 700, 0.75);
      const photoUrl = await sbUpload(blob, session.accessToken, "verifications");
      if (myVerification) {
        // Resubmitting — reset to pending so the admin reviews the new photo.
        await sbRest(`verifications?user_id=eq.${profile.id}`, {
          method: "PATCH",
          token: session.accessToken,
          body: { photo_url: photoUrl, verified: false },
        });
        await sbRest(`profiles?id=eq.${profile.id}`, {
          method: "PATCH",
          token: session.accessToken,
          body: { verified: false },
        });
      } else {
        await sbRest("verifications", {
          method: "POST",
          token: session.accessToken,
          body: { user_id: profile.id, photo_url: photoUrl },
        });
      }
      setProfile((p) => ({ ...p, verified: false }));
      await loadMyVerification(session.accessToken, profile.id);
    } catch (err) {
      console.error(err);
      alert("No se pudo enviar la foto de verificación.");
    } finally {
      setSelfVerifyLoading(false);
      if (selfVerifyInputRef.current) selfVerifyInputRef.current.value = "";
    }
  }

  // ---- DMs ----
  async function handleDmFilePick(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    try {
      const blob = await compressImageToBlob(file, 640, 0.7);
      setDmImagePreview(URL.createObjectURL(blob));
      setDmImageBlob(blob);
    } catch (err) {
      setDmImagePreview(null);
      setDmImageBlob(null);
    }
  }

  async function handleSendDm() {
    if (!activeDmUser || !session) return;
    const text = dmDraft.trim();
    if (!text && !dmImageBlob) return;
    const otherUser = users.find((u) => u.username === activeDmUser);
    if (!otherUser) return;
    setDmDraft("");
    const blobToSend = dmImageBlob;
    setDmImagePreview(null);
    setDmImageBlob(null);
    if (dmFileInputRef.current) dmFileInputRef.current.value = "";
    try {
      let imageUrl = null;
      if (blobToSend) {
        imageUrl = await sbUpload(blobToSend, session.accessToken, "messages");
      }
      await sbRest("messages", {
        method: "POST",
        token: session.accessToken,
        body: { sender_id: profile.id, receiver_id: otherUser.id, text, image_url: imageUrl },
      });
      await loadDms(session.accessToken, profile.id);
    } catch (err) {
      console.error(err);
    }
  }

  const frameCount = posts.length;

  return (
    <div className="rv-root">
      <style>{STYLES}</style>

      {recoveryToken ? (
        <div className="rv-auth-wrap">
          <div className="rv-auth-card">
            <h1 className="rv-logo rv-display">
              CONE<span>XIÓN</span>
            </h1>
            <p className="rv-tagline rv-mono">Elige tu nueva contraseña</p>
            <div>
              <label className="rv-field-label">Nueva contraseña</label>
              <div className="rv-password-wrap">
                <input
                  className="rv-input"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="mínimo 6 caracteres"
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCompletePasswordReset();
                  }}
                  disabled={resetLoading}
                  autoFocus
                />
                <button
                  type="button"
                  className="rv-password-toggle"
                  onClick={() => setShowNewPassword((v) => !v)}
                  tabIndex={-1}
                  title={showNewPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showNewPassword ? "🙈" : "👁"}
                </button>
              </div>
              {resetMessage && <div className="rv-error">{resetMessage}</div>}
              <button
                className="rv-btn"
                type="button"
                onClick={handleCompletePasswordReset}
                disabled={resetLoading}
              >
                {resetLoading ? "GUARDANDO..." : "GUARDAR CONTRASEÑA"}
              </button>
            </div>
          </div>
        </div>
      ) : !session || !profile ? (
        <div className="rv-auth-wrap">
          <div className="rv-auth-card">
            <h1 className="rv-logo rv-display">
              CONE<span>XIÓN</span>
            </h1>
            <p className="rv-tagline rv-mono">
              Un lugar seguro para compartir. Publica, comenta y envía
              mensajes privados, con total seguridad.
            </p>
            <div className="rv-mode-tabs">
              <button
                className={`rv-mode-tab ${authMode === "signin" ? "active" : ""}`}
                onClick={() => {
                  setAuthMode("signin");
                  setAuthError("");
                }}
              >
                Iniciar sesión
              </button>
              <button
                className={`rv-mode-tab ${authMode === "signup" ? "active" : ""}`}
                onClick={() => {
                  setAuthMode("signup");
                  setAuthError("");
                }}
              >
                Crear cuenta
              </button>
            </div>
            <div>
              <label className="rv-field-label">Correo</label>
              <input
                className="rv-input"
                type="email"
                placeholder="tu@correo.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                disabled={authLoading}
                autoFocus
              />
              <label className="rv-field-label" style={{ marginTop: 14 }}>
                Contraseña
              </label>
              <div className="rv-password-wrap">
                <input
                  className="rv-input"
                  type={showPassword ? "text" : "password"}
                  placeholder={authMode === "signup" ? "mínimo 6 caracteres" : "tu contraseña"}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && authMode === "signin") handleAuth();
                  }}
                  disabled={authLoading}
                />
                <button
                  type="button"
                  className="rv-password-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                  title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
              {authMode === "signin" && (
                <div style={{ marginTop: 8, textAlign: "right" }}>
                  <button
                    type="button"
                    className="rv-comment-toggle"
                    style={{ padding: 0 }}
                    onClick={handleForgotPassword}
                    disabled={forgotLoading}
                  >
                    {forgotLoading ? "enviando..." : "¿Olvidaste tu contraseña?"}
                  </button>
                  {forgotMessage && (
                    <div style={{ fontSize: 11, color: "var(--ink-soft)", marginTop: 4 }}>
                      {forgotMessage}
                    </div>
                  )}
                </div>
              )}
              {authMode === "signup" && (
                <>
                  <label className="rv-field-label" style={{ marginTop: 14 }}>
                    Nombre de usuario
                  </label>
                  <input
                    className="rv-input"
                    placeholder="ej. ana_lente"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    disabled={authLoading}
                  />
                  <label className="rv-field-label" style={{ marginTop: 14 }}>
                    Foto de perfil (opcional)
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ position: "relative" }}>
                      <AvatarCircle
                        username={usernameInput || "?"}
                        avatarUrl={signupAvatarPreview}
                        size={52}
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleSignupAvatarPick}
                        disabled={authLoading}
                        style={{
                          position: "absolute",
                          inset: 0,
                          width: "100%",
                          height: "100%",
                          opacity: 0,
                          cursor: "pointer",
                          borderRadius: "50%",
                        }}
                      />
                    </div>
                    <span style={{ fontSize: 11, color: "var(--ink-soft)" }}>
                      Toca el círculo para elegir una foto. Puedes agregarla
                      después si prefieres.
                    </span>
                  </div>
                  <label className="rv-field-label" style={{ marginTop: 14 }}>
                    Foto de verificación (selfie) — obligatoria
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      style={{
                        position: "relative",
                        width: 52,
                        height: 52,
                        borderRadius: "50%",
                        background: "var(--bg)",
                        border: "1px solid var(--line)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        flexShrink: 0,
                      }}
                    >
                      {signupSelfiePreview ? (
                        <img
                          src={signupSelfiePreview}
                          alt="selfie"
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        <span style={{ fontSize: 20 }}>📷</span>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        capture="user"
                        onChange={handleSignupSelfiePick}
                        disabled={authLoading}
                        style={{
                          position: "absolute",
                          inset: 0,
                          width: "100%",
                          height: "100%",
                          opacity: 0,
                          cursor: "pointer",
                          borderRadius: "50%",
                        }}
                      />
                    </div>
                    <span style={{ fontSize: 11, color: "var(--ink-soft)" }}>
                      Toca el ícono 📷 para abrir la cámara y tomarte una foto
                      — sirve para que el administrador confirme que la
                      cuenta es real. Solo la ve el administrador.
                    </span>
                  </div>
                  <label className="rv-field-label" style={{ marginTop: 14 }}>
                    Código de acceso de la comunidad
                  </label>
                  <input
                    className="rv-input"
                    type="password"
                    placeholder="pídeselo a quien te invitó"
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAuth();
                    }}
                    disabled={authLoading}
                  />
                </>
              )}
              {authError && <div className="rv-error">{authError}</div>}
              <button className="rv-btn" type="button" onClick={handleAuth} disabled={authLoading}>
                {authLoading
                  ? "UN MOMENTO..."
                  : authMode === "signup"
                  ? "CREAR CUENTA"
                  : "ENTRAR"}
              </button>
            </div>
            <p className="rv-note">
              Ahora con cuentas reales: tu contraseña se guarda de forma segura
              (no la vemos ni la guardamos nosotros). Las publicaciones y
              comentarios son públicos para la comunidad; los mensajes son
              privados entre las dos personas de la conversación.
            </p>
          </div>
        </div>
      ) : (
        <div className="rv-shell">
          <div className="rv-nav">
            <div className="rv-nav-left">
              <div className="rv-nav-logo rv-display">
                CONE<span>XIÓN</span>
              </div>
              <div className="rv-tabs">
                <button
                  className={`rv-tab ${view === "feed" ? "active" : ""}`}
                  onClick={() => {
                    setView("feed");
                    setActiveDmUser(null);
                  }}
                >
                  Sala
                </button>
                <button
                  className={`rv-tab ${view === "chat" ? "active" : ""}`}
                  onClick={() => {
                    setView("chat");
                    setActiveDmUser(null);
                  }}
                  style={{ position: "relative" }}
                >
                  Mensajes
                  {totalUnread > 0 && (
                    <span
                      className="rv-mono"
                      style={{
                        marginLeft: 6,
                        background: "var(--accent)",
                        color: "#fff",
                        fontSize: 10,
                        padding: "1px 6px",
                        borderRadius: 10,
                      }}
                    >
                      {totalUnread}
                    </span>
                  )}
                </button>
                <button
                  className={`rv-tab ${view === "members" ? "active" : ""}`}
                  onClick={() => {
                    setView("members");
                    setActiveDmUser(null);
                  }}
                >
                  Miembros
                </button>
                <button
                  className={`rv-tab ${view === "store" ? "active" : ""}`}
                  onClick={() => {
                    setView("store");
                    setActiveDmUser(null);
                  }}
                >
                  Tienda
                </button>
                {isAdmin && (
                  <button
                    className={`rv-tab ${view === "admin" ? "active" : ""}`}
                    onClick={() => {
                      setView("admin");
                      setActiveDmUser(null);
                      setAdminActiveConvo(null);
                    }}
                  >
                    Supervisión
                  </button>
                )}
              </div>
            </div>
            <div className="rv-nav-right">
              <div
                className="rv-user-chip"
                style={{ cursor: "pointer" }}
                onClick={() => openProfile(profile.username)}
              >
                <AvatarCircle username={profile.username} avatarUrl={profile.avatar_url} size={26} />
                {profile.username}
                {isAdmin && (
                  <span
                    className="rv-mono"
                    style={{
                      background: "var(--accent-soft)",
                      color: "var(--flash)",
                      fontSize: 10,
                      padding: "2px 6px",
                      borderRadius: 3,
                      letterSpacing: "0.05em",
                    }}
                  >
                    ADMIN
                  </span>
                )}
              </div>
              <button className="rv-logout" onClick={handleLogout}>
                salir
              </button>
            </div>
          </div>

          <div className="rv-main">
            {view === "feed" && (
              <>
                <div className="rv-upload-box">
                  <div className="rv-upload-row">
                    <div className="rv-upload-preview">
                      {uploadPreview ? <img src={uploadPreview} alt="preview" /> : <span>+</span>}
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleFilePick}
                        style={{
                          position: "absolute",
                          inset: 0,
                          width: "100%",
                          height: "100%",
                          opacity: 0,
                          cursor: "pointer",
                        }}
                      />
                    </div>
                    <textarea
                      className="rv-caption-input"
                      placeholder="Escribe un pie de foto..."
                      value={uploadCaption}
                      onChange={(e) => setUploadCaption(e.target.value)}
                    />
                  </div>
                  <div className="rv-upload-actions">
                    {uploadPreview && (
                      <button
                        className="rv-btn rv-btn-ghost"
                        onClick={() => {
                          setUploadPreview(null);
                          setUploadBlob(null);
                          setUploadCaption("");
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                      >
                        Cancelar
                      </button>
                    )}
                    <button className="rv-btn" disabled={!uploadBlob || publishing} onClick={handlePublish}>
                      {publishing ? "REVELANDO..." : "PUBLICAR"}
                    </button>
                  </div>
                </div>

                {posts.length === 0 ? (
                  <div className="rv-empty">
                    <div className="rv-display">LA SALA ESTÁ VACÍA</div>
                    <p>Sé la primera persona en revelar una foto.</p>
                  </div>
                ) : (
                  posts.map((post, idx) => {
                    const frameNum = String(frameCount - idx).padStart(3, "0");
                    const isOpen = !!expanded[post.id];
                    const comments = post.comments || [];
                    return (
                      <div className="rv-post" key={post.id}>
                        <div className="rv-sprockets top">
                          {Array.from({ length: 14 }).map((_, i) => (
                            <span key={i} />
                          ))}
                        </div>
                        <div className="rv-frame">
                          <div className="rv-frame-header">
                            <div
                              className="rv-frame-author"
                              style={{ cursor: "pointer" }}
                              onClick={() => openProfile(post.author.username)}
                            >
                              <AvatarCircle username={post.author.username} avatarUrl={post.author.avatar_url} size={22} />
                              <span className="rv-frame-username">{post.author.username}</span>
                              {post.author.verified && (
                                <span title="Cuenta verificada" style={{ marginLeft: 4, fontSize: 12 }}>
                                  ✅
                                </span>
                              )}
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <span className="rv-frame-number rv-mono">FRAME {frameNum}</span>
                              {isAdmin && (
                                <button
                                  className="rv-comment-toggle"
                                  style={{ color: "var(--accent)" }}
                                  onClick={() => handleDeletePost(post.id)}
                                  title="Borrar publicación"
                                >
                                  borrar
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="rv-frame-img-wrap">
                            <img
                              className="rv-frame-img"
                              src={post.image_url}
                              alt={post.caption || "foto"}
                              style={{ cursor: "pointer" }}
                              onClick={() => setLightboxUrl(post.image_url)}
                            />
                            {post.caption && <div className="rv-frame-caption">{post.caption}</div>}
                          </div>
                          <div className="rv-frame-meta">
                            <span className="rv-timestamp rv-mono">{timeAgo(post.created_at)}</span>
                            <button
                              className="rv-comment-toggle"
                              onClick={() => setExpanded((s) => ({ ...s, [post.id]: !s[post.id] }))}
                            >
                              {comments.length === 0
                                ? "comentar"
                                : `${comments.length} comentario${comments.length === 1 ? "" : "s"}`}
                            </button>
                          </div>
                          {isOpen && (
                            <div className="rv-comments">
                              {comments.map((c) => (
                                <div className="rv-comment" key={c.id}>
                                  <span className="rv-comment-author">{c.author.username}</span>
                                  <span className="rv-comment-text" style={{ flex: 1 }}>
                                    {c.text}
                                  </span>
                                  {isAdmin && (
                                    <button
                                      className="rv-comment-toggle"
                                      style={{ color: "var(--accent)", padding: "0 0 0 6px" }}
                                      onClick={() => handleDeleteComment(c.id)}
                                      title="Borrar comentario"
                                    >
                                      ✕
                                    </button>
                                  )}
                                </div>
                              ))}
                              <div className="rv-comment-form">
                                <input
                                  className="rv-comment-input"
                                  placeholder="Escribe un comentario..."
                                  value={commentDrafts[post.id] || ""}
                                  onChange={(e) =>
                                    setCommentDrafts((d) => ({ ...d, [post.id]: e.target.value }))
                                  }
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") handleAddComment(post.id);
                                  }}
                                />
                                <button className="rv-send-mini" onClick={() => handleAddComment(post.id)}>
                                  enviar
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="rv-sprockets">
                          {Array.from({ length: 14 }).map((_, i) => (
                            <span key={i} />
                          ))}
                        </div>
                      </div>
                    );
                  })
                )}
              </>
            )}

            {view === "chat" && (
              <div className="rv-chat-wrap">
                {!activeDmUser ? (
                  <>
                    <div className="rv-section-title">Mensajes privados</div>
                    {users.filter((u) => u.username !== profile.username).length === 0 ? (
                      <div className="rv-empty" style={{ padding: "30px 0" }}>
                        Todavía no hay otros miembros con quien chatear.
                      </div>
                    ) : (
                      users
                        .filter((u) => u.username !== profile.username)
                        .slice()
                        .sort((a, b) => unreadCountWith(b.username) - unreadCountWith(a.username))
                        .map((u) => {
                          const key = dmKey(profile.username, u.username);
                          const msgs = dms[key] || [];
                          const last = msgs[msgs.length - 1];
                          const unread = unreadCountWith(u.username);
                          return (
                            <div
                              className="rv-member-row"
                              key={u.id}
                              style={{
                                cursor: "pointer",
                                background: unread > 0 ? "rgba(227,66,52,0.08)" : "transparent",
                                borderRadius: 4,
                              }}
                              onClick={() => setActiveDmUser(u.username)}
                            >
                              <div
                                className="rv-avatar"
                                style={{
                                  background: colorForName(u.username),
                                  boxShadow: unread > 0 ? "0 0 0 2px var(--accent)" : "none",
                                }}
                              >
                                {u.username.slice(0, 1).toUpperCase()}
                              </div>
                              <div style={{ flex: 1 }}>
                                <div
                                  className="rv-member-name"
                                  style={{ color: unread > 0 ? "var(--flash)" : "var(--ink)" }}
                                >
                                  {u.username}
                                </div>
                                <div className="rv-member-joined">
                                  {last ? `${last.image_url ? "📷 " : ""}${(last.text || "").slice(0, 40)}` : "Toca para escribir"}
                                </div>
                              </div>
                              {unread > 0 && (
                                <span
                                  className="rv-mono"
                                  style={{
                                    background: "var(--accent)",
                                    color: "#fff",
                                    fontSize: 11,
                                    padding: "2px 8px",
                                    borderRadius: 10,
                                  }}
                                >
                                  {unread} nuevo{unread === 1 ? "" : "s"}
                                </span>
                              )}
                            </div>
                          );
                        })
                    )}
                  </>
                ) : (
                  <>
                    <div className="rv-section-title" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <button
                        className="rv-comment-toggle"
                        style={{ padding: "0 4px 0 0" }}
                        onClick={() => setActiveDmUser(null)}
                      >
                        ← volver
                      </button>
                      conversación con {activeDmUser}
                    </div>
                    <div className="rv-chat-log" ref={chatLogRef}>
                      {(dms[dmKey(profile.username, activeDmUser)] || []).length === 0 && (
                        <div className="rv-empty" style={{ padding: "30px 0" }}>
                          Todavía no hay mensajes. ¡Escribe el primero!
                        </div>
                      )}
                      {(dms[dmKey(profile.username, activeDmUser)] || []).map((m) => (
                        <div
                          className="rv-chat-msg"
                          key={m.id}
                          style={{ flexDirection: "column", alignItems: "flex-start" }}
                        >
                          <div style={{ display: "flex", gap: 8, alignItems: "baseline", width: "100%" }}>
                            <span className="rv-chat-author" style={{ color: colorForName(m.sender.username) }}>
                              {m.sender.username}:
                            </span>
                            {m.text && <span>{m.text}</span>}
                            <span className="rv-chat-time rv-mono">{timeAgo(m.created_at)}</span>
                          </div>
                          {m.image_url && (
                            <img
                              src={m.image_url}
                              alt="imagen adjunta"
                              style={{ maxWidth: "70%", borderRadius: 6, marginTop: 4, border: "1px solid var(--line)" }}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                    {dmImagePreview && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          background: "var(--surface-2)",
                          border: "1px solid var(--line)",
                          borderRadius: "4px 4px 0 0",
                          padding: 8,
                        }}
                      >
                        <img
                          src={dmImagePreview}
                          alt="preview"
                          style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 4 }}
                        />
                        <span style={{ fontSize: 12, color: "var(--ink-soft)", flex: 1 }}>
                          Imagen lista para enviar
                        </span>
                        <button
                          className="rv-comment-toggle"
                          onClick={() => {
                            setDmImagePreview(null);
                            setDmImageBlob(null);
                            if (dmFileInputRef.current) dmFileInputRef.current.value = "";
                          }}
                        >
                          quitar
                        </button>
                      </div>
                    )}
                    <div className="rv-chat-form">
                      <div
                        className="rv-btn rv-btn-ghost"
                        style={{
                          position: "relative",
                          width: "auto",
                          marginTop: 0,
                          padding: "0 14px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        title="Adjuntar imagen"
                      >
                        📎
                        <input
                          type="file"
                          accept="image/*"
                          ref={dmFileInputRef}
                          onChange={handleDmFilePick}
                          style={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            opacity: 0,
                            cursor: "pointer",
                          }}
                        />
                      </div>
                      <input
                        className="rv-chat-input"
                        placeholder="Escribe un mensaje..."
                        value={dmDraft}
                        onChange={(e) => setDmDraft(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSendDm();
                        }}
                      />
                      <button
                        className="rv-btn"
                        style={{ width: "auto", marginTop: 0, padding: "0 20px" }}
                        onClick={handleSendDm}
                      >
                        ENVIAR
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {view === "members" && (
              <div>
                <div className="rv-section-title">
                  {users.length} miembro{users.length === 1 ? "" : "s"} registrado{users.length === 1 ? "" : "s"}
                </div>
                {users
                  .slice()
                  .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
                  .map((u) => (
                    <div className="rv-member-row" key={u.id}>
                      <div
                        style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, cursor: "pointer" }}
                        onClick={() => openProfile(u.username)}
                      >
                        <AvatarCircle username={u.username} avatarUrl={u.avatar_url} size={26} />
                        <div>
                          <div className="rv-member-name">
                            {u.username}
                            {u.verified && (
                              <span title="Cuenta verificada" style={{ marginLeft: 6, fontSize: 12 }}>
                                ✅
                              </span>
                            )}
                            {u.is_admin && (
                              <span
                                className="rv-mono"
                                style={{
                                  marginLeft: 8,
                                  background: "var(--accent-soft)",
                                  color: "var(--flash)",
                                  fontSize: 10,
                                  padding: "2px 6px",
                                  borderRadius: 3,
                                }}
                              >
                                ADMIN
                              </span>
                            )}
                          </div>
                          <div className="rv-member-joined rv-mono">se unió {timeAgo(u.created_at)}</div>
                        </div>
                      </div>
                      {u.username !== profile.username && (
                        <div style={{ display: "flex", gap: 8 }}>
                          <button
                            className="rv-send-mini"
                            onClick={() => {
                              setActiveDmUser(u.username);
                              setView("chat");
                            }}
                          >
                            mensaje
                          </button>
                          {isAdmin && (
                            <button
                              className="rv-send-mini"
                              style={{ color: "var(--accent)", borderColor: "var(--accent-soft)" }}
                              onClick={() => handleBanUser(u.id, u.username)}
                            >
                              expulsar
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}

            {view === "profile" &&
              (() => {
                const isOwn = profileUsername === profile.username;
                const person = isOwn ? profile : users.find((u) => u.username === profileUsername);
                if (!person) {
                  return (
                    <div className="rv-empty" style={{ padding: "40px 0" }}>
                      No se encontró ese perfil.
                    </div>
                  );
                }
                const albumPosts = posts.filter((p) => p.author.username === profileUsername);
                return (
                  <div>
                    <button
                      className="rv-comment-toggle"
                      style={{ padding: "0 0 12px 0" }}
                      onClick={() => setView(profileReturnView)}
                    >
                      ← volver
                    </button>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                      <div style={{ position: "relative" }}>
                        <AvatarCircle
                          username={person.username}
                          avatarUrl={person.avatar_url}
                          size={72}
                          onClick={!isOwn && person.avatar_url ? () => setLightboxUrl(person.avatar_url) : undefined}
                        />
                        {isOwn && (
                          <>
                            <input
                              type="file"
                              accept="image/*"
                              ref={avatarEditInputRef}
                              onChange={handleChangeAvatar}
                              disabled={avatarUploading}
                              style={{
                                position: "absolute",
                                inset: 0,
                                width: "100%",
                                height: "100%",
                                opacity: 0,
                                cursor: "pointer",
                                borderRadius: "50%",
                              }}
                            />
                            <div
                              style={{
                                position: "absolute",
                                bottom: -2,
                                right: -2,
                                background: "var(--accent)",
                                borderRadius: "50%",
                                width: 22,
                                height: 22,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 12,
                                pointerEvents: "none",
                              }}
                            >
                              {avatarUploading ? "…" : "✎"}
                            </div>
                          </>
                        )}
                      </div>
                      <div>
                        <div className="rv-display" style={{ fontSize: 24 }}>
                          {person.username}
                          {person.verified && (
                            <span
                              title="Cuenta verificada"
                              style={{ marginLeft: 8, fontSize: 16, verticalAlign: "middle" }}
                            >
                              ✅
                            </span>
                          )}
                          {person.is_admin && (
                            <span
                              className="rv-mono"
                              style={{
                                marginLeft: 8,
                                fontFamily: "'Space Mono', monospace",
                                fontSize: 10,
                                background: "var(--accent-soft)",
                                color: "var(--flash)",
                                padding: "2px 6px",
                                borderRadius: 3,
                                verticalAlign: "middle",
                              }}
                            >
                              ADMIN
                            </span>
                          )}
                        </div>
                        <div className="rv-timestamp rv-mono">
                          se unió {timeAgo(person.created_at)} · {albumPosts.length} foto
                          {albumPosts.length === 1 ? "" : "s"}
                        </div>
                        {isOwn && (
                          <div style={{ fontSize: 11, color: "var(--ink-soft)", marginTop: 4 }}>
                            Toca tu foto para cambiarla
                          </div>
                        )}
                        {isOwn && (
                          <div style={{ marginTop: 8 }}>
                            {person.verified ? (
                              <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>
                                ✅ Tu cuenta está verificada
                              </span>
                            ) : (
                              <>
                                <input
                                  type="file"
                                  accept="image/*"
                                  capture="user"
                                  ref={selfVerifyInputRef}
                                  onChange={handleSelfVerifyPick}
                                  disabled={selfVerifyLoading}
                                  style={{ display: "none" }}
                                  id="self-verify-input"
                                />
                                <label
                                  htmlFor="self-verify-input"
                                  className="rv-comment-toggle"
                                  style={{ padding: 0, cursor: "pointer" }}
                                >
                                  {selfVerifyLoading
                                    ? "enviando..."
                                    : myVerification
                                    ? "📷 Selfie enviada, pendiente de revisión — tocar para reenviar"
                                    : "📷 Verificarme (tomar selfie)"}
                                </label>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {albumPosts.length === 0 ? (
                      <div className="rv-empty" style={{ padding: "40px 0" }}>
                        {isOwn ? "Todavía no has publicado ninguna foto." : "Esta persona no ha publicado fotos."}
                      </div>
                    ) : (
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
                          gap: 8,
                        }}
                      >
                        {albumPosts.map((p) => (
                          <div
                            key={p.id}
                            style={{
                              aspectRatio: "1 / 1",
                              borderRadius: 3,
                              overflow: "hidden",
                              border: "1px solid var(--line)",
                              background: "var(--surface)",
                            }}
                          >
                            <img
                              src={p.image_url}
                              alt={p.caption || "foto"}
                              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", cursor: "pointer" }}
                              onClick={() => setLightboxUrl(p.image_url)}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}

            {view === "store" && (
              <div>
                {isAdmin && (
                  <div className="rv-upload-box">
                    <div className="rv-upload-row">
                      <div className="rv-upload-preview">
                        {productImagePreview ? (
                          <img src={productImagePreview} alt="preview" />
                        ) : (
                          <span>+</span>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          ref={productFileInputRef}
                          onChange={handleProductFilePick}
                          style={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            opacity: 0,
                            cursor: "pointer",
                          }}
                        />
                      </div>
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                        <input
                          className="rv-input"
                          placeholder="Nombre del producto"
                          value={productName}
                          onChange={(e) => setProductName(e.target.value)}
                        />
                        <input
                          className="rv-input"
                          placeholder="Precio (opcional)"
                          value={productPrice}
                          onChange={(e) => setProductPrice(e.target.value)}
                        />
                      </div>
                    </div>
                    <textarea
                      className="rv-caption-input"
                      style={{ width: "100%", marginTop: 10, minHeight: 60 }}
                      placeholder="Características del producto..."
                      value={productDescription}
                      onChange={(e) => setProductDescription(e.target.value)}
                    />
                    <div className="rv-upload-actions">
                      <button
                        className="rv-btn"
                        disabled={!productName.trim() || publishingProduct}
                        onClick={handlePublishProduct}
                      >
                        {publishingProduct ? "AGREGANDO..." : "AGREGAR PRODUCTO"}
                      </button>
                    </div>
                  </div>
                )}

                {products.length === 0 ? (
                  <div className="rv-empty">
                    <div className="rv-display">LA TIENDA ESTÁ VACÍA</div>
                    <p>
                      {isAdmin
                        ? "Agrega el primer producto arriba."
                        : "Todavía no hay productos publicados."}
                    </p>
                  </div>
                ) : (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 14,
                    }}
                  >
                    {products.map((p) => (
                      <div
                        key={p.id}
                        style={{
                          background: "var(--surface)",
                          border: "1px solid var(--line)",
                          borderRadius: 4,
                          overflow: "hidden",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <div
                          style={{
                            aspectRatio: "1 / 1",
                            background: "var(--paper)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {p.image_url ? (
                            <img
                              src={p.image_url}
                              alt={p.name}
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                          ) : (
                            <span style={{ color: "var(--ink-soft)", fontSize: 12 }}>sin imagen</span>
                          )}
                        </div>
                        <div style={{ padding: 10, display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{p.name}</div>
                          {p.price && (
                            <div className="rv-mono" style={{ color: "var(--flash)", fontSize: 13 }}>
                              {p.price}
                            </div>
                          )}
                          {p.description && (
                            <div style={{ fontSize: 12, color: "var(--ink-soft)", flex: 1 }}>
                              {p.description}
                            </div>
                          )}
                          {isAdmin && (
                            <button
                              className="rv-comment-toggle"
                              style={{ color: "var(--accent)", alignSelf: "flex-start", padding: "4px 0" }}
                              onClick={() => handleDeleteProduct(p.id)}
                            >
                              borrar
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {view === "admin" && isAdmin && (
              <div>
                <div className="rv-section-title" style={{ display: "flex", gap: 16 }}>
                  <span
                    style={{
                      cursor: "pointer",
                      color: adminPanel === "conversations" ? "var(--flash)" : "var(--ink-soft)",
                    }}
                    onClick={() => setAdminPanel("conversations")}
                  >
                    Conversaciones
                  </span>
                  <span
                    style={{
                      cursor: "pointer",
                      color: adminPanel === "verification" ? "var(--flash)" : "var(--ink-soft)",
                    }}
                    onClick={() => setAdminPanel("verification")}
                  >
                    Verificación
                    {verifications.filter((v) => !v.verified).length > 0 && (
                      <span
                        className="rv-mono"
                        style={{
                          marginLeft: 6,
                          background: "var(--accent)",
                          color: "#fff",
                          fontSize: 10,
                          padding: "1px 6px",
                          borderRadius: 10,
                        }}
                      >
                        {verifications.filter((v) => !v.verified).length}
                      </span>
                    )}
                  </span>
                </div>

                {adminPanel === "verification" ? (
                  verifications.length === 0 ? (
                    <div className="rv-empty" style={{ padding: "30px 0" }}>
                      Todavía no hay selfies de verificación para revisar.
                    </div>
                  ) : (
                    verifications.map((v) => (
                      <div
                        className="rv-member-row"
                        key={v.user_id}
                        style={{ alignItems: "flex-start" }}
                      >
                        <img
                          src={v.photo_url}
                          alt={`selfie de ${v.profile ? v.profile.username : ""}`}
                          style={{
                            width: 64,
                            height: 64,
                            borderRadius: 4,
                            objectFit: "cover",
                            cursor: "pointer",
                            flexShrink: 0,
                          }}
                          onClick={() => setLightboxUrl(v.photo_url)}
                        />
                        <div style={{ flex: 1 }}>
                          <div className="rv-member-name">
                            {v.profile ? v.profile.username : "(usuario eliminado)"}
                          </div>
                          <div className="rv-member-joined">
                            {v.verified ? "✅ Verificado" : "⏳ Pendiente de revisión"} ·{" "}
                            {timeAgo(v.created_at)}
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button
                            className="rv-send-mini"
                            onClick={() => handleToggleVerified(v.user_id, v.verified)}
                          >
                            {v.verified ? "quitar verificación" : "marcar verificado"}
                          </button>
                          {v.profile && !v.profile.banned && (
                            <button
                              className="rv-send-mini"
                              style={{ color: "var(--accent)", borderColor: "var(--accent-soft)" }}
                              onClick={() => handleBanUser(v.user_id, v.profile.username)}
                            >
                              expulsar
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )
                ) : (
                <>
                {!adminActiveConvo ? (
                  Object.keys(dms).length === 0 ? (
                    <div className="rv-empty" style={{ padding: "30px 0" }}>
                      Todavía no hay conversaciones entre miembros.
                    </div>
                  ) : (
                    Object.keys(dms)
                      .filter((k) => (dms[k] || []).length > 0)
                      .sort((a, b) => {
                        const la = new Date(dms[a][dms[a].length - 1].created_at).getTime();
                        const lb = new Date(dms[b][dms[b].length - 1].created_at).getTime();
                        return lb - la;
                      })
                      .map((k) => {
                        const [p1, p2] = k.split("|");
                        const msgs = dms[k];
                        const last = msgs[msgs.length - 1];
                        return (
                          <div
                            className="rv-member-row"
                            key={k}
                            style={{ cursor: "pointer" }}
                            onClick={() => setAdminActiveConvo(k)}
                          >
                            <div style={{ display: "flex", marginRight: 4 }}>
                              <div className="rv-avatar" style={{ background: colorForName(p1) }}>
                                {p1.slice(0, 1).toUpperCase()}
                              </div>
                              <div className="rv-avatar" style={{ background: colorForName(p2), marginLeft: -8 }}>
                                {p2.slice(0, 1).toUpperCase()}
                              </div>
                            </div>
                            <div style={{ flex: 1 }}>
                              <div className="rv-member-name">
                                {p1} ↔ {p2}
                              </div>
                              <div className="rv-member-joined">
                                {msgs.length} mensaje{msgs.length === 1 ? "" : "s"} ·{" "}
                                {last.image_url ? "📷 " : ""}
                                {(last.text || "imagen").slice(0, 30)}
                              </div>
                            </div>
                            <span className="rv-timestamp rv-mono">{timeAgo(last.created_at)}</span>
                          </div>
                        );
                      })
                  )
                ) : (
                  <>
                    <div
                      className="rv-section-title"
                      style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16 }}
                    >
                      <button
                        className="rv-comment-toggle"
                        style={{ padding: "0 4px 0 0" }}
                        onClick={() => setAdminActiveConvo(null)}
                      >
                        ← volver
                      </button>
                      {adminActiveConvo.split("|").join(" ↔ ")}
                    </div>
                    <div className="rv-chat-log" style={{ maxHeight: 420 }}>
                      {(dms[adminActiveConvo] || []).map((m) => (
                        <div
                          className="rv-chat-msg"
                          key={m.id}
                          style={{ flexDirection: "column", alignItems: "flex-start" }}
                        >
                          <div style={{ display: "flex", gap: 8, alignItems: "baseline", width: "100%" }}>
                            <span className="rv-chat-author" style={{ color: colorForName(m.sender.username) }}>
                              {m.sender.username}:
                            </span>
                            {m.text && <span>{m.text}</span>}
                            <span className="rv-chat-time rv-mono">{timeAgo(m.created_at)}</span>
                          </div>
                          {m.image_url && (
                            <img
                              src={m.image_url}
                              alt="imagen adjunta"
                              style={{ maxWidth: "60%", borderRadius: 6, marginTop: 4, border: "1px solid var(--line)" }}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="rv-note" style={{ marginTop: 10 }}>
                      Vista de solo lectura para supervisión — el administrador no puede
                      enviar mensajes en conversaciones ajenas.
                    </p>
                  </>
                )}
                </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {lightboxUrl && (
        <div
          onClick={() => setLightboxUrl(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10,11,14,0.92)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            cursor: "zoom-out",
            padding: 20,
          }}
        >
          <img
            src={lightboxUrl}
            alt="vista completa"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              borderRadius: 4,
              boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
            }}
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxUrl(null);
            }}
            style={{
              position: "absolute",
              top: 18,
              right: 18,
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.3)",
              color: "#fff",
              width: 36,
              height: 36,
              borderRadius: "50%",
              fontSize: 18,
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

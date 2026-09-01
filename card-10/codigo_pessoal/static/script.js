const messages = document.querySelector("#messages");
const messageForm = document.querySelector("#message-form");
const joinForm = document.querySelector("#join-form");
const joinScreen = document.querySelector("#join-screen");
const chatInterface = document.querySelector("#chat-interface");
const messageInput = document.querySelector("#message");
const userInput = document.querySelector("#user");
const sendButton = messageForm.querySelector("button");
const statusBadge = document.querySelector("#status");
const clientIdLabel = document.querySelector("#client-id");
const currentUserLabel = document.querySelector("#current-user");
const nameError = document.querySelector("#name-error");

let socket;
let reconnectAttempts = 0;
let reconnectTimer;
let clientId = null;
let selectedUser = "";
let chatStarted = false;

function setConnectionState(connected, text) {
  statusBadge.textContent = text;
  statusBadge.className = `status ${connected ? "connected" : "disconnected"}`;
  messageInput.disabled = !connected;
  sendButton.disabled = !connected;
  if (connected) messageInput.focus();
}

function renderMessage(message) {
  const item = document.createElement("li");
  item.className = `message ${message.type}`;
  if (message.client_id === clientId && message.type === "chat") {
    item.classList.add("mine");
  }

  const meta = document.createElement("div");
  meta.className = "message-meta";
  const time = new Date(message.timestamp).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  meta.textContent = `${message.user} • ${time}`;

  const content = document.createElement("p");
  content.textContent = message.content;
  item.append(meta, content);
  messages.append(item);
  messages.scrollTop = messages.scrollHeight;
}

function connect() {
  clearTimeout(reconnectTimer);

  const protocol = window.location.protocol === "https:" ? "wss" : "ws";
  socket = new WebSocket(
    `${protocol}://${window.location.host}/ws?user=${encodeURIComponent(selectedUser)}`,
  );
  setConnectionState(false, "Conectando…");

  socket.addEventListener("open", () => {
    reconnectAttempts = 0;
    setConnectionState(true, "Online");
  });

  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.type === "welcome") {
      clientId = message.client_id;
      clientIdLabel.textContent = `ID da conexão: ${clientId}`;
    }
    renderMessage(message);
  });

  socket.addEventListener("close", () => {
    if (!chatStarted) return;
    setConnectionState(false, "Reconectando…");
    // Backoff simples, limitado a 10 s. Em produção também aplicaríamos jitter,
    // limite de tentativas e tratamento diferente para encerramentos intencionais.
    const delay = Math.min(1000 * 2 ** reconnectAttempts, 10000);
    reconnectAttempts += 1;
    reconnectTimer = setTimeout(connect, delay);
  });

  socket.addEventListener("error", () => socket.close());
}

joinForm.addEventListener("submit", (event) => {
  event.preventDefault();
  selectedUser = userInput.value.trim();

  if (!selectedUser) {
    nameError.textContent = "Digite um nome para entrar no chat.";
    userInput.focus();
    return;
  }

  nameError.textContent = "";
  currentUserLabel.textContent = selectedUser;
  chatStarted = true;
  joinScreen.hidden = true;
  chatInterface.hidden = false;
  connect();
});

messageForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const content = messageInput.value.trim();
  if (!content || socket.readyState !== WebSocket.OPEN) return;

  socket.send(
    JSON.stringify({
      user: selectedUser,
      content,
      timestamp: new Date().toISOString(),
    }),
  );
  messageInput.value = "";
  messageInput.focus();
});

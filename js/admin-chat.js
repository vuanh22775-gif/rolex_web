const conversationList = document.getElementById('chatConversationList');
const adminThread = document.getElementById('adminChatThread');
const adminChatForm = document.getElementById('adminChatForm');
const adminChatInput = document.getElementById('adminChatInput');
const chatConnectionStatus = document.getElementById('chatConnectionStatus');
let activeConversation = '';

function renderAdminMessages(messages) {
    adminThread.innerHTML = messages.length ? messages.map(message => `
        <div class="admin-chat-message ${message.senderRole === 'admin' ? 'is-admin' : 'is-customer'}">
            <span>${message.senderRole === 'admin' ? 'Bạn' : message.username}</span>
            <p>${escapeChatHtml(message.text)}</p>
            <time>${new Date(message.createdAt).toLocaleString('vi-VN')}</time>
        </div>`).join('') : '<p class="chat-empty">Chưa có tin nhắn.</p>';
    adminThread.scrollTop = adminThread.scrollHeight;
}

function escapeChatHtml(text) {
    return String(text).replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
}

async function loadConversations() {
    const response = await fetch('/api/admin/chat/conversations');
    if (!response.ok) throw new Error('Không thể tải hội thoại');
    const result = await response.json();
    conversationList.innerHTML = result.conversations.length ? result.conversations.map(item => `
        <button type="button" class="chat-conversation ${item._id === activeConversation ? 'is-active' : ''}" data-username="${escapeChatHtml(item._id)}">
            <strong>${escapeChatHtml(item._id)}</strong>
            <span>${escapeChatHtml(item.lastMessage)}</span>
            ${item.unread ? `<b>${item.unread}</b>` : ''}
        </button>`).join('') : '<p class="chat-empty">Chưa có hội thoại.</p>';
}

async function openConversation(username) {
    activeConversation = username;
    adminChatInput.disabled = false;
    adminChatForm.querySelector('button').disabled = false;
    const response = await fetch(`/api/admin/chat/${encodeURIComponent(username)}`);
    const result = await response.json();
    renderAdminMessages(result.messages || []);
    await loadConversations();
}

conversationList.addEventListener('click', event => {
    const button = event.target.closest('[data-username]');
    if (button) openConversation(button.dataset.username);
});

adminChatForm.addEventListener('submit', async event => {
    event.preventDefault();
    const text = adminChatInput.value.trim();
    if (!activeConversation || !text) return;
    const response = await fetch(`/api/admin/chat/${encodeURIComponent(activeConversation)}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text })
    });
    if (response.ok) {
        adminChatInput.value = '';
        await openConversation(activeConversation);
    }
});

(async function initAdminChat() {
    try {
        await loadConversations();
        chatConnectionStatus.textContent = 'Đã kết nối';
        chatConnectionStatus.classList.add('is-online');
    } catch {
        chatConnectionStatus.textContent = 'Không kết nối được';
    }
})();

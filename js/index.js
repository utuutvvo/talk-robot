// 为登陆进行拦截
(async () => {
    const resp = await API.profile();
    const user = resp.data
    if (!user) {
        alert('未登陆或登陆已过期，请重新登陆！');
        location.href = './login.html';
        return;
    }
    // 初始化
    const doms = {
        aside: {
            nickname: document.querySelector('#nickname'),
            loginId: document.querySelector('#loginId'),
        },
        chatContainer: document.querySelector('.chat-container'),
        close: document.querySelector('.close'),
        chatInput: document.querySelector('#txtMsg'),
        mesContainer: document.querySelector('.msg-container'),
    }
    initUserInfo();
    // 注册注销事件
    doms.close.onclick = () => {
        API.loginOut();
        location.href = './login.html';
        return;
    }
    // 发送事件
    doms.mesContainer.addEventListener('submit', async (e) => {
        e.preventDefault();
        await sendChat();
    });

    async function initUserInfo () {
        doms.aside.nickname.innerText = user.nickname;
        doms.aside.loginId.innerText = user.loginId;
        // 初始化聊天记录
        const resp = await API.getHistory();
        for (const item of resp.data) {
            addChat(item);
        }
        scrollBottom();
    }
    function addChat (chatInfo) {
        const div = document.createElement('div');
        div.classList.add('chat-item');
        if (chatInfo.from) {
            div.classList.add('me'); 
        }
        const img = document.createElement('img');
        img.classList.add('chat-avatar');
        img.src = chatInfo.from? './asset/avatar.png' : './asset/robot-avatar.jpg';

        const content = document.createElement('div');
        content.classList.add('chat-content');
        content.innerText = chatInfo.content;

        const date = document.createElement('div');
        date.classList.add('chat-date');
        date.innerText = formatDate(chatInfo.createdAt);

        div.appendChild(img);
        div.appendChild(content);
        div.appendChild(date);

        doms.chatContainer.appendChild(div);
    }
    function formatDate (date) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const day = d.getDate().toString().padStart(2, '0');
        const hour = d.getHours().toString().padStart(2, '0');
        const minute = d.getMinutes().toString().padStart(2, '0');
        const second = d.getSeconds().toString().padStart(2, '0');
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    }
    function scrollBottom () {
        doms.chatContainer.scrollTop = doms.chatContainer.scrollHeight;
    }
    async function sendChat() {
        const content = doms.chatInput.value.trim();
        if (!content) {
            return;
        }
        addChat({
             from: user.loginId,
             to: null,
             createdAt: new Date(),
             content,
        });
        doms.chatInput.value = '';
        scrollBottom();
        const resp = await API.sendChat(content)
        if (resp.code === 0) {
            addChat({
                from: null,
                to: user.loginId,
                ...resp.data,
            });
            scrollBottom();
        }
    }
    window.sendChat = sendChat;
})()
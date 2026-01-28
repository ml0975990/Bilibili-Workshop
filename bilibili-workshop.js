export default {
  name: 'bilibili-workshop',
  displayName: 'B站工房',
  description: '在UP主主页和视频页添加工房入口',
  author: 'custom',

  entry: async () => {
    const uid = getUID();
    if (!uid) return;

    waitDom(() => {
      addButton(uid);
    });
  },
};

// ================= 工具函数 =================

function getUID() {
  try {
    return (
      window.__INITIAL_STATE__?.videoData?.owner?.mid ||
      window.__INITIAL_STATE__?.space?.info?.mid ||
      null
    );
  } catch {
    return null;
  }
}

function waitDom(cb) {
  const timer = setInterval(() => {
    const shareBtn =
      document.querySelector('.video-share') ||
      document.querySelector('.h-action') ||
      document.querySelector('.ops');

    if (!shareBtn) return;
    clearInterval(timer);
    cb(shareBtn);
  }, 500);
}

// ================= UI 注入 =================

function addButton(uid) {
  if (document.getElementById('be-workshop-btn')) return;

  const btn = document.createElement('button');
  btn.id = 'be-workshop-btn';
  btn.innerText = 'B站工房';

  btn.style.cssText = `
    margin-left: 8px;
    padding: 6px 12px;
    background: #fb7299;
    color: #fff;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    font-size: 13px;
  `;

  btn.onclick = () => openWorkshop(uid);

  const container =
    document.querySelector('.video-share')?.parentElement ||
    document.querySelector('.h-action') ||
    document.body;

  container.appendChild(btn);
}

// ================= 悬浮手机窗口 =================

function openWorkshop(uid) {
  let modal = document.getElementById('be-workshop-modal');
  if (modal) {
    modal.remove();
    return;
  }

  modal = document.createElement('div');
  modal.id = 'be-workshop-modal';

  modal.innerHTML = `
    <div class="be-phone">
      <div class="be-header">
        <span>B站工房</span>
        <span id="be-close">✕</span>
      </div>
      <iframe src="https://m.bilibili.com/space/${uid}"></iframe>
    </div>
  `;

  const style = document.createElement('style');
  style.innerHTML = `
    #be-workshop-modal {
      position: fixed;
      right: 40px;
      bottom: 40px;
      z-index: 999999;
    }
    .be-phone {
      width: 375px;
      height: 650px;
      background: #000;
      border-radius: 28px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0,0,0,.4);
      display: flex;
      flex-direction: column;
    }
    .be-header {
      height: 36px;
      background: #111;
      color: #fff;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 12px;
      font-size: 13px;
      cursor: move;
    }
    .be-header span:last-child {
      cursor: pointer;
      font-size: 16px;
    }
    .be-phone iframe {
      flex: 1;
      border: none;
      background: #fff;
    }
  `;

  document.head.appendChild(style);
  document.body.appendChild(modal);

  document.getElementById('be-close').onclick = () => modal.remove();
}

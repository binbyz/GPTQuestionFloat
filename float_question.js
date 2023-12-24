function createTocLayout(messages) {
    const existingToc = document.getElementById('chatgpt-toc');
    
    if (existingToc) {
        existingToc.remove();
    }

    const toc = document.createElement('ul');
    toc.id = 'chatgpt-toc';
    toc.className = 'fixed p-4 bg-white border border-gray-200 rounded shadow overflow-y-auto max-h-96'; // fixed 위치와 스크롤 가능
    toc.style.cssText = 'top: 5rem; right: 1.25rem; width: 16rem;';
    
    // 마우스 오버 시 너비 증가
    toc.addEventListener('mouseover', function() {
        toc.style.width = '40rem'; // 너비 증가
    });

    // 마우스 아웃 시 원래 너비로 복귀
    toc.addEventListener('mouseout', function() {
        toc.style.width = '16rem'; // 원래 너비로 복귀
    });

    messages.forEach(({ messageId, question }) => {
        const listItem = document.createElement('li');
        listItem.className = 'flex items-center mb-2 cursor-pointer hover:text-blue-500 last:mb-0';

        const icon = document.createElement('span'); // 아이콘
        icon.className = 'inline-block h-2 w-2 mr-2 bg-blue-500 rounded-full'; // 원형 아이콘
        icon.style.cssText = 'min-width: 0.5rem; min-height: 0.5rem;';

        const text = document.createElement('span'); // 텍스트
        text.className = 'text-sm truncate overflow-hidden'; // 텍스트 크기 조정, 줄임표 적용
        text.textContent = question;

        listItem.appendChild(icon);
        listItem.appendChild(text);
        listItem.onclick = () => scrollToMessage(messageId);
        toc.appendChild(listItem);
    });

    const relativeTag = document.querySelector('#__next > div.relative > div.relative');
    relativeTag.append(toc);
}
function scrollToMessage(messageId) {
    const targetDiv = document.querySelector(`div[data-message-author-role="user"][data-message-id="${messageId}"]`);
    if (targetDiv) {
        targetDiv.scrollIntoView({ behavior: 'smooth' });
    }
}

function handleDOMChange() {
  // 여기에 DOM 변경이 감지되었을 때 실행할 로직을 작성합니다.
  console.log('<main> 태그 내부가 변경되었습니다.');

  // 예: 새로운 메시지를 추출하는 로직
  const messageDivs = document.querySelectorAll('div[data-message-author-role="user"][data-message-id]');
  const messages = [];

  messageDivs.forEach(div => {
    const messageId = div.getAttribute('data-message-id');
    const textContentDiv = div.querySelector('div');
    const question = textContentDiv ? textContentDiv.textContent : '';
    messages.push({ messageId, question });
  });

  createTocLayout(messages);
}

// MutationObserver를 사용하여 <main> 태그의 변화를 감지하는 함수
function observeMainTagChanges() {
    const mainTag = document.querySelector('main');

    if (!mainTag) {
        console.error('main 태그를 찾을 수 없습니다.');
        return;
    }

    const observer = new MutationObserver(mutations => {
        handleDOMChange();
    });

    observer.observe(mainTag, { childList: true, subtree: true });
}

// 스크립트가 로드될 때 <main> 태그의 변화 감지 시작
observeMainTagChanges();

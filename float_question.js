function createTocLayout(messages) {
    const existingToc = document.getElementById('chatgpt-toc');
    
    if (existingToc) {
        existingToc.remove();
    }

    const toc = document.createElement('ul');
    toc.id = 'chatgpt-toc';
    toc.className = 'fixed p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded shadow overflow-y-auto max-h-96';
    toc.style.cssText = 'top: 5rem; right: 1rem; width: 14rem; max-height: 80%; overflow-y: scroll';
    
    toc.addEventListener('mouseover', function() {
        toc.style.width = '40rem';
    });

    toc.addEventListener('mouseout', function() {
        toc.style.width = '14rem'; // 원래 너비로 복귀
    });

    messages.forEach(({ messageId, question }) => {
        const listItem = document.createElement('li');
        listItem.className = 'flex items-center mb-2 cursor-pointer hover:text-blue-500 last:mb-0';

        const icon = document.createElement('span');
        icon.className = 'inline-block h-2 w-2 mr-2 bg-blue-500 rounded-full';
        icon.style.cssText = 'min-width: 0.5rem; min-height: 0.5rem;';

        const text = document.createElement('span'); // 텍스트
        text.className = 'text-sm truncate overflow-hidden dark:text-gray-50'; // 텍스트 크기 조정, 줄임표 적용
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

function observeMainTagChanges() {
    console.log('started');

    const mainTag = document.querySelector('main');

    if (!mainTag) {
        console.error('Cannot find <main> tag.');
        return;
    }

    const observer = new MutationObserver(mutations => {
        handleDOMChange();
    });

    observer.observe(mainTag, { childList: true, subtree: true });
}

observeMainTagChanges();

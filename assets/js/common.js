document.addEventListener('DOMContentLoaded', async () => {
    // 1. data-component 속성을 가진 모든 요소는 컴포넌트로 간주하고 모으기
    const components = document.querySelectorAll('[data-component]');

    if (!components.length) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '../assets/css/components.css';
    document.head.appendChild(link);

    // 2. 모은 컴포넌트를 순회하면서 렌더링처리하기
    for (const component of components) {
        const componentName = component.dataset.component;
        try {
            const response = await fetch(`/components/${componentName}.html`);
            if (!response.ok) {
                throw new Error(`Failed to fetch ${componentName}.html`);
            }
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const target = doc.querySelector(`${componentName}`);

            // 기존 타겟을 컴포넌트로 교체
            component.replaceWith(target);
        } catch (error) {
            console.error(`Error loading component: ${componentName}`, error);
            component.innerHTML = `<p>Error loading ${componentName}</p>`;
        }
    }
});

const modal = {
    open: openModal,
};

function openModal(
    message,
    agreeMsg,
    disagreeMsg,
    agreeAction = () => alert('수락버튼 눌림'),
    disagreeAction = () => alert('거절버튼 눌림')
) {
    // 이미 모달이 열려있다면 작동 안함
    const existingModal = document.getElementById('commonModal');
    if (existingModal) return;
    // 모달 요소 생성
    const modal = document.createElement('div');
    modal.setAttribute('id', 'commonModal');
    modal.classList.add('modal');
    // 모달 배경 누르면 삭제
    modal.addEventListener('click', (e) => {
        if (e.target === e.currentTarget) modal.remove();
    });

    const container = document.createElement('div');
    container.classList.add('modal__content');

    // 닫기 버튼 생성
    const closeBtn = document.createElement('button');
    closeBtn.setAttribute('type', 'button');
    closeBtn.classList.add('modal__close-button');
    closeBtn.innerHTML = `<img src="../assets/icons/icon-delete.svg" alt="닫기" />`;

    // 닫기 버튼 클릭 시 모달 제거
    closeBtn.addEventListener('click', () => {
        modal.remove();
    });
    const messageElement = document.createElement('p');
    messageElement.classList.add('modal__message');
    messageElement.textContent = message || '문구는 변경됩니다.';

    const buttonGroup = document.createElement('div');
    buttonGroup.classList.add('modal__button-group');

    // 확인 및 취소 버튼 생성
    const cancelButton = document.createElement('button');
    cancelButton.classList.add('modal__button', 'modal__button--cancel');
    cancelButton.setAttribute('type', 'button');
    cancelButton.textContent = disagreeMsg || '아니오';
    cancelButton.addEventListener('click', disagreeAction);

    const confirmButton = document.createElement('button');
    confirmButton.classList.add('modal__button', 'modal__button--confirm');
    confirmButton.setAttribute('type', 'button');
    confirmButton.textContent = agreeMsg || '예';
    confirmButton.addEventListener('click', agreeAction);

    // 추가
    buttonGroup.appendChild(cancelButton);
    buttonGroup.appendChild(confirmButton);

    container.appendChild(closeBtn);
    container.appendChild(messageElement);
    container.appendChild(buttonGroup);

    modal.appendChild(container);
    document.body.appendChild(modal);
}

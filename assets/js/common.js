import { mypageDropdown } from './pages/mypage.js';

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
    mypageDropdown();
});

/**
 * @param {number} count - 현재 장바구니 수량(기본 값: 1)
 * @param {string} type - 모달 타입, login, delete, quantity 중 하나
 * @param {function} confirmAction - confirm 버튼에 바인딩 할 함수
 *
 * @returns
 */
export function openModal({
    count = 1,
    type = 'message',
    confirmAction = () => alert('confirm'),
}) {
    console.log(type);
    // 이미 모달이 열려있다면 작동 안함
    const existingModal = document.getElementById('commonModal');
    if (existingModal) return;
    // 모달 요소 생성
    const modal = document.createElement('div');
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'modal-title');
    modal.classList.add('modal');
    modal.id = 'commonModal';

    // 모달 배경 누르면 삭제
    modal.addEventListener('click', (e) => {
        if (e.target === e.currentTarget) modal.remove();
    });

    // 모달 내용 컨테이너 생성
    const container = document.createElement('div');
    container.classList.add('modal-content', 'modal__quantity');

    // 닫기 버튼 생성
    const closeBtn = document.createElement('button');
    closeBtn.setAttribute('type', 'button');
    closeBtn.setAttribute('aria-label', '닫기');
    closeBtn.classList.add('modal__close-btn');
    closeBtn.innerHTML = `<img src="../assets/icons/icon-delete.svg" alt="" />`;

    // 닫기 버튼 클릭 시 모달 제거
    closeBtn.addEventListener('click', () => {
        modal.remove();
    });

    // TODO:
    // 모달 내용에 따라 다른 구성 요소 생성
    const contentBox = document.createElement('div');

    const actionBox = document.createElement('div');
    actionBox.classList.add('modal__actions');
    const confirmBtn = document.createElement('button');
    const cancelBtn = document.createElement('button');

    confirmBtn.classList.add('btn', 'btn--confirm');
    cancelBtn.classList.add('btn', 'btn--cancel');

    confirmBtn.addEventListener('click', () => {
        confirmAction();
        modal.remove();
    });
    cancelBtn.addEventListener('click', (e) => {
        modal.remove();
    });

    switch (type) {
        case 'quantity':
            container.classList.add('modal__quantity');
            contentBox.classList.add('modal__quantity-con');
            const increaseBtn = document.createElement('button');
            const input = document.createElement('input');
            const decreaseBtn = document.createElement('button');

            decreaseBtn.classList.add('quantity-btn');
            increaseBtn.setAttribute('type', 'button');
            increaseBtn.setAttribute('aria-label', '수량 감소');

            input.setAttribute('type', 'number');
            input.setAttribute('value', '1');
            input.setAttribute('min', '1');
            input.setAttribute('max', '99');
            input.readOnly = true;
            input.setAttribute('aria-label', '수량');
            input.value = count;

            increaseBtn.classList.add('quantity-btn');
            increaseBtn.setAttribute('type', 'button');
            increaseBtn.setAttribute('aria-label', '수량증가');

            increaseBtn.innerHTML = `<img
                                src="./../assets/icons/icon-plus-line.svg"
                                alt=""
                            />`;
            decreaseBtn.innerHTML = `<img
                                src="./../assets/icons/icon-minus-line.svg"
                                alt=""
                            />`;
            decreaseBtn.addEventListener('click', () => {
                if (input.value > 1) input.value--;
            });
            increaseBtn.addEventListener('click', () => {
                if (input.value < 99) input.value++;
            });
            confirmBtn.textContent = '수정';
            cancelBtn.textContent = '취소';

            contentBox.appendChild(decreaseBtn);
            contentBox.appendChild(input);
            contentBox.appendChild(increaseBtn);
            break;

        case 'delete':
            container.classList.add('modal__delete');
            contentBox.classList.add('modal__delete-con');
            contentBox.innerHTML = `<p>상품을 삭제하시겠습니까?</p>`;
            confirmBtn.textContent = '확인';
            cancelBtn.textContent = '취소';
            break;
        case 'login':
            container.classList.add('modal__login-msg');
            contentBox.classList.add('modal__login-msg-con');
            contentBox.innerHTML = `<p>로그인이 필요한 서비스입니다.<br />
                            로그인 하시겠습니까?</p>`;
            confirmBtn.textContent = '예';
            cancelBtn.textContent = '아니오';
            break;

        default:
            console.error(
                '모달의 타입을 확인하세요, login, delete, quantity 중 하나여야 합니다.'
            );
            break;
    }
    container.appendChild(closeBtn);
    container.appendChild(contentBox);
    actionBox.appendChild(cancelBtn);
    actionBox.appendChild(confirmBtn);
    container.appendChild(actionBox);
    modal.appendChild(container);
    document.body.appendChild(modal);
}

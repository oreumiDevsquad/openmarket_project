const modalBg = document.querySelector('.modal');
const modalQuantity = document.querySelector('.modal__quantity');
const modalDelete = document.querySelector('.modal__delete');
const modalLoginMsg = document.querySelector('.modal__login-msg');
const modalCloseBtn = document.querySelector('.modal__close-btn');
const modalCancelBtn = document.querySelector('.btn--cancel');
const modificationBtn = document.querySelector('.btn--modification');
const modalNumInput = document.getElementById('modalInput');

// 장바구니 여러 상품
const cartProducts = document.querySelectorAll('.cart__product');

// 총 상품금액 업데이트
const totalPrice = document.getElementById('totalProduct');

// 1.각 상품의 금액을 저장할 전역변수 객체
const itemPrices = {};

// 2. 총금액을 합산하여 화면에 출력
function updateTotalSum() {
    let totalSum = 0;
    for (const itemId in itemPrices) {
        totalSum += itemPrices[itemId];
    }
    totalPrice.innerHTML = `${totalSum.toLocaleString()}<span>원</span>`;
}

// 각 상품금액 업데이트
function updateIndividualPrice(productItem) {
    const productPrice = document.querySelector('.cart__product-price');
    const productPriceSum = document.querySelector(
        '.cart__product-total-price'
    );
    const controlNumInput = document.querySelector('.quantity-control__input');

    // HTML에 data-id 속성을 추가하여 상품을 식별
    const itemId = productItem.dataset.id || `default_item_${Math.random()}`;

    const productPriceValue = productPrice.textContent.replace(/[^0-9]/g, '');

    individualPrice = Number(modalNumInput.value) * Number(productPriceValue);

    productPriceSum.innerHTML = `${individualPrice.toLocaleString()}원`;

    itemPrices[itemId] = individualPrice;

    updateTotalSum();
}

// 1. 수량 버튼을 클릭했을 때 모달창 나타나기
let currentProductItem; // 현재 모달이 열린 상품을 추적할 변수
function modalOpen(productItem) {
    // 클릭된 상품 정보를 변수에 저장
    currentProductItem = productItem;

    const controlNumInput = productItem.querySelector(
        '.quantity-control__input'
    );

    minusBtn.addEventListener('click', () => {
        modalBg.classList.add('modal-show');
        modalQuantity.classList.add('quantity-show');
    });

    plusBtn.addEventListener('click', () => {
        modalBg.classList.add('modal-show');
        modalQuantity.classList.add('quantity-show');
    });
    modalNumInput.value = controlNumInput.value;

    // 모달 버튼 상태 초기화
    modalPlusBtn.disabled = Number(quantityInput.value) >= 5;
    modalMinusBtn.disabled = Number(quantityInput.value) <= 1;
}

// 모달창 닫기
function closeModal() {
    const handleClose = () => {
        modalBg.classList.remove('modal-show');
        modalQuantity.classList.remove('quantity-show');
    };
    modalCloseBtn.addEventListener('click', handleClose);
    modalCancelBtn.addEventListener('click', handleClose);
}
closeModal();

// 수량변경
function inputQuantity() {
    const modalPlusBtn = document.querySelector('.modal-plus-btn');
    const modalMinusBtn = document.querySelector('.modal-minus-btn');

    // plus 버튼
    let modalInputValue = Number(modalNumInput.value);

    if (modalInputValue <= 1) {
        modalMinusBtn.setAttribute('disabled', 'true');
    }

    modalPlusBtn.addEventListener('click', () => {
        // plus버튼 눌렀을 때 수량 증가
        if (modalInputValue < 5) {
            modalInputValue++;
            modalNumInput.value = modalInputValue;
        }

        // 값이 재고량보다 크면 버튼 비활성화
        if (modalInputValue >= 5) {
            modalPlusBtn.setAttribute('disabled', 'true');
        }

        // 값이 1보다 커지면 마이너스버튼 활성화
        if (modalInputValue > 1) {
            modalMinusBtn.removeAttribute('disabled');
        }
    });

    // minus 버튼
    modalMinusBtn.addEventListener('click', () => {
        // minus버튼 눌렀을 때 수량 감소
        if (modalInputValue > 1) {
            modalInputValue--;
            modalNumInput.value = modalInputValue;
        }

        // 값이 1이면 마이너스 버튼 비활성화
        if (modalInputValue === 1) {
            modalMinusBtn.setAttribute('disabled', 'true');
            console.log('버튼 비활성화!');
        }

        // 값이 재고량보다 작으면 플러스버튼 활성화
        if (modalInputValue < 5) {
            modalPlusBtn.removeAttribute('disabled');
        }
    });
}
inputQuantity();

// 수정버튼을 누르면 수량변경
modificationBtn.addEventListener('click', () => {
    // 모달창의 수량을 장바구니input에 반영
    controlNumInput.value = modalNumInput.value;
    updateIndividualPrice(currentProductItem);

    //

    // 모달창 닫기
    modalBg.classList.remove('modal-show');
    modalQuantity.classList.remove('quantity-show');
});

// 모든 상품에 이벤트리스너 등록
cartProducts.forEach((productItem) => {
    const minusBtn = document.querySelector('.quantity-control__minus-btn');
    const plusBtn = document.querySelector('.quantity-control__plus-btn');

    minusBtn.addEventListener('click', () => {
        openModal(productItem);
    });
    plusBtn.addEventListener('click', () => {
        openModal(productItem);
    });
    // 페이지 로드 시 초기 금액 설정
    updateIndividualPrice(productItem);
});

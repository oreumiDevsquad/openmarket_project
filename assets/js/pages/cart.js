const modalBg = document.querySelector('.modal');
const modalPlusBtn = document.querySelector('.modal-plus-btn');
const modalMinusBtn = document.querySelector('.modal-minus-btn');
const modalQuantity = document.querySelector('.modal__quantity');
const modalDelete = document.querySelector('.modal__delete');
const modalLoginMsg = document.querySelector('.modal__login-msg');
const modificationBtn = document.querySelector('.btn--modification');
const modalNumInput = document.getElementById('modalInput');
const confirmBtn = document.querySelector('.delete-confirm-btn');
const checkAllBox = document.getElementById('productCheckAll');
// const modalCloseBtn = document.querySelector('.modal__close-btn');
// const modalCancelBtn = document.querySelector('.btn--cancel');
const allModalCloseBtns = document.querySelectorAll(
    '.modal__close-btn, .btn--cancel'
);

// 장바구니 여러 상품
const cartProducts = document.querySelectorAll('.cart__product');

// 총 상품금액 업데이트
const totalPrice = document.getElementById('totalProduct');
const finalAmount = document.getElementById('finalPrice');
const discount = document.getElementById('productDiscout');
const deliveryFee = document.getElementById('deliveryFee');

// 개별상품 삭제 버튼
const deleteBtn = document.querySelector('.cart__delete-btn');
let productToDelete = null;

// 각 상품별 총금액 저장
const itemPrices = {};

// 현재 모달이 열린 상품을 추적할 변수
let currentProductItem;
let currentControlInput;

//// 각 상품금액 업데이트 ////
function updateIndividualPrice(productItem) {
    const productPrice = productItem.querySelector('.cart__product-price');
    const productPriceSum = productItem.querySelector(
        '.cart__product-total-price'
    );
    const controlNumInput = productItem.querySelector(
        '.quantity-control__input'
    );

    // HTML에 data-id 속성을 추가하여 상품을 식별
    const hasDataId = productItem.dataset.id;
    const arrayIndex = Array.from(cartProducts).indexOf(productItem);
    const generatedId = `item_${arrayIndex}`;
    const itemId = hasDataId || generatedId;
    const productPriceValue = productPrice.textContent.replace(/[^0-9]/g, '');

    // 총 상품금액 text 변경
    individualPrice = Number(controlNumInput.value) * Number(productPriceValue);
    productPriceSum.innerHTML = `${individualPrice.toLocaleString()}원`;
    itemPrices[itemId] = individualPrice;

    // 전체 총합 업데이트
    updateTotalSum();
    finalPrice();
}

//// 총금액을 합산하여 화면에 출력 ////
function updateTotalSum() {
    let totalSum = 0;

    // 모든 상품을 순회하면서 체크된 항목만 합산
    cartProducts.forEach((productItem) => {
        const checkbox = productItem.querySelector(
            '.cart__product-checkbox input'
        );
        const itemId =
            productItem.dataset.id ||
            `item_${Array.from(cartProducts).indexOf(productItem)}`;

        // 체크박스가 체크되어 있고, 해당 상품의 가격이 존재하면 합산
        if (checkbox && checkbox.checked && itemPrices[itemId]) {
            totalSum += itemPrices[itemId];
        }
    });

    totalPrice.innerHTML = `${totalSum.toLocaleString()}<span>원</span>`;
}

//// 결제예정금액 업데이트 ////
function finalPrice() {
    const totalPriceNum = Number(totalPrice.textContent.replace(/[^0-9]/g, ''));
    const discountNum = Number(discount.textContent.replace(/[^0-9]/g, ''));
    const deliveryFeeNum = Number(
        deliveryFee.textContent.replace(/[^0-9]/g, '')
    );

    // 총상품금액 + 상품할인 + 배송비
    const finalTotalPrice = totalPriceNum + deliveryFeeNum - discountNum;

    finalAmount.innerHTML = `${finalTotalPrice.toLocaleString()}<span>원</span>`;
}

//// 체크박스 전체 선택 & 해제 ////
function handleCheckAll() {
    const isChecked = checkAllBox.checked;

    // 모든 개별 체크박스 상태를 전체 선택상태와 동일하게 설정
    cartProducts.forEach((productItem) => {
        const checkbox = productItem.querySelector(
            '.cart__product-checkbox input'
        );

        if (checkbox) {
            checkbox.checked = isChecked;
        }
    });

    // 총금액 업데이트
    updateTotalSum();
    finalPrice();
}

// 개별 체크박스 상태 변경 시 전체 선택 상태 업데이트 //
function updateCheckAllState() {
    const individualCheckboxes = document.querySelectorAll(
        '.cart__product .cart__product-checkbox input'
    );
    const checkedCount = document.querySelectorAll(
        '.cart__product .cart__product-checkbox input:checked'
    ).length;
    const totalCount = individualCheckboxes.length;

    if (checkedCount === 0) {
        // 아무것도 선택되지 않음
        checkAllBox.checked = false;
        checkAllBox.indeterminate = false;
    } else if (checkedCount === totalCount) {
        // 모두 선택됨
        checkAllBox.checked = true;
        checkAllBox.indeterminate = false;
    } else {
        // 일부 선택됨
        checkAllBox.checked = false;
        checkAllBox.indeterminate = true;
    }
}

// 개별 체크박스 이벤트 실행 //
function handleIndividualCheck() {
    updateCheckAllState();
    updateTotalSum();
    finalPrice();
}

//// 개별 상품 삭제 ////
// 닫기 버튼 누르면 삭제모달 표시
function openDeleteModal(productItem) {
    productToDelete = productItem;
    modalBg.classList.add('modal-show');
    modalDelete.classList.add('delete-show');
}
// 상품 삭제 확인
function confirmDelete() {
    // 삭제할 상품이 없으면 함수 종료
    if (!productToDelete) return;

    // itemPrices에서 해당 상품 제거
    const itemId =
        productToDelete.dataset.id ||
        `item_${Array.from(cartProducts).indexOf(productToDelete)}`;

    if (itemPrices[itemId]) {
        delete itemPrices[itemId];
    }

    // DOM에서 제거
    productToDelete.remove();

    // 금액 업데이트
    updateTotalSum(); // 총 상품금액
    finalPrice(); // 최종 결제금액 (배송비, 할인 포함)

    // 빈 장바구니 체크
    checkEmptyCart();

    // 정리 작업
    productToDelete = null;
    closeModal();
    console.log('삭제 완료!');
}

// 빈 장바구니 체크 //
function checkEmptyCart() {
    const remainingProducts = document.querySelectorAll('.cart__product');
    const emptyMessage = document.querySelector('.cart__empty');
    const footerTable = document.querySelector('.cart__footer-table');
    const orderBtn = document.querySelector('.cart__order-all-btn');

    if (remainingProducts.length === 0) {
        // 빈 장바구니 메시지 표시
        emptyMessage.style.display = 'table-row';

        // 푸터와 주문 버튼 숨기기
        footerTable.style.display = 'none';
        orderBtn.style.display = 'none';

        // 총 금액들을 0으로 설정
        totalPrice.innerHTML = '0<span>원</span>';
        finalAmount.innerHTML = '0<span>원</span>';
    }
}

//// 모달 버튼 상태 업데이트 ////
function updateModalBtn() {
    const currentValue = Number(modalNumInput.value);
    modalPlusBtn.disabled = currentValue >= 10;
    modalMinusBtn.disabled = currentValue <= 1;
}

//// 수량 버튼을 클릭했을 때 모달창 열기 ////
function openModal(productItem) {
    // 클릭된 상품 정보를 변수에 저장
    currentProductItem = productItem;
    currentControlInput = productItem.querySelector('.quantity-control__input');

    // 모달에 현재 수량 설정
    modalNumInput.value = currentControlInput.value;

    // 모달표시
    modalBg.classList.add('modal-show');
    modalQuantity.classList.add('quantity-show');

    // 모달 버튼 상태 초기화
    updateModalBtn();
}

//// 모달창 닫기 ////
function closeModal() {
    modalBg.classList.remove('modal-show');
    modalQuantity.classList.remove('quantity-show');
    modalDelete.classList.remove('delete-show');
    modalLoginMsg.classList.remove('login-msg-show');
}
// 모달창 닫기 이벤트리스너
function closeEvents() {
    allModalCloseBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            if (modalQuantity.classList.contains('quantity-show')) {
                closeModal(); // 수량 모달 닫기
            } else if (modalDelete.classList.contains('delete-show')) {
                productToDelete = null; // 삭제 모달 닫기
                closeModal();
            }
        });
    });
}

//// 수량변경 ////
// Plus 버튼
function modalIncreaseBtn() {
    let modalInputValue = Number(modalNumInput.value);

    if (modalInputValue < 10) {
        modalInputValue++;
        modalNumInput.value = modalInputValue;
        updateModalBtn();
    }
}
// minus 버튼
function modalDecreaseBtn() {
    let modalInputValue = Number(modalNumInput.value);

    if (modalInputValue > 1) {
        modalInputValue--;
        modalNumInput.value = modalInputValue;
        updateModalBtn();
    }
}

function ModalQuantityBtnEvents() {
    modalPlusBtn.addEventListener('click', modalIncreaseBtn);
    modalMinusBtn.addEventListener('click', modalDecreaseBtn);
}

////////////////////////////////////////////////////////////////////////////

// 수정버튼을 누르면 수량변경
function modification() {
    // 모달창의 수량을 장바구니input에 반영
    currentControlInput.value = modalNumInput.value;

    // 개별상품 금액 다시 계산
    updateIndividualPrice(currentProductItem);

    // 모달창 닫기
    closeModal();
}
modificationBtn.addEventListener('click', modification);

// 삭제 확인 버튼 이벤트 등록
if (confirmBtn) {
    confirmBtn.addEventListener('click', confirmDelete);
}

// 전체 선택 체크박스 이벤트 등록
if (checkAllBox) {
    checkAllBox.addEventListener('change', handleCheckAll);
}

// 모든 상품에 이벤트리스너 등록
cartProducts.forEach((productItem, index) => {
    // 각 상품별 고유 ID 설정
    if (!productItem.dataset.id) {
        productItem.dataset.id = `item_${index}`;
    }
    const minusBtn = productItem.querySelector('.quantity-control__minus-btn');
    const plusBtn = productItem.querySelector('.quantity-control__plus-btn');
    const deleteBtn = productItem.querySelector('.cart__delete-btn');

    // 개별 체크박스 이벤트 등록
    const checkbox = productItem.querySelector('.cart__product-checkbox input');
    if (checkbox) {
        checkbox.addEventListener('change', handleIndividualCheck);
    }

    // 삭제 버튼 추가
    if (minusBtn) {
        minusBtn.addEventListener('click', () => {
            openModal(productItem);
        });
    }
    if (plusBtn) {
        plusBtn.addEventListener('click', () => {
            openModal(productItem);
        });
    }

    // 삭제 버튼 이벤트 등록
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => openDeleteModal(productItem));
    }
    // 페이지 로드 시 초기 금액 설정
    updateIndividualPrice(productItem);
    confirmDelete(productItem);
});

closeEvents();
ModalQuantityBtnEvents();

// 페이지 로드시 전체상품체크박스 선택
if (checkAllBox) {
    checkAllBox.checked = true; // 전체 선택 체크박스 체크
    handleCheckAll(); // 전체 선택 함수 실행
}

// 페이지 로드 시 초기 체크 상태 확인
updateCheckAllState();

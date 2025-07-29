import { AuthAPI } from './../auth.js';
import { openModal } from './../common.js';
import { formatPrice } from '../utils.js';

const $checkAllBox = document.getElementById('productCheckAll');
// 장바구니 여러 상품
const getCartProducts = () => document.querySelectorAll('.cart__product');
// 총 상품금액 업데이트
const $totalPrice = document.getElementById('totalProduct');
const $finalAmount = document.getElementById('finalPrice');
const $discount = document.getElementById('productDiscout');
const $deliveryFee = document.getElementById('deliveryFee');

// 개별상품 삭제 버튼
let productToDelete = null;

// 각 상품별 총금액 저장
const itemPrices = {};

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
    const itemId = productItem.dataset.id;
    const productPriceValue = productPrice.textContent.replace(/[^0-9]/g, '');

    // 총 상품금액 text 변경
    const individualPrice =
        Number(controlNumInput.value) * Number(productPriceValue);
    productPriceSum.innerHTML = `${individualPrice.toLocaleString()}원`;
    itemPrices[itemId] = individualPrice;

    // 전체 총합 업데이트
    updateTotalSum();
    finalPrice();
}

//// 총금액을 합산하여 화면에 출력 ////
function updateTotalSum() {
    let totalSum = 0;

    // 동적으로 cartProducts를 가져와서 사용
    const cartProducts = getCartProducts();

    // 모든 상품을 순회하면서 체크된 항목만 합산
    cartProducts.forEach((productItem) => {
        const $checkbox = productItem.querySelector(
            '.cart__product-checkbox input'
        );
        const itemId = productItem.dataset.id;

        // 체크박스가 체크되어 있고, 해당 상품의 가격이 존재하면 합산
        if ($checkbox && $checkbox.checked && itemPrices[itemId]) {
            totalSum += itemPrices[itemId];
        }
    });

    $totalPrice.innerHTML = `${totalSum.toLocaleString()}<span>원</span>`;
}

//// 결제예정금액 업데이트 ////
function finalPrice() {
    const totalPriceNum = Number(
        $totalPrice.textContent.replace(/[^0-9]/g, '')
    );
    const discountNum = Number($discount.textContent.replace(/[^0-9]/g, ''));
    const deliveryFeeNum = Number(
        $deliveryFee.textContent.replace(/[^0-9]/g, '')
    );

    // 총상품금액 + 상품할인 + 배송비
    const finalTotalPrice = totalPriceNum + deliveryFeeNum - discountNum;

    $finalAmount.innerHTML = `${finalTotalPrice.toLocaleString()}<span>원</span>`;
}

//// 체크박스 전체 선택 & 해제 ////
function handleCheckAll() {
    const isChecked = $checkAllBox.checked;
    // 동적으로 cartProducts를 가져와서 사용
    const cartProducts = getCartProducts();

    // 모든 개별 체크박스 상태를 전체 선택상태와 동일하게 설정
    cartProducts.forEach((productItem) => {
        const $checkbox = productItem.querySelector(
            '.cart__product-checkbox input'
        );

        if ($checkbox) {
            $checkbox.checked = isChecked;
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
        $checkAllBox.checked = false;
        $checkAllBox.indeterminate = false;
    } else if (checkedCount === totalCount) {
        // 모두 선택됨
        $checkAllBox.checked = true;
        $checkAllBox.indeterminate = false;
    } else {
        // 일부 선택됨
        $checkAllBox.checked = false;
        $checkAllBox.indeterminate = true;
    }
}

// 실험적 체크리스트만 모아보는 함수
function getCheckedProductList() {
    const $checkedProductList = document.querySelectorAll(
        'input[type=checkbox]:checked'
    );
    console.log($checkedProductList);
}

// 개별 체크박스 이벤트 실행 //
function handleIndividualCheck() {
    updateCheckAllState();
    updateTotalSum();
    finalPrice();
}

//// 수량 버튼을 클릭했을 때 모달창 열기 ////
function openQuantityModal(productItem) {
    const controlInput = productItem.querySelector('.quantity-control__input');

    // 클로저로 productItem과 controlInput을 캡처하는 함수 생성
    const modifyQuantityForThisProduct = async (count) => {
        if (controlInput) {
            // 모달창의 수량을 해당 상품의 input에 반영
            controlInput.value = count;

            try {
                const response = await AuthAPI.editCartItem(
                    productItem.dataset.cartId,
                    count
                );

                console.log(response);
            } catch (error) {
                console.error(error);
            }

            // 해당 상품의 금액 다시 계산
            updateIndividualPrice(productItem);
        }
    };

    // common.js의 openModal 사용
    openModal({
        count: Number(controlInput.value),
        type: 'quantity',
        confirmAction: modifyQuantityForThisProduct,
    });
}

//// 개별 상품 삭제 ////
// 닫기 버튼 누르면 삭제모달 표시
function openDeleteModal(productItem) {
    productToDelete = productItem;

    // common.js의 openModal 사용
    openModal({
        type: 'delete',
        confirmAction: confirmDelete,
    });
}
// 상품 삭제 확인
async function confirmDelete() {
    // 삭제할 상품이 없으면 함수 종료
    if (!productToDelete) return;

    // itemPrices에서 해당 상품 제거
    try {
        const response = await AuthAPI.deleteCartItem(
            productToDelete.dataset.cartId
        );
        console.log(response);

        renderList();
        return;
    } catch (error) {
        console.error('error:', error);
    }

    console.log(itemId);
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
        $totalPrice.innerHTML = '0<span>원</span>';
        $finalAmount.innerHTML = '0<span>원</span>';
    }
}
// 동적으로 생성된 상품들에 이벤트 리스너를 등록하는 함수
function initializeCartEvents() {
    const cartProducts = getCartProducts();

    // 전체 선택 체크박스 이벤트 등록
    if ($checkAllBox) {
        $checkAllBox.addEventListener('change', handleCheckAll);
    }

    // 모든 상품에 이벤트리스너 등록
    cartProducts.forEach((productItem) => {
        const minusBtn = productItem.querySelector(
            '.quantity-control__minus-btn'
        );
        const plusBtn = productItem.querySelector(
            '.quantity-control__plus-btn'
        );
        const deleteBtn = productItem.querySelector('.cart__delete-btn');

        // 개별 체크박스 이벤트 등록
        const $checkbox = productItem.querySelector(
            '.cart__product-checkbox input'
        );
        if ($checkbox) {
            $checkbox.addEventListener('change', handleIndividualCheck);
        }

        // 수량 버튼 이벤트 등록
        if (minusBtn) {
            minusBtn.addEventListener('click', () => {
                openQuantityModal(productItem);
            });
        }
        if (plusBtn) {
            plusBtn.addEventListener('click', () => {
                openQuantityModal(productItem);
            });
        }

        // 삭제 버튼 이벤트 등록
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () =>
                openDeleteModal(productItem)
            );
        }
        // 페이지 로드 시 초기 금액 설정
        updateIndividualPrice(productItem);
    });

    // 전체 선택 체크박스 상태 업데이트
    updateCheckAllState();

    // 페이지 로드시 전체상품체크박스 선택
    if ($checkAllBox && cartProducts.length > 0) {
        $checkAllBox.checked = true; // 전체 선택 체크박스 체크
        handleCheckAll(); // 전체 선택 함수 실행
    }
}

// 렌더링하는 부분
// 페이지 접속 시 첫 렌더링은 즉시 실행 함수로 수행
(async () => {
    renderList();
})();

// 렌더링 함수
async function renderList() {
    const $productWrapper = document.querySelector('.cart__body');
    const productIds = [];
    try {
        // 기존 하드코딩된 상품들 제거 (빈 장바구니 메시지 제외)
        const existingProducts =
            $productWrapper.querySelectorAll('.cart__product');
        existingProducts.forEach((product) => product.remove());

        const response = await AuthAPI.getCartList();
        const frag = document.createDocumentFragment();

        console.log(response.results);
        console.log(response);

        for (let cartItem of response.results) {
            const $tr = document.createElement('tr');
            const product = cartItem.product;
            productIds.push(product.id);
            $tr.classList.add('cart__product');

            $tr.dataset.id = product.id;

            $tr.innerHTML = `<td class="cart__product-checkbox">
                                <label for="productCheck1" class="sr-only"
                                    >${product.name} 선택</label
                                >
                                <input type="checkbox" id="productCheck${product.id}" />
                            </td>
                            <td class="cart__product-details">
                                <img
                                    src="${product.image}"
                                    alt="${product.name}"
                                />

                                <div class="cart__product-info">
                                    <div class="cart__product-wapper">
                                        <p class="cart__product-brand">
                                            ${product.seller.store_name}
                                        </p>
                                        <h3 class="cart__product-title">
                                            ${product.name}
                                        </h3>
                                        <p class="cart__product-price">
                                        ${product.price.toLocaleString()}원
                                        </p>
                                    </div>
                                    <p class="cart__product-delivery">
                                        택배배송 / &nbsp;
                                        ${product.shipping_fee > 0 ? `${formatPrice(product.shipping_fee)}원` : '무료배송'}
                                    </p>
                                </div>
                            </td>
                            <td class="cart__quantity">
                                <div class="cart__quantity-control">
                                    <button
                                        type="button"
                                        class="quantity-control__minus-btn"
                                        aria-label="수량 감소"
                                    >
                                        <img
                                            src="./../assets/icons/icon-minus-line.svg"
                                            alt=""
                                        />
                                    </button>
                                    <input
                                        type="number"
                                        value="${cartItem.quantity || 1}"
                                        min="1"
                                        max="99"
                                        class="quantity-control__input"
                                        aria-label="상품 수량"
                                        readonly
                                    />
                                    <button
                                        type="button"
                                        class="quantity-control__plus-btn"
                                        aria-label="수량 증가"
                                    >
                                        <img
                                            src="./../assets/icons/icon-plus-line.svg"
                                            alt=""
                                        />
                                    </button>
                                </div>
                            </td>
                            <td class="cart__product-order">
                                <button
                                    type="button"
                                    class="cart__delete-btn"
                                    aria-label="상품 삭제"
                                >
                                    <img
                                        src="./../assets/icons/icon-delete.svg"
                                        alt=""
                                    />
                                </button>

                                <p class="cart__product-total-price">
                                ${(product.price * (cartItem.quantity || 1)).toLocaleString()}원
                                </p>
                                <button
                                    type="button"
                                    class="cart__product-order-btn"
                                    aria-label="개별 상품 주문"
                                >
                                    주문하기
                                </button>
                            </td>`;

            $tr.dataset.cartId = cartItem.id;
            frag.appendChild($tr);
        }

        // DOM에 추가
        $productWrapper.appendChild(frag);

        // 빈 장바구니 메시지 숨기기
        const $emptyMessage = document.querySelector('.cart__empty');
        if ($emptyMessage && response.results.length > 0) {
            $emptyMessage.style.display = 'none';
        }

        // 렌더링 완료 후 이벤트 초기화
        initializeCartEvents();
    } catch (error) {
        console.error('장바구니 데이터 로딩 실패:', error);
        // 에러 발생 시 빈 장바구니 상태 표시
        checkEmptyCart();
    }

    // 모든 주문 오더
    const $allOrderBtn = document.querySelector('.cart__order-all-btn');

    console.log($allOrderBtn);

    $allOrderBtn.addEventListener('click', (e) => {
        const allOrderInfo = {
            order_type: 'cart_order',
            cart_items: [...productIds],
        };
        localStorage.setItem('order_info', JSON.stringify(allOrderInfo));
        window.location = '/pages/payment.html';
    });
}

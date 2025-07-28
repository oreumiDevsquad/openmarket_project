import { AuthAPI } from '../auth.js';
import { formatPrice } from '../utils.js';
(async () => {
    // 페이지 접속 시 한 번만 실행하는 장바구니 목록 불러오기라서 즉시 실행함수 사용
    const $orderListTbody = document.querySelector('.order-list__table tbody');
    const $totalPrice = document.querySelector('.order-list__total-price span');

    const myCartData = await AuthAPI.getCartList();
    const myCartList = myCartData.results;

    let totalPrice = 0;

    const frag = document.createDocumentFragment();

    myCartList.forEach(async (item) => {
        const tr = document.createElement('tr');
        const amount = item.product.price * item.quantity;
        const shipping_fee = item.product.shipping_fee;
        totalPrice += shipping_fee + amount;
        tr.innerHTML = `<td class="order-list__product-info">
                                <div class="order-list__item">
                                    <img
                                        src="${item.product.image}"
                                        alt="${item.product.info}"
                                        class="order-list__image"
                                    />
                                    <div class="order-list__details">
                                        <p class="order-list__brand">
                                            ${item.product.seller.store_name}
                                        </p>
                                        <h4 class="order-list__name">
                                            ${item.product.info}
                                        </h4>
                                        <p class="order-list__quantity">
                                            수량: ${item.quantity}개
                                        </p>
                                    </div>
                                </div>
                            </td>
                            <td class="order-list__discount">
                                <div class="order-list__wrapper">
                                    <span class="order-list__discount-value"
                                        >-</span
                                    >
                                </div>
                            </td>
                            <td class="order-list__shipping">
                                <div class="order-list__wrapper">
                                    <span class="order-list__shipping-value"
                                        >${shipping_fee > 0 ? formatPrice(shipping_fee) + '원' : '무료배송'}</span
                                    >
                                </div>
                            </td>
                            <td class="order-list__amount">
                                <div class="order-list__wrapper">
                                    <strong class="order-list__price"
                                        >${formatPrice(amount + shipping_fee)}원</strong
                                    >
                                </div>
                            </td>`;

        frag.appendChild(tr);
    });

    $orderListTbody.appendChild(frag);
    $totalPrice.textContent = formatPrice(totalPrice) + '원';
})();

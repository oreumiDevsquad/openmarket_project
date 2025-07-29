import { AuthAPI } from '../auth.js';
import { formatPrice } from '../utils.js';
(async () => {
    // 페이지 접속 시 한 번만 실행하는 장바구니 목록 불러오기라서 즉시 실행함수 사용
    const $orderListTbody = document.querySelector('.order-list__table tbody');
    const $totalPrice = document.querySelector('.order-list__total-price span');
    const $summaryContainer = document.querySelector('.order-summary');
    const $summaryProductPrice =
        $summaryContainer.querySelector('#productPrice');
    const $summaryDiscount = $summaryContainer.querySelector('#discount');
    const $summaryShippingFee = $summaryContainer.querySelector('#fee');
    const $summaryTotal = $summaryContainer.querySelector('#total');

    const myCartData = await AuthAPI.getCartList();
    const myCartList = myCartData.results;

    const productIds = [];

    const total = {
        amount: 0,
        sale: 0,
        fee: 0,
        price: 0,
    };

    const frag = document.createDocumentFragment();

    myCartList.forEach((item) => {
        const tr = document.createElement('tr');
        const amount = item.product.price * item.quantity;
        const shipping_fee = item.product.shipping_fee;
        productIds.push(item.product.id);

        total.amount += amount;
        total.fee += shipping_fee;
        total.price += shipping_fee + amount;

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
                                        >${formatPrice(amount)}원</strong
                                    >
                                </div>
                            </td>`;

        frag.appendChild(tr);
    });

    $orderListTbody.appendChild(frag);
    $totalPrice.textContent = formatPrice(total.price) + '원';

    $summaryProductPrice.textContent = formatPrice(total.amount);
    $summaryDiscount.textContent = formatPrice(total.sale);
    $summaryShippingFee.textContent = formatPrice(total.fee);
    $summaryTotal.textContent = formatPrice(total.price);

    const $form = document.querySelector('.order-form form');
    const $requiredInputs = $form.querySelectorAll(
        'input:not([type=button], [type=submit])'
    );
    const $radioGroup = $form.querySelectorAll(
        `input[type=radio][name="payment"]`
    );
    const $submitBtn = $form.querySelector('.order-summary__submit');

    // 모든 입력 여부 체크
    $form.addEventListener('input', (e) => {
        const target = e.target;

        //전화번호에는 숫자만 입력받기
        if (target.name.includes('phone')) {
            target.value = target.value.replace(/[^0-9]/g, '');
        }

        const formData = new FormData($form);
        let isComplete = true;
        let checkedRadio = false;

        for (const $input of $requiredInputs) {
            const name = $input.name;

            if (name === 'delivery-message') continue;

            if (!checkedRadio && $input.type === 'radio') {
                const checked = [...$radioGroup].some((radio) => radio.checked);
                if (!checked) {
                    isComplete = false;
                    break;
                }
            } else if ($input.type === 'checkbox') {
                if (!$input.checked) {
                    isComplete = false;
                    break;
                }
            } else {
                const value = formData.get(name);
                if (!value) {
                    isComplete = false;
                    break;
                }
            }
        }

        $submitBtn.disabled = !isComplete;
    });
    $form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData($form);
        for (let [key, value] of formData) {
            console.log(key, value);
        }
        const $payment = $form.querySelector(
            'input[type=radio][name="payment"]:checked'
        );
        const payment = $payment.id.toLowerCase();

        const receiverPhonNumber = [1, 2, 3]
            .map((i) => formData.get(`recipient-phone-${i}`))
            .join('');

        console.log(receiverPhonNumber);
        const receiverAddress =
            formData.get('postal-address') +
            [1, 2].map((i) => formData.get(`street-address-${i}`)).join('\n');
        const orderForm = {
            order_type: 'cart_order',
            cart_items: [...productIds],
            total_price: total.price,
            receiver: formData.get('recipient-name'),
            receiver_phone_number: receiverPhonNumber,
            address: receiverAddress,
            address_message: formData.get('delivery-message') || null,
            payment_method: payment,
        };

        try {
            // 결제 진행
            const response = await AuthAPI.cartOrder(orderForm);
            console.log(response);
            if (response.order_status === 'payment_complete') {
                window.location('/');
            } else {
                throw new Error();
            }
        } catch (error) {
            console.error('error:', error);
        }
    });
})();

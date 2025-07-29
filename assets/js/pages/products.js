// Scripts for product-related pages
import { API } from '../api.js';
import { formatPrice, calculatePrice } from '../utils.js';
import { AuthAPI } from '../auth.js';
import { openModal } from '../common.js';

// 상품 렌더링
(async () => {
    // 변수 선언
    const products = await API.getProducts();
    console.log('test', products);
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    const id = Number(productId);
    // 전달 받은 ID로 해당 상품 찾기
    const targetProduct = products.results.find((product) => product.id === id);

    // 요소 변수 선언
    const $image = document.querySelector('.product-detail__image');
    const $sellerStore = document.querySelector('.product-detail__seller-name');
    const $productName = document.querySelector('.product-detail__name');
    const $price = document.querySelector('.product-detail__price');

    // 총 상품 금액 및 총 수량 변수
    const $totalQuantity = document.querySelector('.quantity__input');
    const $totalPriceSection = document.querySelector('.total-section__price');

    // 가격 및 포맷 적용
    console.log(targetProduct);
    const format = formatPrice(targetProduct.price);
    const totalPrice = calculatePrice(
        targetProduct.price,
        $totalQuantity.value
    );
    const totalFormat = formatPrice(totalPrice);

    // id와 일치상품 렌더링
    $image.setAttribute('src', `${targetProduct.image}`);
    $image.classList.remove('hide');

    $sellerStore.textContent = targetProduct.seller.store_name;
    $productName.textContent = targetProduct.name;
    $price.textContent = format;
    $totalPriceSection.textContent = totalFormat;

    const $plusBtn = document.querySelector('.quantity__button--plus');
    const $minusBtn = document.querySelector('.quantity__button--minus');
    const $totalQuantityLabel = document.querySelector(
        '.total-section__quantity-value'
    );
    const $directBuyBtn = document.querySelector(
        '.product-detail__button--primary'
    );
    const $cartBtn = document.querySelector(
        '.product-detail__button--secondary'
    );

    // 상품의 재고 가져오기
    const stock = targetProduct.stock;

    // 상품의 총 금액 계산
    function updateTotalPrice() {
        const quantity = parseInt($totalQuantity.value);
        const totalPrice = calculatePrice(targetProduct.price, quantity);
        const totalFormat = formatPrice(totalPrice);
        $totalPriceSection.textContent = totalFormat;
        $totalQuantityLabel.textContent = quantity;
    }

    // 버튼 클릭시 수량 변경, 비활성화
    $plusBtn.addEventListener('click', () => {
        let currentQuantity = parseInt($totalQuantity.value);
        if (currentQuantity < stock) {
            currentQuantity++;
            $totalQuantity.value = currentQuantity;
            updateTotalPrice();
        }

        if (currentQuantity >= stock) {
            openModal({
                type: 'stock_exceeded',
                confirmAction: () => {},
            });
            return;
        }

        if ($totalQuantity.value == stock) {
            $plusBtn.disabled = true;
        }
    });

    $minusBtn.addEventListener('click', () => {
        let currentQuantity = parseInt($totalQuantity.value);
        if (currentQuantity > 1) {
            currentQuantity--;
            $totalQuantity.value = currentQuantity;
            updateTotalPrice();
            $plusBtn.disabled = false;
        }
    });

    $directBuyBtn.addEventListener('click', async () => {
        const isLoggedIn = AuthAPI.isLoggedIn();

        if (!isLoggedIn) {
            console.error('로그인 필요');
            openModal({
                type: 'login',
                confirmAction: () => {
                    window.location = '/pages/login.html';
                },
            });
        } else {
            const quantity = parseInt($totalQuantity.value);
            const orderInfo = {
                order_type: 'direct_order',
                product: id,
                quantity: quantity,
                total_price: totalPrice,
            };
            localStorage.setItem('order_info', JSON.stringify(orderInfo));
            window.location = '/pages/payment.html';
        }
    });

    // 장바구니 담기, 중복 선택 방지
    $cartBtn.addEventListener('click', async () => {
        const isLoggedIn = AuthAPI.isLoggedIn();

        if (isLoggedIn) {
            try {
                const cartItems = await AuthAPI.getCartList();
                let isproduct = false;
                for (const item of cartItems.results) {
                    if (item.product_id === id) {
                        isproduct = true;
                        break;
                    }
                }
                if (isproduct) {
                    openModal({
                        type: 'duplicate_item',
                        confirmAction: () => {
                            window.location = '/pages/cart.html';
                        },
                    });
                } else {
                    const data = {
                        product_id: id,
                        quantity: parseInt($totalQuantity.value),
                    };
                    await AuthAPI.addCartItem(data);
                    openModal({
                        type: 'alertAddCart',
                        confirmAction: () => {},
                    });
                }
            } catch (error) {
                console.error('장바구니 처리 오류 발생:', error);
                openModal({
                    type: 'stock_exceeded',
                    confirmAction: () => {},
                });
            }
        } else {
            console.error('로그인 필요');
            openModal({
                type: 'login',
                confirmAction: () => {
                    window.location = '/pages/login.html';
                },
            });
        }
    });
})();

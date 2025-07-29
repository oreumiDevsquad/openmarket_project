// Scripts for product-related pages
import { API } from '../api.js';
import { formatPrice, calculatePrice } from '../utils.js';
import { AuthAPI } from `../auth.js`;

// 상품 렌더링
(async () => {
    // 변수 선언
    const products = await API.getProducts();
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
    const format = formatPrice(targetProduct.price);
    const totalPrice = calculatePrice(
        targetProduct.price,
        $totalQuantity.value
    );
    const totalFormat = formatPrice(totalPrice);

    // id와 일치상품 렌더링
    $image.setAttribute('src', `${targetProduct.image}`);
    $sellerStore.textContent = targetProduct.seller.store_name;
    $productName.textContent = targetProduct.name;
    $price.textContent = format;
    $totalPriceSection.textContent = totalFormat;

    const $plusBtn = document.querySelector('.quantity__button--plus');
    const $minusBtn = document.querySelector('.quantity__button--minus');
    const $totalQuantityLabel = document.querySelector('total-section__quantity-value');
    const $cartBtn = document.querySelector('product-detail__button--secondary');

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

    $plusBtn.addEventListener('click', () => {
        let currentQuantity = parseInt($totalQuantity.value);
        if (currentQuantity < stock) {
            currentQuantity++;
            $totalQuantity.value = currentQuantity;
            updateTotalPrice();
        }

        if ($totalQuantity.value == stock) {
            $plusBtn.disabled = true;
        }
    })

    $minusBtn.addEventListener('click', () => {
        let currentQuantity = parseInt($totalQuantity.value);
        if (currentQuantity > 1) {
            currentQuantity--;
            $totalQuantity.value = currentQuantity;
            updateTotalPrice();
            $minusBtn.disabled = false;
        }
    })

    $cartBtn.addEventListener('click', async () => {
        try {
            
        } catch (error) {
            
        }
    })

})();

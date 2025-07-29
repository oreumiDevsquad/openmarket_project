// Scripts for product-related pages
import { API } from '../api.js';
import { formatPrice, calculatePrice } from '../utils.js';

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
    const image = document.querySelector('.product-detail__image');
    const sellerStore = document.querySelector('.product-detail__seller-name');
    const productName = document.querySelector('.product-detail__name');
    const price = document.querySelector('.product-detail__price');

    // 총 상품 금액 및 총 수량 변수
    const $totalQuantity = document.querySelector('.quantity__input');
    // 수량 -> 어떻게 불러오지?
    const totalPriceSection = document.querySelector('.total-section__price');

    // 가격 및 포맷 적용
    const format = formatPrice(targetProduct.price);
    const totalPrice = calculatePrice(
        targetProduct.price,
        $totalQuantity.value
    );
    const totalFormat = formatPrice(totalPrice);

    // id와 일치상품 렌더링
    image.setAttribute('src', `${targetProduct.image}`);
    sellerStore.textContent = targetProduct.seller.store_name;
    productName.textContent = targetProduct.name;
    price.textContent = format;
    totalPriceSection.textContent = totalFormat;
})();

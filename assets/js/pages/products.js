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
    const sellerName = document.querySelector('.product-detail__seller-name');
    const productName = document.querySelector('.product-detail__name');
    const price = document.querySelector('.product-detail__price');

    // 총 상품 금액 및 총 수량 변수
    const totalQuantity = document.querySelector('.quantity__input').value;
    const totalPriceSection = document.querySelector('.total-section__price');

    // 가격 및 포맷 적용
    const format = await formatPrice(targetProduct.price);
    const totalPrice = await calculatePrice(targetProduct.price, totalQuantity);
    const totalFormat = await formatPrice(totalPrice);

    // id와 일치상품 렌더링
    image.setAttribute('src', `${targetProduct.image}`);
    // sellerName. => 이 부분 데이터에 x
    productName.textContent = targetProduct.name;
    price.textContent = format;
    totalPriceSection.textContent = totalFormat;

    console.log(totalQuantity);
})();

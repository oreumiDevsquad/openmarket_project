// Scripts for the main page

import { API } from '../api.js';
import { formatPrice } from '../utils.js';

// 상품 랜더링
(async () => {
    // product-list__container
    const ul = document.querySelector('.product-list__container');
    const products = await API.getProducts();
    // results: [{item...}, ...]
    const frag = document.createDocumentFragment();

    console.log(products.results);

    for (let product of products.results) {
        const format = formatPrice(product.price);
        const li = document.createElement('li');
        li.classList.add('product-list__item');
        li.innerHTML = '';

        li.innerHTML = `
            <a href="./pages/product_detail.html?id=${product.id}" class="product-card">
                <img
                    src="${product.image}"
                    alt="${product.name}"
                    class="product-card__image"
                />
                <div class="product-card__info">
                    <p class="product-card__brand">
                        ${product.info}
                    </p>
                    <h3 class="product-card__title">
                        ${product.name}
                    </h3>
                    <p class="product-card__price">
                        ${format}<span class="product-card__currency">
                        원</span
                    >
                    </p>
                </div>
            </a>
        `;

        frag.appendChild(li);
    }

    ul.innerHTML = '';
    ul.appendChild(frag);
})();

// 캐러셀

const $slideWarp = document.querySelector('.main-slide__wrapper');
const $slide = document.querySelectorAll('.main-slide__item');
const $pagination = document.querySelectorAll('.main-slide__nav-item');
const $nextBtn = document.querySelector('.main-slide__controls-btn-next');
const $prevBtn = document.querySelector('.main-slide__controls-btn-prev');
const $slideCount = $slide.length;
$pagination[0].classList.add('nav-item-active');

// 무한루프를 위해 cloneNode로 처음,마지막 슬라이드 복사

const $firstClone = $slide[0].cloneNode(true);
const $lastClone = $slide[$slideCount - 1].cloneNode(true);

$slideWarp.appendChild($firstClone);
$slideWarp.prepend($lastClone);

$slideWarp.style.width = `${100 * ($slideCount + 2)}%`;
$slideWarp.style.left = `-100%`;

let current = 1;

// 다음 버튼
$nextBtn.addEventListener('click', () => {
    if (current >= $slideCount) {
        current++;
        $slideWarp.style.transition = 'all 0.5s';
        $slideWarp.style.left = `-${100 * current}%`;

        setTimeout(() => {
            $slideWarp.style.transition = '0s';
            current = 1;
            $slideWarp.style.left = `-${100 * current}%`;
        }, 500);
    } else {
        current++;
        $slideWarp.style.transition = 'all 0.5s';
        $slideWarp.style.left = `-${100 * current}%`;
    }

    $pagination.forEach((item, index) => {
        item.classList.remove('nav-item-active');
        if (index === (current > $slideCount ? 0 : current - 1)) {
            item.classList.add('nav-item-active');
        }
    });
});

// 이전 버튼
$prevBtn.addEventListener('click', () => {
    if (current <= 1) {
        current--;
        $slideWarp.style.transition = 'all 0.5s';
        $slideWarp.style.left = `-${100 * current}%`;

        setTimeout(() => {
            $slideWarp.style.transition = '0s';
            current = $slideCount;
            $slideWarp.style.left = `-${100 * current}%`;
        }, 500);
    } else {
        current--;
        $slideWarp.style.transition = 'all 0.5s';
        $slideWarp.style.left = `-${100 * current}%`;
    }

    $pagination.forEach((item, index) => {
        item.classList.remove('nav-item-active');
        if (index === (current < 1 ? $slideCount - 1 : current - 1)) {
            item.classList.add('nav-item-active');
        }
    });
});

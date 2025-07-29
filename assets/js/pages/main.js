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

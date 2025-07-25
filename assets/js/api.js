// API related functions
const BASE_URL = 'https://api.wenivops.co.kr/services/open-market';

const PATHS = {
    products: `${BASE_URL}/products/`,
    productDetail: `${BASE_URL}/products/`,
    login: `${BASE_URL}/accounts/login/`,
};
const OPTIONS = {
    get: {
        method: 'GET',
    },
    post: {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    },
};

export const API = {
    getProducts: async () => fetchAPI(PATHS.products, OPTIONS.get),

    getProductDetail: async (productID) =>
        fetchAPI(PATHS.productDetail + `${productID}`, OPTIONS.get),

    login: async (id, pw) => {
        return fetchAPI(PATHS.login, {
            ...OPTIONS.post,
            body: JSON.stringify({
                username: id,
                password: pw,
            }),
        });
    },
};

async function fetchAPI(url, option) {
    try {
        const response = await fetch(url, option);
        if (!response.ok) throw new Error(response.status);

        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

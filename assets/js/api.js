// API related functions
const BASE_URL = 'https://api.wenivops.co.kr/services/open-market';

const URL = {
    products: `${BASE_URL}/products/`,
    productDetail: `${BASE_URL}/products/`,
    login: `${BASE_URL}/accounts/login/`,
    refresh: `${BASE_URL}/accounts/token/refresh/`,
    validateUserName: `${BASE_URL}/accounts/validate-username/`,
    signupBuyer: `${BASE_URL}/accounts/buyer/signup/`,
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

const postOption = (data) => ({
    ...OPTIONS.post,
    body: JSON.stringify(data),
});

export const API = {
    getProducts: async () => fetchAPI(URL.products, OPTIONS.get),

    getProductDetail: async (productID) =>
        fetchAPI(URL.productDetail + `${productID}/`, OPTIONS.get),

    login: async (id, password) =>
        fetchAPI(URL.login, postOption({ username: id, password })),

    refreshToken: async (refreshToken) =>
        fetchAPI(
            URL.refresh,
            postOption({
                refresh: refreshToken,
            })
        ),

    validateId: async (id) =>
        fetchAPI(URL.validateUserName, postOption({ username: id })),

    signupBuyer: async (id, password, name, phoneNumber) =>
        fetchAPI(
            URL.signupBuyer,
            postOption({
                username: id,
                password,
                name,
                phone_number: phoneNumber,
            })
        ),
};

async function fetchAPI(url, option) {
    try {
        const response = await fetch(url, option);
        const data = await response.json();

        if (!response.ok) {
            const customError = new Error(
                `${data?.error || '통신 중 무언가 잘못됐습니다.'} `
            );
            customError.status = response.status;
            customError.message =
                data?.error ||
                Object.entries(data)
                    .filter(([_, v]) => v.length)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join('\n');
            throw customError;
        }

        return data;
    } catch (error) {
        throw error;
    }
}

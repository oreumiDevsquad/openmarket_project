// API related functions
const BASE_URL = 'https://api.wenivops.co.kr/services/open-market';

const URL = {
    products: `${BASE_URL}/products/`,
    productDetail: `${BASE_URL}/products/`,
    login: `${BASE_URL}/accounts/login/`,
    refresh: `${BASE_URL}/accounts/token/refresh/`,
    validateUserName: `${BASE_URL}/accounts/validate-username/`,
    signupBuyer: `${BASE_URL}/accounts/buyer/signup/`,
    cart: `${BASE_URL}/cart/`,
};

const options = ({ method, data = null, token = null }) => ({
    method: method,
    headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...(data && { body: JSON.stringify(data) }),
});

async function fetchAPI(url, option) {
    try {
        const response = await fetch(url, option);

        if (response.status === 204)
            return {
                isSuccessful: true,
                detail: '삭제되었습니다.',
            };

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
            customError.messages = data;
            throw customError;
        }

        return data;
    } catch (error) {
        throw error;
    }
}

export const API = {
    getProducts: async () => fetchAPI(URL.products, options({ method: 'GET' })),

    getProductDetail: async (productID) =>
        fetchAPI(
            URL.productDetail + `${productID}/`,
            options({ method: 'GET' })
        ),

    login: async (id, password) =>
        fetchAPI(
            URL.login,
            options({ method: 'POST', data: { username: id, password } })
        ),

    refreshToken: async (refreshToken) =>
        fetchAPI(
            URL.refresh,
            options({
                method: 'POST',
                data: {
                    refresh: refreshToken,
                },
            })
        ),

    validateId: async (id) =>
        fetchAPI(
            URL.validateUserName,
            options({ method: 'POST', data: { username: id } })
        ),

    signupBuyer: async (id, password, name, phoneNumber) =>
        fetchAPI(
            URL.signupBuyer,
            options({
                method: 'POST',
                data: {
                    username: id,
                    password,
                    name,
                    phone_number: phoneNumber,
                },
            })
        ),
    getCartList: async (token) =>
        fetchAPI(URL.cart, options({ method: 'GET', token })),

    addCartItem: async (data, token) =>
        fetchAPI(URL.cart, options({ method: 'POST', data, token })),

    deleteCartItem: async (id, token) =>
        fetchAPI(URL.cart + `${id}`, options({ method: 'DELETE', token })),

    clearCart: async (token) =>
        fetchAPI(URL.cart, options({ method: 'DELETE', token })),

    getCartDetail: async (id, token) =>
        fetchAPI(URL.cart + `${id}/`, options({ method: 'GET', token })),
};

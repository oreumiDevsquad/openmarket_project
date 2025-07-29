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
    order: `${BASE_URL}/order/`,
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
    /**
     * 전체 상품 목록을 가져옵니다.
     * @returns {Promise<any>} 상품 리스트 데이터
     */
    getProducts: async () => fetchAPI(URL.products, options({ method: 'GET' })),
    /**
     * 특정 상품의 상세 정보를 가져옵니다.
     * @param {number|string} productID - 조회할 상품의 ID
     * @returns {Promise<any>} 상품 상세 데이터
     */
    getProductDetail: async (productID) =>
        fetchAPI(
            URL.productDetail + `${productID}/`,
            options({ method: 'GET' })
        ),
    /**
     * 사용자 로그인 처리
     * @param {string} id - 사용자 ID
     * @param {string} password - 사용자 비밀번호
     * @returns {Promise<any>} 로그인 결과(토큰 등)
     */
    login: async (id, password) =>
        fetchAPI(
            URL.login,
            options({ method: 'POST', data: { username: id, password } })
        ),
    /**
     * 리프레시 토큰을 이용한 액세스 토큰 재발급
     * @param {string} refreshToken - 기존 리프레시 토큰
     * @returns {Promise<any>} 새로운 액세스 토큰
     */
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
    /**
     * 사용자 ID 중복 확인
     * @param {string} id - 확인할 사용자 ID
     * @returns {Promise<any>} 중복 여부 응답
     */
    validateId: async (id) =>
        fetchAPI(
            URL.validateUserName,
            options({ method: 'POST', data: { username: id } })
        ),
    /**
     * 구매자 회원가입 처리
     * @param {string} id - 사용자 ID
     * @param {string} password - 비밀번호
     * @param {string} name - 이름
     * @param {string} phoneNumber - 휴대폰 번호
     * @returns {Promise<any>} 회원가입 결과
     */
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
    /**
     * 장바구니 목록 조회
     * @param {string} token - 사용자 인증 토큰
     * @returns {Promise<any>} 장바구니 상품 리스트
     */
    getCartList: async (token) =>
        fetchAPI(URL.cart, options({ method: 'GET', token })),
    /**
     * 특정 장바구니 항목 상세 조회
     * @param {number|string} id - 장바구니 항목 ID
     * @param {string} token - 사용자 인증 토큰
     * @returns {Promise<any>} 항목 상세 정보
     */
    getCartDetail: async (id, token) =>
        fetchAPI(URL.cart + `${id}/`, options({ method: 'GET', token })),
    /**
     * 장바구니에 상품 추가
     * @param {object} data - 추가할 상품 데이터 (product_id, quantity 등)
     * @param {string} token - 사용자 인증 토큰
     * @returns {Promise<any>} 추가 결과
     */
    addCartItem: async (data, token) =>
        fetchAPI(URL.cart, options({ method: 'POST', data, token })),

    /**
     * 장바구니에 상품 추가
     * @param {int} id - 수정할 상품의 cart id
     * @param {int} quantity - 수정할 상품 수량
     * @param {string} token - 사용자 인증 토큰
     * @returns {Promise<any>} 추가 결과
     */
    editCartItem: async (id, quantity, token) =>
        fetchAPI(
            URL.cart + `${id}/`,
            options({ method: 'PUT', data: { quantity }, token })
        ),

    /**
     * 장바구니에서 특정 상품 삭제
     * @param {number|string} id - 삭제할 장바구니 항목 ID
     * @param {string} token - 사용자 인증 토큰
     * @returns {Promise<any>} 삭제 결과
     */
    deleteCartItem: async (id, token) =>
        fetchAPI(URL.cart + `${id}`, options({ method: 'DELETE', token })),
    /**
     * 장바구니 전체 비우기
     * @param {string} token - 사용자 인증 토큰
     * @returns {Promise<any>} 삭제 결과
     */
    clearCart: async (token) =>
        fetchAPI(URL.cart, options({ method: 'DELETE', token })),
    /**
     * 상품 상세 페이지에서 바로 주문 요청
     * @param {object} data - 주문 데이터 (product, quantity 등)
     * @param {string} token - 사용자 인증 토큰
     * @returns {Promise<any>} 주문 처리 결과
     */
    directOrder: async (data, token) =>
        fetchAPI(URL.order, options({ method: 'POST', data, token })),
    /**
     * 장바구니 기반 주문 요청
     * @param {object} data - 주문 데이터 (order_kind, cart_item_list 등)
     * @param {string} token - 사용자 인증 토큰
     * @returns {Promise<any>} 주문 처리 결과
     */
    cartOrder: async (data, token) =>
        fetchAPI(URL.order, options({ method: 'POST', data, token })),
};

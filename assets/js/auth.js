// auth.js - 토큰 관리 시스템
import { API } from './api.js';

// localStorage 키 상수
const STORAGE_KEYS = {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    TOKEN_EXPIRY: 'token_expiry',
};

/**
 * Base64 URL 디코딩 (JWT 토큰 파싱용)
 */
const base64UrlDecode = (str) => {
    const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    return atob(padded);
};

/**
 * JWT 토큰 디코딩
 * @param {string} token - JWT 토큰
 * @returns {object|null} 디코딩된 페이로드 또는 null
 */
const decodeToken = (token) => {
    try {
        if (!token) return null;
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        const decoded = base64UrlDecode(parts[1]);
        const payload = JSON.parse(decoded);
        return payload;
    } catch (error) {
        console.error('토큰 디코딩 실패:', error);
        return null;
    }
};

/**
 * 토큰을 localStorage에 저장
 * @param {string} accessToken - 액세스 토큰
 * @param {string} refreshToken - 리프레시 토큰
 */
const saveTokens = (accessToken, refreshToken) => {
    try {
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);

        // 액세스 토큰의 만료 시간 저장
        const payload = decodeToken(accessToken);
        if (payload && payload.exp) {
            localStorage.setItem(
                STORAGE_KEYS.TOKEN_EXPIRY,
                payload.exp.toString()
            );
        }

        console.log('토큰이 성공적으로 저장되었습니다.');
    } catch (error) {
        console.error('토큰 저장 실패:', error);
    }
};

/**
 * localStorage에서 액세스 토큰 조회
 * @returns {string|null} 액세스 토큰 또는 null
 */
const getAccessToken = () => {
    try {
        return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    } catch (error) {
        console.error('액세스 토큰 조회 실패:', error);
        return null;
    }
};

/**
 * localStorage에서 리프레시 토큰 조회
 * @returns {string|null} 리프레시 토큰 또는 null
 */
const getRefreshToken = () => {
    try {
        return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    } catch (error) {
        console.error('리프레시 토큰 조회 실패:', error);
        return null;
    }
};

/**
 * localStorage에서 모든 토큰 삭제
 */
const clearTokens = () => {
    try {
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRY);
        console.log('토큰이 성공적으로 삭제되었습니다.');
    } catch (error) {
        console.error('토큰 삭제 실패:', error);
    }
};

/**
 * 토큰 만료 여부 확인
 * @param {string} token - 확인할 토큰
 * @returns {boolean} 만료 여부
 */
const isTokenExpired = (token) => {
    if (!token) return true;

    const payload = decodeToken(token);
    if (!payload || !payload.exp) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
};

/**
 * 로그인 상태 확인
 * @returns {boolean} 로그인 상태
 */
const isLoggedIn = () => {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();

    if (!accessToken || !refreshToken) return false;

    // 리프레시 토큰이 유효하면 로그인 상태로 간주
    return !isTokenExpired(refreshToken);
};

/**
 * 리프레시 토큰으로 액세스 토큰 갱신
 * @returns {Promise<boolean>} 갱신 성공 여부
 */
const refreshAccessToken = async () => {
    try {
        const refreshToken = getRefreshToken();
        if (!refreshToken || isTokenExpired(refreshToken)) {
            console.log('리프레시 토큰이 없거나 만료되었습니다.');
            await logout();
            return false;
        }

        const response = await API.refreshToken(refreshToken);

        if (response && response.access) {
            // 새로운 액세스 토큰만 업데이트 (리프레시 토큰은 그대로 유지)
            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.access);

            const payload = decodeToken(response.access);
            if (payload && payload.exp) {
                localStorage.setItem(
                    STORAGE_KEYS.TOKEN_EXPIRY,
                    payload.exp.toString()
                );
            }

            console.log('액세스 토큰이 성공적으로 갱신되었습니다.');
            return true;
        }

        throw new Error('토큰 갱신 응답이 올바르지 않습니다.');
    } catch (error) {
        console.error('토큰 갱신 실패:', error);
        await logout();
        return false;
    }
};

/**
 * 유효한 액세스 토큰 반환 (필요시 자동 갱신)
 * @returns {Promise<string|null>} 유효한 액세스 토큰 또는 null
 */
const getValidAccessToken = async () => {
    let accessToken = getAccessToken();

    // 토큰이 만료되었거나 30초 이내에 만료될 예정이면 갱신
    const payload = decodeToken(accessToken);
    const currentTime = Math.floor(Date.now() / 1000);
    const bufferTime = 30; // 30초

    if (!payload || !payload.exp || payload.exp - currentTime < bufferTime) {
        console.log('토큰이 만료되었거나 곧 만료됩니다. 갱신을 시도합니다.');
        const refreshed = await refreshAccessToken();

        if (refreshed) {
            accessToken = getAccessToken();
        } else {
            return null;
        }
    }

    return accessToken;
};

/**
 * 로그인 처리
 * @param {string} id - 사용자 ID
 * @param {string} password - 비밀번호
 * @returns {Promise<boolean>} 로그인 성공 여부
 */
const login = async (id, password) => {
    try {
        const response = await API.login(id, password);

        if (response && response.access && response.refresh) {
            saveTokens(response.access, response.refresh);
            console.log('로그인이 성공적으로 완료되었습니다.');
            return true;
        }

        throw new Error('로그인 응답이 올바르지 않습니다.');
    } catch (error) {
        console.error('로그인 실패:', error);
        return false;
    }
};

/**
 * 로그아웃 처리
 * @returns {Promise<void>}
 */
const logout = async () => {
    try {
        clearTokens();
        console.log('로그아웃이 완료되었습니다.');

        // 로그아웃 후 추가 처리 (예: 페이지 리다이렉트)
        // window.location.href = '/login';
    } catch (error) {
        console.error('로그아웃 처리 중 오류:', error);
    }
};

/**
 * 토큰 상태 정보 반환
 * @returns {object} 토큰 상태 정보
 */
const getTokenStatus = () => {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();

    return {
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken,
        isAccessTokenExpired: isTokenExpired(accessToken),
        isRefreshTokenExpired: isTokenExpired(refreshToken),
        isLoggedIn: isLoggedIn(),
        accessTokenPayload: decodeToken(accessToken),
        refreshTokenPayload: decodeToken(refreshToken),
    };
};

// 토큰이 자동으로 처리되는 API 래퍼 함수들
export const AuthAPI = {
    /**
     * 로그인
     */
    login,

    /**
     * 로그아웃
     */
    logout,

    /**
     * 로그인 상태 확인
     */
    isLoggedIn,

    /**
     * 토큰 상태 확인
     */
    getTokenStatus,

    /**
     * 장바구니 목록 조회
     */
    getCartList: async () => {
        const token = await getValidAccessToken();
        if (!token) throw new Error('인증이 필요합니다.');
        return API.getCartList(token);
    },

    /**
     * 장바구니 항목 상세 조회
     */
    getCartDetail: async (id) => {
        const token = await getValidAccessToken();
        if (!token) throw new Error('인증이 필요합니다.');
        return API.getCartDetail(id, token);
    },

    /**
     * 장바구니에 상품 추가
     */
    addCartItem: async (data) => {
        const token = await getValidAccessToken();
        if (!token) throw new Error('인증이 필요합니다.');
        return API.addCartItem(data, token);
    },

    /**
     * 장바구니에 상품 추가
     * @param {int} id - 수정할 상품의 cart id
     * @param {int} quantity - 수정할 상품 수량
     * @returns {Promise<any>} 추가 결과
     */
    editCartItem: async (id, quantity) => {
        const token = await getValidAccessToken();
        if (!token) throw new Error('인증이 필요합니다.');
        return API.editCartItem(id, quantity, token);
    },

    /**
     * 장바구니에서 상품 삭제
     */
    deleteCartItem: async (id) => {
        const token = await getValidAccessToken();
        if (!token) throw new Error('인증이 필요합니다.');
        return API.deleteCartItem(id, token);
    },

    /**
     * 장바구니 전체 비우기
     */
    clearCart: async () => {
        const token = await getValidAccessToken();
        if (!token) throw new Error('인증이 필요합니다.');
        return API.clearCart(token);
    },

    /**
     * 상품 직접 주문
     */
    directOrder: async (data) => {
        const token = await getValidAccessToken();
        if (!token) throw new Error('인증이 필요합니다.');
        return API.directOrder(data, token);
    },

    /**
     * 장바구니 기반 주문
     */
    cartOrder: async (data) => {
        const token = await getValidAccessToken();
        if (!token) throw new Error('인증이 필요합니다.');
        return API.cartOrder(data, token);
    },
};

// 내부 함수들도 필요시 사용할 수 있도록 export
export {
    saveTokens,
    getAccessToken,
    getRefreshToken,
    clearTokens,
    isTokenExpired,
    isLoggedIn,
    refreshAccessToken,
    getValidAccessToken,
    login,
    logout,
    getTokenStatus,
};

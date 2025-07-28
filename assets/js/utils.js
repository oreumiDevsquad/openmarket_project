// Utility functions

/**
 * 숫자를 한국 원화(KRW) 형식의 문자열로 변환
 * @param {number} price - 포맷을 적용할 숫자
 * @returns {string} - 천 단위 쉼표가 포함된 문자열
 */

export function formatPrice(price) {
    const $formatter = /\B(?=(\d{3})+(?!\d))/g;
    const $formatPrice = price.toString().replace($formatter, ',');
    return $formatPrice;
}

/**
 * 단가 * 수량으로 총 가격 계산
 * @param {number} price - 개당 가격
 * @param {number} quantity - 수량
 * @returns {number} - 계산된 총가격
 */

export function calculatePrice(price, quantity) {
    return price * quantity;
}

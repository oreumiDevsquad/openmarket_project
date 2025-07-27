// Form validation scripts

/**
 * @param {string} id - 20자 이내의 영문 대소문자 및 숫자
 * @returns {boolean}
 */

export function validateId(id) {
    const idRegex = /^[a-zA-Z0-9]{1,20}$/;
    let isOk = idRegex.test(id);
    return isOk;
}

/**
 * @param {string} password - 8자 이상이어야 하며, 영문 대소문자, 숫자, 특수문자를 모두 포함
 * @returns {boolean}
 */

export function validatePassword(password) {
    const passwordRegex =
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    let isOk = passwordRegex.test(password);
    return isOk;
}

/**
 * @param {string} phone - 일반 휴대폰 형식
 * @returns {boolean}
 */

export function validatePhoneNumber(phone) {
    const phoneRegex = /^(010|011|016|017|018|019)\d{7,8}$/;
    let isOk = phoneRegex.test(phone);
    return isOk;
}

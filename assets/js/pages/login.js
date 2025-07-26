// 변수 선언
const LOGIN_BOX_SUBMIT = document.querySelector('.login-box__submit');

// 유효성 검사 (입력값 없음): 아이디나 비밀번호가 비어있는 상태로 로그인 시도 시, 비어있는 입력창에 focus 처리
// form action을 뭐로 줘야하지? GET? POST?
function validateLogin() {
    const LOGINID = document.querySelector('#login-id').value.trim();
    const LOGINPW = document.querySelector('#login-box-password').value.trim();

    if (LOGINID === '') {
        document.querySelector('#login-id').focus();
        return false;
    }

    if (LOGINPW === '') {
        document.querySelector('#login-password').focus();
        return false;
    }

    // 여기서 추가 유효성 검사 가능

    return true;
}

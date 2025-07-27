// 변수 선언
const btn = document.querySelector('.login-box__submit');

function validatation() {
    const loginId = document.getElementById('loginId').value;
    const loginPw = document.getElementById('login-password').value;

    if (loginId.trim() === '') {
        console.error('아이디가 입력되지 않았습니다.');
        document.getElementById('loginId').focus();
        return;
    }

    if (loginPw.trim() === '') {
        console.error('비밀번호가 입력되지 않았습니다.');
        document.getElementById('login-password').focus();
        return;
    }
}

btn.addEventListener('click', (e) => {
    e.preventDefault();

    validatation();
});

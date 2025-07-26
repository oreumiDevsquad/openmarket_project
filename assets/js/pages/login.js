// 변수 선언
const btn = document.querySelector('.login-box__submit');

btn.addEventListener('click', (e) => {
    e.preventDefault();

    const loginId = document.getElementById('login-id').value;
    const loginPw = document.getElementById('login-password').value;

    if (loginId.trim() === '') {
        console.error('아이디가 입력되지 않았습니다.');
        alert('아이디를 입력해주세요.');
    }

    if (loginPw.trim() === '') {
        console.error('비밀번호가 입력되지 않았습니다.');
        alert('비밀번호를 입력해주세요.');
    }

    console.log('아이디 :', loginId);
    console.log('비밀번호 :', loginPw);
});

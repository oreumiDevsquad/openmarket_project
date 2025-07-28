import { API } from '../api.js';

// 변수 선언
const $form = document.querySelector('.login-box__form');

// 구매탭 클릭 시 상태 반영 -> 토글로 구현할 생각.
const $loginBoxTab = document.getElementsByClassName;

// 아이디 비밀번호 유효성검사 (입력값 없음))
function validatation1() {
    const loginId = document.getElementById('loginId').value;
    const loginPw = document.getElementById('loginPassword').value;

    if (loginId.trim() === '') {
        console.error('아이디가 입력되지 않았습니다.');
        document.getElementById('loginId').focus();
        return;
    }

    if (loginPw.trim() === '') {
        console.error('비밀번호가 입력되지 않았습니다.');
        document.getElementById('loginPassword').focus();
        return;
    }
}

$form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData($form);

    const loginId = formData.get('login-id');
    const loginPw = formData.get('login-password');

    if (loginId.trim() === '') {
        console.error('아이디가 입력되지 않았습니다.');
        document.getElementById('loginId').focus();
        return;
    }

    if (loginPw.trim() === '') {
        console.error('비밀번호가 입력되지 않았습니다.');
        document.getElementById('loginPassword').focus();
        return;
    }

    // 유효성 검사 (불일치)
    try {
        const result = await API.login(loginId, loginPw);
        console.log(result);
        if (!result) {
            // 불일치 시
            document.getElementById('loginPassword').value = '';
            document.getElementById('loginPassword').focus();
            let $inputContainer = document.querySelector(
                '.login-box__input-container'
            );
            let $span = document.createElement('span');
            $span.className = 'login-box__error';
            $span.textContent = '아이디 또는 비밀번호가 일치하지 않습니다.';
            $inputContainer.appendChild($span);
            throw new Error('아이디 또는 비밀번호가 일치하지 않습니다.');
        }
        // 성공 시
        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.location = '/';
        }
    } catch (error) {
        console.error('에러가 발생했습니다.', error.message);
        return;
    }
});

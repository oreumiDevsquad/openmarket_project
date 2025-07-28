import { API } from '../api.js';

// 변수 선언
const $form = document.querySelector('.login-box__form');

// 구매탭 클릭 시 상태 반영 -> 토글로 구현할 생각.
const $loginBoxTab = document.getElementsByClassName;

// 아이디 비밀번호 유효성검사 (입력값 없음))
function validatation1(loginId, loginPw) {
    if (loginId.trim() === '') {
        console.error('아이디가 입력되지 않았습니다.');
        document.getElementById('loginId').focus();
        alert('아이디가 입력되지 않았습니다.');
        return false;
    }

    if (loginPw.trim() === '') {
        console.error('비밀번호가 입력되지 않았습니다.');
        document.getElementById('loginPassword').focus();
        alert('비밀번호가 입력되지 않았습니다.');
        return false;
    }
}

$form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const $loginId = document.getElementById('loginId');
    const $loginPw = document.getElementById('loginPassword');

    const formData = new FormData($form);

    const loginId = formData.get('login-id');
    const loginPw = formData.get('login-password');
    const isValid = validatation1($loginId.value, $loginPw.value);

    // 아이디 비밀번호 유효성검사 (입력값 없음))
    if (!isValid) return;

    // 유효성 검사 (불일치)
    try {
        const result = await API.login(loginId, loginPw);
        console.log(result);
        // 성공 시
        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.location = '/';
        }
    } catch (error) {
        console.error('에러가 발생했습니다 :', error.message);

        document.getElementById('loginPassword').value = '';
        document.getElementById('loginPassword').focus();

        let $errorMsg = document.querySelector('.login-box__error');
        $errorMsg.textContent = '아이디 또는 비밀번호가 일치하지 않습니다.';
        $errorMsg.classList.add('active');
        return;
    }
});

// 구매자 탭 활성화
(() => {
    const $tabs = document.querySelector('.login-box__nav');
    const $btns = $tabs.querySelectorAll('button');

    $tabs.addEventListener('click', (e) => {
        if (e.target.tagName !== 'BUTTON') return;
        $btns.forEach((btn, idx) => {
            btn.classList.remove(
                'tab-left',
                'tab-right',
                'login-box__tab--active'
            );
        });

        if (e.target === $btns[0]) {
            $btns[0].classList.add('tab-left', 'login-box__tab--active');
            $btns[1].classList.add('tab-right');
        } else {
            $btns[1].classList.add('tab-right', 'login-box__tab--active');
            $btns[0].classList.add('tab-left');
        }
    });
})();

import { API } from '../api.js';

// 회원가입
const $tabs = document.querySelector('.signup__tabs');
const $form = document.querySelector('#userSignup');
const $passwordConfirm = $form.querySelector('#userPassword');
const $duplicateCheckBtn = $form.querySelector('.signup__button--secondary');
const $submitBtn = $form.querySelector('button[type="submit"]');
const $_ = $form.querySelector('#phoneMiddle');
const $phoneAlert = $form.querySelector('.signup__phone-fieldset');
const inputStatus = {
    userid: false,
    password: false,
    passwordConfirm: false,
    username: false,
    phoneMiddle: false,
    phoneLast: false,
    terms: false,
};

const CLASS_NAME = {
    notValid: 'valid-fail',
    valid: 'valid-success',
};
const MESSAGE = {
    error: {
        require: '필수 정보입니다.',
        id: '20자 이내의 영문 소문자, 대문자, 숫자만 사용 가능합니다.',
        pw: '8자 이상, 영문 대소문자, 숫자, 특수문자를 사용하세요.',
        pwConfirm: '비밀번호가 일치하지 않습니다.',
        username: '영문 대소문자, 한글만 사용 가능합니다.',
        phone: '잘못된 전화번호 형식입니다.',
        usedPhone: '해당 사용자 전화번호는 이미 존재합니다.',
    },
    success: {
        isUnique: '멋진 아이디네요 :)',
    },
};

// 유효성 검사
// 실시간 검사
$form.addEventListener('input', validForm);
// 포커스 옮길 때 검사
$form.addEventListener('focusout', validForm);

async function validForm(e) {
    // select 제외하고 유효성 검사하기
    const $target = e.target;
    if ($target.tagName !== 'INPUT') return;

    let $inputField = $target.parentElement;

    if ($inputField.classList.contains('signup__input-group')) {
        $inputField = $inputField.parentElement;
    }
    if (
        $inputField.classList.contains('password-wrapper') ||
        $inputField.classList.contains('signup__phone-group')
    ) {
        $inputField = $inputField.parentElement;
    }

    const renderData = {
        msg: MESSAGE.error.require,
        $target,
        $inputField,
        isValid: true,
    };

    // 비어있는지 검사
    const data = $target.value.trim();
    if (!data) {
        renderData.isValid = false;
        if ($target.name === 'userName' || $target.name === 'userid')
            inputStatus[$target.name.toLowerCase()] = false;

        // if($target.name === 'userName')
    } else {
        // 각 글자가 맞는지 확인
        const passwordReg = new RegExp(
            '(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}',
            'i'
        );
        switch ($target.name) {
            case 'userId':
                // 20자 이내 영문 소,대문자 숫자만
                renderData.isValid = /^[a-z0-9]{1,20}$/i.test(data);
                renderData.msg = MESSAGE.error.id;
                break;
            case 'password':
                //
                const isValid = passwordReg.test(data);
                if (isValid) {
                    $target.parentElement.classList.add('valid');
                } else {
                    $target.parentElement.classList.remove('valid');
                }
                renderData.isValid = isValid;
                renderData.msg = MESSAGE.error.pw;
                inputStatus.password = renderData.isValid;

                break;
            case 'passwordConfirm':
                //
                const isConfirm = $passwordConfirm.value.trim() === data;
                if (isConfirm) {
                    $target.parentElement.classList.add('valid');
                } else {
                    $target.parentElement.classList.remove('valid');
                }
                renderData.isValid = isConfirm;
                renderData.msg = MESSAGE.error.pwConfirm;

                inputStatus.passwordConfirm = renderData.isValid;
                break;
            case 'userName':
                renderData.isValid = /^[가-힣a-zA-Z]{1,}$/.test(data);
                renderData.msg = MESSAGE.error.username;
                inputStatus.username = renderData.isValid;
                break;
            case 'phoneMiddle':
                //
                renderData.isValid = /[\d]{3,4}/.test(data);
                renderData.msg = MESSAGE.error.phone;
                inputStatus.phoneMiddle = renderData.isValid;
                break;
            case 'phoneLast':
                //
                renderData.isValid = /[\d]{4}/.test(data);
                renderData.msg = MESSAGE.error.phone;
                inputStatus.phoneLast = renderData.isValid;
                break;
            default:
                break;
        }
    }
    if ($target.type === 'checkbox') {
        inputStatus.terms = $target.checked;
    }

    renderMsg(renderData);
    allGreen();
}

function renderMsg({ msg, $target, $inputField, isValid, isGreen = false }) {
    if (!$inputField) return;
    const $messageEl =
        $inputField.querySelector('p') ?? document.createElement('p');

    if (isValid) {
        $messageEl.remove();
        $target.classList.remove(CLASS_NAME.notValid);
    } else {
        if (!$inputField.querySelector('p')) {
            $inputField.appendChild($messageEl);
        }
        $messageEl.classList.add(
            isGreen ? CLASS_NAME.valid : CLASS_NAME.notValid
        );
        $messageEl.textContent = msg;
        $target.classList.add(isGreen ? CLASS_NAME.valid : CLASS_NAME.notValid);
    }
}

function lowerFirst(str) {
    if (!str) return '';
    return str[0].toLowerCase() + str.slice(1);
}

// submit 이벤트
$form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
        id: null,
        password: null,
        name: null,
        phoneNumber: null,
    };

    // form data는 name으로 가져옴
    const formData = new FormData($form);

    formData.entries().forEach(([name, value]) => {
        const key = lowerFirst(name.replace('user', ''));
        if (key in data) {
            data[key] = value;
        }
    });

    data.phoneNumber =
        formData.get('phonePrefix') +
        formData.get('phoneMiddle') +
        formData.get('phoneLast');

    try {
        const res = await API.signupBuyer(
            data.id,
            data.password,
            data.name,
            data.phoneNumber
        );
        if (res) {
            window.location = '/pages/login.html';
        }
    } catch (error) {
        console.log(error);
        console.log($phoneAlert);
        const renderData = {
            msg: MESSAGE.error.usedPhone,
            $target: $_,
            $inputField: $phoneAlert,
            isValid: false,
        };
        renderMsg(renderData);
    }
});

// 리셋
function resetForm() {
    $form.reset();
    const errorMessages = $form.querySelectorAll('p');
    const inputs = $form.querySelectorAll('input');
    errorMessages.forEach((el) => el.remove());
    inputs.forEach((el) => el.classList.remove(CLASS_NAME.notValid));
    Object.keys(inputStatus).forEach((key) => (inputStatus[key] = false));
}

(() => {
    // 회원가입 폼 변경 이벤트
    const $tabs = document.querySelector('.signup__tabs');
    const $btns = $tabs.querySelectorAll('button');
    const $sellerField = document.querySelector('.signup__group--seller');
    const $sellerInputs = $sellerField.querySelectorAll('input');

    $tabs.addEventListener('click', (e) => {
        if (e.target.tagName !== 'BUTTON') return;
        $btns.forEach((btn) => {
            btn.classList.remove(
                'left',
                'right',
                'signup__tabs-button--active'
            );
        });

        if (e.target === $btns[0]) {
            $btns[0].classList.add('left', 'signup__tabs-button--active');
            $btns[1].classList.add('right');
        } else {
            $btns[1].classList.add('right', 'signup__tabs-button--active');
            $btns[0].classList.add('left');
        }

        $sellerField.classList.toggle('hide', e.target.id !== 'sellerTab');
        const status = e.target.id === 'userTab' ? true : false;

        $sellerInputs.forEach((el) => (el.disabled = status));
        if (!status) {
            // 판매자일 경우
            inputStatus.businessNumber = false;
            inputStatus.storeName = false;
        }
        resetForm();
    });
})();

$duplicateCheckBtn.addEventListener('click', async (e) => {
    const $target = e.currentTarget.parentElement.querySelector('input');
    const $inputField = $target.parentElement.parentElement;
    const renderData = {
        msg: MESSAGE.success.isUnique,
        $target,
        $inputField,
        isValid: false,
        isGreen: true,
    };

    try {
        const response = await API.validateId($target.value.trim());
        if (response.message) {
            inputStatus.userid = true;
            renderMsg(renderData);
        }
    } catch (error) {
        if (error.status === 409) {
            renderData.msg = error.message;
            renderData.isGreen = false;
            inputStatus.userid = false;
            renderMsg(renderData);
        }
    }
    allGreen();
});

// 모든 값이 입력, 검증되었을 때 가입버튼 활성화
function allGreen() {
    if (Object.values(inputStatus).every((status) => status)) {
        activeSubmitBtn();
    } else {
        disableSubmitBtn();
    }
}

function activeSubmitBtn() {
    $submitBtn.disabled = false;
}
function disableSubmitBtn() {
    $submitBtn.disabled = true;
}

import { isLoggedIn, logout } from '../auth.js';

export function mypageDropdown() {
    // HTML 요소 변수 저장
    const $dropdownBtn = document.querySelector(
        '.header__nav-item:last-child .header__nav-link'
    );
    const $dropdownMenu = document.querySelector('.dropdown-menu-container');
    const $logoutBtn = document.querySelector('.dropdown-menu__button');

    if (!$dropdownBtn || !$dropdownMenu) {
        return; // 요소가 없으면 함수 종료
    }

    // active 클래스 토글 함수
    const toggleDropdown = () => {
        $dropdownMenu.classList.toggle('active');
        $dropdownBtn.classList.toggle('active');
    };

    // 버튼 클릭시 드롭다운 기능 추가
    $dropdownBtn.addEventListener('click', (e) => {
        if (isLoggedIn()) {
            e.preventDefault();
            e.stopPropagation();
            toggleDropdown();
        }
    });

    // 다른 DOM 요소 클릭시 드롭다운 닫기
    document.documentElement.addEventListener('click', () => {
        if ($dropdownMenu.classList.contains('active')) {
            toggleDropdown();
        }
    });

    // 로그아웃 버튼이 있을 때 로그아웃,메인 리다이렉트
    if ($logoutBtn) {
        $logoutBtn.addEventListener('click', async () => {
            await logout();
            window.location = '/';
        });
    }
}

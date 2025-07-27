export function mypageDropdown() {
    // HTML 요소 변수 저장
    const dropdownBtn = document.querySelector(
        '.header__nav-item:last-child .header__nav-link'
    );
    const dropdownMenu = document.querySelector('.dropdown-menu-container');

    if (!dropdownBtn) {
        return; // 요소가 없으면 함수 종료
    }

    // active 클래스 토글 함수
    const toggleDropdown = () => {
        dropdownMenu.classList.toggle('active');
    };

    // 버튼 클릭시 드롭다운 기능 추가
    dropdownBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // 클릭 이벤트 부모 요소 전달 방지
        toggleDropdown();
    });

    // 다른 DOM 요소 클릭시 드롭다운 닫기
    document.documentElement.addEventListener('click', () => {
        if (dropdownMenu.classList.contains('active')) {
            toggleDropdown();
        }
    });
}

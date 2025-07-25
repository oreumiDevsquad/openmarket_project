(() => {
    const tabs = document.querySelector('.signup__tabs');
    const btns = tabs.querySelectorAll('button');
    const sellerField = document.querySelector('.signup__group--seller');
    tabs.addEventListener('click', (e) => {
        if (e.target.tagName !== 'BUTTON') return;
        btns.forEach((btn, idx) => {
            btn.classList.remove(
                'left',
                'right',
                'signup__tabs-button--active'
            );
        });

        if (e.target === btns[0]) {
            btns[0].classList.add('left', 'signup__tabs-button--active');
            btns[1].classList.add('right');
        } else {
            btns[1].classList.add('right', 'signup__tabs-button--active');
            btns[0].classList.add('left');
        }

        sellerField.classList.toggle('hide', e.target.id !== 'sellerTab');
    });
})();

// 임시 로그인 상태 유지하기
(async () => {
    const { API } = await import('../api.js');
    const loginData = await API.login('t1', 'xldnjsWkd1!');
    const accessToken = loginData.access;
    const refreshToken = loginData.refresh;
    const data = loginData.user;

    // 장바구니 확인
    const myCartData = await API.getCartList(accessToken);
    const myCartList = myCartData.results;

    console.log(myCartList);
})();

(async () => {})();
document.addEventListener('DOMContentLoaded', async () => {
    // 1. data-component 속성을 가진 모든 요소는 컴포넌트로 간주하고 모으기
    const components = document.querySelectorAll('[data-component]');

    if (!components.length) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '../assets/css/components.css';
    document.head.appendChild(link);

    // 2. 모은 컴포넌트를 순회하면서 렌더링처리하기
    for (const component of components) {
        const componentName = component.dataset.component;
        try {
            const response = await fetch(`/components/${componentName}.html`);
            if (!response.ok) {
                throw new Error(`Failed to fetch ${componentName}.html`);
            }
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const target = doc.querySelector(`${componentName}`);

            // 기존 타겟을 컴포넌트로 교체
            component.replaceWith(target);
        } catch (error) {
            console.error(`Error loading component: ${componentName}`, error);
            component.innerHTML = `<p>Error loading ${componentName}</p>`;
        }
    }
});

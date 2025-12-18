(function () {
    // Valores configurables
    const SNOW_COUNT = 60;
    const COLORS = ["#aaaacc", "#ddddFF", "#ccccDD"];
    const FONTS = ["Arial Black", "Arial Narrow", "Times", "Comic Sans MS"];
    const LETTER = "*";
    const BASE_SPEED = 0.5; // 0.2 - 2
    const MAX_SIZE = 25;
    const MIN_SIZE = 8;
    const SNOW_ZONE = 1; // 1=todo el ancho, 2=izquierda, 3=centro, 4=derecha
    // Selector donde aparecerá la nieve, etiqueta (html, body, div, etc), clase (.clase) o id (#id)
    const CONTAINER_SELECTOR = 'html';

    const styleEl = document.createElement('style');
    styleEl.textContent =
        '.snow-container{position:relative;overflow:hidden;} .snowflake{pointer-events:none; user-select:none; z-index:1000; position:absolute; will-change:transform;}';
    document.head.appendChild(styleEl);

    const container = document.querySelector(CONTAINER_SELECTOR) || document.body;
    container.classList.add('snow-container');

    const flakes = [];
    let W = container.clientWidth;
    let H = container.clientHeight;

    function rand(n) { return Math.floor(Math.random() * n); }

    function createFlakes() {
        for (let i = 0; i < SNOW_COUNT; i++) {
            const el = document.createElement('span');
            el.className = 'snowflake';
            el.textContent = LETTER;

            const size = rand(MAX_SIZE - MIN_SIZE) + MIN_SIZE;
            el.style.fontFamily = FONTS[rand(FONTS.length)];
            el.style.fontSize = size + 'px';
            el.style.color = COLORS[rand(COLORS.length)];
            el.style.left = '-9999px';
            el.style.top = -size + 'px';

            container.appendChild(el);

            flakes.push({
                el,
                size,
                posx: 0,
                posy: Math.random() * H,
                lftrght: Math.random() * 15,
                crds: 0,
                x_mv: 0.03 + Math.random() / 10,
                sink: BASE_SPEED * size / 5
            });
        }
        resetPositions();
        requestAnimationFrame(step);
    }

    function resetPositions() {
        W = container.clientWidth;
        H = container.clientHeight;
        for (let i = 0; i < flakes.length; i++) {
            const f = flakes[i];
            if (SNOW_ZONE === 1) f.posx = rand(Math.max(1, W - f.size));
            else if (SNOW_ZONE === 2) f.posx = rand(Math.max(1, Math.floor(W / 2) - f.size));
            else if (SNOW_ZONE === 3) f.posx = rand(Math.max(1, Math.floor(W / 2) - f.size)) + Math.floor(W / 4);
            else f.posx = rand(Math.max(1, Math.floor(W / 2) - f.size)) + Math.floor(W / 2);
            f.posy = Math.random() * H - 2 * f.size;
            f.el.style.left = f.posx + 'px';
            f.el.style.top = f.posy + 'px';
        }
    }

    function step() {
        for (let i = 0; i < flakes.length; i++) {
            const f = flakes[i];
            f.crds += f.x_mv;
            f.posy += f.sink;
            const x = f.posx + f.lftrght * Math.sin(f.crds);
            f.el.style.left = x + 'px';
            f.el.style.top = f.posy + 'px';

            if (f.posy >= H - 2 * f.size || parseFloat(f.el.style.left) > (W - 3 * f.lftrght)) {
                if (SNOW_ZONE === 1) f.posx = rand(Math.max(1, W - f.size));
                else if (SNOW_ZONE === 2) f.posx = rand(Math.max(1, Math.floor(W / 2) - f.size));
                else if (SNOW_ZONE === 3) f.posx = rand(Math.max(1, Math.floor(W / 2) - f.size)) + Math.floor(W / 4);
                else f.posx = rand(Math.max(1, Math.floor(W / 2) - f.size)) + Math.floor(W / 2);
                f.posy = -f.size;
            }
        }
        requestAnimationFrame(step);
    }

    window.addEventListener('load', createFlakes);
    window.addEventListener('resize', resetPositions);
})();
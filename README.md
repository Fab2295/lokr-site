# Lokr+ — site

Site institucional do Lokr+: uma página com um palco 3D (modelo real do iPhone 17 Pro renderizado com Three.js/WebGL, rolagem de 1000vh) seguida de recursos, cofre isca e planos, mais páginas separadas de Privacidade, Termos de Uso e Suporte. PT/EN/ES, sem build step.

## Rodar localmente

```bash
python3 -m http.server 8843
```

Abra `http://localhost:8843`.

## Estrutura

```
index.html          página inicial (palco 3D + recursos + cofre isca + planos)
privacidade.html     política de privacidade (11 seções, incl. RGPD/CCPA)
termos.html          termos de uso
suporte.html         FAQ + contato
css/                 tokens, layout, palco 3D, seções, páginas legais
js/i18n.js           textos PT/EN/ES do site principal
js/i18n-legal.js     textos PT/EN/ES de privacidade, termos e suporte
js/site.js           idioma (URL/localStorage/navegador), cabeçalho e rodapé
js/page-index.js     monta a página inicial e o motor do palco 3D (Three.js/WebGL)
js/page-legal.js     monta e traduz privacidade/termos/suporte
assets/model/         modelo 3D do iPhone 17 Pro (.glb, CC-BY — ver CREDITS.md)
assets/img/pt, en/   prints do app usados nas telas do iPhone (ES reaproveita EN)
assets/icon.svg      ícone do app em SVG, pelas coordenadas exatas do spec
```

## Idiomas

Ordem de escolha: `?lang=pt|en|es` na URL → `localStorage["lokr-lang"]` → idioma do navegador (pt→PT, es→ES, os demais→EN). Trocar de idioma grava no localStorage e atualiza a URL.

## Deploy

GitHub Pages, a partir da branch `main`, raiz do repositório.

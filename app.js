(() => {
"use strict";
const neighborhood = document.querySelector("#neighborhood");
const rentMax = document.querySelector("#rent-max");
const links = [...document.querySelectorAll(".portal-link")];

// Use each portal's own URL structure. Viva Real supports precoMaximo in
// the query string; ZAP supports the same parameter. Imovelweb neighborhood
// pages use a different slug, and its price filter is left to the site's UI.
const slugs = {
  zap: {
    todos: "https://www.zapimoveis.com.br/aluguel/apartamentos/rs%2Bporto-alegre/",
    "menino-deus": "https://www.zapimoveis.com.br/aluguel/apartamentos/rs%2Bporto-alegre%2B%2Bmenino-deus/",
    cristal: "https://www.zapimoveis.com.br/aluguel/apartamentos/rs%2Bporto-alegre%2B%2Bcristal/",
    tristeza: "https://www.zapimoveis.com.br/aluguel/apartamentos/rs%2Bporto-alegre%2B%2Btristeza/"
  },
  vivareal: {
    todos: "https://www.vivareal.com.br/aluguel/rs/porto-alegre/apartamento_residencial/",
    "menino-deus": "https://www.vivareal.com.br/aluguel/rs/porto-alegre/menino-deus/apartamento_residencial/",
    cristal: "https://www.vivareal.com.br/aluguel/rs/porto-alegre/cristal/apartamento_residencial/",
    tristeza: "https://www.vivareal.com.br/aluguel/rs/porto-alegre/tristeza/apartamento_residencial/"
  },
  imovelweb: {
    todos: "https://www.imovelweb.com.br/apartamentos-aluguel-porto-alegre.html",
    "menino-deus": "https://www.imovelweb.com.br/apartamentos-aluguel-menino-deus-porto-alegre.html",
    cristal: "https://www.imovelweb.com.br/apartamentos-aluguel-cristal-porto-alegre.html",
    tristeza: "https://www.imovelweb.com.br/apartamentos-aluguel-tristeza-porto-alegre.html"
  }
};

function updateLinks() {
  for (const link of links) {
    const portal = link.dataset.portal;
    const url = new URL(slugs[portal][neighborhood.value]);
    const max = Number(rentMax.value);

    // Known query convention for these portals. Imovelweb's current URL
    // format doesn't have a verified equivalent, so do not pretend it filters.
    if (portal !== "imovelweb" && Number.isFinite(max) && max > 0) {
      url.searchParams.set("precoMaximo", String(Math.round(max)));
    }
    link.href = url.toString();
    const bairro = neighborhood.options[neighborhood.selectedIndex].text;
    link.textContent = neighborhood.value === "todos"
      ? "Pesquisar todos os bairros ↗"
      : "Pesquisar " + bairro + " ↗";
    if (portal === "imovelweb") {
      link.title = "O bairro será selecionado pela URL; aplique o preço máximo dentro do Imovelweb.";
      link.setAttribute("aria-label", link.textContent + " (aplicar preço dentro do Imovelweb)");
    } else {
      link.title = "Pesquisa por bairro e preço máximo de aluguel.";
      link.removeAttribute("aria-label");
    }
  }
}
neighborhood.addEventListener("change", updateLinks);
rentMax.addEventListener("input", updateLinks);
document.querySelector("#search-all").addEventListener("click", () => {
  updateLinks();
  for (const link of links) window.open(link.href, "_blank", "noopener,noreferrer");
});
updateLinks();
})();
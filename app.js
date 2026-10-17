(() => {
"use strict";
const neighborhood = document.querySelector("#neighborhood");
const rentMax = document.querySelector("#rent-max");
const links = [...document.querySelectorAll(".portal-link")];
const slugs = {
  zap: {
    todos: "https://www.zapimoveis.com.br/aluguel/apartamentos/rs%2Bporto-alegre/",
    "menino-deus": "https://www.zapimoveis.com.br/aluguel/apartamentos/rs%2Bporto-alegre%2B%2Bmenino-deus/",
    cristal: "https://www.zapimoveis.com.br/aluguel/apartamentos/rs%2Bporto-alegre%2B%2Bcristal/",
    tristeza: "https://www.zapimoveis.com.br/aluguel/apartamentos/rs%2Bporto-alegre%2B%2Btristeza/"
  },
  vivareal: {
    todos: "https://www.vivareal.com.br/aluguel/rio-grande-do-sul/porto-alegre/apartamento_residencial/",
    "menino-deus": "https://www.vivareal.com.br/aluguel/rio-grande-do-sul/porto-alegre/bairros/menino-deus/apartamento_residencial/",
    cristal: "https://www.vivareal.com.br/aluguel/rio-grande-do-sul/porto-alegre/bairros/cristal/apartamento_residencial/",
    tristeza: "https://www.vivareal.com.br/aluguel/rio-grande-do-sul/porto-alegre/bairros/tristeza/apartamento_residencial/"
  },
  imovelweb: {
    todos: "https://www.imovelweb.com.br/apartamentos-aluguel-porto-alegre-rs.html",
    "menino-deus": "https://www.imovelweb.com.br/apartamentos-aluguel-menino-deus-porto-alegre-rs.html",
    cristal: "https://www.imovelweb.com.br/apartamentos-aluguel-cristal-porto-alegre-rs.html",
    tristeza: "https://www.imovelweb.com.br/apartamentos-aluguel-tristeza-porto-alegre-rs.html"
  }
};
function updateLinks() {
  for (const link of links) {
    const portal = link.dataset.portal;
    const base = slugs[portal][neighborhood.value];
    const url = new URL(base);
    const max = Number(rentMax.value);
    if (Number.isFinite(max) && max > 0) url.searchParams.set("precoMaximo", String(Math.round(max)));
    link.href = url.toString();
    link.textContent = neighborhood.value === "todos" ? "Pesquisar todos os bairros ↗" : "Pesquisar " + neighborhood.options[neighborhood.selectedIndex].text + " ↗";
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
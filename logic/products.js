const products = [
  {
    image: "assets/nzP1.jpeg",
    title: "Pâte d'arachide naturelle",
    description: "Une pâte onctueuse, adaptée à la cuisine familiale et à la vente régulière.",
    price: "A partir de 10 $",
    tag: "Produit phare"
  },
  {
    image: "assets/nzP2.jpeg",
    title: "Caramel d'arachide",
    description: "Une douceur croquante qui met en valeur le goût authentique de l'arachide.",
    price: "A partir de 8 $",
    tag: "Gourmand"
  },
  {
    image: "assets/nz3.jpeg",
    title: "Produits agricoles",
    description: "Des produits issus de la production locale, destinés aux ménages et revendeurs.",
    price: "Prix selon saison",
    tag: "Production"
  }
];

function renderProducts() {
  const container = document.querySelector("[data-products-grid]");
  const basePath = document.body.dataset.basePath || "./";

  if (!container) {
    return;
  }

  container.innerHTML = products
    .map(
      (product) => `
        <article class="product-card">
          <img src="${basePath}${product.image}" alt="${product.title}" />
          <span class="product-mark">${product.tag}</span>
          <h3>${product.title}</h3>
          <p>${product.description}</p>
          <strong class="price-label">${product.price}</strong>
        </article>
      `
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", renderProducts);

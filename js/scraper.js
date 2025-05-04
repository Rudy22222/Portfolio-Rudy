document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loader");
  const articlesDiv = document.getElementById("articles-cyber");

  const API_KEY = "41dd02cecf07353936a71c316ce04518";
  const targetUrl = "https://cyber.gouv.fr/publications";
  const fullUrl = `https://api.scraperapi.com/?api_key=${API_KEY}&url=${encodeURIComponent(
    targetUrl
  )}`;

  loader.style.display = "block";

  fetch(fullUrl)
    .then((res) => res.text())
    .then((html) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      const articles = [];

      doc.querySelectorAll(".views-row").forEach((row) => {
        const anchor = row.querySelector("a");
        const infoDiv = row.querySelector(".list-item .info");

        if (!anchor || !infoDiv) return;

        const titleElement = infoDiv.querySelector("h3");
        const title = titleElement ? titleElement.textContent.trim() : "";
        const link = "https://cyber.gouv.fr" + anchor.getAttribute("href");

        const dateElement = infoDiv.querySelector(".date");
        const date = dateElement ? dateElement.textContent.trim() : "";

        const descElement = infoDiv.querySelector(".field-body");
        let description = descElement ? descElement.textContent.trim() : "";
        if (description.length > 115) {
          description = description.substring(0, 115) + "…";
        }

        const imgElement = row.querySelector("img");
        const imageUrl = imgElement
          ? "https://cyber.gouv.fr" + imgElement.getAttribute("src")
          : "./images/ANSSI.png";

        articles.push({ title, link, date, description, imageUrl });
      });

      displayArticles(articles.slice(0, 9));
    })
    .catch((err) => {
      console.error("Erreur ScraperAPI :", err);
      loader.style.display = "none";
    });

  function displayArticles(articles) {
    articlesDiv.innerHTML = "";
    articles.forEach((article) => {
      const articleDiv = document.createElement("div");
      articleDiv.classList.add("col-md-4", "mb-4");

      const imageStyle = `
          width: 100%;
          height: 180px;
          object-fit: contain;
        `;

      const card = `
          <div class="card h-100 border-0 shadow-sm animate_animated animate_fadeIn">
            <img 
              src="${article.imageUrl}" 
              alt="${article.title}" 
              style="${imageStyle}" 
              onerror="this.src='images/ANSSI.png'"
            >
            <div class="card-body d-flex flex-column">
              <p class="text-muted small mb-2">${article.date}</p>
              <h5 class="card-title mb-2 fw-semibold" style="font-size: 1.05rem; min-height: 48px;">${article.title}</h5>
              <p class="card-text text-secondary flex-grow-1" style="font-size: 0.9rem; line-height: 1.4;">${article.description}</p>
              <a href="${article.link}" class="btn btn-primary btn-sm mt-3" target="_blank">
                En savoir plus
              </a>
            </div>
          </div>
        `;

      articleDiv.innerHTML = card;
      articlesDiv.appendChild(articleDiv);
    });

    loader.style.display = "none";
  }
  console.log("Articles displayed:", articles);
});
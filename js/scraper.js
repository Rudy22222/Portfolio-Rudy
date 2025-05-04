document.addEventListener("DOMContentLoaded", () => {
  const proxyUrl = "https://api.allorigins.win/get?url=";
  const targetUrl = "https://siecledigital.fr/cybersecurite/";
  const loader = document.getElementById("loader");
  const articlesDiv = document.getElementById("articles-siecledigital");

  loader.style.display = "block";

  fetch(proxyUrl + encodeURIComponent(targetUrl))
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(data.contents, "text/html");

      const articles = [];
      doc.querySelectorAll("article").forEach((element) => {
        const linkElement = element.querySelector("a[href]");
        const titleElement = element.querySelector("h2");
        const imgElement = element.querySelector("img");

        if (linkElement && titleElement) {
          const title = titleElement.textContent.trim();
          const link = linkElement.getAttribute("href");
          const imageUrl = imgElement
            ? imgElement.getAttribute("src")
            : "images/siecledigital.png";
          const dateMatch = element.innerHTML.match(/Publié le\s*(.*?)\s*à/);
          const date = dateMatch ? dateMatch[1].trim() : "Date inconnue";

          articles.push({ title, link, date, imageUrl });
        }
      });

      displayArticles(articles);
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des articles :", error);
      loader.style.display = "none";
    });

  function displayArticles(articles) {
    articlesDiv.innerHTML = "";
    articles.forEach((article) => {
      const articleDiv = document.createElement("div");
      articleDiv.classList.add("articles-siecledigital");
      articleDiv.innerHTML = `
      <div class="d-flex mb-3 border border-white">
        <img src="${article.imageUrl}" alt="${article.title}" class="img-article" style="max-width: 300px; height: auto; object-fit: cover;">
        <div class="p-3">
          <h4>${article.title}</h4>
          <p>${article.date}</p>
          <a class="btn btn-light" href="${article.link}" target="_blank">En savoir plus</a>
        </div>
      </div>
      `;
      articlesDiv.appendChild(articleDiv);
    });
    loader.style.display = "none";
    console.log("Articles affichés :", articles);
  }
});
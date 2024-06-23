document.addEventListener("DOMContentLoaded", () => {
  const proxyUrl = "https://api.allorigins.win/get?url=";
  const targetUrl = "https://www.cnil.fr/fr/actualite";
  const loader = document.getElementById("loader");
  const articlesDiv = document.getElementById("articles-cnil");

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
      doc.querySelectorAll(".views-row .list-item").forEach((element) => {
        const titleElement = element.querySelector("h3 a");
        const title = titleElement.textContent.trim();
        const link = "https://www.cnil.fr" + titleElement.getAttribute("href");
        const date = element.querySelector(".date").textContent.trim();
        const imageElement = element.querySelector("img");
        const imageUrl = imageElement
          ? "https://www.cnil.fr" + imageElement.getAttribute("src")
          : "images/cnil.png";

        articles.push({ title, link, date, imageUrl });
      });

      displayArticles(articles);
    })
    .catch((error) => {
      console.error("Error fetching the page:", error);
      loader.style.display = "none";
    });

  function displayArticles(articles) {
    articlesDiv.innerHTML = "";
    articles.forEach((article) => {
      const articleDiv = document.createElement("div");
      articleDiv.classList.add("article-cyber");
      articleDiv.innerHTML = `
          <img src="${article.imageUrl}" alt="${article.title}" class="img-article">
          <div class="p-3">
            <h4>${article.title}</h4>
            <p>${article.date}</p>
            <a class="btn btn-light" href="${article.link}" target="_blank">En savoir plus</a>
          </div>
        `;
      articlesDiv.appendChild(articleDiv);
    });
    loader.style.display = "none";
    console.log("Articles displayed:", articles);
  }
});

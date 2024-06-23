document.addEventListener("DOMContentLoaded", () => {
  const proxyUrl = "https://api.allorigins.win/get?url=";
  const targetUrl = "https://cyber.gouv.fr/publications";
  const loader = document.getElementById("loader");
  const articlesDiv = document.getElementById("articles-cyber");

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
        const titleElement = element.querySelector("h3");
        const title = titleElement ? titleElement.textContent.trim() : "";
        const linkElement = element.closest("a");
        const link = linkElement
          ? "https://cyber.gouv.fr" + linkElement.getAttribute("href")
          : "#";
        const date = element.querySelector(".date")
          ? element.querySelector(".date").textContent.trim()
          : "";
        const descriptionElement = element.querySelector(".field-body");
        let description = descriptionElement
          ? descriptionElement.textContent.trim()
          : "";
        if (description.length > 115) {
          description = description.substring(0, 115) + "…";
        }
        const imageElement = element.querySelector("img");
        const imageUrl = imageElement
          ? "https://cyber.gouv.fr" + imageElement.getAttribute("src")
          : "images/default.png";

        articles.push({ title, link, date, description, imageUrl });
      });

      displayArticles(articles.slice(0, 9));
    })
    .catch((error) => {
      console.error("Error fetching the page:", error);
      loader.style.display = "none";
    });

  function displayArticles(articles) {
    articlesDiv.innerHTML = "";
    articles.forEach((article) => {
      const articleDiv = document.createElement("div");
      articleDiv.classList.add("col-md-4", "mb-4");
      articleDiv.innerHTML = `
              <div class="card h-100 d-flex flex-column justify-content-between">
                  <img src="${article.imageUrl}" class="card-img-top" alt="${article.title}">
                  <div class="card-body">
                      <p class="card-text xs-regular">${article.date}</p>
                      <h5 class="card-title">${article.title}</h5>
                      <p class="card-text ellipsis">${article.description}</p>
                  </div>
                  <a href="${article.link}" class="btn btn-primary" target="_blank">En savoir plus</a>
              </div>
          `;
      articlesDiv.appendChild(articleDiv);
    });
    loader.style.display = "none";
    console.log("Articles displayed:", articles);
  }
});

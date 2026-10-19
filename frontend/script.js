
const newsContainer =
    document.getElementById("newsContainer");

const searchInput =
    document.getElementById("searchInput");

const searchButton =
    document.getElementById("searchButton");

const currentCategory =
    document.getElementById("currentCategory");


// ===============================
// GET NEWS FROM FLASK
// ===============================

async function getNews(category = "general") {

    currentCategory.textContent =
        category.charAt(0).toUpperCase() +
        category.slice(1);

    newsContainer.innerHTML = `
    <div class="loading-container">
        <div class="loader"></div>
        <p>Loading the latest news...</p>
    </div>
`;
        

    try {

        const response = await fetch(
            `http://127.0.0.1:5000/api/news?category=${category}`
        );

        const articles = await response.json();

        if (!response.ok) {

            throw new Error(
                articles.error || "Failed to fetch news"
            );

        }

        displayNews(articles);

    } catch (error) {

        console.error(error);

        newsContainer.innerHTML = `
            <p>
                Unable to load news.
                Please check whether the Python server is running.
            </p>
        `;
    }
}


// ===============================
// DISPLAY NEWS
// ===============================

function displayNews(articles) {

    newsContainer.innerHTML = "";

    if (!articles || articles.length === 0) {

        newsContainer.innerHTML =
            "<p>No news found.</p>";

        return;
    }


    articles.forEach(function(article) {

        const card =
            document.createElement("article");

        card.className = "news-card";


        const image =
            article.urlToImage
            ? article.urlToImage
            : "";


        card.innerHTML = `

            ${
                image
                ? `<img
                    src="${image}"
                    alt="News image"
                    class="news-image"
                   >`
                : `
                   <div class="news-image">
                       📰
                   </div>
                  `
            }

            <div class="news-content">

                <span class="news-source">
                    ${
                        article.source
                        ? article.source.name
                        : "Unknown Source"
                    }
                </span>

                <h3>
                    ${
                        article.title ||
                        "No title available"
                    }
                </h3>

                <p>
                    ${
                        article.description ||
                        "No description available."
                    }
                </p>

                <button class="read-more">
                    Read More
                </button>

            </div>
        `;


        const readMoreButton =
            card.querySelector(".read-more");


        readMoreButton.addEventListener(
            "click",
            function() {

                if (article.url) {

                    window.open(
                        article.url,
                        "_blank"
                    );

                }

            }
        );


        newsContainer.appendChild(card);

    });
}


// ===============================
// CATEGORY BUTTONS
// ===============================

const categoryLinks = document.querySelectorAll(".navbar nav a");

categoryLinks.forEach(function(link) {
    link.addEventListener("click", function(event) {
        event.preventDefault();

        const category = link.textContent.trim().toLowerCase();

        categoryLinks.forEach(function(item) {
            item.classList.remove("active");
        });

        link.classList.add("active");
        searchInput.value = "";

        getNews(category);
    });
});


// ===============================
// SEARCH NEWS
// ===============================

async function searchNews() {

    const keyword =
        searchInput.value.trim();


    if (keyword === "") {

        alert(
            "Please enter a keyword."
        );

        return;
    }


    currentCategory.textContent =
        "Search Results";


    newsContainer.innerHTML = `
    <div class="loading-container">
        <div class="loader"></div>
        <p>Searching the latest news...</p>
    </div>
`;


    try {

        const response = await fetch(
            `http://127.0.0.1:5000/api/search?q=${encodeURIComponent(keyword)}`
        );


        const articles =
            await response.json();


        if (!response.ok) {

            throw new Error(
                articles.error ||
                "Search failed"
            );

        }


        displayNews(articles);

    } catch (error) {

        console.error(error);

        newsContainer.innerHTML = `
            <p>
                Unable to search news.
                Please check the Python server.
            </p>
        `;

    }

}


// Search button
searchButton.addEventListener(
    "click",
    searchNews
);


// Press Enter to search
searchInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            searchNews();

        }

    }
);


// ===============================
// LOAD GENERAL NEWS
// ===============================

getNews("general");

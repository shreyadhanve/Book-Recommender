function createBookCard(book) {
    return `
    <div class="col-lg-3 col-md-4 col-6">
        <div class="card book-card shadow-sm position-relative">

            <div class="fav-icon" onclick="toggleFavorite('${book.id}')">
                ${getFavorites().includes(book.id) ? "💖" : "🤍"}
            </div>

            <img src="${book.image}" class="card-img-top">

            <div class="card-body">
                <h6>${book.title}</h6>
                <p class="author">by ${book.author}</p>
                <p class="rating">⭐ ${book.rating}</p>

                <p class="desc short" id="desc-${book.id}">
                    ${book.description}
                </p>

               <span class="read-more-btn">
                    Read More
                </span>

                <a href="${book.link}" 
   class="btn btn-primary btn-sm w-100 buy-btn">
   Buy
</a>
            </div>
        </div>
    </div>
    `;
}
function displayPopularBooks() {

    let container = document.getElementById("popularBooks");

    if (!container) return;

    let popular = bookList.filter(function (book) {
        return book.popular === true;
    });

    container.innerHTML = "";

    popular.forEach(function (book) {
        container.innerHTML += createBookCard(book);
    });
}
function displayBooks(list) {
    let container = document.getElementById("books");
    container.innerHTML = "";

    if (list.length === 0) {
        container.innerHTML = "<p>No books found 🔍</p>";
        return;
    }

    list.forEach(function (book) {
        container.innerHTML += createBookCard(book);
    });
}
function getFavorites() {
    return JSON.parse(localStorage.getItem("favorites")) || [];
}

function saveFavorites(favs) {
    localStorage.setItem("favorites", JSON.stringify(favs));
}

function toggleFavorite(id) {
    let favs = JSON.parse(localStorage.getItem("favorites")) || [];

    if (favs.includes(id)) {
        favs = favs.filter(f => f !== id);
    } else {
        favs.push(id);
    }

    localStorage.setItem("favorites", JSON.stringify(favs));

    showSection("favoriteSection");
    displayFavorites();
}
function displayFavorites() {
    let favs = getFavorites();

    let favBooks = bookList.filter(book => favs.includes(book.id));

    let container = document.getElementById("favorites");
    container.innerHTML = "";

    favBooks.forEach(function (book) {
        container.innerHTML += createBookCard(book);
    });
}

function toggleReadMore(id) {
    let desc = document.getElementById(`desc-${id}`);

    if (desc.classList.contains("short")) {
        desc.classList.remove("short");
        desc.classList.add("full");
    } else {
        desc.classList.remove("full");
        desc.classList.add("short");
    }
}
function showSection(sectionId) {
    document.getElementById("popularSection").style.display = "none";
    document.getElementById("recommendSection").style.display = "none";
    document.getElementById("favoriteSection").style.display = "none";

    document.getElementById(sectionId).style.display = "block";
}
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("searchInput").addEventListener("input", function () {
    let query = this.value.toLowerCase().trim();

    // If search is cleared, go back to popular books
    if (query === "") {
        showSection("popularSection");
        displayPopularBooks();
        return;
    }

    let filtered = bookList.filter(function (book) {
        return (
            (book.title && book.title.toLowerCase().includes(query)) ||
            (book.author && book.author.toLowerCase().includes(query)) ||
            (book.genre && book.genre.toLowerCase().includes(query))
        );
    });

    showSection("recommendSection");
    displayBooks(filtered);
});

    document.getElementById("darkToggle").addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");
    });

    document.getElementById("favBtn").addEventListener("click", function () {
        showSection("favoriteSection");
        displayFavorites();
    });
    showSection("popularSection");
displayPopularBooks();

document.getElementById("btn").addEventListener("click", function () {

    console.log("Recommend clicked");

    let genre = document.getElementById("genre").value;
    let mood = document.getElementById("mood").value;

    let result = bookList.filter(function (book) {
        return (
            (genre === "" || book.genre === genre) &&
            (mood === "" || book.mood === mood)
        );
    });

    // ✅ SMART FALLBACK LOGIC
    if (result.length === 0) {

        let genreMatch = bookList.filter(book => book.genre === genre);
        let moodMatch = bookList.filter(book => book.mood === mood);

        let fallback = genreMatch.length ? genreMatch :
                       moodMatch.length ? moodMatch :
                       bookList;

        showSection("recommendSection");
        displayBooks(fallback);

    } else {
        showSection("recommendSection");
        displayBooks(result);
    }

    console.log(genre, mood);
});

});

document.addEventListener("click", function (e) {
    if (e.target.classList.contains("read-more-btn")) {

        let desc = e.target.previousElementSibling;

        if (desc.classList.contains("short")) {
            desc.classList.remove("short");
            desc.classList.add("full");
            e.target.innerText = "Read Less";
        } else {
            desc.classList.remove("full");
            desc.classList.add("short");
            e.target.innerText = "Read More";
        }
    }
});

document.addEventListener("click", function (e) {

    if (e.target.classList.contains("buy-btn")) {
        e.preventDefault();

        let link = e.target.getAttribute("href");

        let confirmRedirect = confirm("You will be redirected to Amazon. Continue?");

        if (confirmRedirect) {
            window.open(link, "_blank");
        }
    }

});

document.addEventListener("DOMContentLoaded", () => {

    const year =
        document.getElementById("year");

    if (year) {

        year.textContent =
            new Date().getFullYear();

    }


    const gameCount =
        document.getElementById("gameCount");

    if (gameCount) {

        gameCount.textContent = "9";

    }

});
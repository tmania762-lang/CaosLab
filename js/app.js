/* =========================================================
   CAOSLAB V1.2
   APP PRINCIPAL
   ========================================================= */

(function () {

    "use strict";


    /* ---------------------------------------------------------
       AÑO ACTUAL
       --------------------------------------------------------- */

    const yearElement =
        document.getElementById("year");


    if (yearElement) {

        yearElement.textContent =
            new Date().getFullYear();

    }


    /* ---------------------------------------------------------
       CONTADOR DE JUEGOS
       --------------------------------------------------------- */

    const gameCountElement =
        document.getElementById("gameCount");


    if (gameCountElement) {

        gameCountElement.textContent =
            "9";

    }


    /* ---------------------------------------------------------
       ESTADÍSTICAS
       --------------------------------------------------------- */

    function updateStatsPreview() {

        if (
            typeof window.CAOSLAB_STATS ===
            "undefined"
        ) {

            return;

        }


        const stats =
            window.CAOSLAB_STATS.get();


        const pointsElement =
            document.getElementById(
                "totalPoints"
            );


        const gamesElement =
            document.getElementById(
                "totalGames"
            );


        const winsElement =
            document.getElementById(
                "totalWins"
            );


        if (pointsElement) {

            pointsElement.textContent =
                stats.points;

        }


        if (gamesElement) {

            gamesElement.textContent =
                stats.totalGames;

        }


        if (winsElement) {

            winsElement.textContent =
                stats.wins;

        }

    }


    /* ---------------------------------------------------------
       INICIALIZAR
       --------------------------------------------------------- */

    updateStatsPreview();


})();
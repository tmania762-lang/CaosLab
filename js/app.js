/* =========================================================
   CAOSLAB V1.3
   APP PRINCIPAL
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       AÑO
       ===================================================== */

    const yearElement =
        document.getElementById(
            "year"
        );


    if (yearElement) {

        yearElement.textContent =
            new Date().getFullYear();

    }


    /* =====================================================
       NÚMERO DE JUEGOS
       ===================================================== */

    const gameCountElement =
        document.getElementById(
            "gameCount"
        );


    if (gameCountElement) {

        gameCountElement.textContent =
            "9";

    }


    /* =====================================================
       ESTADÍSTICAS
       ===================================================== */

    function updateStatsPreview() {

        if (
            typeof window.CAOSLAB_STATS ===
            "undefined"
        ) {

            return;

        }


        const stats =
            window.CAOSLAB_STATS.get();


        /* =================================================
           PUNTOS
           ================================================= */

        const pointsElement =
            document.getElementById(
                "totalPoints"
            );


        if (pointsElement) {

            pointsElement.textContent =
                stats.points;

        }


        /* =================================================
           PARTIDAS
           ================================================= */

        const gamesElement =
            document.getElementById(
                "totalGames"
            );


        if (gamesElement) {

            gamesElement.textContent =
                stats.totalGames;

        }


        /* =================================================
           VICTORIAS
           ================================================= */

        const winsElement =
            document.getElementById(
                "totalWins"
            );


        if (winsElement) {

            winsElement.textContent =
                stats.wins;

        }


        /* =================================================
           NIVEL
           ================================================= */

        const levelElement =
            document.getElementById(
                "playerLevelPreview"
            );


        if (
            levelElement &&
            typeof window.CAOSLAB_STATS.getLevel ===
            "function"
        ) {

            levelElement.textContent =
                window.CAOSLAB_STATS.getLevel(
                    stats.points
                );

        }


        /* =================================================
           RACHA
           ================================================= */

        const streakElement =
            document.getElementById(
                "streakPreview"
            );


        if (
            streakElement &&
            typeof window.CAOSLAB_STATS.getStreak ===
            "function"
        ) {

            streakElement.textContent =
                window.CAOSLAB_STATS.getStreak();

        }

    }


    /* =====================================================
       ACTUALIZACIÓN INICIAL
       ===================================================== */

    updateStatsPreview();


})();
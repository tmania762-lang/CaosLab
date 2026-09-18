/* =========================================================
   CAOSLAB V1.2
   SISTEMA DE ESTADÍSTICAS
   ========================================================= */

(function () {

    "use strict";


    const STORAGE_KEY = "caoslab_stats_v1";


    /* ---------------------------------------------------------
       DATOS INICIALES
       --------------------------------------------------------- */

    const defaultStats = {

        totalGames: 0,

        wins: 0,

        losses: 0,

        points: 0,

        bestScore: 0,

        achievements: [],

        games: {}

    };


    /* ---------------------------------------------------------
       CARGAR ESTADÍSTICAS
       --------------------------------------------------------- */

    function loadStats() {

        try {

            const saved =
                localStorage.getItem(STORAGE_KEY);


            if (!saved) {

                return JSON.parse(
                    JSON.stringify(defaultStats)
                );

            }


            const data =
                JSON.parse(saved);


            return {

                ...defaultStats,

                ...data,

                games: {

                    ...defaultStats.games,

                    ...(data.games || {})

                },

                achievements:
                    Array.isArray(data.achievements)
                        ? data.achievements
                        : []

            };

        }

        catch (error) {

            console.warn(
                "CAOSLAB: no se pudieron cargar las estadísticas."
            );


            return JSON.parse(
                JSON.stringify(defaultStats)
            );

        }

    }


    /* ---------------------------------------------------------
       GUARDAR ESTADÍSTICAS
       --------------------------------------------------------- */

    function saveStats(stats) {

        try {

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(stats)
            );

        }

        catch (error) {

            console.warn(
                "CAOSLAB: no se pudieron guardar las estadísticas."
            );

        }

    }


    /* ---------------------------------------------------------
       OBTENER ESTADÍSTICAS
       --------------------------------------------------------- */

    function getStats() {

        return loadStats();

    }


    /* ---------------------------------------------------------
       REGISTRAR PARTIDA
       --------------------------------------------------------- */

    function recordGame(
        gameName,
        result = "played",
        points = 0
    ) {

        const stats =
            loadStats();


        stats.totalGames++;


        if (result === "win") {

            stats.wins++;

        }


        if (result === "loss") {

            stats.losses++;

        }


        const safePoints =
            Number.isFinite(Number(points))
                ? Number(points)
                : 0;


        stats.points += safePoints;


        if (safePoints > stats.bestScore) {

            stats.bestScore =
                safePoints;

        }


        if (!stats.games[gameName]) {

            stats.games[gameName] = {

                played: 0,

                wins: 0,

                losses: 0,

                points: 0,

                bestScore: 0

            };

        }


        const game =
            stats.games[gameName];


        game.played++;


        if (result === "win") {

            game.wins++;

        }


        if (result === "loss") {

            game.losses++;

        }


        game.points +=
            safePoints;


        if (
            safePoints >
            game.bestScore
        ) {

            game.bestScore =
                safePoints;

        }


        saveStats(stats);


        checkAchievements(stats);


        return stats;

    }


    /* ---------------------------------------------------------
       AÑADIR PUNTOS
       --------------------------------------------------------- */

    function addPoints(points) {

        const stats =
            loadStats();


        const safePoints =
            Number.isFinite(Number(points))
                ? Number(points)
                : 0;


        stats.points +=
            safePoints;


        if (
            safePoints >
            stats.bestScore
        ) {

            stats.bestScore =
                safePoints;

        }


        saveStats(stats);


        checkAchievements(stats);


        return stats;

    }


    /* ---------------------------------------------------------
       LOGROS
       --------------------------------------------------------- */

    function unlockAchievement(id) {

        const stats =
            loadStats();


        if (
            !stats.achievements.includes(id)
        ) {

            stats.achievements.push(id);


            saveStats(stats);


            return true;

        }


        return false;

    }


    /* ---------------------------------------------------------
       COMPROBAR LOGROS
       --------------------------------------------------------- */

    function checkAchievements(stats) {

        const achievements = [];


        if (
            stats.totalGames >= 1
        ) {

            achievements.push(
                "first_game"
            );

        }


        if (
            stats.totalGames >= 10
        ) {

            achievements.push(
                "ten_games"
            );

        }


        if (
            stats.wins >= 1
        ) {

            achievements.push(
                "first_win"
            );

        }


        if (
            stats.wins >= 5
        ) {

            achievements.push(
                "five_wins"
            );

        }


        if (
            stats.points >= 100
        ) {

            achievements.push(
                "hundred_points"
            );

        }


        if (
            stats.points >= 500
        ) {

            achievements.push(
                "five_hundred_points"
            );

        }


        achievements.forEach(
            function (id) {

                unlockAchievement(id);

            }
        );

    }


    /* ---------------------------------------------------------
       REINICIAR ESTADÍSTICAS
       --------------------------------------------------------- */

    function resetStats() {

        const freshStats =
            JSON.parse(
                JSON.stringify(defaultStats)
            );


        saveStats(freshStats);


        return freshStats;

    }


    /* ---------------------------------------------------------
       API PÚBLICA
       --------------------------------------------------------- */

    window.CAOSLAB_STATS = {

        get: getStats,

        save: saveStats,

        recordGame: recordGame,

        addPoints: addPoints,

        unlockAchievement:
            unlockAchievement,

        checkAchievements:
            checkAchievements,

        reset:
            resetStats

    };


})();
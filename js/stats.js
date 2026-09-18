/* =========================================================
   CAOSLAB V1.3
   SISTEMA DE ESTADÍSTICAS — VERSIÓN FINAL
   ========================================================= */

(function () {

    "use strict";

    const STORAGE_KEY = "caoslab_stats_v1";

    const defaultStats = {
        totalGames: 0,
        wins: 0,
        losses: 0,
        points: 0,
        bestScore: 0,
        streak: 0,
        bestStreak: 0,
        lastGameDate: "",
        achievements: [],
        games: {}
    };


    /* =====================================================
       UTILIDADES
       ===================================================== */

    function toSafeNumber(value, fallback = 0) {

        const number = Number(value);

        if (!Number.isFinite(number)) {
            return fallback;
        }

        return Math.round(number);
    }


    function createDefaultStats() {

        return {
            totalGames: 0,
            wins: 0,
            losses: 0,
            points: 0,
            bestScore: 0,
            streak: 0,
            bestStreak: 0,
            lastGameDate: "",
            achievements: [],
            games: {}
        };

    }


    function normalizeGameStats(game) {

        if (!game || typeof game !== "object") {
            return {
                plays: 0,
                wins: 0,
                losses: 0,
                points: 0,
                bestScore: 0
            };
        }

        return {
            plays: Math.max(
                0,
                toSafeNumber(game.plays)
            ),

            wins: Math.max(
                0,
                toSafeNumber(game.wins)
            ),

            losses: Math.max(
                0,
                toSafeNumber(game.losses)
            ),

            points: Math.max(
                0,
                toSafeNumber(game.points)
            ),

            bestScore: Math.max(
                0,
                toSafeNumber(game.bestScore)
            )
        };

    }


    /* =====================================================
       CARGAR ESTADÍSTICAS
       ===================================================== */

    function loadStats() {

        try {

            const saved =
                localStorage.getItem(STORAGE_KEY);

            if (!saved) {
                return createDefaultStats();
            }

            const parsed =
                JSON.parse(saved);

            if (
                !parsed ||
                typeof parsed !== "object"
            ) {
                return createDefaultStats();
            }

            const stats = {
                ...defaultStats,
                ...parsed
            };


            stats.totalGames =
                Math.max(
                    0,
                    toSafeNumber(stats.totalGames)
                );


            stats.wins =
                Math.max(
                    0,
                    toSafeNumber(stats.wins)
                );


            stats.losses =
                Math.max(
                    0,
                    toSafeNumber(stats.losses)
                );


            stats.points =
                Math.max(
                    0,
                    toSafeNumber(stats.points)
                );


            stats.bestScore =
                Math.max(
                    0,
                    toSafeNumber(stats.bestScore)
                );


            stats.streak =
                Math.max(
                    0,
                    toSafeNumber(stats.streak)
                );


            stats.bestStreak =
                Math.max(
                    0,
                    toSafeNumber(stats.bestStreak)
                );


            stats.lastGameDate =
                typeof stats.lastGameDate === "string"
                    ? stats.lastGameDate
                    : "";


            stats.achievements =
                Array.isArray(stats.achievements)
                    ? [...stats.achievements]
                    : [];


            stats.games =
                stats.games &&
                typeof stats.games === "object"
                    ? stats.games
                    : {};


            Object.keys(stats.games).forEach(
                function (gameName) {

                    stats.games[gameName] =
                        normalizeGameStats(
                            stats.games[gameName]
                        );

                }
            );


            return stats;

        } catch (error) {

            console.error(
                "CAOSLAB: error cargando estadísticas",
                error
            );

            return createDefaultStats();

        }

    }


    /* =====================================================
       GUARDAR ESTADÍSTICAS
       ===================================================== */

    function saveStats(stats) {

        try {

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(stats)
            );

            return true;

        } catch (error) {

            console.error(
                "CAOSLAB: error guardando estadísticas",
                error
            );

            return false;

        }

    }


    /* =====================================================
       FECHA ACTUAL
       ===================================================== */

    function getToday() {

        const date = new Date();

        const year =
            date.getFullYear();

        const month =
            String(
                date.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                date.getDate()
            ).padStart(2, "0");

        return (
            year +
            "-" +
            month +
            "-" +
            day
        );

    }


    /* =====================================================
       RACHA
       ===================================================== */

    function updateStreak(stats) {

        const today =
            getToday();


        /*
         * Si ya se ha jugado hoy,
         * la racha no aumenta otra vez.
         */

        if (
            stats.lastGameDate === today
        ) {
            return;
        }


        /*
         * Primera partida registrada.
         */

        if (!stats.lastGameDate) {

            stats.streak = 1;

        } else {

            const previous =
                new Date(
                    stats.lastGameDate +
                    "T00:00:00"
                );

            const current =
                new Date(
                    today +
                    "T00:00:00"
                );


            const difference =
                Math.round(
                    (
                        current -
                        previous
                    ) / 86400000
                );


            if (difference === 1) {

                stats.streak += 1;

            } else {

                stats.streak = 1;

            }

        }


        if (
            stats.streak >
            stats.bestStreak
        ) {

            stats.bestStreak =
                stats.streak;

        }


        stats.lastGameDate =
            today;

    }


    /* =====================================================
       LOGROS
       ===================================================== */

    function applyAchievements(stats) {

        if (
            !stats ||
            typeof stats !== "object"
        ) {
            return false;
        }


        if (
            !Array.isArray(
                stats.achievements
            )
        ) {

            stats.achievements = [];

        }


        let changed = false;


        function unlock(id) {

            if (
                !stats.achievements.includes(id)
            ) {

                stats.achievements.push(id);

                changed = true;

            }

        }


        /*
         * Primer juego
         */

        if (
            stats.totalGames >= 1
        ) {

            unlock("first_game");

        }


        /*
         * Diez partidas
         */

        if (
            stats.totalGames >= 10
        ) {

            unlock("ten_games");

        }


        /*
         * Primera victoria
         */

        if (
            stats.wins >= 1
        ) {

            unlock("first_win");

        }


        /*
         * Cinco victorias
         */

        if (
            stats.wins >= 5
        ) {

            unlock("five_wins");

        }


        /*
         * 100 puntos
         */

        if (
            stats.points >= 100
        ) {

            unlock("hundred_points");

        }


        /*
         * 500 puntos
         */

        if (
            stats.points >= 500
        ) {

            unlock("five_hundred_points");

        }


        /*
         * Racha de 3 días
         */

        if (
            stats.bestStreak >= 3
        ) {

            unlock("three_day_streak");

        }


        /*
         * Racha de 7 días
         */

        if (
            stats.bestStreak >= 7
        ) {

            unlock("seven_day_streak");

        }


        return changed;

    }


    function checkAchievements(stats) {

        if (!stats) {
            stats = loadStats();
        }

        const changed =
            applyAchievements(stats);


        if (changed) {
            saveStats(stats);
        }


        return stats;

    }


    /* =====================================================
       REGISTRAR PARTIDA
       ===================================================== */

    function recordGame(
        gameName,
        result,
        points
    ) {

        const stats =
            loadStats();


        const safeGameName =
            String(
                gameName ||
                "unknown"
            );


        const safeResult =
            String(
                result ||
                "play"
            ).toLowerCase();


        let safePoints =
            toSafeNumber(
                points
            );


        /*
         * Permitimos puntos negativos
         * en una ronda concreta, pero
         * nunca dejamos que el total
         * quede por debajo de cero.
         */

        stats.totalGames += 1;


        /*
         * Victoria
         */

        if (
            safeResult === "win"
        ) {

            stats.wins += 1;

        }


        /*
         * Derrota
         */

        else if (
            safeResult === "loss"
        ) {

            stats.losses += 1;

        }


        /*
         * Puntos generales
         */

        stats.points +=
            safePoints;


        if (
            stats.points < 0
        ) {

            stats.points = 0;

        }


        /*
         * Mejor puntuación
         */

        if (
            safePoints > 0 &&
            safePoints >
            stats.bestScore
        ) {

            stats.bestScore =
                safePoints;

        }


        /*
         * Racha
         */

        updateStreak(stats);


        /*
         * Crear estadísticas
         * del juego si no existen.
         */

        if (
            !stats.games[safeGameName]
        ) {

            stats.games[safeGameName] = {

                plays: 0,
                wins: 0,
                losses: 0,
                points: 0,
                bestScore: 0

            };

        }


        const gameStats =
            stats.games[safeGameName];


        /*
         * Partidas
         */

        gameStats.plays += 1;


        /*
         * Victorias
         */

        if (
            safeResult === "win"
        ) {

            gameStats.wins += 1;

        }


        /*
         * Derrotas
         */

        else if (
            safeResult === "loss"
        ) {

            gameStats.losses += 1;

        }


        /*
         * Puntos del juego
         */

        gameStats.points +=
            safePoints;


        if (
            gameStats.points < 0
        ) {

            gameStats.points = 0;

        }


        /*
         * Mejor puntuación
         * individual del juego.
         */

        if (
            safePoints > 0 &&
            safePoints >
            gameStats.bestScore
        ) {

            gameStats.bestScore =
                safePoints;

        }


        /*
         * Comprobar logros
         * antes de guardar.
         */

        applyAchievements(stats);


        /*
         * Guardado único.
         */

        saveStats(stats);


        return stats;

    }


    /* =====================================================
       AÑADIR PUNTOS MANUALMENTE
       ===================================================== */

    function addPoints(points) {

        const stats =
            loadStats();


        const safePoints =
            toSafeNumber(
                points
            );


        stats.points +=
            safePoints;


        if (
            stats.points < 0
        ) {

            stats.points = 0;

        }


        applyAchievements(stats);

        saveStats(stats);


        return stats;

    }


    /* =====================================================
       DESBLOQUEAR LOGRO MANUALMENTE
       ===================================================== */

    function unlockAchievement(
        achievementId
    ) {

        const stats =
            loadStats();


        const id =
            String(
                achievementId || ""
            );


        if (!id) {
            return false;
        }


        if (
            stats.achievements.includes(id)
        ) {

            return false;

        }


        stats.achievements.push(id);

        saveStats(stats);


        return true;

    }


    /* =====================================================
       OBTENER ESTADÍSTICAS DE UN JUEGO
       ===================================================== */

    function getGameStats(
        gameName
    ) {

        const stats =
            loadStats();


        const name =
            String(
                gameName || ""
            );


        if (
            !stats.games[name]
        ) {

            return {
                plays: 0,
                wins: 0,
                losses: 0,
                points: 0,
                bestScore: 0
            };

        }


        return normalizeGameStats(
            stats.games[name]
        );

    }


    /* =====================================================
       REINICIAR TODO
       ===================================================== */

    function reset() {

        try {

            localStorage.removeItem(
                STORAGE_KEY
            );

            return true;

        } catch (error) {

            console.error(
                "CAOSLAB: error reiniciando estadísticas",
                error
            );

            return false;

        }

    }


    /* =====================================================
       NIVELES
       ===================================================== */

    function getLevel(points) {

        const safePoints =
            Math.max(
                0,
                toSafeNumber(points)
            );


        return (
            Math.floor(
                safePoints / 100
            ) + 1
        );

    }


    function getLevelProgress(points) {

        const safePoints =
            Math.max(
                0,
                toSafeNumber(points)
            );


        return (
            safePoints % 100
        );

    }


    function getNextLevelPoints(points) {

        return (
            getLevel(points) * 100
        );

    }


    /* =====================================================
       API PÚBLICA
       ===================================================== */

    window.CAOSLAB_STATS = {

        get: loadStats,

        save: saveStats,

        recordGame: recordGame,

        addPoints: addPoints,

        unlockAchievement:
            unlockAchievement,

        checkAchievements:
            checkAchievements,

        getGameStats:
            getGameStats,

        reset: reset,

        getLevel: getLevel,

        getLevelProgress:
            getLevelProgress,

        getNextLevelPoints:
            getNextLevelPoints,

        getStreak: function () {

            return loadStats().streak;

        },

        getBestStreak: function () {

            return loadStats().bestStreak;

        }

    };


})();
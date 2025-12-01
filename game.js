export const gameState = {
    playerName: '',
    genre: '',
    stats: {
        str: 0,
        int: 0,
        dex: 0
    },
    history: [] // Stores the conversation history
};

export function initGame(name, genre, stats) {
    gameState.playerName = name;
    gameState.genre = genre;
    gameState.stats = stats;
    gameState.history = [];
}

export function addToHistory(role, content) {
    gameState.history.push({ role, content });
}

export function getHistory() {
    return gameState.history;
}

export function createSystemPrompt() {
    const { playerName, genre, stats } = gameState;

    return `Du bist ein Game Master für ein Text-Adventure.
    
    Spieler-Info:
    - Name: ${playerName}
    - Genre: ${genre}
    - Attribute: Stärke ${stats.str}, Intelligenz ${stats.int}, Geschick ${stats.dex}
    
    Deine Aufgabe:
    1. Führe den Spieler durch ein spannendes Abenteuer im gewählten Genre.
    2. Sei beschreibend und atmosphärisch.
    3. Biete dem Spieler am Ende jeder Nachricht 2-3 konkrete Handlungsoptionen an, aber erlaube auch freie Eingaben.
    4. Berücksichtige die Attribute des Spielers bei Herausforderungen (z.B. ein starker Charakter kann Türen eintreten, ein intelligenter Codes knacken).
    5. Halte die Antworten prägnant (max. 150 Wörter), damit der Spielfluss erhalten bleibt.
    6. Starte das Spiel jetzt mit einer kurzen Einleitung und der ersten Situation.
    
    WICHTIG: Antworte NICHT als KI, sondern bleibe immer in der Rolle des Erzählers/Game Masters.`;
}

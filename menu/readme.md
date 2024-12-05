```javascript
let selectedPlayer = null; // Aktueller Spieler: null, 'P1', 'P2'
let confirmedPlayers = {}; // Bestätigte Spieler: { P1: character1, P2: character2 }

const h1 = document.querySelector('h1');
const menu = document.querySelector('main');
h1.textContent = "Select your Character";

menu.addEventListener('click', (e) => {
    const target = e.target;

    // Nur auf gültige Charaktere reagieren
    if (!target.classList.contains('character') || !target.classList.contains('collected')) return;

    const isP1 = target.id === confirmedPlayers.P1;
    const isP2 = target.id === confirmedPlayers.P2;

    if (selectedPlayer === null) {
        // Auswahl für P1
        selectedPlayer = 'P1';
        target.classList.add('selected');
        h1.textContent = "Confirm your Selection for Player 1";
    } else if (selectedPlayer === 'P1') {
        if (isP1) {
            // P1 bestätigen
            confirmedPlayers.P1 = target.id;
            selectedPlayer = null;
            target.classList.add('confirmed');
            h1.textContent = "Player 1 Confirmed. Select Player 2";
        } else {
            // P1 Auswahl rückgängig
            resetSelection(target);
        }
    } else if (selectedPlayer === 'P2') {
        if (isP2) {
            // P2 bestätigen
            confirmedPlayers.P2 = target.id;
            selectedPlayer = null;
            target.classList.add('confirmed');
            h1.textContent = "Player 2 Confirmed!";
        } else {
            // P2 Auswahl rückgängig
            resetSelection(target);
        }
    } else if (!confirmedPlayers.P1 || !confirmedPlayers.P2) {
        // Auswahl für P2 starten
        selectedPlayer = 'P2';
        target.classList.add('selected');
        h1.textContent = "Confirm your Selection for Player 2";
    }
});
/* 
// Hilfsfunktion: Auswahl zurücksetzen
function resetSelection(target) {
    target.classList.remove('selected', 'confirmed');
    h1.textContent = selectedPlayer === 'P1' ? "Select your Character for Player 1" : "Select your Character for Player 2";
}

das sit der code von gpt verwende diesen um deinen anzupassen
*/ 
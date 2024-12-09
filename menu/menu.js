console.log("menu.js loaded");
const menu = document.querySelector('main');
const h1 = document.querySelector('h1');


// confirm variablen, diese werden auf true gesetzt, wenn der Spieler seine Auswahl bestätigt
const menuMusic = new Audio('.././assets/sounds/BGMusik/Arp & Synth Music/Menu.mp3');
menuMusic.volume = 0.3;
menuMusic.loop = true;

document.addEventListener('DOMContentLoaded', () => {
    menuMusic.play().catch(err => console.error("konnte nicht abspielen: ", err));
}
);
let p1MapConfirm = false;
let p2MapConfirm = false;
let SelectedP1 = null;
let SelectedP2 = null;
let SelectedMap = null;
let mapUrl = null;
let playerOneConfirmed = false;
let playerTwoConfirmed = false;
if(menu){
// das /* hmtl */ wird verwendet um Syntaxhighlighting zu aktivieren, kann aber nur verwendet werden wenn man das nötige Plugin installiert hat.
menu.innerHTML = /* html */ ` 
<div id="bancho" class="character collected"><p class="playerName"></p><p>Bancho</p></div>
<div id="battingGirl" class="character collected"><p class="playerName"></p><p>Batty</p></div>
<div id="bruteArms" class="character collected"><p class="playerName"></p><p>Brutus</p></div>
<div id="character4" class="character"><p class="playerName"></p><p>Coming Soon</p></div>
<div id="character5" class="character"><p class="playerName"></p><p>Coming Soon</p></div>
<div id="character6" class="character"><p class="playerName"></p><p>Coming Soon</p></div>
<div id="character7" class="character"><p class="playerName"></p><p>Coming Soon</p></div>
<div id="character8" class="character"><p class="playerName"></p><p>Coming Soon</p></div>
`;
}

const mapMusic = {
    map1: "",
    map2: "",
    map3: "",
    map4: "",
    map5: "",
    map6: "",
    map7: "",
    map8: ""
}
// das erstellen der CharakterClass um nicht für jede ein objekt zu machen
class Character {
    constructor(name, url) {
        this.name = name;
        this.url = url;
    }
}

const bancho = new Character("bancho", "url(characterImg/Bancho_Idle1.png)");
const battingGirl = new Character("battingGirl", "url(characterImg/BattingGirl_Idle1.png)");
const bruteArms = new Character("bruteArms", "url(characterImg/BruteArm_Idle1.png)");
const placeHolder = new Character("placeholder", "url(characterImg/placesHolder.png)");

const Clicksound = new Audio('.././assets/sounds/Free Sounds Pack/Interface 1-1.wav');
const confimy = new Audio('.././assets/sounds/Free Sounds Pack/Magical Interface 5-1.wav');


// das ist eine Hilfsfunktion um den Hintergrund der Objekte zu setzen zu setzen
function setBackground(id, url) {
    document.getElementById(id).style.background = `${url} center center/cover no-repeat`;
}

setBackground('bancho', bancho.url);
setBackground('battingGirl', battingGirl.url);
setBackground('bruteArms', bruteArms.url);
setBackground('character4', placeHolder.url);
setBackground('character5', placeHolder.url);
setBackground('character6', placeHolder.url);
setBackground('character7', placeHolder.url);
setBackground('character8', placeHolder.url);


document.addEventListener('DOMContentLoaded', initCharacterMenu);



h1.textContent = 'Player 1: Select your Character';

const character = {
    bancho: bancho,
    battingGirl: battingGirl,
    bruteArms: bruteArms,
}

// Event Listener
function initCharacterMenu() {
    menu.addEventListener('click', (e) => {
        
        const target = e.target.closest('.character');
    
        if (!target || !target.classList.contains('collected') || target.classList.contains('confirmed')) return;
    
        // Player 1 Auswahl und Bestätigung
        if (!playerOneConfirmed) {
            if (SelectedP1 === null) {
                Clicksound.play().catch(err => console.error("konnte nicht abspielen: ", err));             
                SelectedP1 = target; // es wird das ganze hmtl objekt gespiechert aus welchem nachher das nur die Id extrahiert wird.
                target.classList.add('selected'); 
                h1.textContent = "Player 1: Click again on the same character to confirm";
                target.querySelector('.playerName').textContent = "Player 1";
            } else if (SelectedP1 === target) {
                confimy.play().catch(err => console.error("konnte nicht abspielen: ", err));             
                target.classList.remove('selected');
                target.querySelector('.playerName').classList.add('confirmed');
                h1.textContent = "Player 2, your turn!";
                playerOneConfirmed = true;
            } else {
                Clicksound.play().catch(err => console.error("konnte nicht abspielen: ", err));             
                SelectedP1.classList.remove('selected');
                SelectedP1.querySelector('.playerName').textContent = "";
                target.classList.add('selected');
                SelectedP1 = target;
                target.querySelector('.playerName').textContent = "Player 1";
            }

           // console.log(SelectedP1); // debuggin um zu überpfüfen welcher character gespeichert wird, hier wird das ganze objekt ausgegeben.
        }
        // Player 2 Auswahl und Bestätigung
        else if (playerOneConfirmed && !playerTwoConfirmed && target !== SelectedP1) {
            if (SelectedP2 === null) {
                Clicksound.play().catch(err => console.error("konnte nicht abspielen: ", err));             
                SelectedP2 = target;
                target.classList.add('selected');
                h1.textContent = "Player 2: Click again on the same character to confirm";
                target.querySelector('.playerName').textContent = "Player 2";
            } else if (SelectedP2 === target) {
                confimy.play().catch(err => console.error("konnte nicht abspielen: ", err));             
                target.classList.remove('selected');
                target.querySelector('.playerName').classList.add('confirmed');
                h1.textContent = "Selection Complete!";                
                playerTwoConfirmed = true;
            } else {
                Clicksound.play().catch(err => console.error("konnte nicht abspielen: ", err));
                SelectedP2.classList.remove('selected');
                SelectedP2.querySelector('.playerName').textContent = "";
                target.classList.add('selected');
                SelectedP2 = target;
                target.querySelector('.playerName').textContent = "Player 2";
            }
        }
        h1.textContent = playerOneConfirmed && playerTwoConfirmed ? 'Map Loading ...' : h1.textContent;
        setTimeout(() => {
            initMapMenu();
        }, 2000);
    });
}


function initMapMenu() {
    if(playerOneConfirmed && playerTwoConfirmed) {

        h1.textContent = 'Select your Map';
        menu.classList.remove('menu');
        menu.classList.add('mapMenu');

        // beachte das /* hmtl */ wieder mal um Syntaxhighlighting zu aktivieren
        menu.innerHTML = /* html */ ` 
        <div id="showCaseContainer">
            <div id="P1Head" class="playerHead">P1</div>
            <div id="showCase">my Map</div>
            <div id="P2Head" class="playerHead">P2</div>
        </div>

        <div id="map-select">
            <div id="map1" class="map">Vally</div>
            <div id="map2" class="map">backalley</div>
            <div id="map3" class="map">Main-Street</div>
            <div id="map4" class="map">Old City</div>
            <div id="map5" class="map">Forgotten Carneval</div>
            <div id="map6" class="map">abandoned station</div>
            <div id="map7" class="map">Rustedplace</div>
            <div id="map8" class="map">Slums</div>
        </div>
        `;

        setBackground('map1', 'url(../assets/background/alley.png)');
        setBackground('map2', 'url(../assets/background/backalley.png)');
        setBackground('map3', 'url(../assets/background/mainStreet.jpg)');
        setBackground('map4', 'url(../assets/background/postapocalypse2.png)');
        setBackground('map5', 'url(../assets/background/postapocalypse3.png)');
        setBackground('map6', 'url(../assets/background/postapocalypse4.png)');
        setBackground('map7', 'url(../assets/background/Rusted_4.webp)');
        setBackground('map8', 'url(../assets/background/slums.png)');
        document.getElementById('P1Head').style.background = SelectedP1.style.background;
        document.getElementById('P2Head').style.background = SelectedP2.style.background;
        
        
        menu.addEventListener('click', (e) => {

            const target = e.target.closest('.map');
            if (!target) return; // wenn das target nicht die klasse map hat, dann wird die funktion abgebrochen
            if(!target.classList.contains('map') && !target.classList.contains('playerHead')) return;
            Clicksound.play().catch(err => console.error("konnte nicht abspielen: ", err));
                p1MapConfirm = false;
                p2MapConfirm = false;
                document.getElementById('P1Head').style.boxShadow = '0px 0px 10px 5px #fff';
                document.getElementById('P2Head').style.boxShadow = '0px 0px 10px 5px #fff';
                document.getElementById('P1Head').classList.remove('confirmed');
                document.getElementById('P2Head').classList.remove('confirmed');
                SelectedMap = target;
                target.classList.add('selected');
    
                document.getElementById('showCase').style.background = target.style.background;
                document.getElementById('showCase').textContent = target.textContent;
    
                document.body.style.background = target.style.background;
                const background = target.style.background;
                mapUrl = background.match(/url\((['"]?)(.*?)\1\)/)?.[2] || null; // regex um die url aus dem background zu extrahieren
                
        });
    
        menu.addEventListener('click', (e) => {
            const target = e.target.closest('.playerHead');
            h1.textContent = "Both Players, please click on your Character to confirm";

            if (!target) return;
            
            if(SelectedMap !== null && target.id === 'P1Head'){
                confimy.play().catch(err => console.error("konnte nicht abspielen: ", err));
                document.getElementById('P1Head').style.boxShadow = '0 0 10px 5px #0f0';
                document.getElementById('P1Head').classList.add('confirmed');
                p1MapConfirm = true;
            } else if(SelectedMap !== null && target.id === 'P2Head'){
                confimy.play().catch(err => console.error("konnte nicht abspielen: ", err));
                document.getElementById('P2Head').style.boxShadow = '0 0 10px 5px #0f0';
                document.getElementById('P2Head').classList.add('confirmed');
                p2MapConfirm = true;
            }
            if(SelectedMap && p2MapConfirm && p1MapConfirm){
                document.getElementById('showCase').style.transition = 'all 2s';
                document.getElementById('showCase').style.boxShadow = '0 0 10px 5px #0f0';
                setTimeout(() => {
                    gameCountdown();
                }, 2000);
            }

            menu.removeEventListener('click', initMapMenu);
        });
    }
}
function gameCountdown() {
    setTimeout(() => {
        sessionStorage.setItem('SelectedP1', SelectedP1.id);
        sessionStorage.setItem('SelectedP2', SelectedP2.id);
        sessionStorage.setItem('SelectedMap', mapUrl);

    window.location.href = '../index.html';  // das ist die verlinkung zum spiel
    }, 1000);           
}
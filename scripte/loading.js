const LoadingScreen = document.getElementById('loading');

const loadingMusic = new Audio('.././assets/sounds/BGMusik/Arp & Synth Music/Char Select.mp3');
loadingMusic.volume = 0.3;
loadingMusic.loop = true;


document.addEventListener("keydown", (e) => {
    if(e.key === "Enter"){
        console.log("Enter pressed");
        
        loadingMusic.play().catch(err => console.log(err));
        LoadingScreen.style.setProperty('--animation-before', 'running');
        LoadingScreen.style.setProperty('--animation-after', 'running');

        setTimeout(() => {
            window.location.href = './menu/menu.html';
        }, 16000);
    }
})
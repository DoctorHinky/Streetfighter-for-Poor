const LoadingScreen = document.getElementById('loading');

document.addEventListener("DOMContentLoaded", console.log('loaded'));

document.addEventListener("keydown", (e) => {
    if(e.key === "Enter"){
        console.log("Enter pressed");
        
        LoadingScreen.style.setProperty('--animation-before', 'running');
        LoadingScreen.style.setProperty('--animation-after', 'running');

        setTimeout(() => {
            window.location.href = './menu/menu.html';
        }, 16000);
    }
})
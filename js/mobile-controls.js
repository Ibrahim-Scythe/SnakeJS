// Simulates a button press of a given key
const pressBtn = (keyboardKey) => {
    const event = new KeyboardEvent('keydown', {key: keyboardKey});
    document.dispatchEvent(event);
}

// If the user taps the screen twice within 300ms, start/stops the snake
let lastTap = 0;
const checkForDoubleTap = () => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;

    if (tapLength > 0 && tapLength <= 300) {
        startAndStop();
    }

    lastTap = currentTime;
}

if (isMobile) {
    const upBtn = document.getElementById("upBtn");
    upBtn.addEventListener("click", function() { pressBtn("ArrowUp")} );

    const downBtn = document.getElementById("downBtn");
    downBtn.addEventListener("click", function() { pressBtn("ArrowDown")} );

    const leftBtn = document.getElementById("leftBtn");
    leftBtn.addEventListener("click", function() { pressBtn("ArrowLeft")} );

    const rightBtn = document.getElementById("rightBtn");
    rightBtn.addEventListener("click", function() { pressBtn("ArrowRight")} );

    const canvas = document.getElementById("game");
    canvas.addEventListener("touchend", checkForDoubleTap);
}
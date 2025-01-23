import { Game } from "./game";

function getRequestAnimationFrame()
{
  if (window.requestAnimationFrame) {
    return window.requestAnimationFrame;
  }

  // Manual fallbacks
  let lastTime = 0;
  return (callback : FrameRequestCallback) => {
    const currTime = Date.now();
    const timeToCall = Math.max(0, 16 - (currTime - lastTime));
    const id = setTimeout(() => callback(currTime + timeToCall), timeToCall);
    lastTime = currTime + timeToCall;
    return id;
  };
}

function isMobile()
{
  const isAndroid = () => navigator.userAgent.match(/Android/i);
  const isBlackBerry = () => navigator.userAgent.match(/BlackBerry/i);
  const isiOS = () => navigator.userAgent.match(/iPhone|iPad|iPod/i);
  const isOpera = () => navigator.userAgent.match(/Opera Mini/i);
  const isWindows = () => navigator.userAgent.match(/IEMobile/i);
  return isAndroid() || isiOS() || isBlackBerry() || isOpera() || isWindows();
}

function main(_ : Event)
{
  const requestAnimationFrame = getRequestAnimationFrame();
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const mobile = isMobile();
  const game = new Game(canvas);

  let isRendering = false;

  const update = () => {
    game.render();

    if (!isRendering) {
      return;
    }
    requestAnimationFrame(update);
  };
  update();

  if (mobile) {
  } else {
    let mouseX = 0;
    let mouseY = 0;

    const mouseup = (_ : MouseEvent) => {
      if (isRendering) {
        game.dropTile();
      }
      isRendering = false;
    };

    canvas.addEventListener("mouseup", mouseup, false);
    canvas.addEventListener("mouseleave", mouseup, false);
    canvas.addEventListener("mousedown", (ev : MouseEvent) => {
      isRendering = true;
      mouseX = ev.offsetX;
      mouseY = ev.offsetY;
      game.takeTile(mouseX, mouseY);
      requestAnimationFrame(update);
    }, false);
    canvas.addEventListener("mousemove", (ev : MouseEvent) => {
      if (!isRendering) {
        return;
      }
      const dx = ev.offsetX - mouseX;
      const dy = ev.offsetY - mouseY;
      game.moveTile(dx, dy);
      mouseX = ev.offsetX;
      mouseY = ev.offsetY;
    }, false);
  }
}

window.addEventListener("load", main);

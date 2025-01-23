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
    canvas.addEventListener("mouseup", (_) => {
      isRendering = false;
    }, false);
    canvas.addEventListener("mouseleave", (_) => {
      isRendering = false;
    }, false);
    canvas.addEventListener("mousedown", (_) => {
      isRendering = true;
      requestAnimationFrame(update);
    }, false);
  }
}

window.addEventListener("load", main);

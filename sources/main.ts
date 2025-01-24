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
  
  let mouseX = 0;
  let mouseY = 0;

  const mouseup = <EventType>(_ : EventType) => {
    if (isRendering) {
      game.dropTile();
    }
    isRendering = false;
  };
  const mousedown = (x : number, y : number) => {
    isRendering = true;
    mouseX = x;
    mouseY = y;
    game.takeTile(mouseX, mouseY);
    requestAnimationFrame(update);
  };
  const mousemove = (x : number, y : number) => {
    if (!isRendering) {
      return;
    }
    const dx = x - mouseX;
    const dy = y - mouseY;
    game.moveTile(dx, dy);
    mouseX = x;
    mouseY = y;
  };

  if (mobile) {
    document.addEventListener("touchend", mouseup, false);
    document.addEventListener("touchcancel", mouseup, false);
    document.addEventListener("touchstart", (ev : TouchEvent) => {
      const { pageX, pageY } = ev.changedTouches[0];
      mousedown(pageX - canvas.offsetLeft, pageY - canvas.offsetTop);
    }, false);
    document.addEventListener("touchmove", (ev : TouchEvent) => {
      const { pageX, pageY } = ev.changedTouches[0];
      mousemove(pageX - canvas.offsetLeft, pageY - canvas.offsetTop);
    }, false);
  } else {

    canvas.addEventListener("mouseup", mouseup, false);
    canvas.addEventListener("mouseleave", mouseup, false);
    canvas.addEventListener("mousedown", (ev : MouseEvent) => {
      mousedown(ev.offsetX, ev.offsetY);
    }, false);
    canvas.addEventListener("mousemove", (ev : MouseEvent) => {
      mousemove(ev.offsetX, ev.offsetY);
    }, false);
  }
}

window.addEventListener("load", main);

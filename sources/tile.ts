
export class TileImage
{
  canvas : HTMLCanvasElement;
  #context : CanvasRenderingContext2D;

  constructor(width : number, height : number, borderSize : number, letter : string)
  {
    this.canvas = document.createElement("canvas");
    this.canvas.width = width + borderSize;
    this.canvas.height = height + borderSize;
    this.#context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.#context.fillStyle = "rgb(100, 90, 80)";
    this.#context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.#context.fillStyle = "rgb(200, 180, 170)";
    this.#context.fillRect(borderSize, borderSize, this.canvas.width - 2 * borderSize, this.canvas.height - 2 * borderSize);
    this.#context.font = `${height * 0.5 | 0}px Verdana, Geneva, Arial, Helvetica, sans-serif`;
    this.#context.fillStyle = "white";
    this.#context.fillText(letter, width * 0.25, height * 0.75);
  }
};

export class Tile
{
  x : number;
  y : number;
  #image : TileImage;

  constructor(x : number, y : number, image : TileImage)
  {
    this.x = x;
    this.y = y;
    this.#image = image;
  }

  render(destCtx : CanvasRenderingContext2D)
  {
    destCtx.drawImage(this.#image.canvas, this.x, this.y);
  }
};

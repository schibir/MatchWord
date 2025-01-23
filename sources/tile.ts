
export class TileImage
{
  canvas : HTMLCanvasElement;
  #context : CanvasRenderingContext2D;

  constructor(width : number, height : number, boardSize : number)
  {
    this.canvas = document.createElement("canvas");
    this.canvas.width = width + boardSize;
    this.canvas.height = height + boardSize;
    this.#context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.#context.fillStyle = "rgb(100, 90, 80)";
    this.#context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.#context.fillStyle = "rgb(200, 180, 170)";
    this.#context.fillRect(boardSize, boardSize, this.canvas.width - 2 * boardSize, this.canvas.height - 2 * boardSize);
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

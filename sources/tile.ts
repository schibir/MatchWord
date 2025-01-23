
export class TileImage
{
  canvas : HTMLCanvasElement;
  #context : CanvasRenderingContext2D;

  constructor(width : number, height : number)
  {
    this.canvas = document.createElement("canvas");
    this.canvas.width = width;
    this.canvas.height = height;
    this.#context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.#context.fillStyle = "rgb(100, 90, 80)";
    this.#context.fillRect(0, 0, width, height);
  }
};

export class Tile
{
  #x : number;
  #y : number;
  #image : TileImage;

  constructor(x : number, y : number, image : TileImage)
  {
    this.#x = x;
    this.#y = y;
    this.#image = image;
  }

  render(destCtx : CanvasRenderingContext2D)
  {
    destCtx.drawImage(this.#image.canvas, this.#x, this.#y);
  }
};

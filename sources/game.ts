import { TileImage, Tile } from "./tile";

export class Game
{
  #context : CanvasRenderingContext2D;
  #tileImage : TileImage;
  #tiles : Tile[] = [];

  constructor(canvas : HTMLCanvasElement)
  {
    this.#context = canvas.getContext("2d") as CanvasRenderingContext2D;

    const tileWidth = canvas.width / 5;
    const tileHeight = canvas.height / 5;

    this.#tileImage = new TileImage(tileWidth, tileHeight);

    for (let x = 0; x < 5; x++) {
      for (let y = 0; y < 5; y++) {
        this.#tiles.push(new Tile(x * tileWidth, y * tileHeight, this.#tileImage));
      }
    }
  }

  render()
  {
    for (let tile of this.#tiles) {
      tile.render(this.#context);
    }
  }
};

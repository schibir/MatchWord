import { TileImage, Tile } from "./tile";

export class Game
{
  #context : CanvasRenderingContext2D;
  #tileImage : TileImage;
  #tiles : Tile[] = [];
  #tileWidth : number;
  #tileHeight : number;
  #currentTile : Tile | null = null;

  constructor(canvas : HTMLCanvasElement)
  {
    this.#context = canvas.getContext("2d") as CanvasRenderingContext2D;

    const boardSize = 5;
    this.#tileWidth = (canvas.width - boardSize) / 5;
    this.#tileHeight = (canvas.height - boardSize) / 5;

    this.#tileImage = new TileImage(this.#tileWidth, this.#tileHeight, boardSize);

    for (let x = 0; x < 5; x++) {
      for (let y = 0; y < 5; y++) {
        this.#tiles.push(new Tile(x * this.#tileWidth, y * this.#tileHeight, this.#tileImage));
      }
    }
  }

  render()
  {
    for (let tile of this.#tiles) {
      tile.render(this.#context);
    }
    if (this.#currentTile) {
      this.#currentTile.render(this.#context);
    }
  }

  takeTile(x : number, y : number)
  {
    console.assert(this.#currentTile === null);
    for (let tile of this.#tiles) {
      if (x > tile.x && x < tile.x + this.#tileWidth &&
          y > tile.y && y < tile.y + this.#tileHeight) {
            this.#currentTile = tile;
            break;
          }
    }
    console.assert(this.#currentTile !== null, `Unable to find tile in ${x}, ${y}`);
  }

  dropTile()
  {
    console.assert(this.#currentTile !== null);
    this.#currentTile = null;
  }

  moveTile(dx : number, dy : number)
  {
    console.assert(this.#currentTile !== null);
    if (!this.#currentTile) {
      return;
    }
    this.#currentTile.x += dx;
    this.#currentTile.y += dy;
  }
};

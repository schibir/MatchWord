import { Dict } from "./dict";
import { TileImage, Tile } from "./tile";

function correctCoord(coord : number, tileSize : number)
{
  const pos = coord / tileSize | 0;
  return tileSize * pos;
}

function getCenter(coord : number, tileSize : number)
{
  return coord + tileSize / 2 | 0;
}
export class Game
{
  #context : CanvasRenderingContext2D;
  #tileImages : TileImage[] = [];
  #tiles : Tile[] = [];
  #tileWidth : number;
  #tileHeight : number;
  #currentTile : Tile | null = null;
  #lastCurrentTile : Tile | null = null;
  #currentTilePos = [0, 0];
  #dict : Dict;

  constructor(canvas : HTMLCanvasElement)
  {
    this.#context = canvas.getContext("2d") as CanvasRenderingContext2D;

    const borderSize = 5;
    this.#tileWidth = (canvas.width - borderSize) / 5 | 0;
    this.#tileHeight = (canvas.height - borderSize) / 5 | 0;

    for (let x = 0; x < 5; x++) {
      for (let y = 0; y < 5; y++) {
        const image = new TileImage(this.#tileWidth, this.#tileHeight, borderSize, `${x + y * 5}`);
        this.#tileImages.push(image);
        this.#tiles.push(new Tile(x * this.#tileWidth, y * this.#tileHeight, image));
      }
    }

    this.#dict = new Dict();
    this.#dict;
  }

  render()
  {
    let isCompleted = true;
    this.#context.fillRect(0, 0, this.#context.canvas.width, this.#context.canvas.height);
    this.#currentTile?.fixRenderPpos();
    for (let tile of this.#tiles) {
      const completed = tile.update();
      isCompleted = isCompleted && completed;
      tile.render(this.#context);
    }
    this.#currentTile?.render(this.#context);
    if (!this.#currentTile && this.#lastCurrentTile) {
      this.#lastCurrentTile.render(this.#context);
    }
    return isCompleted;
  }

  #getTile(x : number, y : number, ignoreTile : Tile | null)
  {
    for (let tile of this.#tiles) {
      if (ignoreTile === tile) {
        continue;
      }
      if (x > tile.x && x < tile.x + this.#tileWidth &&
          y > tile.y && y < tile.y + this.#tileHeight) {
            return tile;
          }
    }
    return null;
  }

  takeTile(x : number, y : number)
  {
    console.assert(this.#currentTile === null);
    this.#currentTile = this.#getTile(x, y, null);
    this.#lastCurrentTile = this.#currentTile;
    console.assert(this.#currentTile !== null, `Unable to find tile in ${x}, ${y}`);
    this.#currentTilePos = this.#currentTile ? [this.#currentTile.x, this.#currentTile.y] : [0, 0];
  }

  #checkTile(myTile : Tile)
  {
    if (myTile.x < 0 || myTile.x >= 5 * this.#tileWidth ||
        myTile.y < 0 || myTile.y >= 5 * this.#tileHeight) {
          return false;
        }
    for (let tile of this.#tiles) {
      if (tile === myTile) {
        continue;
      }
      if (myTile.x === tile.x && myTile.y === tile.y) {
        return false;
      }
    }
    return true;
  }

  dropTile()
  {
    console.assert(this.#currentTile !== null);
    if (this.#currentTile) {
      this.#currentTile.x = correctCoord(getCenter(this.#currentTile.x, this.#tileWidth), this.#tileWidth);
      this.#currentTile.y = correctCoord(getCenter(this.#currentTile.y, this.#tileHeight), this.#tileHeight);
      console.assert(this.#checkTile(this.#currentTile));
    }
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

    const centerX = getCenter(this.#currentTile.x, this.#tileWidth);
    const centerY = getCenter(this.#currentTile.y, this.#tileHeight);
    if (centerX <= 0 || centerX >= 5 * this.#tileWidth ||
        centerY <= 0 || centerY >= 5 * this.#tileHeight) {
          this.moveTile(-dx, -dy);
          return;
        }
    const tile = this.#getTile(centerX, centerY, this.#currentTile);
    if (!tile) {
      return;
    }
    [tile.x, this.#currentTilePos[0]] = [this.#currentTilePos[0], tile.x];
    [tile.y, this.#currentTilePos[1]] = [this.#currentTilePos[1], tile.y];
    console.assert(correctCoord(tile.x, this.#tileWidth) === tile.x &&
                   correctCoord(tile.y, this.#tileHeight) === tile.y);
    console.assert(this.#checkTile(tile));
  }
};

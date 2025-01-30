
export type char = string;
export const BoardSize = 5;
const BoardFullSize = BoardSize * BoardSize;

class Dict
{
  words : string[] = [];
  alphabet : string = "";

  constructor(callback : () => void)
  {
    fetch("dict/dict.txt")
      .then((res) => res.text())
      .then((text : string) => {
        this.words = text.split("\r\n");

        let map = new Map<char, number>();
        let crossmap = new Map<number, char>();
        for (let word of this.words) {
          for (let ch of word) {
            const got = map.get(ch);
            const count = got === undefined ? 0 : got;
            map.set(ch, count + 1);
          }
        }
        map.forEach((v, k, _) => {
          crossmap.set(v, k);
        });

        const sorted = new Map([...crossmap.entries()].sort((a, b) => b[0] - a[0]));
        this.alphabet = [...sorted.values()].join("");

        callback();
      })
      .catch((e) => console.error(e));
  }
};

export class Board
{
  #dict : Dict;
  #state : char[] = [];

  constructor(callback : () => void)
  {
    for (let i = 0; i < BoardFullSize; i++) {
      this.#state.push('_');
    }
    this.#dict = new Dict(() => {
      this.generate();
      callback();
    });
  }

  getAlphabet()
  {
    return this.#dict.alphabet;
  }

  generate()
  {
    for (let i = 0; i < BoardFullSize; i++) {
      this.#state[i] = this.#dict.alphabet.charAt(Math.random() * BoardFullSize | 0);
    }
  }

  get(x : number, y : number)
  {
    return this.#state[x + y * BoardSize];
  }
};

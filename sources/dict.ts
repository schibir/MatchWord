
export class Dict
{
  #words : string[] = [];

  constructor()
  {
    fetch("dict/dict.txt")
      .then((res) => res.text())
      .then((text : string) => {
        this.#words = text.split("\r\n");
        this.#words;
      })
      .catch((e) => console.error(e));
  }
};

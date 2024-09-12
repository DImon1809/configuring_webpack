function createAnalitics(): object {
  let counter: number = 0;
  let isDestroy: boolean = false;

  const listener = () => ++counter;

  document.addEventListener("click", listener);

  return {
    destroy() {
      document.removeEventListener("click", listener);

      isDestroy = true;
    },

    getClick() {
      return isDestroy ? "analitics is destroy. Total clicks = " : counter;
    },
  };
}

window["analitics"] = createAnalitics();

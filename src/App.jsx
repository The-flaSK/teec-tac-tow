import { createEffect, createSignal, Show } from "solid-js";
import AppStyles from "./App.module.css";
import { createMutable, modifyMutable, reconcile } from "solid-js/store";

const init = {
  c1: { player: "", clicked: false },
  c2: { player: "", clicked: false },
  c3: { player: "", clicked: false },
  c4: { player: "", clicked: false },
  c5: { player: "", clicked: false },
  c6: { player: "", clicked: false },
  c7: { player: "", clicked: false },
  c8: { player: "", clicked: false },
  c9: { player: "", clicked: false },
};

function App() {
  Array.prototype.diff = function (arr2) {
    var ret = [];
    this.sort();
    arr2.sort();
    for (var i = 0; i < this.length; i += 1) {
      if (arr2.indexOf(this[i]) > -1) {
        ret.push(this[i]);
      }
    }
    return ret;
  };
  const [board, setBoard] = createSignal(init);
  const boardState = createMutable({
    state: {
      c1: { player: "", clicked: false },
      c2: { player: "", clicked: false },
      c3: { player: "", clicked: false },
      c4: { player: "", clicked: false },
      c5: { player: "", clicked: false },
      c6: { player: "", clicked: false },
      c7: { player: "", clicked: false },
      c8: { player: "", clicked: false },
      c9: { player: "", clicked: false },
    },
  });

  const cleanup = () => {
    const cells = document.getElementsByClassName(AppStyles.cell)
    for(let cell of cells) {
      cell.innerHTML = ""
    }
  }

  const [player, setPlayer] = createSignal(true);
  const [done, setDone] = createSignal([]);
  const [currentCell, setCell] = createSignal("");
  const [winner, setWinner] = createSignal(false);
  const matchingPatterns = [
    ["c1", "c2", "c3"],
    ["c4", "c5", "c6"],
    ["c7", "c8", "c9"],
    ["c1", "c5", "c9"],
    ["c3", "c5", "c7"],
    ["c1", "c4", "c7"],
    ["c2", "c5", "c8"],
    ["c3", "c6", "c9"],
  ];
  createEffect(() => {
    const filtered = Object.keys(boardState.state).filter(
      (key) => boardState.state[key].player === !player()
    );
    console.log(filtered);
    matchingPatterns.forEach((value, index) => {
      if (JSON.stringify(filtered.diff(value)) == JSON.stringify(value)) {
        setWinner(true);
      }
    });
  });
  createEffect(() => {
    console.log({
      boardState: boardState.state,
      done: done(),
      winner: winner(),
      currentCell: currentCell(),
      player: player(),
    });
  });
  return (
    <>
      <Show when={winner()}> {JSON.stringify(winner())} winner</Show>
      <div className={AppStyles.grid}>
        <For each={Object.keys(boardState.state)}>
          {(value, index) => {
            return (
              <div
                id={value}
                className={AppStyles.cell}
                onClick={(event) => {
                  if (
                    done().includes(event.target.getAttribute("name")) ||
                    winner()
                  ) {
                    return;
                  }
                  if (player() === true) {
                    event.target.innerHTML = "X";
                    const newlist = done();
                    newlist.push(event.target.getAttribute("name"));
                    setDone(newlist);
                    setCell(event.target.getAttribute("name"));
                    let newBoard = boardState.state;
                    newBoard[event.target.getAttribute("name")].player =
                      player();
                    setPlayer(false);
                    // setBoard(newBoard);
                    boardState.state = newBoard;
                  } else {
                    event.target.innerHTML = "O";
                    const newlist = done();
                    newlist.push(event.target.getAttribute("name"));
                    setDone(newlist);
                    setCell(event.target.getAttribute("name"));
                    let newBoard = boardState.state;
                    newBoard[event.target.getAttribute("name")].player =
                      player();
                    setPlayer(true);
                    // setBoard(newBoard);
                    boardState.state = newBoard;
                  }
                }}
                name={value}
              ></div>
            );
          }}
        </For>
        {winner() ? (
          <buttton
            onClick={() => {
              console.log("button clicked");
              // setBoard(init)
              // boardState.state = { ...init };
              modifyMutable(boardState.state, reconcile({...init}))
              setPlayer(true);
              setDone([]);
              setCell("");
              cleanup()
              setWinner(false);
            }}
          >
            reset
          </buttton>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}

export default App;

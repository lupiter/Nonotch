


const games = {
	"1-1":	[
		[0, 1, 0],
		[1, 1, 1],
		[0, 1, 0]
	],
	"1-2":	[
		[0, 1, 0],
		[1, 0, 1],
		[0, 1, 0]
	],
	"2-1":	[
		[0, 1, 0, 0],
		[1, 0, 1, 0],
		[0, 1, 0, 1],
		[1, 1, 1, 1]
	],
	"2-2":	[
		[0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
		[1, 0, 1, 0, 1, 1, 1, 1, 1, 1],
		[0, 1, 0, 1, 0, 0, 0, 0, 0, 0],
		[1, 0, 1, 0, 1, 1, 1, 1, 1, 1],
		[0, 1, 0, 1, 0, 0, 0, 0, 0, 0],
		[1, 0, 1, 0, 1, 1, 1, 1, 1, 1],
		[0, 1, 0, 1, 0, 0, 0, 0, 0, 0],
		[1, 0, 1, 0, 1, 1, 1, 1, 1, 1],
		[0, 1, 0, 1, 0, 0, 0, 0, 0, 0],
		[1, 1, 1, 1, 1, 1, 0, 0, 0, 1]
	],
};

const toolIsPen = (e) => {
	const selected = document.getElementById("tool_pen").checked;
	if (e.button > 0) {
		return !selected;
	}
	return selected;
}

const removeAllChildren = (el) => {
	while (el.firstChild) {
		el.removeChild(el.firstChild);
	}
}

const solved = () => {
	const puzzleID = document.getElementById("gameselect").value;
	const puzzle = games[puzzleID].flat();
	const cells = Array.from(document.getElementsByTagName("td"));

	for (let i = 0; i < cells.length; i++) {
		const cell = cells[i].dataset.value;
		if (cell === undefined && puzzle[i] === 1) {
			return false;
		}
		if (cell === 'true' && puzzle[i] === 0) {
			return false;
		}
		if (cell === 'false' && puzzle[i] === 1) {
			return false;
		}
	}
	return true;
}

const checkSolution = () => {
	if(solved()) {
		const popup = document.getElementById("solved");
		popup.style.display = 'flex';
		for (button of popup.getElementsByTagName('button')) {
			button.onclick = () => {
				popup.style.display = 'none';
			}
		}

	}
}

const setupGame = (index) => {
	const game = games[index];
	const head = document.getElementById("gamehead");
	removeAllChildren(head);
	head.appendChild(document.createElement("th"));
	const body = document.getElementById("gamebody");
	removeAllChildren(body);
	const colClues = [];
	var mistakes = 0;
	document.getElementById("mistakes").value = 0;

	// create gameboard
	for (const row of game) {
		const tr = document.createElement("tr");
		const th = document.createElement("th");
		const rowClues = [0];
		tr.appendChild(th);
		for (let i = 0; i < row.length; i++) {
			const cell = row[i];
			if (colClues.length > i) {
				const clue = colClues[i];
				const lastClue = clue[clue.length - 1];
				if (cell <= 0 && lastClue > 0) {
					clue.push(0);
				} else if (cell <= 0 && lastClue <= 0) {
					// do nothing
				} else {
					clue[clue.length - 1] = lastClue + cell;
				}
				colClues[i] = clue;
			} else {
				colClues.push([cell]);
			}
			
			const rowClue = rowClues[rowClues.length - 1];
			if (cell > 0) {
				rowClues[rowClues.length - 1] += cell;
			} else if (cell <= 0 && rowClue > 0) {
				rowClues.push(cell);
			}

			const td = document.createElement("td");
			td.textContent = " ";

			const onclick = (e) => {
				var value = undefined;
				var currentValue = td.dataset.value === "false" ? false : td.dataset.value === "true" ? true : undefined;
				var mistake = false;

				if (toolIsPen(e)) {
					if (cell > 0) {
						value = true;
					} else {
						value = false;
						mistake = true;
					}
				} else {
					if (currentValue === false) {
						value = undefined;
					} else if (currentValue === true) {
						value = currentValue;
					} else {
						value = false;
					}
				}
				td.dataset.value = value;
				td.className = value;
				td.textContent = value === true ? "o" : value === false ? "⤬" : " ";
				if (mistake) {
					mistakes += 1;
					document.getElementById("mistakes").value = mistakes;
				}
				checkSolution();
			}
			td.onmouseenter = (e) => {
				if (e.buttons > 0) {
					onclick(e);
				}
			}
			td.onmousedown = (e) => {
				onclick(e);
			}
			td.oncontextmenu = (e) => {
				return false;
			}
			tr.appendChild(td);
		}
		for (const clue of rowClues) {
			if (clue > 0) {
				const span = document.createElement("span");
				span.className = 'clue';
				span.textContent = clue;
				th.appendChild(span);
			}
		}
		body.appendChild(tr);
	}

	for (const clue of colClues) {
		const th = document.createElement("th");
		for (const no of clue) {
			if (no > 0) {
				const p = document.createElement("p");
				p.textContent = no;
				th.appendChild(p);
			}
		}
		head.append(th);
	}
}

window.onload = () => {
	const select = document.getElementById("gameselect");
	select.onchange = () => {
		setupGame(select.value);
	}
	const reset = document.getElementById("reset");
	reset.onclick = () => {

		setupGame(select.value);
	}
	setupGame(select.value);
}
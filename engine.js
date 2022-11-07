


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
		[0, 1, 0, 0],
		[1, 1, 1, 1]
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

const setupGame = (index) => {
	const game = games[index];
	const head = document.getElementById("gamehead");
	removeAllChildren(head);
	head.appendChild(document.createElement("th"));
	const body = document.getElementById("gamebody");
	removeAllChildren(body);
	const colClues = [];

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
				if (clue <= 0 && lastClue > 0) {
					clue.push(0);
				} else if (clue <= 0 && lastClue <= 0) {
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

				if (toolIsPen(e)) {
					if (cell > 0) {
						value = true;
					} else {
						value = false;
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
				td.textContent = value === true ? "o" : value === false ? "x" : " ";
			}
			td.onclick = onclick;
			td.oncontextmenu = (e) => {
				onclick(e);
				return false;
			}
			tr.appendChild(td);
		}
		if (rowClues[rowClues.length - 1] === 0) {
			rowClues.pop();
		}
		th.textContent = rowClues.join(" ");
		body.appendChild(tr);
	}

	for (const clue of colClues) {
		const th = document.createElement("th");
		th.textContent = clue.join(" ");
		head.append(th);
	}
}

window.onload = () => {
	const select = document.getElementById("gameselect");
	select.onchange = (e) => {
		setupGame(select.value);
	}
	setupGame(select.value);
}
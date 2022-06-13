const pi = Math.PI;

function random(min, max) {
	return Math.floor(Math.random()*(max-min+1))+min;
}

function setColor(block) {
	switch (block.minesAround) {
		case 1:
			graphics.fillStyle = "blue";
			break;
		case 2:
			graphics.fillStyle = "green";
			break;
		case 3:
			graphics.fillStyle = "red";
			break;
		case 4:
			graphics.fillStyle = "darkblue";
			break;
		case 5:
			graphics.fillStyle = "maroon";
			break;
		case 6:
			graphics.fillStyle = "darkturquoise";
			break;
		case 7:
			graphics.fillStyle = "black";
			break;
		case 8:
			graphics.fillStyle = "gray";
			break;
	}
}

function Block(row, column) {
	this.row = row;
	this.column = column;
	this.width = mineWidth;
	this.height = mineHeight;
	this.containsMine = false;
	this.minesAround = 0;
	this.revealed = false;
	this.checkedForMinesAround = false;
	this.type = "";
	this.flagged = false;

	if ((row == 0 && column == 0) || (row == 0 && column == columns-1) || (row == rows-1 && column == 0) || (row == rows-1 && column == columns-1)) {
		this.type = "corner";
	} else if (row == 0 || row == rows-1 || column == 0 || column == columns-1) {
		this.type = "edge";
	} else {
		this.type = "middle";
	}
}

Block.prototype.draw = function() {
	graphics.fillStyle = "gray";

	if (this.revealed) {
		graphics.fillStyle = "white";
	}

	if (this == highlightedGrid) {
		graphics.fillStyle = "#B0B0B0";

		if (this.revealed) {
			graphics.fillStyle = "#E0E0E0";
		}
	}

	graphics.strokeStyle = "black";
	graphics.beginPath();
	graphics.rect(this.column*this.width, this.row*this.height, this.width, this.height);
	graphics.fill();
	graphics.stroke();

	if (this.revealed && this.minesAround > 0) {
		if (this.containsMine) {
			graphics.fillStyle = "black";
			graphics.beginPath();
			graphics.arc(this.column*this.width+(this.width/2), this.row*this.height+(this.height/2), this.width/4, 0, pi*2);
			graphics.fill();
		} else {
			setColor(this);
			graphics.font = `${this.width/2}px sans-serif`;
			graphics.textAlign = "center";
			graphics.fillText(this.minesAround, this.column*this.width+(this.width/2), this.row*this.height+(this.height/2+10));
		}
	}

	if (this.flagged) {
		graphics.fillStyle = "red";
		graphics.beginPath();
		graphics.arc(this.column*this.width+(this.width/2), this.row*this.height+(this.height/2), this.width/4, 0, pi*2);
		graphics.fill();
	}
}

Block.prototype.figureOutNumberOfMines = function() {
	let startX = -1;
	let startY = -1;
	let endX = 2;
	let endY = 2;

	if (this.row == 0) {
		startY = 0;
	} else if (this.row == rows-1) {
		endY = 1;
	}

	if (this.column == 0) {
		startX = 0;
	} else if (this.column == columns-1) {
		endX = 1;
	}

	for (let i = startY; i < endY; i++) {
		for (let j = startX; j < endX; j++) {
			if (grid[this.row+i][this.column+j].containsMine) {
				this.minesAround++;
			}
		}
	}
}

Block.prototype.revealSpace = function() {
	this.checkedForMinesAround = true;

	for (let i = this.row; i >= 0; i--) {
		if (grid[i][this.column].containsMine || grid[i][this.column].minesAround != 0) {
			if (grid[i][this.column].minesAround != 0) {
				grid[i][this.column].revealed = true;
				grid[i][this.column].checkedForMinesAround = true;
			}

			break;
		} else {
			if (!grid[i][this.column].checkedForMinesAround) {
				grid[i][this.column].revealSpace();
				grid[i][this.column].checkedForMinesAround = true;
			}

			grid[i][this.column].revealed = true;
		}
	}

	for (let i = this.row; i < rows; i++) {
		if (grid[i][this.column].containsMine || grid[i][this.column].minesAround != 0) {
			if (grid[i][this.column].minesAround != 0) {
				grid[i][this.column].revealed = true;
				grid[i][this.column].checkedForMinesAround = true;
			}

			break;
		} else {
			if (!grid[i][this.column].checkedForMinesAround) {
				grid[i][this.column].revealSpace();
				grid[i][this.column].checkedForMinesAround = true;
			}

			grid[i][this.column].revealed = true;
		}
	}

	for (let i = this.column; i >= 0; i--) {
		if (grid[this.row][i].containsMine || grid[this.row][i].minesAround != 0) {
			if (grid[this.row][i].minesAround != 0) {
				grid[this.row][i].revealed = true;
				grid[this.row][i].checkedForMinesAround = true;
			}

			break;
		} else {
			if (!grid[this.row][i].checkedForMinesAround) {
				grid[this.row][i].revealSpace();
				grid[this.row][i].checkedForMinesAround = true;
			}

			grid[this.row][i].revealed = true;
		}
	}

	for (let i = this.column; i < columns; i++) {
		if (grid[this.row][i].containsMine || grid[this.row][i].minesAround != 0) {
			if (grid[this.row][i].minesAround != 0) {
				grid[this.row][i].revealed = true;
				grid[this.row][i].checkedForMinesAround = true;
			}

			break;
		} else {
			if (!grid[this.row][i].checkedForMinesAround) {
				grid[this.row][i].revealSpace();
				grid[this.row][i].checkedForMinesAround = true;
			}

			grid[this.row][i].revealed = true;
		}
	}
}
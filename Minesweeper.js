const canvas = document.getElementById("canvas");
const graphics = canvas.getContext("2d");
const difficulty = document.getElementById("difficulty");
const button = document.getElementById("button");

/* 
Easy: 8x8 with 10 mines
Medium: 16x16 with 40 mines
Hard: 30x16 with 99 mines
*/

let rows = 8;
let columns = 8;
let mines = 10;

let mineWidth = 40;
let mineHeight = 40;

canvas.width = mineWidth*columns;
canvas.height = mineHeight*rows;
let width = canvas.width;
let height = canvas.height;

let grid = [];

let numberOfMines = 0;

let highlightedGrid;

let firstAttempt = true;

let lostGame = false;

button.onclick = function() {
    if (difficulty.value == "Easy") {
        rows = 8;
        columns = 8;
        mines = 10;
        mineWidth = 40;
        mineHeight = 40;
    } else if (difficulty.value == "Medium") {
        rows = 16;
        columns = 16;
        mines = 40;
        mineWidth = 35;
        mineHeight = 35;
    } else if (difficulty.value == "Hard") {
        rows = 16;
        columns = 30;
        mines = 99;
        mineWidth = 35;
        mineHeight = 35;
    } else if (difficulty.value == "Custom") {
        rows = parseInt(prompt("How many rows would you like? (5-40)"));

        while (!Number.isInteger(rows) || rows <= 4 || rows > 40) {
            rows = parseInt(prompt("How many rows would you like? (5-40)"));
        }

        columns = parseInt(prompt("How many columns would you like? (5-40)"));

        while (!Number.isInteger(columns) || columns <= 4 || columns > 40) {
            columns = parseInt(prompt("How many columns would you like? (5-40)"));
        }

        mines = parseInt(prompt(`How many mines would you like (1-${rows*columns})`));

        while (!Number.isInteger(mines) || mines <= 0 || mines >= rows*columns) {
            mines = parseInt(prompt(`How many mines would you like (1-${rows*columns})`));
        }

        mineWidth = 800/columns;
        mineHeight = mineWidth;
    }

    canvas.width = mineWidth*columns;
    canvas.height = mineHeight*rows;
    grid = [];
    numberOfMines = 0;
    highlightedGrid = "";
    firstAttempt = true;
    lostGame = false;

    for (let i = 0; i < rows; i++) {
        grid.push([]);
        for (let j = 0; j < columns; j++) {
            grid[i].push(new Block(i, j));
        }
    }

    draw();
};

//Defining Blocks
for (let i = 0; i < rows; i++) {
    grid.push([]);
    for (let j = 0; j < columns; j++) {
        grid[i].push(new Block(i, j));
    }
}

function checkSquares(firstMine, randMine) {
    if (firstMine.type == "corner") {
        if (firstMine.row == 0 && firstMine.column == 0) {
            return randMine != grid[firstMine.row][firstMine.column] && randMine != grid[firstMine.row][firstMine.column+1] && randMine != grid[firstMine.row+1][firstMine.column] && randMine != grid[firstMine.row+1][firstMine.column+1];
        } else if (firstMine.row == rows-1 && firstMine.column == 0) {
            return randMine != grid[firstMine.row][firstMine.column] && randMine != grid[firstMine.row-1][firstMine.column] && randMine != grid[firstMine.row-1][firstMine.column+1] && randMine != grid[firstMine.row][firstMine.column+1];
        } else if (firstMine.row == 0 && firstMine.column == columns-1) {
            return randMine != grid[firstMine.row][firstMine.column] && randMine != grid[firstMine.row][firstMine.column-1] && randMine != grid[firstMine.row+1][firstMine.column-1] && randMine != grid[firstMine.row+1][firstMine.column];
        } else {
            return randMine != grid[firstMine.row][firstMine.column] && randMine != grid[firstMine.row-1][firstMine.column] && randMine != grid[firstMine.row][firstMine.column-1] && randMine != grid[firstMine.row-1][firstMine.column-1];
        }
    } else if (firstMine.type == "edge") {
        if (firstMine.row == 0) {
            return (randMine != grid[firstMine.row][firstMine.column-1] && randMine != grid[firstMine.row][firstMine.column] && randMine != grid[firstMine.row][firstMine.column+1]) && (randMine != grid[firstMine.row+1][firstMine.column-1] && randMine != grid[firstMine.row+1][firstMine.column] && randMine != grid[firstMine.row+1][firstMine.column+1]);
        } else if (firstMine.row == rows-1) {
             return (randMine != grid[firstMine.row-1][firstMine.column-1] && randMine != grid[firstMine.row-1][firstMine.column] && randMine != grid[firstMine.row-1][firstMine.column+1]) && (randMine != grid[firstMine.row][firstMine.column-1] && randMine != grid[firstMine.row][firstMine.column] && randMine != grid[firstMine.row][firstMine.column+1]);
        } else if (firstMine.column == 0) {
            return (randMine != grid[firstMine.row-1][firstMine.column] && randMine != grid[firstMine.row][firstMine.column] && randMine != grid[firstMine.row+1][firstMine.column]) && (randMine != grid[firstMine.row-1][firstMine.column+1] && randMine != grid[firstMine.row][firstMine.column+1] && randMine != grid[firstMine.row+1][firstMine.column+1]);
        } else {
            return (randMine != grid[firstMine.row-1][firstMine.column-1] && randMine != grid[firstMine.row][firstMine.column-1] && randMine != grid[firstMine.row+1][firstMine.column-1]) && (randMine != grid[firstMine.row-1][firstMine.column] && randMine != grid[firstMine.row][firstMine.column] && randMine != grid[firstMine.row+1][firstMine.column]);
        }
    }

    return (randMine != grid[firstMine.row-1][firstMine.column-1] && randMine != grid[firstMine.row-1][firstMine.column] && randMine != grid[firstMine.row-1][firstMine.column+1]) && (randMine != grid[firstMine.row][firstMine.column-1] && randMine != grid[firstMine.row][firstMine.column] && randMine != grid[firstMine.row][firstMine.column+1]) && (randMine != grid[firstMine.row+1][firstMine.column-1] && randMine != grid[firstMine.row+1][firstMine.column] && randMine != grid[firstMine.row+1][firstMine.column+1]);
}

canvas.addEventListener("mousemove", function(mouse) {
    if (!lostGame) {
        let mouseX = mouse.offsetX;
        let mouseY = mouse.offsetY;

        let mouseRow = Math.floor(mouseY/mineHeight);
        let mouseColumn = Math.floor(mouseX/mineWidth);

        if (mouseRow == rows) {
            mouseRow = rows-1;
        }

        if (mouseColumn == columns) {
            mouseColumn = columns-1;
        }

        highlightedGrid = grid[mouseRow][mouseColumn];

        draw();
    }
})

canvas.addEventListener("click", function(mouse) {
    if (!lostGame) {
        let mouseX = mouse.offsetX;
        let mouseY = mouse.offsetY;

        let mouseRow = Math.floor(mouseY/mineHeight);
        let mouseColumn = Math.floor(mouseX/mineWidth);

        if (mouseRow == rows) {
            mouseRow = rows-1;
        }

        if (mouseColumn == columns) {
            mouseColumn = columns-1;
        }

        if (!grid[mouseRow][mouseColumn].flagged) {
            if (grid[mouseRow][mouseColumn].containsMine) {
                alert("You Lose!");

                lostGame = true;
            }

            if (firstAttempt) {
               while (numberOfMines < mines) {
                    let randRow = random(0, rows-1);
                    let randCol = random(0, columns-1);

                    //A corner has checkedAmount 4, An edge has checked amount 6, and a middle square has a checked amount of 9
                    if (!grid[randRow][randCol].containsMine && checkSquares(grid[mouseRow][mouseColumn], grid[randRow][randCol])) {
                        numberOfMines++;

                        grid[randRow][randCol].containsMine = true;
                    }
                }

                for (let i = 0; i < rows; i++) {
                    grid.push([]);
                    for (let j = 0; j < columns; j++) {
                        grid[i][j].figureOutNumberOfMines();
                    }
                }

                firstAttempt = false;
            }

            grid[mouseRow][mouseColumn].revealed = true;
            grid[mouseRow][mouseColumn].revealSpace();

            let revealedSquares = 0;

            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < columns; j++) {
                    if (grid[i][j].revealed) {
                        revealedSquares++;
                    }
                }
            }

            if (revealedSquares == rows*columns-mines && !lostGame) {
                alert("You Win!");
                lostGame = true;
            }

            draw();
        }
    }
});

canvas.addEventListener("contextmenu", function(mouse) {
    if (!lostGame) {
        let mouseX = mouse.offsetX;
        let mouseY = mouse.offsetY;

        let mouseRow = Math.floor(mouseY/mineHeight);
        let mouseColumn = Math.floor(mouseX/mineWidth);

        if (mouseRow == rows) {
            mouseRow = rows-1;
        }

        if (mouseColumn == columns) {
            mouseColumn = columns-1;
        }

        if (!grid[mouseRow][mouseColumn].revealed) {
            if (grid[mouseRow][mouseColumn].flagged) {
                grid[mouseRow][mouseColumn].flagged = false;
            } else {
                grid[mouseRow][mouseColumn].flagged = true;
            }

            draw();
        }
    }
});

function draw() {
    graphics.clearRect(0, 0, width, height);

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            grid[i][j].draw();
        }
    }
}

draw();
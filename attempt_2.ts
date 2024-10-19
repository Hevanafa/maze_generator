// 19-10-2024
// Translated from https://github.com/StanislavPetrovV/Maze_Game/blob/main/maze_generator.py
// Upgraded 2D array version of attempt_1 with attemptDraw1 & attemptDraw2 removed

const [cols, rows] = [9, 7];

class Cell {
    x: number;
    y: number;
    visited: boolean;
    walls: {top: boolean, right: boolean, bottom: boolean, left: boolean};

    /**
     * assigned in check_neighbours
     */
    grid_cells: Array<Array<Cell>>;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.walls = {
            top: true, right: true, bottom: true, left: true
        };
        this.visited = false;
    }

    check_cell(x: number, y: number): Cell | null {
        if (x < 0 || x > cols - 1 || y < 0 || y > rows - 1)
            return null;

        return this.grid_cells[y][x];
    }

    check_neighbours(grid_cells: Array<Array<Cell>>) {
        this.grid_cells = grid_cells;
        const neighbours = [];
        
        const right = this.check_cell(this.x + 1, this.y);
        const left = this.check_cell(this.x - 1, this.y);

        const top = this.check_cell(this.x, this.y - 1);
        const bottom = this.check_cell(this.x, this.y + 1);

        if (right && !right.visited)
            neighbours.push(right);
        if (left && !left.visited)
            neighbours.push(left);
        
        if (top && !top.visited)
            neighbours.push(top);

        if (bottom && !bottom.visited)
            neighbours.push(bottom);

        return neighbours.length > 0
            // simulate choice(neighbours)
            ? neighbours[Math.floor(Math.random() * neighbours.length)]
            : false;
    }
}


function remove_walls(current: Cell, next: Cell) {
    const [dx, dy] = [
        current.x - next.x,
        current.y - next.y
    ];

    if (dx === 1) {
        current.walls.left = false;
        next.walls.right = false;
    } else if (dx === -1) {
        current.walls.right = false;
        next.walls.left = false;
    }

    if (dy === 1) {
        current.walls.top = false;
        next.walls.bottom = false;
    } else if (dy === -1) {
        current.walls.bottom = false;
        next.walls.top = false;
    }
}


function generate_maze(): Array<Array<Cell>> {
    const grid_cells: Array<Array<Cell>> = [...Array(rows)].map((_, row) =>
        [...Array(cols)].map((_, col) => new Cell(col, row))
    );

    let current_cell = grid_cells[0][0];
    const ary: Array<Cell> = [];
    let break_count = 1;

    while (break_count !== rows * cols) { //grid_cells.length
        current_cell.visited = true;
        const next_cell = current_cell.check_neighbours(grid_cells);

        if (next_cell) {
            next_cell.visited = true;
            break_count += 1;
            ary.push(current_cell);
            remove_walls(current_cell, next_cell);
            current_cell = next_cell;
        } else if (ary.length > 0)
            current_cell = ary.pop();
    }

    return grid_cells;
}

const maze = generate_maze();
// console.log(maze);

function attemptDraw3() {
    // top wall
    console.log("#".repeat(cols * 2 + 1));

    const ary = [];
    let a: number, b: number;

    for (b = 0; b < rows; b++) {
        // top half
        for (a = 0; a < cols * 2; a++)
            ary.push("");

        for (a = 0; a < cols; a++) {
            ary[a * 2] = " ";

            // left & right
            if (a * 2 - 1 >= 0)
                ary[a * 2 - 1] = maze[b][a].walls.left ? "#" : " ";
            if (a * 2 + 1 < ary.length)
                ary[a * 2 + 1] = maze[b][a].walls.right ? "#" : " ";
        }

        console.log("#" + ary.join(""));
        ary.splice(0, ary.length);

        // lower half
        for (a = 0; a < cols * 2; a++)
            ary.push("#");

        for (a = 0; a < cols; a++) {
            ary[a * 2] = ".";

            // bottom
            ary[a * 2] = maze[b][a].walls.bottom ? "#" : " ";
        }

        console.log("#" + ary.join(""));
        ary.splice(0, ary.length);
    }
}

attemptDraw3();

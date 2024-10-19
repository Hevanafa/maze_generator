// 19-10-2024
// Translated from https://github.com/StanislavPetrovV/Maze_Game/blob/main/maze_generator.py

const random = Math.random;
const [cols, rows] = [7, 7];

class Cell {
    x: number;
    y: number;
    visited: boolean;
    // private thickness: 
    walls: {top: boolean, right: boolean, bottom: boolean, left: boolean};
    grid_cells: Array<Cell>;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.walls = {
            top: true, right: true, bottom: true, left: true
        };
        this.visited = false;
    }

    // draw;
    // get_rects;

    check_cell(x: number, y: number): Cell | null {
        const find_index = (x: number, y: number) => x + y * cols;

        if (x < 0 || x > cols - 1 || y < 0 || y > rows - 1)
            return null;

        return this.grid_cells[find_index(x, y)];
    }

    check_neighbours(grid_cells: Array<Cell>) {
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


function generate_maze(): Array<Cell> {
    const grid_cells = [...Array(rows)].map((_, row) =>
        [...Array(cols)].map((_, col) => new Cell(col, row))
    ).flat();

    let current_cell = grid_cells[0];
    const ary: Array<Cell> = [];
    let break_count = 1;

    while (break_count !== grid_cells.length) {
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

function attemptDraw1() {
    // top wall
    console.log("#".repeat(cols * 2 - 1));

    const ary = [];
    let a: number, b: number, cell_idx: number;

    for (b = 0; b < rows; b++) {
        cell_idx = b * cols + a;

        // first half
        for (a = 0; a < cols; a++) {
            if (!maze[cell_idx]) break;

            // maze is not a 2D array
            ary.push(
                " ",
                maze[cell_idx].walls.right ? "#" : " "
            );
        }
        
        console.log("#" + ary.join("") + "#")
        ary.splice(0, ary.length);

        // second half
        for (a = 0; a < cols; a++) {
            if (!maze[cell_idx]) break;

            ary.push(
                "#",
                maze[cell_idx].walls.bottom ? "#" : " "
            );
        }
        console.log("#" + ary.join("") + "#");
        ary.splice(0, ary.length);
    }

    // bottom wall
    console.log("#".repeat(cols * 2 - 1));
}


function attemptDraw2() {
    // top wall
    console.log("#".repeat(cols * 2 + 1));

    const ary = [];
    let a: number, b: number, cell_idx: number;

    for (b = 0; b < maze.length / cols; b++) {
        // [...Array(cols * 2 - 1)].map(_ => "#");
        // top half
        for (a = 0; a < cols * 2; a++)
            ary.push("");

        for (a = 0; a < cols; a++) {
            cell_idx = b * cols + a;

            ary[a * 2] = " ";

            // left & right
            if (a * 2 - 1 >= 0)
                ary[a * 2 - 1] = maze[cell_idx].walls.left ? "#" : " ";
            if (a * 2 + 1 < ary.length)
                ary[a * 2 + 1] = maze[cell_idx].walls.right ? "#" : " ";
        }

        console.log("#" + ary.join(""));
        ary.splice(0, ary.length);

        // lower half
        for (a = 0; a < cols * 2; a++)
            ary.push("#");

        for (a = 0; a < cols; a++) {
            cell_idx = b * cols + a;

            ary[a * 2] = ".";

            // bottom
            if (cell_idx >= maze.length) break;

            ary[a * 2] = maze[cell_idx].walls.bottom ? "#" : " ";
        }

        console.log("#" + ary.join(""));
        ary.splice(0, ary.length);
    }

    // bottom wall
    // console.log("#".repeat(cols * 2 + 1));
}

attemptDraw2();

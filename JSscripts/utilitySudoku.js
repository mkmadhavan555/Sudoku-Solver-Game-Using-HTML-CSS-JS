
function board_string_to_grid(board_string) {
    var rows = [];
    var cur_row = [];
    for (var i in board_string) {
        cur_row.push(board_string[i]);
        if (i % 9 == 8) {
            rows.push(cur_row);
            cur_row = [];
        }
    }
    return rows;
};

function board_grid_to_string(board_grid) {
    var board_string = "";
    for (var r = 0; r < 9; ++r) {
        for (var c = 0; c < 9; ++c) {
            board_string += board_grid[r][c];
        }
    }
    return board_string;
}

function board_grid_to_display_string(board_grid) {
    const maxLength = board_grid.flat().reduce((a, c) => Math.max(c.length, a), 0);
    const display_string = board_grid.map(arr => arr.map(s => s.padEnd(maxLength, ' ')).join(' ')).join('\n');
    return display_string;
}

function board_string_to_display_string(board_string) {
    var V_PADDING = " "; 
    var H_PADDING = '\n'; 
    var V_BOX_PADDING = "  "; 
    var H_BOX_PADDING = '\n';

    var display_string = "";

    for (var i in board_string) {
        var square = board_string[i];
        display_string += square + V_PADDING;
        if (i % 3 === 2) {
            display_string += V_BOX_PADDING;
        }
        if (i % 9 === 8) {
            display_string += H_PADDING;
        }
        if (i % 27 === 26) {
            display_string += H_BOX_PADDING;
        }
    }

    return display_string;
}

function validate_board(board) {
   

    if (!board) {
        return "Empty board";
    }

    if (board.length !== NUM_SQUARES) {
        return "Invalid board size. Board must be exactly " + NUM_SQUARES + " squares.";
    }

    for (var i in board) {
        if (!_in(board[i], "123456789") && board[i] !== BLANK_CHAR) {
            return "Invalid board character encountered at index " + i + ": " + board[i];
        }
    }

    return true;
}
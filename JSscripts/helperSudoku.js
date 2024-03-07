

var ROWS = "ABCDEFGHI"; 
var COLS = "123456789"; 
var SQUARES = null; 

var UNITS = null;
var SQUARE_UNITS_MAP = null;
var SQUARE_PEERS_MAP = null;

var MIN_GIVENS = 17; 
var NUM_SQUARES = 81; 


BLANK_CHAR = ".";
BLANK_BOARD = "...................................................." + ".............................";


function initializeSudokuLib() {
    SQUARES = _cross(ROWS, COLS);
    UNITS = _get_all_units(ROWS, COLS);
    SQUARE_UNITS_MAP = _get_square_units_map(SQUARES, UNITS);
    SQUARE_PEERS_MAP = _get_square_peers_map(SQUARES, SQUARE_UNITS_MAP);
}

function _get_square_units_map(squares, units) {
    var square_unit_map = {};

    for (var s in squares) {
        var cur_square = squares[s];

        var cur_square_units = [];

        for (var ui in units) {
            var cur_unit = units[ui];
            if (cur_unit.indexOf(cur_square) !== -1) {
                cur_square_units.push(cur_unit);
            }
        }

        square_unit_map[cur_square] = cur_square_units;
    }

    return square_unit_map;
}

function _get_square_peers_map(squares, units_map) {
    var square_peers_map = {};

    for (var s in squares) {
        var cur_square = squares[s];
        var cur_square_units = units_map[cur_square];

        var cur_square_peers = [];

        for (var c in cur_square_units) {
            var cur_unit = cur_square_units[c];

            for (var u in cur_unit) {
                var cur_unit_square = cur_unit[u];
                if (cur_square_peers.indexOf(cur_unit_square) === -1 &&
                    cur_unit_square !== cur_square) {
                    cur_square_peers.push(cur_unit_square);
                }
            }
        }
        square_peers_map[cur_square] = cur_square_peers;
    }

    return square_peers_map;
}

function _cross(a, b) {
    var result = [];
    for (var i in a) {
        for (var j in b) {
            result.push(a[i] + b[j]);
        }
    }
    return result;
}

function _get_all_units(rows, cols) {
    var units = [];

    for (var ri in rows) {
        units.push(_cross(rows[ri], cols));
    }

    for (var ci in cols) {
        units.push(_cross(rows, cols[ci]));
    }

    var row_squares = ["ABC", "DEF", "GHI"];
    var col_squares = ["123", "456", "789"];
    for (var rsi in row_squares) {
        for (var csi in col_squares) {
            units.push(_cross(row_squares[rsi], col_squares[csi]));
        }
    }

    return units;
}

function _assign(candidates, square, val) {
    var other_vals = candidates[square].replace(val, "");

    for (var ovi in other_vals) {
        var other_val = other_vals[ovi];
        var candidates_next = _eliminate(candidates, square, other_val);
        if (!candidates_next) {
            return false;
        }
    }

    return candidates;
}

function _eliminate(candidates, square, val) {
    if (!_in(val, candidates[square])) {
        return candidates;
    }

    candidates[square] = candidates[square].replace(val, '');

    var nr_candidates = candidates[square].length;
    if (nr_candidates === 1) {
        var target_val = candidates[square];
        for (var p in SQUARE_PEERS_MAP[square]) {
            var peer = SQUARE_PEERS_MAP[square][p];
            var candidates_new = _eliminate(candidates, peer, target_val);
            if (!candidates_new) {
                return false;
            }
        }
    }
    if (nr_candidates === 0) { 
        return false;
    }

    for (var u in SQUARE_UNITS_MAP[square]) {
        var unit = SQUARE_UNITS_MAP[square][u];
        var val_places = [];
        for (var s in unit) {
            var unit_square = unit[s];
            if (_in(val, candidates[unit_square])) {
                val_places.push(unit_square);
            }
        }
        if (val_places.length === 0) {
            return false;
        } else if (val_places.length === 1) { 
            var candidates_new = _assign(candidates, val_places[0], val);
            if (!candidates_new) {
                return false;
            }
        }
    }

    return candidates;
}

function _get_square_vals_map(board) {
    var squares_vals_map = {};
    if (board.length != SQUARES.length) {
        throw "Board/squares length mismatch.";
    } else {
        for (var i in SQUARES) {
            squares_vals_map[SQUARES[i]] = board[i];
        }
    }

    return squares_vals_map;
}

function _in(v, seq) {
    return seq.indexOf(v) !== -1;
}

function _first_true(seq) {

    for (var i in seq) {
        if (seq[i]) {
            return seq[i];
        }
    }
    return false;
}

function _shuffle(seq) {
    var shuffled = [];
    for (var i = 0; i < seq.length; ++i) {
        shuffled.push(false);
    }

    for (var i in seq) {
        var t = _rand_range(seq.length);
        while (shuffled[t]) {
            t = (t + 1) > (seq.length - 1) ? 0 : (t + 1);
        }
        shuffled[t] = seq[i];
    }

    return shuffled;
}

function _rand_range(max, min) {
 
    min = min || 0;
    if (max) {
        return Math.floor(Math.random() * (max - min)) + min;
    } else {
        throw "Range undefined";
    }
}

function _strip_dups(seq) {

    var seq_set = [];
    var dup_map = {};
    for (var i in seq) {
        var e = seq[i];
        if (!dup_map[e]) {
            seq_set.push(e);
            dup_map[e] = true;
        }
    }
    return seq_set;
}

function _force_range(nr, max, min) {
  
    min = min || 0;
    nr = nr || 0;
    if (nr < min) {
        return min;
    }
    if (nr > max) {
        return max;
    }
    return nr;
}

function _get_candidates_map(board) {

    var report = validate_board(board);
    if (!report) { throw report; }

    var candidate_map = {};
    var squares_values_map = _get_square_vals_map(board);

    for (var s in SQUARES) {
        candidate_map[SQUARES[s]] = "123456789";
    }

    for (var square in squares_values_map) {
        var val = squares_values_map[square];
        if (_in(val, "123456789")) {
            var new_candidates = _assign(candidate_map, square, val);
            if (!new_candidates) { return false; }
        }
    }

    return candidate_map;
}
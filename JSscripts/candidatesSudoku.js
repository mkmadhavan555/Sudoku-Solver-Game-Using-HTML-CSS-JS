function get_candidates(board) {
    var report = validate_board(board);
    if (report !== true) {
        throw report;
    }
    var candidates_map = _get_candidates_map(board);
    if (!candidates_map) {
        return false;
    }

    var rows = [];
    var cur_row = [];
    var i = 0;

    for (var square in candidates_map) {
        var candidates = candidates_map[square];
        cur_row.push(candidates);
        if (i % 9 == 8) {
            rows.push(cur_row);
            cur_row = [];
        }
        ++i;
    }

    return rows;
}
-- print the movesets for the 5 longest games (unrated and rated)
SELECT un_movelist, un_turns FROM unrated_matches
UNION
SELECT rm_movelist, rm_turns FROM rated_matches
ORDER BY rm_turns DESC
LIMIT 5;
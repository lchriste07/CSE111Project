-- print the movesets for the 5 shortest games (unrated and rated)
SELECT un_movelist, un_turns FROM unrated_matches
UNION
SELECT rm_movelist, rm_turns FROM rated_matches
ORDER BY un_turns ASC
LIMIT 5;
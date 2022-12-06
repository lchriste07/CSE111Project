-- print every rated grandmaster game
SELECT * FROM rated_matches
WHERE rm_white_rating >= 2500 AND rm_black_rating >= 2500
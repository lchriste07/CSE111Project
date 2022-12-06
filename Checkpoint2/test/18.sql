-- how many times was the Scotch Game opening used in rated matches?
SELECT count(*) FROM rated_matches
WHERE rm_opening LIKE '%Scotch Game%'
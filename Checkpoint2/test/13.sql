-- total wins for the sicilian defense
SELECT sum(rm_match_res = 'white')
FROM rated_matches
WHERE rm_opening LIKE '%Sicilian Defense%' 
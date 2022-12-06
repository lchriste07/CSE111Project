-- For creating our data we generate based on the match history. This query is used for getting all unique ID's so that we can create accounts for each one.

SELECT DISTINCT rm_white_id 
                FROM rated_matches
                UNION
                SELECT DISTINCT un_white_id 
                FROM unrated_matches
                UNION
                SELECT DISTINCT rm_black_id 
                FROM rated_matches
                UNION
                SELECT DISTINCT un_black_id 
                FROM unrated_matches
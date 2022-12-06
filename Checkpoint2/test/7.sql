-- For our betting poriton of the project we want to parse the matches 
SELECT rm_match_id  
                FROM rated_matches
                WHERE rm_white_rating > 2500 AND 
                rm_black_rating > 2500 AND 
                rm_white_id != '' AND 
                rm_black_id != ''

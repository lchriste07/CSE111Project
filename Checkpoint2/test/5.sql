-- Gets the amount of wins that a player had made in their career on the black side. 
SELECT COUNT(*) 
                FROM rated_matches 
                WHERE 
                rm_black_id = '{}' AND 
                rm_match_res = "black"
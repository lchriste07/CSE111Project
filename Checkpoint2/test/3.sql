-- Gets the amount of losses that a player had made in their career on the white side. 
SELECT COUNT(*) 
                FROM rated_matches 
                WHERE 
                rm_white_id = 'aminox' AND 
                rm_match_res = "black"
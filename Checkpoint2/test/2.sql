-- Gets the amount of draws that a player had made in their career. 
SELECT COUNT(*) 
                FROM rated_matches 
                WHERE 
                (rm_black_id = 'oldpaths' OR rm_white_id = 'oldpaths') AND 
                rm_match_res = "draw"
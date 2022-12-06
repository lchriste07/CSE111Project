-- Gets the amount of wins that a player had made in their career on the white side. 
SELECT COUNT(*) 
                FROM rated_matches 
                WHERE 
                rm_white_id = 'fandm-lancaster' AND 
                rm_match_res = "white"
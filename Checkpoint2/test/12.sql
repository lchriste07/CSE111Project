-- who are the top ten players on the leaderboard? Print the names and win/loss/draw ratio
SELECT lb_player_id, lb_overall_winrate
FROM leaderboard
GROUP BY lb_player_id, lb_overall_winrate
ORDER BY lb_overall_winrate DESC
LIMIT 10;
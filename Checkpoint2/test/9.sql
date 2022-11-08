SELECT lb_player_id 
FROM leaderboard , account 
WHERE acc_accountid = lb_player_id AND 
acc_balance > 9900
ORDER BY lb_overall_winrate DESC
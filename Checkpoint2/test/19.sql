-- print names and emails of every intermediate player
SELECT acc_accountid, acc_email 
FROM account
WHERE acc_rating >= 1200 AND acc_rating <= 1800
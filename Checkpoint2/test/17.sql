SELECT COUNT(acc_dateofbirth) 
FROM  account
WHERE 
(acc_dateofbirth BETWEEN '1994-01-01' AND '1995-01-01') AND 
acc_balance > 7000 AND 
acc_rating > 1400
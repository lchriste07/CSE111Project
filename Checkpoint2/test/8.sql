-- Updates the account with new information with new informaiton. Used for updating the account information and adding funds for betting results. 

SELECT *
FROM account 
WHERE acc_accountid = 'xvid';

UPDATE account
SET acc_email = '2842876580@gmail.com', acc_rating = 1600
WHERE acc_accountid = 'xvid';

SELECT *
FROM account 
WHERE acc_accountid = 'xvid';
import sqlite3  , csv , random 
from sqlite3 import Error


def openConnection(_dbFile):
    print("++++++++++++++++++++++++++++++++++")
    print("Open database: ", _dbFile)

    conn = None
    try:
        conn = sqlite3.connect(_dbFile)
        print("success")
    except Error as e:
        print(e)

    print("++++++++++++++++++++++++++++++++++")

    return conn

def closeConnection(_conn, _dbFile):
    print("++++++++++++++++++++++++++++++++++")
    print("Close database: ", _dbFile)

    try:
        _conn.close()
        print("success")
    except Error as e:
        print(e)

    print("++++++++++++++++++++++++++++++++++")


def createTable(_conn):
    print("++++++++++++++++++++++++++++++++++")
    print("Create table")

    c = _conn.cursor()



    c.execute ('''CREATE TABLE unrated_matches(
        un_match_id char(10) , 
        un_opening char(100) not null,
        un_white_id text not null,
        un_black_id text not null,
        un_white_rating not null, 
        un_black_rating not null,
        un_turns decimal(3,0) not null, 
        un_movelist text not null,
        un_match_res char(6) not null)
        ''')
  

    c.execute (
        '''CREATE TABLE betting_logs (
bt_account_id char(20) not null, 
bt_winner_id char(20) not null, 
bt_loser_id char(20) not null, 
bt_loser_rating decimal(4,0) not null, 
bt_winner_rating decimal(4,0) not null, 
bt_victory_status char(20) not null, 
bt_amount decimal(4,2) not null, 
bt_match_id char(20) not null, 
bt_id decimal(3,0) not null, 
bt_date date date not null,
bt_choice char (20,0) not null
        ) '''
    )
    c.execute ('''CREATE TABLE leaderboard(
        lb_player_id char(20) not null, 
        lb_overall_winrate double(0,4) not null, 
        lb_wins decimal(3,0) not null,
        lb_losses decimal(3,0) not null,
        lb_draws decimal(3,0) not null,
        lb_fave_op char(30) not null, 
        lb_rating decimal(4,0) not null)
         ''')


    c.execute (
        '''CREATE TABLE account(
acc_accountid char(20) not null, 
acc_dateofbirth date not null, 
acc_email char(30) not null, 
acc_rating decimal(4,0) not null,
acc_balance double(10,0) not null
        ) '''
    )
  
    c.execute ('''CREATE TABLE opening(
        op_eco text not null,
        op_name text not null,
        op_moves text not null)
        ''')


   
    
    c.execute ('''CREATE TABLE rated_matches(
        rm_match_id char(10) , 
        rm_opening char(100) not null,
        rm_white_id text not null,
        rm_black_id text not null,
        rm_white_rating not null, 
        rm_black_rating not null,
        rm_turns decimal(3,0) not null, 
        rm_movelist text not null , 
        rm_match_res char(6) not null)
        ''')

    _conn.commit()
    
    print("++++++++++++++++++++++++++++++++++")


def dropTable(_conn):
    print("++++++++++++++++++++++++++++++++++")
    print("Drop tables")
    c = _conn.cursor()

    c.execute(''' SELECT count(name) FROM sqlite_master WHERE type='table' AND name='betting_logs' ''')

    if c.fetchone()[0]==1 : 
        
        c.execute ('DROP TABLE rated_matches;',)
        c.execute ('DROP TABLE unrated_matches;',)
        c.execute ('DROP TABLE opening;',)
        c.execute ('DROP TABLE account;',)
        c.execute ('DROP TABLE leaderboard;',)
        c.execute ('DROP TABLE betting_logs;',)

        

    else: 
        print("Table Does Not Exist")


        
    _conn.commit()
    print("++++++++++++++++++++++++++++++++++")




def generateMatches(_conn):
    c = _conn.cursor()
    with open('games.csv', newline='') as csvfile:
        data = list(csv.reader(csvfile))
    unrated = ('''INSERT INTO unrated_matches VALUES( ? ,? , ? , ? , ? , ? , ? , ? )''')
    rated = ('''INSERT INTO rated_matches VALUES( ? ,? , ? , ? , ? , ? , ? , ?)''')

    for rows in data:
        paramater = (rows[0] , (rows[14]) , rows[8] , rows[10] , rows[9] , rows[11] , rows[4] , rows[12])
        if(rows[1] == "TRUE" or rows[1] == "True"):
            c.execute(rated ,paramater)
        else:
            c.execute(unrated , paramater)

        
        
def generateAccounts(_conn):
    c = _conn.cursor()
    dates = []
    emails = []
    ratings = []
    count = 0

    # Gets all the unique IDs of all players who have participated in matches. 
    query = ('''SELECT DISTINCT rm_white_id 
                FROM rated_matches
                UNION
                SELECT DISTINCT un_white_id 
                FROM unrated_matches
                UNION
                SELECT DISTINCT rm_black_id 
                FROM rated_matches
                UNION
                SELECT DISTINCT un_black_id 
                FROM unrated_matches
                ''')
    c.execute(query)
    userID = c.fetchall()
    for rows in userID:
        count+= 1
        dates.append(str(random.randrange(1940,2022)) + "-" + str(random.randrange(1,12)) + "-" + str(random.randrange(1,30)))
        emails.append(str(random.randrange(1000000,10000000000)) + "@gmail.com")
        ratings.append(random.randrange(600, 1500))

    
    rated = ('''INSERT INTO account VALUES( ? ,? , ? , ?)''')


    for rows in range(count):
        paramater = (userID[rows][0] , dates[rows] , emails[rows] , ratings[rows])
        c.execute(rated , paramater)


def generateOpenings(_conn):
    c = _conn.cursor()
    with open('chess_openings.csv', newline='') as csvfile:
        data = list(csv.reader(csvfile))
    unrated = ('''INSERT INTO opening VALUES( ? ,? , ? )''')
    

    for rows in data:
        if(rows[0] == "ECO"):
            print("")
        else:
            paramater = (rows[0] , (rows[1]) , rows[2])
            c.execute(unrated , paramater)

    unrated = ('''INSERT INTO account VALUES( ? ,? , ?  )''')





def Q1(_conn):
    print("++++++++++++++++++++++++++++++++++")
    print("Q1:  ")
    c = _conn.cursor()
    query = ('''SELECT DISTINCT rm_white_id 
                FROM rated_matches
                UNION
                SELECT DISTINCT un_white_id 
                FROM unrated_matches
                UNION
                SELECT DISTINCT rm_black_id 
                FROM rated_matches
                UNION
                SELECT DISTINCT un_black_id 
                FROM unrated_matches ''')

    c.execute(query)
    data = c.fetchall()
    for rows in data :
        print(str(rows[0]) + "\n")


    print("++++++++++++++++++++++++++++++++++")


def Q2(_conn):
    print("++++++++++++++++++++++++++++++++++")
    print("Q2")
    c = _conn.cursor()
    
    print("++++++++++++++++++++++++++++++++++")


def Q3(_conn):
    print("++++++++++++++++++++++++++++++++++")
    print("Q3")
    
   
    print("++++++++++++++++++++++++++++++++++")


def Q4(_conn):
    print("++++++++++++++++++++++++++++++++++")
    print("Q4")
    c = _conn.cursor()
   
  
    print("++++++++++++++++++++++++++++++++++")


def Q5(_conn):
    print("++++++++++++++++++++++++++++++++++")
    print("Q5")

    print("++++++++++++++++++++++++++++++++++")

def Q6(_conn):
    print("++++++++++++++++++++++++++++++++++")
    print("Q5")

    print("++++++++++++++++++++++++++++++++++")

def Q7(_conn):
    print("++++++++++++++++++++++++++++++++++")
    print("Q5")

    print("++++++++++++++++++++++++++++++++++")


def Q8(_conn):
    print("++++++++++++++++++++++++++++++++++")
    print("Q5")

    print("++++++++++++++++++++++++++++++++++")


def Q9(_conn):
    print("++++++++++++++++++++++++++++++++++")
    print("Q5")

    print("++++++++++++++++++++++++++++++++++")

def Q5(_conn):
    print("++++++++++++++++++++++++++++++++++")
    print("Q5")

    print("++++++++++++++++++++++++++++++++++")

def Q10(_conn):
    print("++++++++++++++++++++++++++++++++++")
    print("Q5")

    print("++++++++++++++++++++++++++++++++++")

def Q11(_conn):
    print("++++++++++++++++++++++++++++++++++")
    print("Q5")

    print("++++++++++++++++++++++++++++++++++")

def Q12(_conn):
    print("++++++++++++++++++++++++++++++++++")
    print("Q5")

    print("++++++++++++++++++++++++++++++++++")

def Q13(_conn):
    print("++++++++++++++++++++++++++++++++++")
    print("Q5")

    print("++++++++++++++++++++++++++++++++++")


def Q14(_conn):
    print("++++++++++++++++++++++++++++++++++")
    print("Q5")

    print("++++++++++++++++++++++++++++++++++")


def Q15(_conn):
    print("++++++++++++++++++++++++++++++++++")
    print("Q5")

    print("++++++++++++++++++++++++++++++++++")


def Q16(_conn):
    print("++++++++++++++++++++++++++++++++++")
    print("Q5")

    print("++++++++++++++++++++++++++++++++++")    

def Q17(_conn):
    print("++++++++++++++++++++++++++++++++++")
    print("Q5")

    print("++++++++++++++++++++++++++++++++++") 

def Q18(_conn):
    print("++++++++++++++++++++++++++++++++++")
    print("Q5")

    print("++++++++++++++++++++++++++++++++++") 


def Q19(_conn):
    print("++++++++++++++++++++++++++++++++++")
    print("Q5")

    print("++++++++++++++++++++++++++++++++++") 

def Q20(_conn):
    print("++++++++++++++++++++++++++++++++++")
    print("Q5")

    print("++++++++++++++++++++++++++++++++++") 

def main():
    database = r"games.sqlite"

    # create a database connection
    conn = openConnection(database)
    with conn:
        #dropTable(conn)
        #createTable(conn)
        #generateMatches(database)
        #generateAccounts(database)
        #generateOpenings(database)
        
        Q1(conn)
        Q2(conn)
        Q3(conn)
        Q4(conn)
        Q5(conn)
        Q6(conn)
        Q7(conn)
        Q8(conn)
        Q9(conn)
        Q10(conn)
        Q11(conn)
        Q12(conn)
        Q13(conn)
        Q14(conn)
        Q15(conn)
        Q16(conn)
        Q17(conn)
        Q18(conn)
        Q19(conn)
        Q20(conn)

    closeConnection(conn, database)


if __name__ == '__main__':
    main()

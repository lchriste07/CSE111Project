// STEP: Import required packages
import java.sql.*;

public class load {
    private Connection c = null;
    private String dbName;
    private boolean isConnected = false;

    private void openConnection(String _dbName) {
        dbName = _dbName;

        if (false == isConnected) {
            System.out.println("++++++++++++++++++++++++++++++++++");
            System.out.println("Open database: " + _dbName);

            try {
                String connStr = new String("jdbc:sqlite:");
                connStr = connStr + _dbName;

                // STEP: Register JDBC driver
                Class.forName("org.sqlite.JDBC");

                // STEP: Open a connection
                c = DriverManager.getConnection(connStr);

                // STEP: Diable auto transactions
                c.setAutoCommit(false);

                isConnected = true;
                System.out.println("success");
            } catch (Exception e) {
                System.err.println(e.getClass().getName() + ": " + e.getMessage());
                System.exit(0);
            }

            System.out.println("++++++++++++++++++++++++++++++++++");
        }
    }

    private void closeConnection() {
        if (true == isConnected) {
            System.out.println("++++++++++++++++++++++++++++++++++");
            System.out.println("Close database: " + dbName);

            try {
                // STEP: Close connection
                c.close();

                isConnected = false;
                dbName = "";
                System.out.println("success");
            } catch (Exception e) {
                System.err.println(e.getClass().getName() + ": " + e.getMessage());
                System.exit(0);
            }

            System.out.println("++++++++++++++++++++++++++++++++++");
        }
    }

    private void createTable() {
        System.out.println("++++++++++++++++++++++++++++++++++");
        System.out.println("Create table");
        
        try
        {
            Statement stmt = c.createStatement();
            String sql = "CREATE TABLE betting_logs (" +
                "bt_account_id char(20) not null, " +
                "bt_winner_id char(20) not null, " +
                "bt_loser_id char(20) not null, " +
                "bt_loser_rating decimal(4,0) not null, " +
                "bt_winner_rating decimal(4,0) not null, " +
                "bt_victory_status char(20) not null, " +
                "bt_amount decimal(4,2) not null, " +
                "bt_match_id char(20) not null, " +
                "bt_id decimal(3,0) not null, " +
                "bt_date date date not null" +
                ")";
            stmt.execute(sql);
            
            sql = "CREATE TABLE account(" +
                "acc_accountid char(20) not null, " +
                "acc_dateofbirth date not null, " +
                "acc_email char(30) not null, " +
                "acc_rating decimal(4,0) not null " +
            ")";
            stmt.execute(sql);

            sql = "CREATE TABLE leaderboard(" +
                "lb_player_id char(20) not null, " +
                "lb_overall_winrate double(0,4) not null, " +
                "lb_wins decimal(3,0) not null, " +
                "lb_losses decimal(3,0) not null, " +
                "lb_draws decimal(3,0) not null, " +
                "lb_fave_op char(30) not null, " +
                "lb_rating decimal(4,0) not null)";
            stmt.execute(sql);

            sql = "CREATE TABLE matches(" +
                "m_rated char(10) not null, " +
                "m_opening char(30) not null, " +
                "m_white_id text not null, " +
                "m_black_id text not null, " +
                "m_white_rating not null, " +
                "m_black_rating not null, " +
                "m_moves decimal(3,0) not null, " +
                "m_movelist text not null)";
            stmt.execute(sql);

            sql = "CREATE TABLE opening(" +
                "op_name text not null, " +
                "op_moves decimal(2,0) not null)";
            stmt.execute(sql);

            c.commit();
            stmt.close();

            System.out.println("success!");
        }
        catch (Exception e) 
        {
            System.err.println(e.getClass().getName() + ": " + e.getMessage());
            try 
            {
                c.rollback();
            } catch (Exception e1) 
            {
                System.err.println(e1.getClass().getName() + ": " + e1.getMessage());
            }
        }
        System.out.println("++++++++++++++++++++++++++++++++++");
    }

    private void populateTable() {
        System.out.println("++++++++++++++++++++++++++++++++++");
        System.out.println("Populate table");

        try
        {
            String sql = "SELECT rated, opening_name, white_id, black_id, white_rating, black_rating, turns, moves FROM games";
            PreparedStatement stmt = c.prepareStatement(sql);
            ResultSet rs = stmt.executeQuery();

            while(rs.next())
            {                
                String rated = rs.getString("rated");
                String opening_name = rs.getString("opening_name");
                String white_id = rs.getString("white_id");
                String black_id = rs.getString("black_id");
                int white_rating = rs.getInt("white_rating");
                int black_rating = rs.getInt("black_rating");
                int turns = rs.getInt("turns");
                String moves = rs.getString("moves");

                sql = "INSERT INTO matches(m_rated, m_opening, m_white_id, m_black_id, m_white_rating, "+
                "m_black_rating, m_moves, m_movelist) VALUES(?,?,?,?,?,?,?,?)";
                stmt = c.prepareStatement(sql);
                
                stmt.setString(1, rated);
                stmt.setString(2, opening_name);
                stmt.setString(3, white_id);
                stmt.setString(4, black_id);
                stmt.setInt(5, white_rating);
                stmt.setInt(6, black_rating);
                stmt.setInt(7, turns);
                stmt.setString(8, moves);

                stmt.executeUpdate();
            }

            c.commit();
            rs.close();
            stmt.close();
        }
        catch (Exception e) 
        {
            System.err.println(e.getClass().getName() + ": " + e.getMessage());
            try 
            {
                c.rollback();
            } catch (Exception e1) 
            {
                System.err.println(e1.getClass().getName() + ": " + e1.getMessage());
            }
        }
        System.out.println("++++++++++++++++++++++++++++++++++");
    }

    private void dropTable() {
        System.out.println("++++++++++++++++++++++++++++++++++");
        System.out.println("Drop table");
        System.out.println("success");

        try
        {
            
            Statement stmt = c.createStatement();
            stmt.execute("DROP TABLE betting_logs");
            stmt.execute("DROP TABLE account");
            stmt.execute("DROP TABLE leaderboard");
            stmt.execute("DROP TABLE matches");
            stmt.execute("DROP TABLE opening");

            c.commit();
            stmt.close();
        }
        catch (Exception e) 
        {
            System.err.println(e.getClass().getName() + ": " + e.getMessage());
            try 
            {
                c.rollback();
            } catch (Exception e1) 
            {
                System.err.println(e1.getClass().getName() + ": " + e1.getMessage());
            }
        }

        System.out.println("++++++++++++++++++++++++++++++++++");
    }

    public static void main(String args[]) {
        load sj = new load();
        
        sj.openConnection("games.sqlite");

        sj.dropTable();
        sj.createTable();
        sj.populateTable();

        sj.closeConnection();
    }
}

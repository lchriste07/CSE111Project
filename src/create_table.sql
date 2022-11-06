CREATE TABLE betting_logs (
    bt_account_id decimal(3,0) not null,
    bt_winner_id decimal(3,0) not null,
    bt_loser_id decimal(3,0) not null,
    bt_amount decimal(4,2) not null,
    bt_match_id decimal(3,0) not null,
    bt_id decimal(3,0) not null,
    bt_date date date not null
);

CREATE TABLE account(
    acc_accountid decimal(3,0) not null,
    acc_dateofbirth date not null,
    acc_email char(30) not null,
    acc_rating decimal(4,0) not null
);

CREATE TABLE leaderboard(
    lb_player_id decimal(3,0) not null,
    lb_overall_winrate double(0,4) not null,
    lb_wins decimal(3,0) not null,
    lb_loss decimal(3,0) not null,
    lb_draw decimal(3,0) not null,
    lb_fave_op char(30) not null,
    lb_bullet_rating decimal(4,0) not null,
    lb_blitz_rating decimal(4,0) not null,
    lb_rapid_rating decimal(4,0) not null
);

CREATE TABLE unrated_matches(
    um_player_id decimal(3,0) not null,
    um_opening char(30) not null,
    um_whtie_id decimal(3,0) not null,
    um_black_id decimal(3,0) not null,
    um_duation time(mm:ss) not null,
    um_movelist char(500) not null
);

CREATE TABLE rated_matches(
    rm_player_id decimal(3,0) not null,
    rm_opening char(30) not null,
    rm_whtie_id decimal(3,0) not null,
    rm_black_id decimal(3,0) not null,
    rm_duation time(mm:ss) not null,
    rm_movelist char(500) not null
);

CREATE TABLE opening(
    op_name char(30) not null,
    op_moves char(15) not null
);

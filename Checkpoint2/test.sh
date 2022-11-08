#!/bin/bash

rm -f score.res
rm -f output/*

score=0
qnum=20
db="games.sqlite"

for (( i=1; i<=$qnum; i++ ))
do
	sqlite3 $db < test/$i.sql | sort > output/$i.out
	
done


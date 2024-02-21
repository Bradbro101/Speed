# Speed
By Bradley Broughton (brb28)
## Introduction
This game was inspired by "Smash Lights" published by "KIXX" on the Google Play Store.
## References and sources
It is important to note that all use of code from others' projects has been pointed out in the comments of the files. It is also important to note that this project is by no means an original idea, just an adaptation of the game I have already named.
Some of the code in this project was produced and/or edited by ChatGPT, I therefore cannot take full credit for the code.

Blurry Canvas - https://medium.com/@doomgoober/understanding-html-canvas-scaling-and-sizing-c04925d9a830

Shape constructor - https://gitlab.aber.ac.uk/eds/javascript-starter-canvases/-/blob/main/falling_stuff.html?ref_type=heads

Leaderboard - https://gitlab.aber.ac.uk/eds/leaderboard/-/blob/main/javascript/leaderboard.js?ref_type=heads

Retrieving highscores - https://gitlab.aber.ac.uk/eds/leaderboard/-/blob/main/php/top_n_names_scores.php?ref_type=heads

Saving scores - https://gitlab.aber.ac.uk/eds/leaderboard/-/blob/main/php/save_score.php?ref_type=heads (with edits from ChatGPT).
## How to play
To play, you simply press start and go! Click as many tiles as you can in the allowed time period, but be careful... if you miss a tile, you'll end your hit streak (the longer you keep your streak going, the more points you'll get!).
## How to get the database set up with postgreSQL
Enter the following commands into your console: "DROP TABLE IF EXISTS highscores; CREATE TABLE highscores(player_name VARCHAR, player_score INT);"
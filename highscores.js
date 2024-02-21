const highscores_namespace = function () {
    let highscores = {names_scores:[], max_entries:10};
    const save_score = async function (player_score) {

        const player_name = document.getElementById("player_name").value;

        // Place data in array
        const names_scores = {
            player_name,
            player_score
        }

        // Convert the data object to a query string (made with help from chatGPT) as the way I was adding the values to the URL wasn't working.
        const queryString = Object.keys(names_scores)
            .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(names_scores[key]))// Encodes the values in such a way that the URL accepts it, but it's input to the table a plain text and integers
            .join('&');
        const response = await fetch('./save_score.php?' + queryString, { // Concatenating the query string to end of url
            method: 'GET'
        })
        if (response.ok) {
            // Update table if highscores length isn't large enough OR the new player score is larger than the lowest score on the table.
            if (highscores.names_scores.length < highscores.max_entries || player_score > highscores.names_scores[highscores.names_scores.length - 1].player_score) {
                show_highscores();
            }

        } else {
            console.log("Unable to establish connection...");
        }
    }
    const hide_highscores = function () { // rearranges display layers of page depending on what is pressed
        document.getElementById("highscores_container").style.zIndex = "auto";
        document.getElementById("game_canvas").style.zIndex = "1";
        document.getElementById("game_menu").style.zIndex = "2";
        document.getElementById("input_field").style.zIndex = "2";
    }
    const show_highscores = function () { // rearranges display layers of page depending on what is pressed
        display_highscores();
        document.getElementById("game_menu").style.zIndex = "auto";
        document.getElementById("input_field").style.zIndex = "auto";
        document.getElementById("game_canvas").style.zIndex = "1";
        document.getElementById("highscores_container").style.zIndex = "2";
    }
    const create_row = function (player_name, player_score) { // Taken from Edel Sherratt (lines 42-57) https://gitlab.aber.ac.uk/eds/leaderboard/-/blob/main/javascript/leaderboard.js?ref_type=heads
        const row = document.createElement("tr");
        row.className = "row";


        // the player name
        const name_data = document.createElement("td");
        name_data.innerHTML = player_name;
        row.appendChild(name_data);

        // the player score
        const score_data = document.createElement("td");
        score_data.innerHTML = player_score;
        row.appendChild(score_data);

        return row;
    }

    async function display_highscores () { // Taken from Edel Sherratt (lines 59-101) https://gitlab.aber.ac.uk/eds/leaderboard/-/blob/main/javascript/leaderboard.js?ref_type=heads
        game_namespace.displayHighscores();
        const top_scores = document.getElementById("highscores");
        const table_head = document.getElementById("top_scores_head");

        // remove all the names and scores from the body of the displayed leaderboard
        while (top_scores.hasChildNodes()) {
            top_scores.removeChild(top_scores.firstChild)
        }

        // and clear the numeric scores from the_leaderboard
        highscores.scores = [];

        // Use fetch() to run php and obtain the scores data
        const names_scores_response = await fetch(`get_scores.php?`, {
                method: 'GET'
            })


        if (names_scores_response.ok) {

            // names_scores_response is an entire HTTP response, encoded as JSON
            // .json() extracts the json body part of the HTTP response, and returns a JavaScript object that we can work with
            const names_scores = await names_scores_response.json();

            table_head.appendChild(create_row("Player Name","Player Score")); // Adds the header row to the table

            // add a row to the leaderboard for each name and score
            // had problems splitting apart data from database, so changed the method of splitting the data
            // with the help of ChatGPT, as I was just receiving errors stating '.split' and '.replace' aren't
            // real functions.
            names_scores.forEach(
                function (name_score) {
                    const player_name = name_score.player_name; // splitting data
                    const player_score = name_score.player_score; // splitting data
                    console.log(name_score);
                    // so name_score now looks like ["name" "score"]
                    // which we can use to create a new row for the displayed leaderboard
                    top_scores.appendChild(create_row(player_name,player_score));

                    highscores.names_scores.push({name: player_name, score: parseInt(player_score)});
                    // an in-memory array that represents the leaderboard
                    // in this code, only the scores are used

                }
                ) // end forEach
        }
    }



    return {
        show_highscores : show_highscores,
        hide_highscores : hide_highscores,
        save_score : save_score
    }

}
const game_namespace = function() {
    let canvas = document.getElementById("game_canvas");
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    let ctx;
    let canv_border = 10;
    let init = function () {
        render();
        welcomeText.draw(ctx);
        requestName.draw(ctx);
    }
    let render = function() {
        const dimensions = getObjectFitSize( /* code taken from: https://medium.com/@doomgoober/understanding-html-canvas-scaling-and-sizing-c04925d9a830 */
            true,
            canvas.clientWidth,
            canvas.clientHeight,
            canvas.width,
            canvas.height
        );
        const dpr = window.devicePixelRatio || 1;

        canvas.width = dimensions.width * dpr;

        canvas.height = dimensions.height * dpr;
        ctx = canvas.getContext("2d");

        let ratio = Math.min(
            canvas.clientWidth / canvas.width,
            canvas.clientHeight / canvas.height
        );
        ctx.scale(ratio,ratio);
        clear_bg();

        function getObjectFitSize(
            contains /* true = contain, false = cover */,
            containerWidth,
            containerHeight,
            width,
            height
        ) {
            let doRatio = width / height;
            let cRatio = containerWidth / containerHeight;
            let targetWidth;
            let targetHeight;
            let test = contains ? doRatio > cRatio : doRatio < cRatio;

            if (test) {
                targetWidth = containerWidth;
                targetHeight = targetWidth / doRatio;
            } else {
                targetHeight = containerHeight;
                targetWidth = targetHeight * doRatio;
            }

            return {
                width: targetWidth,
                height: targetHeight,
                x: (containerWidth - targetWidth) / 2,
                y: (containerHeight - targetHeight) / 2
            };
        }
    }

    /*Game stages*/
    let game_interval;
    let tileSize = canvas.height / 10;
    let score = 0;
    let streak = 0;
    let score_multiplier = 1;
    let time = 60;
    let randX;
    let randY;
    let game_start = function () {
        hideMenus();
        game_interval = setInterval(game_loop,100);
        beginCountdown();
        canvas.addEventListener('click', function(event) { // listening for a click
            let clickX = event.clientX - canvas.getBoundingClientRect().left;
            let clickY = event.clientY - canvas.getBoundingClientRect().top;

            if(clickX >= tile.x && clickX <= (tile.x + tileSize) && clickY >= tile.y && clickY <= (tile.y + tileSize)) {
                streak++;
                score++;

                // As streak increases, increase the points per hit
                if (streak > 10) {
                    score++;
                    score_multiplier = 2;
                    if (streak > 20) {
                        score++;
                        score_multiplier = 3;
                        if (streak > 30) {
                            score++;
                            score_multiplier = 4;
                        }
                    }
                }
                scoreText.moreText = score;
                rand_gen();
            } else {
                // End streak when miss
                streak = 0;
                score_multiplier = 1;
            }
        }); //For clicking on square
    }
    let clear_bg = function () {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    let displayHighscores = function () { // Ensure we're not drawing on top of old drawing
        clear_bg();
        highscoreText.draw(ctx);
    }
    let hideMenus = function () { // rearranges display layers of page depending on what is pressed
        document.getElementById("game_canvas").style.zIndex = "2";
        document.getElementById("game_menu").style.zIndex = "1";
    }

    /*Objects below*/
    let square = function (x, y, width, height, colour) { // Taken from Edel Sherratt (lines 38-50) https://gitlab.aber.ac.uk/eds/javascript-starter-canvases/-/blob/main/falling_stuff.html?ref_type=heads
        // Added some styling to the shape so it would suit the game
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.colour = colour;
        this.draw = function (ctx) {
            ctx.save();
            ctx.strokeStyle = this.colour;
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();
            ctx.restore();
        }
    }
    let tile = new square(((canvas.width/2) - (tileSize/2)), ((canvas.height/2) - (tileSize/2)), tileSize, tileSize, "#00f");
    let text = function (text , x, y, font, colour) { // Mostly copied from square constructor
        this.text = text;
        this.x = x;
        this.y = y;
        this.font = font;
        this.colour = colour;
        this.draw = function (ctx) {
            ctx.save();
            ctx.font = this.font;
            ctx.fillStyle = this.colour;
            ctx.textAlign = 'center';
            ctx.fillText(this.text, this.x, this.y);
        }
    }
    let multiText = function (text, moreText, x, y, font, colour) { // This will be used for score as it's easier to deal with one concatenated string, than place a second string for the same element of the canvas
        this.text = text;
        this.moreText = moreText;
        this.x = x;
        this.y = y;
        this.font = font;
        this.colour = colour;
        this.draw = function (ctx) {
            ctx.save();
            ctx.font = this.font;
            ctx.fillStyle = this.colour;
            ctx.fillText(this.text + " " +this.moreText + (" ( X " + score_multiplier + ")"), this.x, this.y);
        }
    }

    // All canvas text
    let welcomeText = new text("Welcome to Speed!", canvas.width/2, canvas.height/10, (3 / 100) * window.innerWidth + "pt Courier New", "#f00");
    let requestName = new text("Please input your name below:", canvas.width/2, (canvas.height/16)*3, (2 / 100) * window.innerWidth + "pt Courier New", "#aaa");
    let scoreText = new multiText("Score: ", score, canv_border, (32 + canv_border), (1.5 / 100) * window.innerWidth + "pt Courier New", "#fff");
    let timeText = new text(time, canvas.width/2 , (32 + canv_border), (1.5 / 100) * window.innerWidth + "pt Courier New", "#fff");
    let highscoreText = new text("HighScores", canvas.width/2, canvas.height/10, (3 / 100) * window.innerWidth + "pt Courier New", "#f00");

    let beginCountdown = function () { // Created with help from ChatGPT
        let startTime = new Date().getTime();

        let targetEnd = startTime + time * 1000;
        let intervalTimer = setInterval(function () { // Changed to display countdown from 60, instead of 60,000
            let now = new Date().getTime();
            let remainingTime = targetEnd - now;
            time = Math.floor(remainingTime / 1000);
            timeText.text = time; // Update what time will be displayed
            if (time <= 0) {
                clearInterval(intervalTimer);
            }
        }, 1000)
    }
    let rand_gen = function () { // Place somewhere within the bounds of the canvas
        randX = Math.floor((Math.random() * canvas.width) + 1);

        randY = Math.floor((Math.random() * canvas.height) + 1);
        while(canvas.width - tileSize < randX) {
            randX = Math.floor((Math.random() * canvas.width) + 1);

        }
        while(canvas.height - tileSize < randY || randY < 50) {
            randY = Math.floor((Math.random() * canvas.height) + 1);

        }
        tile.x = randX;
        tile.y = randY;

    }
    let game_loop = function () {
        render();
        scoreText.draw(ctx);
        timeText.draw(ctx);
        tile.draw(ctx);
        if (time <= 0){
            clearInterval(game_interval);
            highscores_namespace().save_score(score);
            highscores_namespace().show_highscores();
        }
    }

    return {
        init : init,
        start_game : game_start,
        displayHighscores : displayHighscores,
    }

}()
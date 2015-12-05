// Jun Yang

// right answer will be in console
var myInterval;
var data;               // store the JSON data
var cur;                // record of the current selected answer
var answer;             // record of the user's answer
var right;              // record of the right answer
var questionSet = [];   // questions already be taken
var cate;           // category number

// set up when the page loads
window.onload = function() {
    // get the category number
    var date = new Date();
    var d = date.getDate();
    cate = d - 5 * parseInt(d / 5);
    
    $("body").css("background", "url(img/blue" + cate + ".jpg)");
    var cateName = ["Physics", "Math", "Celebrity Facts", "Presidents", "Geography"]
    $("#category").html(cateName[cate]);

    //ajax_get_json();
    nextQuestion();

    // click next and go to the next question
    $("#next").click(function() {
        nextQuestion();
    });

    $("#pause").click(function() {
        clearInterval(myInterval);
    });

    $("#resume").click(function() {
        clearInterval(myInterval);
        myInterval = setInterval(timer, 1000);
    });

    // record the answer currently being selected - multiple choice
    $("#answer-multiple").children().click(function() {
        var allId = ["A", "B", "C", "D"];
        cur = this.id;
        allId.splice(allId.indexOf(cur), 1);
        $("#" + cur).addClass("selected");
        for (var i in allId) {
            $("#" + allId[i]).removeClass("selected");
        }
        answer = $("#" + cur).html();
    });

    // record the answer currently being selected - input
    $("#input").change(function() {
        answer = $("#input").val();
    });
};

// timer
function timer() {
    var time = increment("#time", -1);
    $("#time-span-run").css("width", time + "0%");
    if (time == -1) {
        nextQuestion();
    }
}

// increase value by amount
function increment(element, amount) {
    var new_time = parseInt($(element).html()) + amount;
    $(element).html(new_time);
    return new_time;
}

// get the json
function ajax_get_json() {
    var AJAX_req = new XMLHttpRequest();
    AJAX_req.open( "GET", "question.json", true );
    AJAX_req.setRequestHeader("Content-type", "application/json");
 
    AJAX_req.onreadystatechange = function() {
        if( AJAX_req.readyState == 4 && AJAX_req.status == 200 ) {
            data = JSON.parse(AJAX_req.responseText);
            displayQuestion(data);
        }
    }
    AJAX_req.send();
}

// get score
function score(answer, a) {
    if (answer === a) {
        var score = parseInt($("#score").html()) + 1;
        $("#score").html = score;
    }

    var count = parseInt($("#count").html()) + 1;
    $("#count").html = count;
}

// if the answer is correct
function isRightAnswer() {
    increment("#score", 1);
    answer = null;
}

// generate a random order
function randOrder(num) {
    var randomSet = [];
    for (var i = 0; i < num; i++) {
        var rand = Math.floor(Math.random() * num);
        while (randomSet.indexOf(rand) !== -1) {
            rand = Math.floor(Math.random() * 4);
        }
        randomSet.push(rand);
    }
    return randomSet;
}

// parse the JSON file for question and answer
function displayQuestion(data) {
    var ques_all = data.questions[cate].length
    // finished all the questions
    if (questionSet.length === ques_all) {
        clearInterval(myInterval);
        var score = $("#score").html();
        $("#finish").show();
        alert("You have finished all the questions." + "\n" + "Your score is " + score + "/" + ques_all);
        return;
    }


    while (true) {
        var cur_ques = Math.floor(Math.random() * ques_all);
        if (questionSet.indexOf(cur_ques) === -1) {
            questionSet.push(cur_ques);
            break;
        }
    }

    // convert between multiple choice and input text
    if (data.questions[cate][cur_ques].xa.length > 1) {
        $("#answer-input").hide();
        $("#answer-multiple").show();
        $("#question").html(data.questions[cate][cur_ques].q);

        // display the options in a random order
        var allId = ["A", "B", "C", "D"];
        var order = randOrder(4);

        $("#" + allId[order[0]]).html(data.questions[cate][cur_ques].a);
        $("#" + allId[order[1]]).html(data.questions[cate][cur_ques].xa[0]);
        $("#" + allId[order[2]]).html(data.questions[cate][cur_ques].xa[1]);
        $("#" + allId[order[3]]).html(data.questions[cate][cur_ques].xa[2]);
        right = data.questions[cate][cur_ques].a;

    } else {
        $("#question").html(data.questions[cate][cur_ques].q);
        $("#answer-input").show();
        $("#answer-multiple").hide();
        $("#input").val("");
        right = data.questions[cate][cur_ques].a;
    }

    console.log(right);
}

// set up a random question
function nextQuestion() {
    // clean the record
    var allId = ["A", "B", "C", "D"];
    for (var i in allId) {
        $("#" + allId[i]).removeClass("selected");
    }


    // if the answer is right, score pluses 1
    if (right === answer) {
        isRightAnswer();
    }

    // increment the number of questions count
    increment("#count", 1);

    $("#time").html("10");                      // set time to the maximum
    clearInterval(myInterval);
    myInterval = setInterval(timer, 1000);      // time click each 1 second
    score();                                    // show the score and question number

    ajax_get_json();
}




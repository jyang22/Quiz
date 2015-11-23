var max_time = 5;
var myInterval;
var data;           // store the JSON data


// set up when the page loads
window.onload = function() {
    var c = 0;      // category number
    var q = 1;      // question number

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

    multiple();

};

// get the number of questions
/*
function getNumber() {
    //data = 10;
    var AJAX_req = new XMLHttpRequest();
    AJAX_req.open( "GET", "question.json", true );
    AJAX_req.setRequestHeader("Content-type", "application/json");
 
    AJAX_req.onreadystatechange = function() {
        if( AJAX_req.readyState == 4 && AJAX_req.status == 200 ) {
            data = JSON.parse(AJAX_req.responseText);
            var number = data.question[0].length;
        }
    }
    AJAX_req.send();
    return number;
}
*/

// timer
function timer() {
    var time = increment("#time", -1);
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

// record which one is selected
function multiple() {
    $("#answer").click(function() {
        alert(this.id);
    });
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

/*
// get the question
function getQuestion(responseText) {
    data = JSON.parse(responseText);
    return data;
}
*/

// parse the JSON file for question and answer
function displayQuestion(data) {
    console.log(data);
    $("#question").html(data.questions[0][0].q);
    $("#A").html(data.questions[0][0].a);
    $("#B").html(data.questions[0][0].xa[0]);
    $("#C").html(data.questions[0][0].xa[1]);
    $("#D").html(data.questions[0][0].xa[2]);
}

// set up a random question
function nextQuestion() {
    $("#time").html("10");                      // set time to the maximum
    clearInterval(myInterval);
    myInterval = setInterval(timer, 1000);      // time click each 1 second
    //i = parseInt(Math.random() * 10) + 1;
    ajax_get_json();
    score();                                    // show the score and question number

}




var modal;
var countdowns = [];
var HTMLCountdownRows;
var boolUpdateCountdowns = false;

document.addEventListener('DOMContentLoaded', _ => {
    modal = document.querySelector('#create-countdown-modal');
    document.querySelector('#modal-open').addEventListener('click', OpenCreateCountdown);
    document.querySelector('#modal-close').addEventListener('click', CloseCreateCountdown);
    document.querySelector('#modal-submit-button').addEventListener('click', AddCountdown);
    HTMLCountdownRows = document.querySelectorAll('tr');
});

// Update
function UpdateCountdowns() {
    for (let i = 0; i < countdowns.length; i++) {
        countdowns[i].timeRemainingInt--;
        let updateTimeRemainingString = CompileCountdownTime(countdowns[i].timeRemainingInt);
        HTMLCountdownRows[i+2].querySelectorAll('td')[1].textContent = updateTimeRemainingString; 
        countdowns[i].timeRemainingString = updateTimeRemainingString;
    }
}
// Countdown
function AddCountdown() {
    // Get Input Text
    var label = document.getElementById('user-label').value;
    var endDate = document.getElementById('user-time').value;

    let newCountdown = {
        name: label,
        finishDate: endDate,
        timeRemainingString: "",
        timeRemainingInt: 0
    };

    var t = document.querySelector('#countdown-row');

    var clone = document.importNode(t.content, true);   

    // Calculate the end Time and Compile as string
    let endTimeAsInt = Date.parse(endDate.toString()) / 1000;
    let currentTime = (new Date()).getTime() / 1000 | 0;
    let difference = endTimeAsInt - currentTime;

    let timeRemaining = CompileCountdownTime(difference);
    newCountdown.timeRemainingString = timeRemaining;
    newCountdown.timeRemainingInt = difference;

    // Add values to HTML
    td = clone.querySelectorAll("td");
    td[0].textContent = label.toString();
    td[1].textContent = timeRemaining;
    td[2].textContent = endDate.toString();

    var tb = document.querySelector("tbody");

    // Insert the row before the last row
    tr = tb.querySelectorAll("tr");

    tb.insertBefore(clone, tr[tr.length-1]);

    // Add new countdown to countdowns list
    countdowns.push(newCountdown);

    // Update the Countdown Rows
    HTMLCountdownRows = document.querySelectorAll('tr');

    // If we weren't updating the countdowns already, do that
    if (boolUpdateCountdowns == false) {
        boolUpdateCountdowns = true;
        setInterval(UpdateCountdowns, 1000);
    }

    CloseCreateCountdown();
}

function CompileCountdownTime(time) {
    let rtn = "";
    rtn += Math.floor( time / (60 * 60 * 24)).toString() + " Days, ";
    time = time % (60 * 60 * 24);
    rtn += Math.floor(time / (60 * 60)).toString() + " Hours, ";
    time = time % (60 * 60);
    rtn += Math.floor(time / (60)).toString() + " Minutes, ";
    time = time % 60;
    rtn += time.toString() + " Seconds.";
    return rtn;
}

// Open Modal to create a new countdown
function OpenCreateCountdown() {
    modal.style.display = 'flex';
}

function CloseCreateCountdown() {
    modal.style.display = 'none';
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
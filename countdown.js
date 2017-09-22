var modal;
var countdowns = [];
var saveData = (window.localStorage.getItem("SaveData") === null) ? "" : window.localStorage.getItem("SaveData");
var HTMLCountdownRows;
var boolUpdateCountdowns = false;

document.addEventListener('DOMContentLoaded', _ => {
    modal = document.querySelector('#create-countdown-modal');
    document.querySelector('#modal-open').addEventListener('click', OpenCreateCountdown);
    document.querySelector('#modal-close').addEventListener('click', CloseCreateCountdown);
    document.querySelector('#modal-submit-button').addEventListener('click', CreateNewCountdown);
    
    // Load the Save Data on load
    LoadData(saveData);

    // Need to call this after we load the data.
    HTMLCountdownRows = GetCountdownRows();
});

function GetCountdownRows() {
    return document.querySelectorAll('.countdown-row');
}

// Update
function UpdateCountdowns() {
    for (let i = 0; i < countdowns.length; i++) {
        countdowns[i].timeRemainingInt--;
        let updateTimeRemainingString = CompileCountdownTime(countdowns[i].timeRemainingInt);
        HTMLCountdownRows[i].querySelector('.countdown-time-remaining').textContent = updateTimeRemainingString; 
        countdowns[i].timeRemainingString = updateTimeRemainingString;
    }
}

// Get Input from Player, then add a countdown.
function CreateNewCountdown() {
    // Get Input Text
    let label = document.getElementById('user-label').value;
    let endDate = document.getElementById('user-time').value;

    difference = GetTimeDifference(endDate);

    AddCountdown(label, endDate, difference, true)
}

// Add a countdown to the list
// label - The Countdown label
// endDate - When the countdown ends
// (int) timeRemainingInt - The left remaining in the countdown
// (bool) isNewCountdown - are we loading the data from a previous session or not?
function AddCountdown(label, endDate, timeRemainingInt, isNewCountdown) {
    
    let newCountdown = {
        name: label,
        finishDate: endDate,
        timeRemainingString: "",
        timeRemainingInt: timeRemainingInt
    };

    let timeRemainingString = CompileCountdownTime(timeRemainingInt);
    newCountdown.timeRemainingString = timeRemainingString;

    let t = document.querySelector('#countdown-template');
    let clone = document.importNode(t.content, true);   

    // Add values to HTML
    td = clone.querySelectorAll("td");
    td[0].textContent = label.toString();
    td[1].textContent = timeRemainingString;
    td[2].textContent = endDate.toString();

    var tb = document.querySelector("tbody");

    // Insert the row before the last row
    tr = tb.querySelectorAll("tr");
    tb.insertBefore(clone, tr[tr.length-1]);

    // Add new countdown to countdowns list
    countdowns.push(newCountdown);
    
    // If we are creating a new countdown, we need to update save data and save file
    if (isNewCountdown) {
        saveData += UpdateSaveString(newCountdown);
        UpdateSaveData(saveData);
    }

    // Update the Countdown Rows
    HTMLCountdownRows = GetCountdownRows();

    // If we weren't updating the countdowns already, do that
    if (boolUpdateCountdowns == false) {
        boolUpdateCountdowns = true;
        setInterval(UpdateCountdowns, 1000);
    }

    CloseCreateCountdown();
}

// Compile the (int) time (in seconds) to a String 
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

// Gets the difference between the end date and the current time.
function GetTimeDifference(endDate) {
    // Calculate the end Time and Compile as string
    let endTimeAsInt = Date.parse(endDate.toString()) / 1000;
    let currentTime = (new Date()).getTime() / 1000 | 0;
    return (endTimeAsInt - currentTime);
}

// Open Modal to create a new countdown
function OpenCreateCountdown() {
    modal.style.display = 'flex';
}

// Close Modal
function CloseCreateCountdown() {
    modal.style.display = 'none';
}

// Update the save string to be stored in localStorage
function UpdateSaveString(newCountdown) {
    return newCountdown.name + ',' + newCountdown.finishDate + ',' + newCountdown.timeRemainingInt + '|'; 
}

// Save Data
function UpdateSaveData(newCountdownSaveString) {
    window.localStorage.setItem("SaveData", saveData);
}

// Load Data
// Data is saved as follows: Label, Time When Finished (Date), Time Remaining (int).
function LoadData(savedData) {
    let savedDataArray = savedData.split('|');
    for (let i = 0; i < savedDataArray.length - 1; i++) {
        // Saved data is in two parts, add to the list
        if (savedDataArray[i] === "") { 
            continue; 
        }

        // Get the current time　difference
        let savedCountdown = savedDataArray[i].split(',');
        let difference = GetTimeDifference(savedCountdown[1]);
        AddCountdown(savedCountdown[0], savedCountdown[1], difference, false);
    }
}


// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
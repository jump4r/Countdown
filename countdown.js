var modal;
var countdowns = [];
var saveData = (window.localStorage.getItem("SaveData") === null) ? "{}" : window.localStorage.getItem("SaveData");
var JSONSaveData;
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
    console.log('Update Countdowns');
    for (let i = 0; i < countdowns.length; i++) {
        countdowns[i].timeRemainingInt--;
        if (countdowns[i].timeRemainingInt < 0) {

        }
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

    // Add new countdown to countdowns list
    countdowns.push(newCountdown);

    // Set Event Listener for Remove Button
    let countdownRow = clone.querySelector('tr');
    clone.querySelector('.btn-countdown-remove').addEventListener('click', function(event) { 
        countdownRow.remove();
        UpdateSaveData();
        HTMLCountdownRows = GetCountdownRows();
    });

    // Insert the row before the last row
    tr = tb.querySelectorAll("tr");
    tb.insertBefore(clone, tr[tr.length-1]);
    
    // If we are creating a new countdown, we need to update save data and save file
    if (isNewCountdown) {
        UpdateSaveData();
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

// Save Data
function UpdateSaveData() {
    countdowns = [];
    document.querySelectorAll('.countdown-row').forEach(el => {
        countdowns.push({
            name: el.querySelector('.countdown-id').textContent,
            finishDate: el.querySelector('.countdown-end-time').textContent,
            timeRemainingString: el.querySelector('.countdown-time-remaining').textContent,
            timeRemainingInt: GetTimeDifference(el.querySelector('.countdown-end-time').textContent)
        });
    });

    window.localStorage.setItem("SaveData", JSON.stringify(countdowns));
}

// Load Data
// Data is saved as follows: Label, Time When Finished (Date), Time Remaining (int).
function LoadData(savedData) {
    let savedDataArray = JSON.parse(savedData);
    console.log(savedDataArray);
    for (let i = 0; i < savedDataArray.length; i++) {
        // Saved data is in two parts, add to the list
        if (savedDataArray[i] === "") { 
            continue; 
        }
        console.log(savedDataArray[i].name, savedDataArray[i].finishDate);
        let difference = GetTimeDifference(savedDataArray[i].finishDate);
        AddCountdown(savedDataArray[i].name, savedDataArray[i].finishDate, difference, false);
    }
}


// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
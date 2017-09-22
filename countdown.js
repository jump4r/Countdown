var modal;
var countdowns = [];
var saveData = (window.localStorage.getItem("SaveData") === null) ? "{}" : window.localStorage.getItem("SaveData");
var boolUpdateCountdowns = false;

document.addEventListener('DOMContentLoaded', _ => {
    modal = document.querySelector('#create-countdown-modal');
    document.querySelector('#modal-open').addEventListener('click', OpenCreateCountdown);
    document.querySelector('#modal-close').addEventListener('click', CloseCreateCountdown);
    document.querySelector('#modal-submit-button').addEventListener('click', CreateNewCountdown);
    
    // Load the Save Data on load
    LoadData(saveData);

    setInterval(UpdateCountdowns, 1000);
});

// Update
function UpdateCountdowns() {
    let HTMLCountdownRows = document.querySelectorAll('.countdown-row');
    for (let i = 0; i < countdowns.length; i++) {
        countdowns[i].timeRemainingInt--;
        HTMLCountdownRows[i].querySelector('.countdown-time-remaining').textContent = CompileCountdownTime(countdowns[i].timeRemainingInt); 
        countdowns[i].timeRemainingString = CompileCountdownTime(countdowns[i].timeRemainingInt);
    }
}

// Get Input from Player, then add a countdown.
function CreateNewCountdown() {
    let label = document.getElementById('user-label').value;
    let endDate = document.getElementById('user-time').value;
    AddCountdown(label, endDate, GetTimeDifference(endDate), true)
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
        timeRemainingString: CompileCountdownTime(timeRemainingInt),
        timeRemainingInt: timeRemainingInt
    };

    let t = document.querySelector('#countdown-template');
    let clone = document.importNode(t.content, true);   

    // Add values to HTML
    td = clone.querySelectorAll("td");
    td[0].textContent = newCountdown.name;
    td[1].textContent = newCountdown.timeRemainingString;
    td[2].textContent = newCountdown.finishDate;

    // Add new countdown to countdowns list
    countdowns.push(newCountdown);

    // Set Event Listener for Remove Button
    let countdownRow = clone.querySelector('tr');
    clone.querySelector('.btn-countdown-remove').addEventListener('click', function(event) { 
        countdownRow.remove();
        UpdateSaveData();
    });

    // Insert the row before the last row
    let tb = document.querySelector("tbody");    
    tr = tb.querySelectorAll("tr");
    tb.insertBefore(clone, tr[tr.length-1]);
    
    UpdateSaveData();
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
        AddCountdown(savedDataArray[i].name, savedDataArray[i].finishDate, GetTimeDifference(savedDataArray[i].finishDate), false);
    }
}


// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
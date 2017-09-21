var modal;
document.addEventListener('DOMContentLoaded', _ => {
    modal = document.querySelector('#create-countdown-modal');
    document.querySelector('#open-modal').addEventListener('click', OpenCreateCountdown);
    document.querySelector('#close-modal').addEventListener('click', CloseCreateCountDown);
});
// Countdown
function AddCountdown() {
    var t = document.querySelector('#countdown-row');

    var clone = document.importNode(t.content, true);   

    td = clone.querySelectorAll("td");

    var tb = document.querySelector("tbody");

    // Insert the row before the last row
    tr = tb.querySelectorAll("tr");

    tb.insertBefore(clone, tr[tr.length-1]);
}

// Open Modal to create a new countdown
function OpenCreateCountdown() {
    modal.style.display = 'block';
}

function CloseCreateCountDown() {
    modal.style.display = 'none';
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
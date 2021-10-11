// Datepicker

Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});
document.getElementById('datepicker').value = new Date().toDateInputValue();
document.getElementById('second-datepicker').value = new Date().toDateInputValue();

// Avatarpicker

function getImage(image) {
    var newimg = image.replace(/^.*\\/,"");
    $("#display-image").attr("src", "/img/" + newimg);
}

function getUsername(name,username){
    document.getElementById('nameTable').value = name;
    document.getElementById('usernameTable').value = username;
}    

// Optional course end date

function enableDatepicker() {
    var datepicker = document.getElementById("second-datepicker");
    var checkbox = document.getElementById("optional-enddate");
    if(checkbox.checked) {
        datepicker.disabled = false;
    } else {
        datepicker.disabled = true;
    }
}
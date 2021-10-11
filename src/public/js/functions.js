// Datepicker

Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});
document.getElementById('datepicker').value = new Date().toDateInputValue();

// Avatarpicker

function getImage(image) {
    var newimg = image.replace(/^.*\\/,"");
    $("#display-image").attr("src", "/img/" + newimg);
}
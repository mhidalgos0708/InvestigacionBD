// Photopicker

function getImage(image) {
    var newimg = image.replace(/^.*\\/,"");
    $("#display-image").attr("src", "/img/" + newimg);
}
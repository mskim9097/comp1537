
function ajaxGET(url, callback) {

    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            //console.log('responseText:' + xhr.responseText);
            callback(this.responseText);

        } else {
            console.log(this.status);
        }
    }
    xhr.open("GET", url);
    xhr.send();
}

function ajaxPOST(url, callback, data) {

    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            //console.log('responseText:' + xhr.responseText);
            callback(this.responseText);

        } else {
            console.log(this.status);
        }
    }
    xhr.open("POST", url);
    // make it clear that our call is an AJAX call
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    // we are sending form data, we must inform the server of this
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(data);
}

// POST TO THE SERVER
document.querySelector("#submit").addEventListener("click", function (e) {
    e.preventDefault();
    let email = document.getElementById("email");
    let password = document.getElementById("password");
    let queryString =
        "email=" + email.value + "&password=" + password.value;
    console.log("query parameters", queryString)

    const vars = { "email": email.value, "password": password.value }
    ajaxPOST("/login", function (data) {

        if (data) {
            let dataParsed = JSON.parse(data);
            console.log(dataParsed);
            if (dataParsed.status == "fail") {
                document.getElementById("errorMsg").innerHTML = dataParsed.msg;
            } else {
                window.location.replace("/profile");
            }
        }

    }, queryString);
});



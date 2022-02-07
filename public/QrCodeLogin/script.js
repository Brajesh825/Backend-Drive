host = "http://localhost:4000";

var qr;

function uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

const qrToken = uuidv4();

(function() {
    qr = new QRious({
        element: document.getElementById("qr-code"),
        size: 200,
        value: qrToken,
    });
})();

let status = "";
const token = {};

async function checkQR() {
    console.log(qrToken);
    const data = { qrToken };
    const response = await fetch(host + "/qr-service/login", {
        method: "POST",
        headers: {
            "content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const status = response.status;
    const responseObj = await response.json();

    if (status == "404") {
        setTimeout(checkQR, 5000);
    } else if (status == "200") {
        token["access_token"] = responseObj.access_token;
        token["expires_in"] = responseObj.expires_in;
        token["scope"] = responseObj.scope;
        token["token_type"] = responseObj.token_type;

        console.log(token);
    } else {
        return;
    }
}

checkQR();
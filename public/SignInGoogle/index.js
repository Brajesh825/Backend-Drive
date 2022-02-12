// const host = "https://backend.unbelong.in";

async function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    $("#name").text(profile.getName());
    $("#email").text(profile.getEmail());
    $("#image").attr("src", profile.getImageUrl());
    $(".data").css("display", "block");
    $(".g-signin2").css("display", "none");

    const idToken = googleUser.wc.id_token;

    const data = { idToken };
    const response = await fetch("/google-service/login", {
        method: "POST",
        headers: {
            "content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const responseObj = await response.json();
    console.log(responseObj);
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function() {
        alert("You have been signed out successfully");
        $(".data").css("display", "none");
        $(".g-signin2").css("display", "block");
    });
}
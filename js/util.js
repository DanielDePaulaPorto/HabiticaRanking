var days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

$(document).ready(function () {
    console.log("util.js loaded!");

    // Initialize Firebase
    var config = {
        apiKey: "<<<APIKEY do Firebase>>>",
        authDomain: "<<<ID do projeto no Firebase>>>.firebaseapp.com",
        databaseURL: "https://<<<ID do projeto no Firebase>>>.firebaseio.com",
        projectId: "<<<ID do projeto no Firebase>>>",
        storageBucket: "<<<ID do projeto no Firebase>>>.appspot.com",
        messagingSenderId: "<<<ID>>>"
    };
    firebase.initializeApp(config);
});

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;
    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};

function getChallengeParameter() {
    console.log("Getting challenge parameter");
    var chall = getUrlParameter('challenge');
    console.log("Challenge found: " + chall);
    return chall;
}

function getDateFormated(date){
  return days[date.getDay()] + " " + date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " - " + date.getHours() + ":" + ("0" + date.getMinutes()).slice(-2) + '\n';
}

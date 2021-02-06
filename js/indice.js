var table = "";

$(document).ready(function () {
    console.log("indice.js loaded!");
    showLoading();

    table = '<table id="tableIndice" border="0" cellspacing="10" cellpadding="10" class="indexTable">' +
        '<tr>' +
        '  <td class="indexCellHeader">Desafio</td>' +
        '  <td class="indexCellHeader">Ranking</td>' +
        '  <td class="indexCellHeader">Dashboard</td>' +
        '  <td class="indexCellHeader">Histórico</td>' +
        '  <td class="indexCellHeader">Resultado</td>' +
        '</tr>';

    // get all challenge Avaliables
    var db = firebase.firestore();
    var collectionRef = db.collection("challengeUsers");

    collectionRef.get().then(function (challenges) {
        challenges.forEach(function (doc) {
            console.log(doc.id, " -> ", doc.data());

            var users = new Array();

            Object.entries(doc.data()).forEach(entry => {
                let key = entry[0];
                let value = entry[1];
                // console.log("Key: " + key + " - value: " + value);
                var usr = {
                    i: key,
                    t: value
                };
                users.push(usr);
            });
            data = {
                u: users,
            };



            // get challenge name
            var challenge = getChallenge(doc.id);
            // console.log("* " + challenge.name);

            addChallangeLine(doc.id, challenge.name);
        });
        table += "</table>";
        $("#indice").append(table);
        hideLoading();
    }).catch(function (error) {
        console.error("Error getting document:", error);
    });
});

function addChallangeLine(id, name) {
    table += '<tr><td class="indexCell">';
    
    if(name){
        table += name;
    } else {
        table += '<i class="fas fa-skull"></i> ' + name;
    }
    
    table += '</td>' +
        '  <td class="indexCell"><a href="Ranking.html?challenge=' + id + '"><i class="fas fa-medal"></i> Ranking</a></td>' +
        '  <td class="indexCell"><a href="Dashboard.html?challenge=' + id + '"><i class="fas fa-cogs"></i> Dashboard</a></td>' +
        '  <td class="indexCell"><a href="Historic.html?challenge=' + id + '"><i class="fas fa-history"></i> Histórico</a></td>' +
        '  <td class="indexCell"><a href="ClosedChallenge.html?challenge=' + id + '"><i class="fas fa-flag-checkered"></i> Placar final</a></td>' +
        '</tr>';
}

function showLoading() {
    $("#loading").show();
}

function hideLoading() {
    $("#loading").hide();
}
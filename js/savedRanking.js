var challenge = {};
var desafio;
var teamsRanking = new Array();

$(document).ready(function () {
  console.log("savedRanking.js loaded!");

  showLoading();

  desafio = getChallengeParameter();
  console.log("desafio:" + desafio);
  if (desafio) {
    getChallengeUsers();
  } else {
    showMessage("Código do desafio inválido!");
  }
});

function getChallengeUsers() {
  console.log("getChallengeUsers()");
  console.log("Procurando o desafio: " + desafio);
  var db = firebase.firestore();
  var docRef = db.collection("challengeUsers").doc(desafio);

  docRef.get().then(function (doc) {
    if (doc.exists) {
      var challengeUsers = doc.data();
      console.log("Document data:", challengeUsers);

      var users = new Array();

      Object.entries(challengeUsers).forEach(entry => {
        let key = entry[0];
        let value = entry[1];
        console.log("Key: " + key + " - value: " + value);

        var usr = {
          i: key,
          t: value
        };
        users.push(usr);
      });
      data = {
        u: users,
      };

      // load leaderboard...
      createLeaderBoard();

    } else {
      // doc.data() will be undefined in this case
      console.error("No such document!");
      showMessage("Código do desafio inválido!");
    }
  }).catch(function (error) {
    console.error("Error getting document:", error);
  });

}

function showRanking() {
  $("#ranking").show();
  $("#loading").hide();
  $("#message").hide();
  $("#saveRankingButton").show();
}

function showLoading() {
  $("#ranking").hide();
  $("#message").hide();
  $("#loading").show();
  $("#saveRankingButton").hide();
}

function showMessage(message) {
  $("#ranking").hide();
  $("#loading").hide();

  $('#message').text(message);
  $("#message").show();
}

function createLeaderBoard() {
  console.log("createLeaderBoard()");

  for (i = 0; i < data.u.length; i++) {
    console.log("Users [" + i + "] :" + data.u[i].i);
    getHabiticaUserAPIWithoutGroup(i);
  }

  getSavedResult();
}

function getSavedResult() {

  var db = firebase.firestore();
  var docRef = db.collection("savedChallenges").doc(desafio);

  docRef.get().then(function (doc) {
    if (doc.exists) {
      var challengeUsers = doc.data();
      // console.log("Document data:", challengeUsers);

      var users = new Array();

      Object.entries(challengeUsers).forEach(entry => {

        // console.log("entry data:", entry);

        let key = entry[0];
        let value = entry[1];
        // console.log("Key: " + key + " - value: " + value);

        if (key == "NAME") {
          challenge.name = value;
        } else {

          for (i = 0; i < data.u.length; i++) {
            // console.log("Users [" + i + "] :" + data.u[i].i);
            if (key == data.u[i].i) {

              // grupo: data.u[j].group,
              // hp: data.u[j].hp,
              // maxHealth: data.u[j].maxHealth,
              // exp: data.u[j].exp,
              // level: data.u[j].level,
              // score: data.u[j].challengeScore

              data.u[i].group = value.grupo;
              data.u[i].hp = value.hp;
              data.u[i].maxHealth = value.maxHealth;
              data.u[i].exp = value.exp;
              data.u[i].level = value.level;
              data.u[i].challengeScore = value.score;
              // console.log(key + " --> ", value.score);
              break;
            }
          }

        }
      });
      // console.log("challenge.name:", challenge.name);

      calculateTeamRanking();

      // sort
      data.u.sort(function (a, b) {
        return b.challengeScore - a.challengeScore
      });

      for (var w = 0; w < data.u.length; w++) {
        console.log("usuario: \t" + data.u[w].profileName + "\t" + data.u[w].group + "\t" + data.u[w].challengeScore);
      }

      setLeader();
      createBoard();
      createGroupRanking();
      showRanking();

    } else {
      // doc.data() will be undefined in this case
      console.error("No such document!");
      showMessage("Código do desafio inválido!");
    }
  }).catch(function (error) {
    console.error("Error getting document:", error);
  });


}

function setLeader() {
  var foto = (data.u[0].foto ? data.u[0].foto : 'img/user.png');
  $("#leaderBox").append(
    '<div class="challengeName">' + challenge.name + '</div>' +
    '<img src="' + foto + '">' +
    '<div class="firstUserFrame"></div>' +
    '<div class="firstUserData">' +
    '  <p class="firstUserName">' + data.u[0].profileName + '</p>' +
    '  <p class="firstUserAtributes">@' + data.u[0].username + ' • ' + data.u[0].group + '</p>' +
    '</div>');
}

function createBoard() {
  for (var i = 0; i < data.u.length; i++) {
    // console.log("usuario: " + data.u[i].profileName);
    var position = i + 1;
    var crown = "img/blankCrown.png";
    if (position == 1) {
      crown = "img/goldCrown.png";
    } else if (position == 2) {
      crown = "img/silverCrown.png";
    } else if (position == 3) {
      crown = "img/bronzeCrown.png";
    }

    var expProgress = 100 * data.u[i].exp / getLevelExp(data.u[i].level);
    var hpProgress = 100 * data.u[i].hp / data.u[i].maxHealth;

    var avatarPaddingTop = data.u[i].avatar.mount ? '0' : '24.5';


    $("#board").append(
      '<div class="player">' +
      '  <div class="position">' +
      '    <div class="crown"><img src="' + crown + '" width="54" height="44"></div>' +
      '    <p>' + position + '</p>' +
      '  </div>' +
      '  <div class="avatar">' +
      //Avatar:
      '   <div data-v-0f68e140="" class="">' +
      '     <div data-v-186433de="" data-v-0f68e140="" class="avatar background_' + data.u[i].avatar.background + '" style="padding-top: ' + avatarPaddingTop + 'px; 	left: 0px; top: 0px;">' +
      '       <div data-v-186433de="" class="character-sprites" style="margin: 0px auto 0px 24px;">' +
      '         <span data-v-186433de="" class="Mount_Body_' + data.u[i].avatar.mount + '"></span>' +
      // '        <!---->'+
      // '        <!---->'+
      // '        <!---->'+
      // '        <!---->'+
      '         <span data-v-186433de="" class="hair_flower_' + data.u[i].avatar.hairflower + '"></span>' +
      '         <span data-v-186433de="" class="chair_' + data.u[i].avatar.chair + '"></span>' +
      // '          <span data-v-186433de="" class=""></span>'+
      '         <span data-v-186433de="" class="skin_' + data.u[i].avatar.skin + '"></span>' +
      '         <span data-v-186433de="" class="broad_shirt_' + data.u[i].avatar.shirt + '"></span>' +
      '         <span data-v-186433de="" class="head_0"></span>' +
      '         <span data-v-186433de="" class="broad_' + data.u[i].avatar.armor + '"></span>' +
      // '          <span data-v-186433de="" class=""></span>'+
      '         <span data-v-186433de="" class="hair_bangs_' + data.u[i].avatar.hairbangs + '_' + data.u[i].avatar.haircolor + '"></span>' +
      '         <span data-v-186433de="" class="hair_base_' + data.u[i].avatar.hairbase + '_' + data.u[i].avatar.haircolor + '"></span>' +
      '         <span data-v-186433de="" class="hair_mustache_' + data.u[i].avatar.hairmustache + '_' + data.u[i].avatar.haircolor + '"></span>' +
      '         <span data-v-186433de="" class="hair_beard_' + data.u[i].avatar.hairbeard + '_' + data.u[i].avatar.haircolor + '"></span>' +
      // '          <span data-v-186433de="" class=""></span>'+
      // '          <span data-v-186433de="" class=""></span>'+
      '         <span data-v-186433de="" class="' + data.u[i].avatar.headArmoire + '"></span>' +
      '         <span data-v-186433de="" class="' + data.u[i].avatar.headAccessory + '"></span>' +
      '         <span data-v-186433de="" class="hair_flower_' + data.u[i].avatar.hairflower + '"></span>' +
      '         <span data-v-186433de="" class="' + data.u[i].avatar.shield + '"></span>' +
      '         <span data-v-186433de="" class="' + data.u[i].avatar.weapon + '"></span>' +
      //  '         <!---->'+
      //  '         <!---->'+
      '         <span data-v-186433de="" class="current-pet Pet-' + data.u[i].avatar.currentPet + '"></span>' +
      '         <span data-v-186433de="" class="Mount_Head_' + data.u[i].avatar.mount + '"></span>' +
      '       </div>' +
      '       <!---->' +
      '     </div>' +
      '   </div>' +
      // -------------------
      '  </div>' +
      '  <div class="name">' +
      '    <p class="userName">' + data.u[i].profileName + '</p>' +
      '    <p class="userAtributes">@' + data.u[i].username + ' • ' + data.u[i].class + ' • <b>' + data.u[i].group + '</b></p>' +
      '  </div>' +
      '  <div class="atributesBox">' +
      '    <div class="atributes">' +
      '      <img src="img/life.png" width="24" height="24">' +
      '      <div data-v-0f68e140="" class="progress">' +
      '        <div data-v-0f68e140="" class="progress-bar bg-health" style="width: ' + hpProgress + '%;"></div>' +
      '      </div>' +
      '      <span data-v-0f68e140="" class="small-text">' + Math.floor(data.u[i].hp) + ' / ' + data.u[i].maxHealth + '</span>' +
      '    </div>' +
      '    <div class="atributes">' +
      '      <img src="img/points.png" width="24" height="24">' +
      '      <div data-v-0f68e140="" class="progress">' +
      '        <div data-v-0f68e140="" class="progress-bar bg-experience" style="width: ' + expProgress + '%;"></div>' +
      '      </div>' +
      '      <span data-v-0f68e140="" class="small-text">' + data.u[i].exp + ' / ' + getLevelExp(data.u[i].level) + '</span>' +
      '    </div>' +
      '  </div>' +
      '  <div class="level">' + data.u[i].level + '</div>' +
      '  <div class="points">' + Number(data.u[i].challengeScore).toFixed(2) + '</div>' +
      '</div>');
  }
}

function calculateTeamRanking() {
  console.log("calculateTeamRanking");

  var teamsMap = new Map();
  for (i = 0; i < data.u.length; i++) {

    // grupo: data.u[j].group,
    // hp: data.u[j].hp,
    // maxHealth: data.u[j].maxHealth,
    // exp: data.u[j].exp,
    // level: data.u[j].level,
    // score: data.u[j].challengeScore

    var grupo = data.u[i].group;
    var scoreJogador = data.u[i].challengeScore;

    // console.log("Grupo " + grupo + " -> " + scoreJogador);

    var totalGrupo = teamsMap.get(grupo);
    if (totalGrupo === undefined) {
      totalGrupo = new Object();
      totalGrupo.pontuacao = 0;
      totalGrupo.tamanho = 0;
    }
    // console.log("totalGrupo: " + totalGrupo);

    totalGrupo.pontuacao += scoreJogador;
    totalGrupo.tamanho += 1;
    teamsMap.set(grupo, totalGrupo);
  }

  var k = 0;
  for (var [key, value] of teamsMap.entries()) {
    console.log(key + " = " + value);
    var media = value.pontuacao / value.tamanho;

    var score = {
      grupo: key,
      score: media,
    };

    teamsRanking[k] = score;
    k = k + 1;
  }

  // for (i = 0; i < teamsRanking.length; i++) {
  //   console.log("teamsRanking[" + i + "] - " + teamsRanking[i].grupo + " = " + teamsRanking[i].score);
  // }

  // sort
  teamsRanking.sort(function (a, b) {
    return b.score - a.score
  });

  // for (i = 0; i < teamsRanking.length; i++) {
  //   console.log("teamsRanking[" + i + "] - " + teamsRanking[i].grupo + " = " + teamsRanking[i].score);
  // }

}

function createGroupRanking() {

  var table = '<table class="groupRankingTable" width="500" border="0" cellspacing="0" cellpadding="5">'+
  '<tr> <td><h2 class="indexCellHeader"> Grupo </h2></td>'+
  '<td><h2 class="indexCellHeader">Pontos</h2></td></tr>';

  for (i = 0; i < teamsRanking.length; i++) {
    table = table + '<tr>';
    table = table + '<td><h2 class="indexCell">' + teamsRanking[i].grupo + '</h2></td>';
    table = table + '<td><h2 class="indexCell">' + Number(teamsRanking[i].score).toFixed(2) + '</h2></td>';
    table = table + '</tr>';
  }
  table = table + '</table>';


  $("#GroupRanking").append(
    '<br><br><br>' + table
  );
}
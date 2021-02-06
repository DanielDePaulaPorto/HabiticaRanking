var challenge = {};
var desafio;

$(document).ready(function() {
  console.log("ranking.js loaded!");

  var ck = document.cookie;
  console.log("Cookies: " + ck);

  showLoading();

  autoSingin();
});

function autoSingin() {
  console.log("autoSingin()");
  // get cookie user

  desafio = getChallengeParameter();
  console.log("desafio:" + desafio);
  if (desafio) {
    var cookieEmail = getCookie(desafio);
    console.log("cookieEmail:" + cookieEmail);
    if (cookieEmail != "") {
      login(cookieEmail);
      //temp remove cookie
      // setCookie(desafio, cookieEmail, -1);
    } else {
      showLogin();
    }
  } else {
    showMessage("Código do desafio inválido!");
  }
}

function login(email) {
  console.log("login: " + email);
  showLoading();

  firebase.auth().signInWithEmailAndPassword(email, "123456").then(function(user) {
    // user signed in
    console.log("User: " + user);
    setCookie(desafio, email, 365);
    registerLoggedUser(email);
    getChallengeUsers();
  }).catch(function(error) {
    // Handle Errors here.
    console.log(error.code + " - " + error.message);
    showMessage(error.message);
  });
}

function registerLoggedUser(email) {
  console.log("registerLoggedUser() > " + email);
  var now = new Date();
  var em = email.replace(/\./gi, '+');
  var db = firebase.firestore();

  var userRefDoc = db.collection('history').doc(desafio);
  userRefDoc.update({
    [em]: firebase.firestore.FieldValue.arrayUnion(now)
  });
}

function getChallengeUsers() {
  console.log("getChallengeUsers()");
  console.log("Procurando o desafio: " + desafio);
  var db = firebase.firestore();
  var docRef = db.collection("challengeUsers").doc(desafio);

  docRef.get().then(function(doc) {
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
  }).catch(function(error) {
    console.error("Error getting document:", error);
  });
}

function setUsersPenalties() {
  console.log("getUsersPenalties()");
  console.log("Procurando o desafio: " + desafio);
  var db = firebase.firestore();
  var docRef = db.collection("penalties").doc(desafio);

  docRef.get().then(function(doc) {
    if (doc.exists) {
      // var challengeUsers = doc.data();
      var usersPenalties = doc.data();
      console.log("Penalties data:", usersPenalties);


      Object.entries(usersPenalties).forEach(entry => {
        let key = entry[0];
        let value = entry[1];
        console.log("Key(user): " + key + " - value(penaltie): " +
          value);

        for (var i = 0; i < data.u.length; i++) {
          console.log("User: " + data.u[i].i);
          if (data.u[i].i == key) {
            console.log("Vai remover " + value +
              " do score do jogador " + key + " (" + data.u[i].challengeScore +
              ")");
            data.u[i].challengeScore -= value;
          }
        }
      });

      // sort
      data.u.sort(function(a, b) {
        return b.challengeScore - a.challengeScore
      });

      for (var w = 0; w < data.u.length; w++) {
        console.log("usuario: \t" + data.u[w].profileName + "\t" + data.u[w]
          .group + "\t" + data.u[w].challengeScore);
        // console.log("level: " + data.u[w].level);
        // console.log("totalExp: " + data.u[w].challengeScore);
      }

      setLeader();
      createBoard();
      showRanking();

      saveRanking();


    } else {
      // doc.data() will be undefined in this case
      console.error("No such document!");
      showMessage("Código do desafio inválido!");
    }
  }).catch(function(error) {
    console.error("Error getting document:", error);
  });
}

function showRanking() {
  $("#ranking").show();
  $("#login").hide();
  $("#loading").hide();
  $("#message").hide();
  $("#saveRankingButton").show();
}

function showLoading() {
  $("#ranking").hide();
  $("#message").hide();
  $("#login").hide();
  $("#loading").show();
  $("#saveRankingButton").hide();
}

function showLogin() {
  console.log("showLogin()");
  $("#ranking").hide();
  $("#message").hide();
  $("#login").show();
  $("#loading").hide();
  $("#saveRankingButton").hide();
}

function showMessage(message) {
  $("#ranking").hide();
  $("#loading").hide();

  $('#message').text(message);
  $("#message").show();
}

function emailEnter(event) {
  // console.log("emailEnter() > " + event.keyCode);
  if (event.keyCode == 13) {
    var email = $('#email').val();
    login(email);
  }
}

function buttonEnter() {
  var email = $('#email').val();
  login(email);
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function createLeaderBoard() {
  console.log("createLeaderBoard()");
  challenge = getChallenge(desafio);
  console.log("challenge: " + challenge.name);

  if (challenge.name) {

    delayedLoop(500, function(index) {
      // var width = (item / items.length * 100) + "%";
      // progressBar.style.width = width;
      // progressBar.innerHTML = width;
      var progress = index / data.u.length;
      console.log("PROGRESSO!!!!!! " + (progress * 100).toFixed(2));
      var message = "Carregando... (" + (progress * 100).toFixed(2) + "%)";
      $('#progress').text(message);
    });
  } else {
    console.log("Desafio encerrado! Redirecinando para a página de desafios encerrados...");
    var newPage = "ClosedChallenge?challenge=" + desafio;
    window.location.replace(newPage);
  }
}

function delayedLoop(delay, callback, context) {
  context = context || null;

  var i = 0;
  var nextInteration = function() {
    if (i === data.u.length) {

      // set penalities for users
      setUsersPenalties();



      return;
    }

    console.log("Users [" + i + "] :" + data.u[i].i);
    getHabiticaUserAPI(i);
    console.log("usuario: " + data.u[i].profileName);
    getChallengeScoreAPI(i, challenge);

    console.log(">>>> U data:", data.u[i]);

    i++;
    callback.call(context, i);
    setTimeout(nextInteration, delay);
  };

  nextInteration();
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
      '     <div data-v-186433de="" data-v-0f68e140="" class="avatar background_' + data.u[i].avatar.background +
      '" style="padding-top: ' + avatarPaddingTop + 'px; 	left: 0px; top: 0px;">' +
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
      '         <span data-v-186433de="" class="hair_bangs_' + data.u[i].avatar.hairbangs + '_' + data.u[i].avatar.haircolor +
      '"></span>' +
      '         <span data-v-186433de="" class="hair_base_' + data.u[i].avatar.hairbase + '_' + data.u[i].avatar.haircolor +
      '"></span>' +
      '         <span data-v-186433de="" class="hair_mustache_' + data.u[i].avatar.hairmustache + '_' + data.u[i].avatar
      .haircolor + '"></span>' +
      '         <span data-v-186433de="" class="hair_beard_' + data.u[i].avatar.hairbeard + '_' + data.u[i].avatar.haircolor +
      '"></span>' +
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
      '    <p class="userAtributes">@' + data.u[i].username + ' • ' + data.u[i].class + ' • <b>' + data.u[i].group +
      '</b></p>' +
      '  </div>' +
      '  <div class="atributesBox">' +
      '    <div class="atributes">' +
      '      <img src="img/life.png" width="24" height="24">' +
      '      <div data-v-0f68e140="" class="progress">' +
      '        <div data-v-0f68e140="" class="progress-bar bg-health" style="width: ' + hpProgress + '%;"></div>' +
      '      </div>' +
      '      <span data-v-0f68e140="" class="small-text">' + Math.floor(data.u[i].hp) + ' / ' + data.u[i].maxHealth +
      '</span>' +
      '    </div>' +
      '    <div class="atributes">' +
      '      <img src="img/points.png" width="24" height="24">' +
      '      <div data-v-0f68e140="" class="progress">' +
      '        <div data-v-0f68e140="" class="progress-bar bg-experience" style="width: ' + expProgress +
      '%;"></div>' +
      '      </div>' +
      '      <span data-v-0f68e140="" class="small-text">' + data.u[i].exp + ' / ' + getLevelExp(data.u[i].level) +
      '</span>' +
      '    </div>' +
      '  </div>' +
      '  <div class="level">' + data.u[i].level + '</div>' +
      '  <div class="points">' + Number(data.u[i].challengeScore).toFixed(2) + '</div>' +
      '</div>');
  }
}

function printBoard() {
  html2canvas(document.querySelector('#container')).then(canvas => {
    // document.body.appendChild(canvas);
    var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    window.location.href = image; // it will save locally
  });
}

function saveRanking() {

  var save = new Object();
  for (var j = 0; j < data.u.length; j++) {
    var id = data.u[j].i;
    var player = {
      grupo: data.u[j].group,
      hp: data.u[j].hp,
      maxHealth: data.u[j].maxHealth,
      exp: data.u[j].exp,
      level: data.u[j].level,
      score: data.u[j].challengeScore
    }
    save[id] = player;
  }
  save["NAME"] = challenge.name;

  var str = JSON.stringify(save, null, 2);
  console.log("JSON Data: " + str);

  var db = firebase.firestore();
  db.collection("savedChallenges").doc(desafio).set(save)
    .then(function() {
      console.log("Document successfully written!");
    })
    .catch(function(error) {
      console.error("Error writing document: ", error);
    });
}

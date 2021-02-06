var challenge = {};
var data;
var teams = new Array();

$(document).ready(function () {
  console.log("dashboard.js loaded!");

  desafio = getChallengeParameter();
  console.log("desafio:" + desafio);

  if (desafio) {
    showLoading();
    getChallengeUsers();
  }
  else {
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

      // load dashboard...      
      createDashBoard();

    } else {
      // doc.data() will be undefined in this case
      console.error("No such document!");
      showMessage("Código do desafio inválido!");
    }
  }).catch(function (error) {
    console.error("Error getting document:", error);
  });
}

function createDashBoard() {

  challenge = getChallenge(desafio);

  // data = getPreHabiticaUsers();
  for (var i = 0; i < data.u.length; i++) {
    // console.log( "Users [" + i + "] :" + data.u[i].i );
    getHabiticaUserAPI(i);
  }

  for (var i = 0; i < data.u.length; i++) {
    console.log("usuario: " + data.u[i].profileName + " - level: " + data.u[i].level + " - totalExp: " + data.u[i].totalExp);
  }

  hideLoading();

  createBoard();
  populateNewTaskSelect();
}

function showLoading() {
  $("#loading").show();
  $("#createNewTask").hide();
  $("#challenge").hide();
  $("#message").hide();
}

function hideLoading() {
  $("#createNewTask").show();
  $("#challenge").show();
  $("#loading").hide();
  $("#message").hide();
}

function showMessage(message) {
  $("#loading").hide();
  $("#createNewTask").hide();
  $('#message').text(message);
  $("#message").show();
}

function createBoard() {

  $("#challengeName").append('<div class="challengeName">' + challenge.name + '</div>' +
    '<h5 style="color: #FFFFFF;">Todas as atividades dos integrantes</h5>');

  var table = '<table width="100%" border="1" cellspacing="0" cellpadding="10">' +
    '  <tr>' +
    '    <td><h2 class="dashboardJogador">Jogador</h2></td>' +
    '    <td><h2 class="dashboardJogador">Hábitos</h2></td>' +
    '    <td><h2 class="dashboardJogador">Diárias</h2></td>' +
    '    <td><h2 class="dashboardJogador">Afazeres</h2></td>' +
    '  </tr>';

  for (var i = 0; i < data.u.length; i++) {
    // console.log(">>>usuario: " + data.u[i].profileName);

    getHabiticaUserTasksData(i);
    var habitsTasks = getTasksString(data.u[i].tasks.HABITS, i, "HABITS");
    var dailysTaks = getTasksString(data.u[i].tasks.DAILYS, i, "DAILYS");
    var todosTasks = getTasksString(data.u[i].tasks.TODOS, i, "TODOS");
    var foto = (data.u[i].foto ? data.u[i].foto : 'img/user.png');

    table = table.concat(' <tr>' +
      '    <td>' +
      '      <img src="' + foto + '" width="142" height="142"">' +
      '      <h3 class="dashboardJogador">' + data.u[i].profileName + '</h3>' +
      '      <p class="dashboardJogador">@' + data.u[i].username + ' • ' + data.u[i].class + ' • ' + data.u[i].group + '</p>' +
      '      <p class="dashboardJogador">Nível: ' + data.u[i].level + ' • Pontos: ' + data.u[i].totalExp + '</p>' +
      '    </td>' +
      '    <td>' + habitsTasks + '</td>' +
      '    <td>' + dailysTaks + '</td>' +
      '    <td>' + todosTasks + '</td>' +
      '  </tr>');
  }

  table += '</table><br>';

  $("#dashboard").append(table);
}

function getTasksString(tasks, user, type) {
  // console.log(">>>tasks: " + tasks);
  var string = "<ul>";
  for (var i = 0; i < tasks.length; i++) {
    string += "<li><span style='cursor: pointer;' class='fas fa-plus-square' onclick=\"scoreTask('" + user + "','" + tasks[i].taskId + "','up')\"></span> <span onclick=\"showHistory(" + user + "," + i + ",'" + type + "')\">" + tasks[i].taskName + "</span></li>";
  }
  string += "</ul><br>"
  return string;
}

function showHistory(i, t, type) {
  // alert("usuário:"+i+" task:"+t+" type:"+type);
  alert(data.u[i].tasks[type][t].history);
}

function populateNewTaskSelect() {
  for (var i = 0; i < data.u.length; i++) {
    // console.log( "Users [" + i + "] :" + data.u[i].i );
    $("#userSelect").append(new Option(data.u[i].profileName, i));
  }
}

function createNewTask() {
  console.log("createNewTask: user: " + $("#userSelect").val() + " tipo: " + $("#taskTypeSelect").val() + " task: " + $("#newTaskName").val());
  // console.log("Usuário: " + $("#userSelect").val());
  // console.log("Tipo: " + $("#taskTypeSelect").val());
  // console.log("Task: " + $("#newTaskName").val());
  createNewHabiticaUserTask($("#userSelect").val(), $("#taskTypeSelect").val(), $("#newTaskName").val());
  location.reload();
}

function scoreTask(user, taskId, scoreType) {
  console.log("scoreTask: user: " + user + " taskId: " + taskId + " scoreType: " + scoreType);
  scoreHabiticaTask(user, taskId, scoreType);
  location.reload();
}

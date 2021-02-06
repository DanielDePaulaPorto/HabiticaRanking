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
}

function showLoading() {
  $("#loading").show();
  $("#end").hide();
  $("#challenge").hide();
}

function hideLoading() {
  $("#end").show();
  $("#challenge").show();
  $("#loading").hide();
}

function showMessage(message) {
  $("#loading").hide();
  $("#end").hide();
  $('#message').text(message);
  $("#message").show();
}

function createBoard() {

  $("#challengeName").append('<div class="challengeName">' + challenge.name + '</div>' +
    '<h5 style="color: #FFFFFF;">Hisórico de todas as atividades do desafio</h5>');

  var table = '<table width="100%" border="1" cellspacing="0" cellpadding="2">';

  for (var i = 0; i < data.u.length; i++) {
    console.log(">>>usuario: " + data.u[i].profileName);

    getHabiticaUserTasksData(i);
    // var habitsTasks = getTasksString(data.u[i].tasks.HABITS, i, "HABITS");
    // var dailysTaks = getTasksString(data.u[i].tasks.DAILYS, i, "DAILYS");
    // var todosTasks = getTasksString(data.u[i].tasks.TODOS, i, "TODOS");
    var foto = (data.u[i].foto ? data.u[i].foto : 'img/user.png');

    if (i == 0) {
      //create the table header...

      // var str = JSON.stringify(challenge.tasks, null, 2);
      // console.log("challenge.tasks JSON Data: " + str);

      table += '<tr><td><h3 class="dashboardJogador">Jogador</h3></td>';

      for (var c = 0; c < challenge.tasks.habits.length; c++) {
        // console.log("challenge.tasks.habits[" + c + "]: " + challenge.tasks.habits[i]);
        table += '<td><h3 class="dashboardJogador">Hábito - ' + getTaskName(challenge.tasks.habits[c], "HABITS") + '</h3></td>';
      }

      for (var c = 0; c < challenge.tasks.dailys.length; c++) {
        // console.log("challenge.tasks.dailys[" + c + "]: " + challenge.tasks.dailys[c]);
        table += '<td><h3 class="dashboardJogador">Diária - ' + getTaskName(challenge.tasks.dailys[c], "DAILYS") + '</h3></td>';
      }

      for (var c = 0; c < challenge.tasks.todos.length; c++) {
        // console.log("challenge.tasks.todos[" + c + "]: " + challenge.tasks.todos[c]);
        table += '<td><h3 class="dashboardJogador">Afazer - ' + getTaskName(challenge.tasks.todos[c], "TODOS") + '</h3></td>';
      }
      table += '</tr>';
    }

    table += ' <tr><td>' +
      '      <img src="' + foto + '" width="142" height="142"">' +
      '      <h3 class="dashboardJogador">' + data.u[i].profileName + '</h3>' +
      '      <p class="dashboardJogador">@' + data.u[i].username + ' • ' + data.u[i].class + ' • ' + data.u[i].group + '</p>' +
      '      <p class="dashboardJogador">Nível: ' + data.u[i].level + ' • Pontos: ' + data.u[i].totalExp + '</p>' +
      '    </td>';

    for (var c = 0; c < challenge.tasks.habits.length; c++) {
      // console.log("challenge.tasks.habits[" + c + "]: " + challenge.tasks.habits[i]);
      table += '<td><h5>' + getTaskHistory(i,challenge.tasks.habits[c], "HABITS") + '</h5></td>';
    }

    for (var c = 0; c < challenge.tasks.dailys.length; c++) {
      // console.log("challenge.tasks.dailys[" + c + "]: " + challenge.tasks.dailys[c]);
      table += '<td><h5>' + getTaskHistory(i,challenge.tasks.dailys[c], "DAILYS") + '</h5></td>';
    }

    for (var c = 0; c < challenge.tasks.todos.length; c++) {
      // console.log("challenge.tasks.todos[" + c + "]: " + challenge.tasks.todos[c]);
      table += '<td><h5>' + getTaskHistory(i,challenge.tasks.todos[c], "TODOS") + '</h5></td>';
    }
    table += '</tr>';

  }




  table += '</table><br>';


  $("#historic").append(table);

  // var table = '<table width="100%" border="1" cellspacing="0" cellpadding="10">' +
  //   '  <tr>' +
  //   '    <td><h2 class="dashboardJogador">Jogador</h2></td>' +
  //   '    <td><h2 class="dashboardJogador">Hábitos</h2></td>' +
  //   '    <td><h2 class="dashboardJogador">Diárias</h2></td>' +
  //   '    <td><h2 class="dashboardJogador">Afazeres</h2></td>' +
  //   '  </tr>';



  // // for (var i = 0; i < challenge.tasks.length; i++) {
  // //   console.log("challenge.tasks["+i+"]: " +challenge.tasks[i]);
  // // }



  // for (var i = 0; i < data.u.length; i++) {
  //   // console.log(">>>usuario: " + data.u[i].profileName);

  //   getHabiticaUserTasksData(i);
  //   var habitsTasks = getTasksString(data.u[i].tasks.HABITS, i, "HABITS");
  //   var dailysTaks = getTasksString(data.u[i].tasks.DAILYS, i, "DAILYS");
  //   var todosTasks = getTasksString(data.u[i].tasks.TODOS, i, "TODOS");
  //   var foto = (data.u[i].foto ? data.u[i].foto : 'img/user.png');

  //   table = table.concat(' <tr>' +
  //     '    <td>' +
  //     '      <img src="' + foto + '" width="142" height="142"">' +
  //     '      <h3 class="dashboardJogador">' + data.u[i].profileName + '</h3>' +
  //     '      <p class="dashboardJogador">@' + data.u[i].username + ' • ' + data.u[i].class + ' • ' + data.u[i].group + '</p>' +
  //     '      <p class="dashboardJogador">Nível: ' + data.u[i].level + ' • Pontos: ' + data.u[i].totalExp + '</p>' +
  //     '    </td>' +
  //     '    <td>' + habitsTasks + '</td>' +
  //     '    <td>' + dailysTaks + '</td>' +
  //     '    <td>' + todosTasks + '</td>' +
  //     '  </tr>');
  // }

  // table += '</table><br>';

  // $("#dashboard").append(table);
}

// function getTasksString(tasks, user, type) {
//   // console.log(">>>tasks: " + tasks);
//   var string = "<ul>";
//   for (var i = 0; i < tasks.length; i++) {
//     string += "<li><span style='cursor: pointer;' class='fas fa-plus-square' onclick=\"scoreTask('" + user + "','" + tasks[i].taskId + "','up')\"></span> <span onclick=\"showHistory(" + user + "," + i + ",'" + type + "')\">" + tasks[i].taskName + "</span></li>";
//   }
//   string += "</ul><br>"
//   return string;
// }

// function showHistory(i, t, type) {
//   // alert("usuário:"+i+" task:"+t+" type:"+type);
//   alert(data.u[i].tasks[type][t].history);
// }


function getTaskName(id, type) {
  if (type == "HABITS") {
    var tasks = data.u[0].tasks.HABITS;
    for (var i = 0; i < tasks.length; i++) {
      // console.log("-> "+tasks[i].taskId);
      if (tasks[i].challengeTaskId == id) {
        return tasks[i].taskName;
      }
    }
  } else if (type == "DAILYS") {
    var tasks = data.u[0].tasks.DAILYS;
    for (var i = 0; i < tasks.length; i++) {
      // console.log("-> "+tasks[i].taskId);
      if (tasks[i].challengeTaskId == id) {
        return tasks[i].taskName;
      }
    }
  } else if (type == "TODOS") {
    var tasks = data.u[0].tasks.TODOS;
    for (var i = 0; i < tasks.length; i++) {
      // console.log("-> "+tasks[i].taskId);
      if (tasks[i].challengeTaskId == id) {
        return tasks[i].taskName;
      }
    }
    //check for completed todo...
    var completedTodoTasks = getHabiticaUserCompletedTodoTasksData(0);
    for (var i = 0; i < completedTodoTasks.length; i++) {
      // console.log("-> "+tasks[i].taskId);
      if (completedTodoTasks[i].challenge.taskId == id) {
        return completedTodoTasks[i].text;
      }
    }
  }
  return "XXX_" + id;
}

function getTaskHistory(i, id, type) {
  if (type == "HABITS") {
    var tasks = data.u[i].tasks.HABITS;
    for (var c = 0; c < tasks.length; c++) {
      // console.log("-> "+tasks[c].taskId);
      if (tasks[c].challengeTaskId == id) {
        return tasks[c].history.replace(/\n/gi, "<br>");
      }
    }
  } else if (type == "DAILYS") {
    var tasks = data.u[i].tasks.DAILYS;
    for (var c = 0; c < tasks.length; c++) {
      // console.log("-> "+tasks[c].taskId);
      if (tasks[c].challengeTaskId == id) {
        return tasks[c].history.replace(/\n/gi, "<br>");
      }
    }
  } else if (type == "TODOS") {
    var tasks = data.u[i].tasks.TODOS;
    for (var c = 0; c < tasks.length; c++) {
      // console.log("-> "+tasks[c].taskId);
      if (tasks[c].challengeTaskId == id) {
        return "";
      }
    }
    //check for completed todo...
    var completedTodoTasks = getHabiticaUserCompletedTodoTasksData(i);
    for (var c = 0; c < completedTodoTasks.length; c++) {
      // console.log("-> "+tasks[c].taskId);
      if (completedTodoTasks[c].challenge.taskId == id) {
        var date = new Date(completedTodoTasks[c].dateCompleted);
        return getDateFormated(date);
      }
    }
  }
  return "XXX_" + id;
}
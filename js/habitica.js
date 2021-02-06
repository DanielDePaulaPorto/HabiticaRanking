var data = new Object();
var teams = new Array();

console.log("habitica.js loaded!");

function getUserTotalExp(Exp, Level) {
  var total = 0;
  for (var i = 1; i < Level; i++) {
    total += getLevelExp(i);
    //Logger.log("x: " + x);
    //Logger.log("CEIL: " + Math.floor(x/10));
    //Logger.log("roundX: " + roundX);
    //Logger.log("total parcial: " + total);
  }
  return total + Exp;
}

function getLevelExp(level) {
  //0.25×level2+10×level+139.75 .
  var x = (0.25 * Math.pow(level, 2)) + (10 * level) + 139.75;
  var roundX = ((Math.round(x / 10)) * 10);
  return roundX;
}

//----< Habitica API >-----

function getHabiticaUserAPI(i) {
  $.ajaxSetup({
    async: false,
    headers: {
      "x-api-user": data.u[i].i,
      "x-api-key": data.u[i].t
    }
  });

  $.getJSON("https://habitica.com/api/v3/user")
    .done(function(json) {
      // var str = JSON.stringify(json, null, 2);
      // console.log( "JSON Data: " + str );

      data.u[i].profileName = json.data.profile.name;
      data.u[i].exp = json.data.stats.exp;
      data.u[i].level = json.data.stats.lvl;
      data.u[i].totalExp = getUserTotalExp(data.u[i].exp, data.u[i].level);
      data.u[i].foto = json.data.profile.imageUrl;
      data.u[i].username = json.data.auth.local.username;
      data.u[i].class = json.data.stats.class;
      data.u[i].hp = json.data.stats.hp;
      data.u[i].maxHealth = json.data.stats.maxHealth;

      //Avatar
      var avatar = {
        haircolor: json.data.preferences.hair.color,
        hairbase: json.data.preferences.hair.base,
        hairbangs: json.data.preferences.hair.bangs,
        hairbeard: json.data.preferences.hair.beard,
        hairmustache: json.data.preferences.hair.mustache,
        hairflower: json.data.preferences.hair.flower,
        // head : json.data.items.gear.costume.head,
        skin: json.data.preferences.skin,
        chair: json.data.preferences.chair,
        shirt: json.data.preferences.shirt,
        headAccessory: json.data.items.gear.equipped.headAccessory,
        headArmoire: json.data.items.gear.equipped.head,
        shield: json.data.items.gear.equipped.shield,
        weapon: json.data.items.gear.equipped.weapon,
        armor: json.data.items.gear.equipped.armor,
        currentPet: json.data.items.currentPet,
        mount: json.data.items.currentMount,
        background: json.data.preferences.background,
      };
      data.u[i].avatar = avatar;

      // console.log( "Team: " + json.data.party._id );
      if (!teams[json.data.party._id]) {
        getHabiticaGroupAPI(i, json.data.party._id);
      }
      data.u[i].group = teams[json.data.party._id];

    })
    .fail(function(jqxhr, textStatus, error) {
      var err = textStatus + ", " + error;
      console.log("Request Failed: " + err);
    });
}

function getHabiticaUserAPIWithoutGroup(i) {
  $.ajaxSetup({
    async: false,
    headers: {
      "x-api-user": data.u[i].i,
      "x-api-key": data.u[i].t
    }
  });

  $.getJSON("https://habitica.com/api/v3/user")
    .done(function(json) {
      // var str = JSON.stringify(json, null, 2);
      // console.log( "JSON Data: " + str );

      data.u[i].profileName = json.data.profile.name;
      data.u[i].exp = json.data.stats.exp;
      data.u[i].level = json.data.stats.lvl;
      data.u[i].totalExp = getUserTotalExp(data.u[i].exp, data.u[i].level);
      data.u[i].foto = json.data.profile.imageUrl;
      data.u[i].username = json.data.auth.local.username;
      data.u[i].class = json.data.stats.class;
      data.u[i].hp = json.data.stats.hp;
      data.u[i].maxHealth = json.data.stats.maxHealth;

      //Avatar
      var avatar = {
        haircolor: json.data.preferences.hair.color,
        hairbase: json.data.preferences.hair.base,
        hairbangs: json.data.preferences.hair.bangs,
        hairbeard: json.data.preferences.hair.beard,
        hairmustache: json.data.preferences.hair.mustache,
        hairflower: json.data.preferences.hair.flower,
        // head : json.data.items.gear.costume.head,
        skin: json.data.preferences.skin,
        chair: json.data.preferences.chair,
        shirt: json.data.preferences.shirt,
        headAccessory: json.data.items.gear.equipped.headAccessory,
        headArmoire: json.data.items.gear.equipped.head,
        shield: json.data.items.gear.equipped.shield,
        weapon: json.data.items.gear.equipped.weapon,
        armor: json.data.items.gear.equipped.armor,
        currentPet: json.data.items.currentPet,
        mount: json.data.items.currentMount,
        background: json.data.preferences.background,
      };
      data.u[i].avatar = avatar;
    })
    .fail(function(jqxhr, textStatus, error) {
      var err = textStatus + ", " + error;
      console.log("Request Failed: " + err);
    });
}

function getHabiticaGroupAPI(i, groupId) {
  $.ajaxSetup({
    async: false,
    headers: {
      "x-api-user": data.u[i].i,
      "x-api-key": data.u[i].t
    }
  });

  $.getJSON("https://habitica.com/api/v3/groups/" + groupId)
    .done(function(json) {
      // var str = JSON.stringify(json, null, 2);
      // console.log( "JSON Data: " + str );

      teams[groupId] = json.data.name;
    })
    .fail(function(jqxhr, textStatus, error) {
      var err = textStatus + ", " + error;
      console.log("Request Failed: " + err);
    });
}

function getHabiticaUserTasksData(i) {
  $.ajaxSetup({
    async: false,
    headers: {
      "x-api-user": data.u[i].i,
      "x-api-key": data.u[i].t
    }
  });

  $.getJSON("https://habitica.com/api/v3/tasks/user")
    .done(function(json) {
      // var str = JSON.stringify(json, null, 2);
      // console.log("JSON Data: " + str);

      var habits = [];
      var dailys = [];
      var todos = [];

      for (var t = 0; t < json.data.length; t++) {
        var taskName = json.data[t].text;
        var taskType = json.data[t].type;
        var taskId = json.data[t].id;
        var challengeTaskId = json.data[t].challenge.taskId;

        // console.log(taskType + ": " + taskName);
        var history = "";

        if (typeof json.data[t].history === "undefined") {
          // console.log("Sem histórico!");
        } else {
          for (var q = 0; q < json.data[t].history.length; q++) {
            var ts = json.data[t].history[q];
            var date = new Date(ts.date);
            var dateStr = "";

            if (taskType == "habit") {
              var up = ts.scoredUp;
              var down = ts.scoredDown;
              dateStr = "+" + up + " -" + down + " ";
            }
            dateStr += getDateFormated(date);

            history += dateStr;
            // console.log("timestamp : " + dateStr);
          }
        }

        var task = {
          taskName: taskName,
          taskId: taskId,
          challengeTaskId: challengeTaskId,
          history: history,
        };

        if (taskType == "habit") {
          habits.push(task);
        } else if (taskType == "daily") {
          dailys.push(task);
        } else if (taskType == "todo") {
          todos.push(task);
        }
      }

      // getHabiticaUserCompletedTodoTasksData(i);


      var userTasks = {
        "HABITS": habits,
        "DAILYS": dailys,
        "TODOS": todos
      }

      // strUserTasks = JSON.stringify(userTasks, null, 2);
      // console.log("userTasks: " + strUserTasks);

      data.u[i].tasks = userTasks;
    })
    .fail(function(jqxhr, textStatus, error) {
      var err = textStatus + ", " + error;
      console.log("Request Failed: " + err);
    });
}

function getHabiticaUserCompletedTodoTasksData(i) {
  var todoTasks;
  $.ajaxSetup({
    async: false,
    headers: {
      "x-api-user": data.u[i].i,
      "x-api-key": data.u[i].t
    }
  });

  $.getJSON("https://habitica.com/api/v3/tasks/user?type=completedTodos")
    .done(function(json) {
      var str = JSON.stringify(json, null, 2);
      // console.log("==========================================");
      // console.log("JSON Data: " + str);

      todoTasks = json.data;
    })
    .fail(function(jqxhr, textStatus, error) {
      var err = textStatus + ", " + error;
      console.log("Request Failed: " + err);
    });
  return todoTasks;
}

function createNewHabiticaUserTask(i, taskType, newTaskName) {
  // console.log("Users [" + i + "]: " + data.u[i].i);
  // console.log("taskType: " + taskType);
  // console.log("newTaskName: " + newTaskName);

  var postString = '{' +
    ' "text": "' + newTaskName + '",' +
    ' "type": "' + taskType + '",' +
    ' "notes": "Tarefa inserida por Daniel" ' +
    '}';
  // console.log(postString);

  $.ajaxSetup({
    async: false,
    headers: {
      "x-api-user": data.u[i].i,
      "x-api-key": data.u[i].t
    }
  });

  $.ajax({
      type: 'POST',
      url: 'https://habitica.com/api/v3/tasks/user',
      data: postString,
      contentType: "application/json",
      dataType: 'json'
    })
    .done(function(json) {
      var str = JSON.stringify(json, null, 2);
      // console.log("JSON Data: " + str);
      alert(str);

      var id = json.data.id;
      console.log("Atividade criada: " + id);
    })
    .fail(function(error) {
      console.error(error);
    });
}

function scoreHabiticaTask(i, taskId, scoreType) {
  $.ajaxSetup({
    async: false,
    headers: {
      "x-api-user": data.u[i].i,
      "x-api-key": data.u[i].t
    }
  });

  $.ajax({
      type: 'POST',
      url: 'https://habitica.com/api/v3/tasks/' + taskId + '/score/' + scoreType,
      data: "",
      contentType: "application/json",
      dataType: 'json'
    })
    .done(function(json) {
      var str = JSON.stringify(json, null, 2);
      // console.log("JSON Data: " + str);
      alert(str);

      console.log("Atividade marcada: " + taskId);
    })
    .fail(function(error) {
      console.error(error);
    });
}

function getChallenge(id) {
  var url = "https://habitica.com/api/v3/challenges/" + id;
  var challenge = {
    id: id,
  };

  console.log("data.u[0].i: " + data.u[0].i + " - data.u[0].t: " + data.u[0].t);

  $.ajaxSetup({
    async: false,
    headers: {
      "x-api-user": data.u[0].i,
      "x-api-key": data.u[0].t
    }
  });
  $.getJSON(url)
    .done(function(json) {
      // var str = JSON.stringify(json, null, 2);
      // console.log( "JSON Data: " + str );

      challenge.name = json.data.name;
      challenge.summary = json.data.summary;
      challenge.tasks = json.data.tasksOrder;

      console.log("Challenge: '" + challenge.name + "' recuperada!");
    })
    .fail(function(jqxhr, textStatus, error) {
      var err = textStatus + ", " + error;
      console.error("Request Failed: " + err);
    });
  return challenge;
}

function getChallengeScoreAPI(i, challenge) {
  $.ajaxSetup({
    async: false,
    headers: {
      "x-api-user": data.u[i].i,
      "x-api-key": data.u[i].t
    }
  });

  $.getJSON("https://habitica.com/api/v3/tasks/user")
    .done(function(json) {
      // var str = JSON.stringify(json, null, 2);
      // console.log("getChallengeScoreAPI - JSON Data: " + str);

      var challengeScore = 0;

      //habits
      console.log("habits: " + challenge.tasks["habits"].length);
      for (var c = 0; c < challenge.tasks["habits"].length; c++) {
        console.log("procurando pontuação para o habit: " + challenge.tasks["habits"][c]);
        var taskScore = getHabitScore(challenge.tasks["habits"][c], json.data);
        console.log("Score para o habit: " + challenge.tasks["habits"][c] + "          >>>>>          " + taskScore);
        challengeScore += taskScore;
      }

      //dailys
      console.log("dailys: " + challenge.tasks["dailys"].length);
      for (var c = 0; c < challenge.tasks["dailys"].length; c++) {
        console.log("procurando pontuação para a daily: " + challenge.tasks["dailys"][c]);
        var taskScore = getDailyScore(challenge.tasks["dailys"][c], json.data);
        console.log("Score para o daily: " + challenge.tasks["dailys"][c] + "          >>>>>          " + taskScore);
        challengeScore += taskScore;
      }

      //todos
      var todoTasks = getHabiticaUserCompletedTodoTasksData(i);
      console.log("todoTasks: " + todoTasks);
      console.log("todoTasks.length: " + todoTasks.length);

      console.log("todos: " + challenge.tasks["todos"].length);
      for (var c = 0; c < challenge.tasks["todos"].length; c++) {
        console.log("procurando pontuação para o todo: " + challenge.tasks["todos"][c]);
        var taskScore = getTodoScore(challenge.tasks["todos"][c], json.data, todoTasks);
        console.log("Score para o todo: " + challenge.tasks["todos"][c] + "          >>>>>          " + taskScore);
        challengeScore += taskScore;
      }

      data.u[i].challengeScore = challengeScore;
    })
    .fail(function(jqxhr, textStatus, error) {
      var err = textStatus + ", " + error;
      console.error("Request Failed: " + err);
    });
}

function getHabitScore(habitID, userTasks) {
  // console.log("O usuário possui: " + userTasks.length + " tarefas");

  for (var t = 0; t < userTasks.length; t++) {
    var taskName = userTasks[t].text;
    var taskType = userTasks[t].type;
    // var taskId = userTasks[t].id;
    var taskHabitID = userTasks[t]["challenge"]["taskId"];

    // console.log(taskType + ": " + taskName);

    if (taskType == "habit" && taskHabitID == habitID) {
      // console.log("Task encontrada! " + taskName);
      var taskScore = 0;
      for (var q = 0; q < userTasks[t].history.length; q++) {
        var ts = userTasks[t].history[q];
        var date = new Date(ts.date);
        var value = ts.value;
        var up = ts.scoredUp;
        var down = ts.scoredDown;
        var dateStr = value + "          >>>>>          +" + up + " -" + down + " " + date;
        taskScore += up;
        taskScore -= down;
        console.log("timestamp : " + dateStr);
      }
      // taskScore = userTasks[t].value;

      return taskScore;
    }
  }
  return 0;
}

function getDailyScore(habitID, userTasks) {
  // console.log("O usuário possui: " + userTasks.length + " tarefas");

  for (var t = 0; t < userTasks.length; t++) {
    var taskName = userTasks[t].text;
    var taskType = userTasks[t].type;
    // var taskId = userTasks[t].id;
    var taskDailyID = userTasks[t]["challenge"]["taskId"];

    // console.log(taskType + ": " + taskName);

    if (taskType == "daily" && taskDailyID == habitID) {
      // console.log("Task encontrada! " + taskName);
      var taskScore = 0;
      for (var q = 0; q < userTasks[t].history.length; q++) {
        var ts = userTasks[t].history[q];
        var date = new Date(ts.date);
        var value = ts.value;
        var dateStr = value + "          >>>>>          +" + date;
        taskScore += 1;
        console.log(taskName + "          >>>>>          " + dateStr);
      }
      // taskScore = userTasks[t].value;
      return taskScore;
    }
  }
  return 0;
}

function getTodoScore(habitID, userTasks, userCompletedTasks) {
  // console.log("O usuário possui: " + userTasks.length + " tarefas");

  for (var t = 0; t < userCompletedTasks.length; t++) {
    var taskName = userCompletedTasks[t].text;
    var taskType = userCompletedTasks[t].type;
    // var taskId = userTasks[t].id;
    var value = userCompletedTasks[t].value;
    var taskTodoID = userCompletedTasks[t]["challenge"]["taskId"];

    // console.log(taskType + ": " + taskName);

    if (taskType == "todo" && taskTodoID == habitID) {
      console.log("Task todo encontrada na lista de completos! " + taskName);

      // TODO retornando o valor de 5 pontos
      return 5;
    }
  }
  // console.log("Task todo NÃO encontrada na lista de completos! Procurando na lista por fazer ainda");
  // for (var t = 0; t < userTasks.length; t++) {
  //   var taskName = userTasks[t].text;
  //   var taskType = userTasks[t].type;
  //   // var taskId = userTasks[t].id;
  //   var taskDailyID = userTasks[t]["challenge"]["taskId"];
  //
  //   // console.log(taskType + ": " + taskName);
  //
  //   if (taskType == "todo" && taskDailyID == habitID) {
  //     // console.log("Task encontrada! " + taskName);
  //     var taskScore = userTasks[t].value;
  //     return taskScore;
  //   }
  // }
  return 0;
}

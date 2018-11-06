(function(){
  var equipe = $("#equipe");
  var joueur1 = $("#joueur1");
  var joueur2 = $("#joueur2");

  function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
  }

  function buildMatchs(teams){
    var matchs = [];
    if(teams.length % 2 != 0){
      for(var i = 0; i < teams.length - 1; i+=2){
        matchs.push([ teams[i], teams[i + 1] ]);
      }
      matchs.push([teams[teams.length - 1], null]);
    }
    else{
      for(var i = 0; i < teams.length; i+=2){
        matchs.push([ teams[i], teams[i + 1] ]);
      }
    }
    console.log(matchs);
    return matchs;
  }

  function buildScores(matchs){
    var scores = [];
    var n = matchs.length;
    while(n > 1){
      var temp = [];
      for(var i = 0; i < n; i++){
        temp.push([null, null]);
      }
      scores.push(temp);
      n /= 2;
    }
    scores.push([[null,null], [null, null]])
    return scores;
  }

  $( "form" ).submit(function( event ) {
    event.preventDefault();
    var previousLine = $("table tbody tr");
    var previous = previousLine.find("th");
    var id;
    if(previous.length == 0){
      id = 1;
    }
    else{
      id = Number(previous.eq(previous.length - 1).text()) + 1;
    }
    var newLine = $("<tr></tr>");
    var newTh = $("<th scope='row'>" + id + "</th>");
    newLine.append(newTh);
    newLine.append($("<td class='equipe'>" + equipe.val() + "</td>"));
    newLine.append($("<td class='joueur1'>" + joueur1.val() + "</td>"));
    newLine.append($("<td class='joueur2'>" + joueur2.val() + "</td>"));

    if(id == 1){
      $("table tbody").append(newLine);
    }
    else{
      previousLine.eq(previousLine.length - 1).after(newLine);
    }

    $('form').trigger("reset");
  });

  $("#tournamentCreateSimpleElimination").click(function(){
    console.log("création du tournoi...");
    var teamsElement = $(".equipe");
    var teams = [];
    for(var i = 0; i < teamsElement.length; i++){
      teams.push(teamsElement.eq(i).text());
    }
    teams = shuffle(teams);
    var matchs = buildMatchs(teams);
    var scores = buildScores(matchs);
    if(matchs == undefined){
      matchs = [];
    }
    console.log(scores);
    $(".tournamentSimpleElimination").bracket({
      init: {
        teams: matchs,
      },
      disableToolbar: false,
      matchMargin: 100,
      teamWidth: 100,
      save: function(){}
    });
  });
})();

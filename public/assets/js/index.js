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
    console.log(teams);
    var n = 0;
    while(teams.length > Math.pow(2, n)){
      n++;
    }
    var roundsToEquilibrate = teams.length - Math.pow(2, n - 1);
    var roundsToComplete = Math.pow(2, n);
    var i = 0;
    while( i < roundsToEquilibrate * 2){
      matchs.push([ teams[i], teams[i + 1] ]);
      i+=2;
    }
    for(var j = i; j < teams.length; j++){
      matchs.push([teams[j], null]);
      i+=2;
    }
    for(var j = i; j < roundsToComplete; j++){
      matchs.push([null,null]);
    }
    console.log(matchs);
    return matchs;
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
    equipe.focus();
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
    if(matchs == undefined){
      matchs = [];
    }
    $(".tournamentSimpleElimination").bracket({
      init: {
        teams: matchs,
      },
      disableToolbar: true,
      matchMargin: 50,
      teamWidth: 100,
      centerConnectors: true,
      save: function(){},
      decorator: {
        render: function(container, data, score, state) {
                switch(state) {
                  case "empty-bye":
                    container.parent().hide();
                    break;
                  case "empty-tbd":
                    container.append("Upcoming");
                    break;
                  case "entry-no-score":
                    container.append(data);
                    break;
                  case "entry-default-win":
                    container.parent().hide();
                    break;
                  case "entry-complete":
                    container.append(data);
                    break;
                }
              },
        edit: function(container, data, doneCb) {
                var input = $('<input type="text">')
                input.val(data ? data.flag + ':' + data.name : '')
                container.html(input)
                input.focus()
                input.blur(function() {
                  var inputValue = input.val()
                  if (inputValue.length === 0) {
                    doneCb(null); // Drop the team and replace with BYE
                  } else {
                    var flagAndName = inputValue.split(':') // Expects correct input
                    doneCb({flag: flagAndName[0], name: flagAndName[1]})
                  }
                })
              }
      }
    });
  });
})();

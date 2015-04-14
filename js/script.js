$(document).ready(function() {

  $("#skattwrap").hide();

  $("#sok-knapp").click(function() {
    $("#skattwrap").show();
    
    // Get Kommun Id
    var userInput = document.getElementById("myText").value;
    var userKommun = userInput.toLowerCase();
    var kommunId

    function getKommun() {
      $.ajax({
        type: "GET",
        url: "data/kommuner_lowercase.json",
        success: function(data) {
          console.log(data);
          var kommunList= data.kommun;
          for (var i = 0; i < kommunList.length; i++) {

            // Find Kommun in the result that matched the user search
            if (kommunList[i].Kommuner == userKommun) {
              kommunId = kommunList[i].KommunId;
              console.log("Search value: ", userKommun)
              console.log("Kommun ID: ", kommunId);

              getTaxPayers();
              jobAds();

            }
          }
        }
      });
    }
    getKommun();

    function getTaxPayers(){
      $.ajax({
        type: "GET",
        url: "data/taxpayers_lowercase.json",
        success: function(data){
          var taxPayersList = data.kommun;
          for (var i = 0; i < taxPayersList.length; i++) {
            if (taxPayersList[i].kommune == userKommun) {
              var taxPayers = taxPayersList[i].taxpayers;
              console.log("Tax payers: ",taxPayers);
              $("#skatt").html(taxPayers);
            }         
          }
        }
      })
    }

    function jobAds() {

      // Arguments variables
      //var kommunId = 180;
      var nyckelOrd = "'butikssäljare'OR'barnvakt'OR'butikssäljare'OR'barnflicka'OR'extrainhopp'OR'varuplockare'OR'lagerarbetare'OR'cafévärd'OR'Städare'OR'tidningsdistributör'OR'enklare städuppgifter'OR'kökshjälp'OR'burger king'OR'butiksmedarbetare'OR'cafépersonal'OR'campingvärd'OR'campingvärder'OR'sommarpersonal'OR'servitris'OR'servitör'OR'butikssäljare'OR'mcdonalds'OR'sommarjobb'OR'tidningsbud'OR'brevbärare'OR'tidningsdistributörer'OR'tidningsdistributör'OR'Cafebiträde'OR'diskare'OR'sommarmedarbetare'OR'Köksbiträde'OR'serveringspersonal'OR'reklamutdelning'OR'kassapersonal'OR'minst 16 år'OR'minst 17 år'OR'minst 18 år'AND'deltid";
      var rad = "30";
      var url = "http://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?";

      // Request arguments
      var args = {
        kommunid: kommunId,
        nyckelord: nyckelOrd,
        antalrader: rad,
        format: 'json',
      };

      // Sending request
      $.getJSON(url, args,
        function(data) {
          var adsList = data.matchningslista.matchningdata

          for(var i = 0; i < adsList.length; i++) {

            var annonsRubrik = adsList[i].annonsrubrik; console.log(annonsRubrik);
            var jobPlace = adsList[i].arbetsplatsnamn;
            var jobPosition = adsList[i].yrkesbenamning;
            var jobId = adsList[i].annonsid;

            // Creating Div for each result object
            $("#annonser").append("<div class='ad'> <div class='wrap-ad'>" +  "<div class='headline'>" + annonsRubrik + "</div>" + "<br>" + "<div class='undertitle'>" + jobPlace + "<br>" + jobPosition + "</div>" + "</div>" + "<br>" + "<input type='image' src='img/plus.png' id=annonsimage>" + "<div id='annonsid' style='display:none'>" + jobId + "</div>" + "</div>");
          }

          jQuery.fn.center = function () {
                this.css("position","absolute");
                this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + $(window).scrollTop()) + "px");
                return this;
            }

          $("input#annonsimage").click(function() {
            var annonsid = $(this).next().html();
            $(".helannons").show();
            console.log(annonsid);
            $(".helannons").center();
            //getAnnonsDetails();

              var url1 = "http://api.arbetsformedlingen.se/af/v0/platsannonser/" + annonsid;
              //console.log(url1);

              //GET THE FULL AD
              var xhr = new XMLHttpRequest 
              xhr.open("GET", url1, false );
              xhr.send();

              var annonsData = JSON.parse(xhr.responseText);
              //console.log(annonsData);

              //Address output for the travel calculation
              var jobAddress = annonsData.platsannons.arbetsplats.postadress;
              var postort = annonsData.platsannons.arbetsplats.postort;

              document.getElementById("annonsrubrik").innerHTML = annonsData.platsannons.annons.annonsrubrik;
              document.getElementById("yrke").innerHTML = annonsData.platsannons.annons.yrkesbenamning;
              document.getElementById("annonstext").innerHTML = annonsData.platsannons.annons.annonstext;
              document.getElementById("foretag").innerHTML = annonsData.platsannons.arbetsplats.arbetsplatsnamn;
            
            //Shorter text
            function cutString(id){    
               var text = annonsData.platsannons.annons.annonstext;         
               var charsToCutTo = 600;
                  if(text.length>charsToCutTo){
                      var strShort = "";
                      for(i = 0; i < charsToCutTo; i++){
                          strShort += text[i];
                      }
                      document.getElementById("annonstext").innerHTML = strShort + "...";
                  }            
              };

              cutString('stuff'); 

            //Link to ad
            $("#sok-knapp-button").attr('href', annonsData.platsannons.annons.platsannonsUrl);
            //Close ad
            $("#minus").click(function() { 
                $(".helannons").hide(); 
            });
          });
        }
      );
    }
  });
});






(function() {

const API_URL = "https://lt175p2wc6.execute-api.us-west-2.amazonaws.com/v0-1";

//set onclick functions.
$("#refresh-worlds").click(refreshWorlds);
$("#refresh-flavors").click(refreshFlavors);
$(document).ready(function() {
  injectWorlds();
  injectFlavors();
});

//onclick listener.
//updates local cache for all data necessary for updating world display.
//injects objects for worlds not currently displayed.
function refreshWorlds() {
  iconClickLoading(this, function(){
    return fetchFlavors().then(fetchWorlds).then(injectWorlds);
  });
}

function refreshFlavors() {
  iconClickLoading(this, function() {
    return fetchFlavors().then(injectFlavors);
  });
}

// Encapsulate your click function in this to implement a
// "loading/rowing" icon while your function is active.
//
// ONLY for use with click listeners on material icons.
function iconClickLoading(onclickThis, toDo) {
  var element = onclickThis;
  var original = element.innerHTML;
  element.innerHTML = "rowing";
  toDo().then(function() {
    element.innerHTML = original;
  });
}

//obtain new flavors data.
function fetchFlavors() {
  var url = API_URL + "/flavors";
  var urlParams = "limit=5";
  return fetch(
    url+"?"+urlParams,
    {
      mode: "cors",
      headers: {
        "Access-Control-Allow-Origin":"*"
      }
    }
  )
  .then(checkRequestStatus)
  .then(JSON.parse)
  .then(function(data) {
    localStorage.setItem("flavors",JSON.stringify(data.items));
    return data;
  })
  .catch(alert);
}

//obtain new worlds data.
function fetchWorlds() {

  var url = API_URL + "/worlds";
  var urlParams = "limit=5";
  return fetch(
    url+"?"+urlParams,
    {
      mode: "cors",
      headers: {
        "Access-Control-Allow-Origin":"*"
      }
    }
  )
  .then(checkRequestStatus)
  .then(JSON.parse)
  .then(function(data) {
    localStorage.setItem("worlds",JSON.stringify(data.items));
    return data;
  })
  .catch(alert);
}

/*
Verify health of API request response. Utilize promise rejection for failure.
*/
function checkRequestStatus(response) {
  if (response.status >= 200 && response.status < 300) {
       return response.text();
  }
  else {
     return Promise.reject(new Error(response.status +
                                      ": " + response.statusText));
  }
}


/*
forms and injects DOM elements containing information on each world.
removes and repopulates #worlds-cards-row.
TODO: which is better, appendChild all at the end, or when the element is made?
*/
function injectWorlds() {

  var worlds = JSON.parse(localStorage.worlds);
  var flavors = JSON.parse(localStorage.flavors);

  //delete current HTML
  var row = document.getElementById("worlds-cards-row");
  while(row.firstChild) {
    row.removeChild(row.firstChild);
  }

  //for each world object in localStorage array
  for(var i = 0; i < worlds.length; i++) {
    //find the flavor details
    var world = worlds[i];
    var flavor = flavors.find(i => i.flavorID === world.flavorID);

    //build new HTML
    var column = document.createElement("div");
    column.classList.add("col-lg-4","col-md-6","col-sm-6");
    row.appendChild(column);

    var card = document.createElement("div");
    card.classList.add("card","card-stats");
    column.appendChild(card);

      var cardHeader = document.createElement("div");
      cardHeader.classList.add("card-header");
      cardHeader.setAttribute("data-background-color","white")
      cardHeader.appendChild(document.createTextNode(world.worldName));
      card.appendChild(cardHeader);

      var cardContent = document.createElement("div");
      cardContent.classList.add("card-content");
      card.appendChild(cardContent);

        var cardContentCategory = document.createElement("p");
        cardContentCategory.classList.add("category");
        cardContentCategory.appendChild(document.createTextNode("Flavor"));
        cardContent.appendChild(cardContentCategory);

        var cardContentTitle = document.createElement("p");
        cardContentTitle.classList.add("card-title");
        //TODO: find syntax.
        cardContentTitle.appendChild(document.createTextNode(
          flavor.flavorDescription
        ));
        cardContent.appendChild(cardContentTitle);

      var cardFooter = document.createElement("div");
      cardFooter.classList.add("card-footer");
      card.appendChild(cardFooter);

        var cardFooterLink = document.createElement("a");
        cardFooterLink.onclick = function() {
          /* TODO: create world...
          createStackWithWorld(
            world.worldName + "-" + getMonth() + "-" + getDate() + "-" + getYear(),  //stackName
            world.s3Filepath,
            flavor
          )
          */
        };
        cardFooterLink.href = "blah"; //TODO: find syntax.
        cardFooterLink.appendChild(document.createTextNode(
          "create stack with this world..."
        ));
        cardFooter.appendChild(cardFooterLink);
  }
}

/*
forms and injects DOM elements containing information on each world.
removes and repopulates #worlds-cards-row.
TODO: which is better, appendChild all at the end, or when the element is made?
*/
function injectFlavors() {

  var flavors = JSON.parse(localStorage.flavors);

  //delete current HTML
  var row = document.getElementById("flavors-cards-row");
  while(row.firstChild) {
    row.removeChild(row.firstChild);
  }

  //for each flavor object in localStorage array
  for(var i = 0; i < flavors.length; i++) {

    var flavor = flavors[i];

    //build new HTML
    var column = document.createElement("div");
    column.classList.add("col-lg-4","col-md-6","col-sm-6");
    row.appendChild(column);

    var card = document.createElement("div");
    card.classList.add("card","card-stats");
    column.appendChild(card);

      var cardHeader = document.createElement("div");
      cardHeader.classList.add("card-header");
      cardHeader.setAttribute("data-background-color","white")
      cardHeader.appendChild(document.createTextNode(flavor.flavorDescription));
      card.appendChild(cardHeader);

      var cardContent = document.createElement("div");
      cardContent.classList.add("card-content");
      card.appendChild(cardContent);

        var cardContentCategory = document.createElement("p");
        cardContentCategory.classList.add("category");
        cardContentCategory.appendChild(document.createTextNode("MC version"));
        cardContent.appendChild(cardContentCategory);

        var cardContentTitle = document.createElement("p");
        cardContentTitle.classList.add("card-title");
        //TODO: find syntax.
        cardContentTitle.appendChild(document.createTextNode(
          flavor.minecraftVersion
        ));
        cardContent.appendChild(cardContentTitle);

      var cardFooter = document.createElement("div");
      cardFooter.classList.add("card-footer");
      card.appendChild(cardFooter);

        var cardFooterLink = document.createElement("a");
        cardFooterLink.onclick = function() {
          /*
          createStackWithWorld(
            world.worldName + "-" + getMonth() + "-" + getDate() + "-" + getYear(),  //stackName
            world.s3Filepath,
            flavor
          )
          */
        };
        cardFooterLink.href = "blah"; //TODO: find syntax.
        cardFooterLink.appendChild(document.createTextNode(
          "create world with this flavor..."
        ));
        cardFooter.appendChild(cardFooterLink);
  }
}

})();

var UI = require('ui');
var ajax = require('ajax');
var stopRoutes = require('./stopRoute').stops;
var BASE_URL = 'http://realtimemap.grt.ca/';

var main = new UI.Menu({
    sections: [{
        title: "GRT Pebble",
        items: [
            {
                title: "3766",
                subtitle: "Home"
        },
            {
                title: "1119",
                subtitle: "Rev"
        },
          {
            title: "1893",
            subtitle: "Victoria"
          },
            {
                title: "3699",
                subtitle: "DC"
        },
          {
            title: "3619",
            subtitle: "Laurier"
          }
      ]
    }]
});

main.show();

main.on('select', function (e) {
    var stopId = e.item.title;
    var currentStop = stopRoutes[stopId];
    var routeMenu = [];
    for (var i = 0; i < currentStop.length; i++) {
        routeMenu.push({
            title: currentStop[i]
        });
    }
    var routes = new UI.Menu({
        sections: [{
          title: stopId,
            items: routeMenu
    }]
    });
    routes.on('select', function (e) {
        ajax({
                url: BASE_URL + 'Stop/GetStopInfo?routeId=' + e.item.title + '&stopId=' + stopId,
            },
            function (data) {
                data = JSON.parse(data);
                var stopMenu = [];
                for (var i = 0; i < data.stopTimes.length; i++) {
                    stopMenu.push({
                        title: data.stopTimes[i].Minutes + " minutes"
                    });
                }
                var stop = new UI.Menu({
                    sections: [{
                        title: e.item.title + "@" + stopId,
                        items: stopMenu
                    }]
                });
                stop.show();
            },
            function (error) {
                console.log('The ajax request failed: ' + error);
            }
        );
    });
    routes.show();
});
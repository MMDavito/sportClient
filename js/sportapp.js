var module = angular.module("sportApp", ["ui.router"]);

module.config(function ($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise("/");
    $stateProvider.state("home", {
        url: "/",
        templateUrl: "templates/home.html",
        controller: "homeCtrl"
    }).state("addgame", {
        url: "/addgame",
        templateUrl: "templates/addgame.html",
        controller: "addgameCtrl"
    }).state("changegame", {
        url: "/changegame",
        templateUrl: "templates/changegame.html",
        controller: "changegameCtrl"
    });
});

module.controller("homeCtrl", function ($scope, $rootScope, sportService) {
    var promise = sportService.getTable();
    promise.then(function (data) {
        $scope.table = data;
    });
});
module.controller("addgameCtrl", function ($scope, $rootScope, sportService) {

    sportService.getTable().then(function (data) {
        $scope.table = data;
    });
    $scope.loggIn = function () {
        console.log("du komer hit, dummel");
        sportService.loggIn($scope.username, $scope.password);
    };
    $scope.addGame = function () {
        console.log("Fubar");
        if ((($scope.hl) !== Number($scope.bl)) && ($scope.ph + $scope.pb === 3)) {
            sportService.addGame(Number($scope.hl), Number($scope.bl), $scope.ph, $scope.pb);
        } else
            console.log("DRUMEL, Du kan inte göra så.");

    };
    sportService.getTeams().then(function (data) {
        console.log("teams");
        $rootScope.teams = data;
        console.log(data);
    });
});
module.controller("changegameCtrl", function ($scope, $rootScope, sportService) {
    var promise = sportService.getGames();
    promise.then(function (data) {
        $scope.games = data;
    });

    $scope.resolveTeam = function (id) {
        for (var i = 0; i < $rootScope.teams.length; i++) {
            if (id === $rootScope.teams[i].id) {
                return $rootScope.teams[i].lag;
            }
        }
    };

    $scope.removeGame = function (id) {
        sportService.removeGame(id);
    };
    $scope.fillForm = function (id) {
        console.log(id);
        for (var i = 0; i < $scope.games.length; i++) {
            if ($scope.games[i].id === id) {
                $scope.formId = $scope.games[i].id;
                $scope.formHL = Number($scope.games[i].hemmalag);
                $scope.formBL = Number($scope.games[i].bortalag);
                $scope.formPH = $scope.games[i].poanghemma;
                $scope.formPB = $scope.games[i].poangborta;

            }
        }
    };
    $scope.changeGame = function () {
        if (($scope.formHL !== $scope.formBL) && ($scope.formPH + $scope.formPB === 3)) {
            sportService.changeGame($scope.formId, Number($scope.formHL), Number($scope.formBL), $scope.formPH, $scope.formPB);
        }
        else console.log("Failade ändra match PG:A. Användare");
    };
});

module.service("sportService", function ($q, $http, $rootScope) {
    this.getTable = function () {
        var deffer = $q.defer();
        var url = "http://localhost:8080/SportApp/webresources/table";
        $http.get(url).success(function (data) {
            deffer.resolve(data);
        });
        return deffer.promise;
    };
    this.getTeams = function () {
        var deffer = $q.defer();
        var url = "http://localhost:8080/SportApp/webresources/teams";
        var auth = "Basic " + window.btoa($rootScope.user + ":" + $rootScope.pass);
        $http({
            url: url,
            method: "GET",
            headers: {'Authorization': auth}
        }).success(function (data, status) {
            deffer.resolve(data);
        });
        return deffer.promise;
    };
    this.addGame = function (hl, bl, ph, pb) {
        var data = {
            hemmalag: hl,
            bortalag: bl,
            poanghemma: ph,
            poangborta: pb
        };
        console.log(data);
        var url = "http://localhost:8080/SportApp/webresources/game";
        var auth = "Basic " + window.btoa($rootScope.user + ":" + $rootScope.pass);
        console.log(auth);
        $http({
            url: url,
            method: "POST",
            data: data,
            headers: {'Authorization': auth}}).success(function (data, status) {
            console.log("Fixade inlagd match");
        });
    };
    this.loggIn = function (username, password) {

        var url = "http://localhost:8080/SportApp/webresources/login";
        var auth = "Basic " + window.btoa(username + ":" + password);

        console.log(auth);

        $http({
            url: url,
            method: "POST",
            headers: {'Authorization': auth}
        }).success(function (data, status) {
            console.log("loggedin");
            $rootScope.isLoggedIn = true;
            $rootScope.user = username;
            $rootScope.pass = password;
        })
                .error(function (data, status) {
                    console.log("logedout");
                });
    };
    this.getGames = function () {
        var deffer = $q.defer();
        var url = "http://localhost:8080/SportApp/webresources/games";
        var auth = "Basic " + window.btoa($rootScope.user + ":" + $rootScope.pass);
        $http({
            url: url,
            method: "GET",
            headers: {'Authorization': auth}
        }).success(function (data, status) {
            deffer.resolve(data);
        });
        return deffer.promise;
    };
    this.removeGame = function (id) {

        var deffer = $q.defer();
        var url = "http://localhost:8080/SportApp/webresources/game/" + id;
        var auth = "Basic " + window.btoa($rootScope.user + ":" + $rootScope.pass);
        $http({
            url: url,
            method: "DELETE",
            headers: {'Authorization': auth}
        }).success(function (data, status) {
            console.log("Match borttagen");
        }).error(function (data, status) {
            console.log("det blev fel");
        });
    };
    this.changeGame = function (id, hl, bl, ph, pb) {
        var data = {
            id: id,
            hemmalag: hl,
            bortalag: bl,
            poanghemma: ph,
            poangborta: pb
        };
        console.log(data);
        var url = "http://localhost:8080/SportApp/webresources/game";
        var auth = "Basic " + window.btoa($rootScope.user + ":" + $rootScope.pass);
        console.log(auth);
        $http({
            url: url,
            method: "PUT",
            data: data,
            headers: {'Authorization': auth}}).success(function (data, status) {
            console.log("Lyckades att ändra match");
        });
    };

});
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
        console.log("trevligt");
        $scope.table = data;
    });
    $scope.loggIn = function () {
        console.log("du komer hit, dummel");
        sportService.loggIn($scope.username, $scope.password);
    };
    $scope.addGame = function () {
        sportService.addGame(Number($scope.hl), Number($scope.bl), $scope.ph, $scope.pb);
    };
    sportService.getTeams().then(function (data) {
        console.log("teams");
        $scope.teams = data;
        console.log(data);
    });
});
/*module.controller("addgameCtrl", function ($scope, $rootScope, sportService) {
 
 sportService.getTeams().then(function (data){        
 console.log("teams");
 $scope.teams = data;
 console.log(data);
 });
 });*/



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
            "hemmalag": hl,
            "bortalag": bl,
            "poanghemma": ph,
            "poangborta": pb
        };
        console.log(data);
        var url = "http://localhost:8080/SportApp/webresources/game";
        var auth = "Basic " + window.btoa($rootScope.user + ":" + $rootScope.pass);
        $http({
            url: url,
            method: "POST",
            data: data,
            headers: {'Authorization': auth}}).success(function (data, status) {
            console.log("Fixade inlagd match");
        }).error("Failade med lägga in match");
    };

    this.loggIn = function (username, password) {
        console.log("kärleken, magi, liksom fixade allt");

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
});
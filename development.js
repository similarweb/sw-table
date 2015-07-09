angular.module('main', ['sw.table', 'ngResource', 'ngMockE2E'])
    .constant('mockData', [
        {
            "appId": "com.ciegames.RacingRivals",
            "name": "Racing Rivals",
            "appIconSmall": "https://lh3.googleusercontent.com/JxYMF5gSoIoYzX9GltTQTxd6SOp9izWXZB28J-4s4NRWSOnh3SWuWZ1XVdBz247jmg=w300",
            "globalRank": 91,
            "rankChange": 207,
            "tooltip": {
                "AppStore": "Google",
                "Title": "Racing Rivals",
                "Author": "Glu",
                "Icon": "https://lh3.googleusercontent.com/JxYMF5gSoIoYzX9GltTQTxd6SOp9izWXZB28J-4s4NRWSOnh3SWuWZ1XVdBz247jmg=w300",
                "Price": "Free",
                "Category": "Games / Racing"
            }
        },
        {
            "appId": "com.microsoft.office.outlook",
            "name": "Microsoft Outlook",
            "appIconSmall": "https://lh4.ggpht.com/CJnXspvHG7Qa-GXDFaUMPcx-BFEqhWMH059lMyIu0KI_gCLt_7QVx4ISIhbJ7WX6wYsb=w300",
            "globalRank": 85,
            "rankChange": 47,
            "tooltip": {
                "AppStore": "Google",
                "Title": "Microsoft Outlook",
                "Author": "Microsoft Corporation",
                "Icon": "https://lh4.ggpht.com/CJnXspvHG7Qa-GXDFaUMPcx-BFEqhWMH059lMyIu0KI_gCLt_7QVx4ISIhbJ7WX6wYsb=w300",
                "Price": "Free",
                "Category": "Productivity"
            }
        },
        {
            "appId": "com.zentertain.bigcasino",
            "name": "Lucky Win Casino�- FREE SLOTS",
            "appIconSmall": "https://lh3.googleusercontent.com/O3yfzz6Q_kT9JmbKh_vInuE_NzBgYsMSh-u1Y2J36GgY-O3FV6y6D8Ck9h0MBYU3gA=w300",
            "globalRank": 65,
            "rankChange": 39,
            "tooltip": {
                "AppStore": "Google",
                "Title": "Lucky Win Casino�- FREE SLOTS",
                "Author": "ZENTERTAIN LTD",
                "Icon": "https://lh3.googleusercontent.com/O3yfzz6Q_kT9JmbKh_vInuE_NzBgYsMSh-u1Y2J36GgY-O3FV6y6D8Ck9h0MBYU3gA=w300",
                "Price": "Free",
                "Category": "Games / Casino"
            }
        },
        {
            "appId": "air.com.fgl.happyplanetgames.cubecrash2deluxefree",
            "name": "Cube Crash 2 Deluxe Free",
            "appIconSmall": "https://lh5.ggpht.com/bXBD7xb-iv1Us-IxsUqS_nFtWogpDoWLsGlH2fRvFatBG_mOFgQoUEJyw1ymsFapdQKc=w300",
            "globalRank": 57,
            "rankChange": 35,
            "tooltip": {
                "AppStore": "Google",
                "Title": "Cube Crash 2 Deluxe Free",
                "Author": "Ocean Breeze Games",
                "Icon": "https://lh5.ggpht.com/bXBD7xb-iv1Us-IxsUqS_nFtWogpDoWLsGlH2fRvFatBG_mOFgQoUEJyw1ymsFapdQKc=w300",
                "Price": "Free",
                "Category": "Games / Casual"
            }
        },
        {
            "appId": "com.igg.castleclash",
            "name": "Castle Clash",
            "appIconSmall": "https://lh3.ggpht.com/7ri9iDY6mLybEW8CU8_SgQC_PlmAH1kT8j-NzYw6zEk5E3b1XF30LxNyF-fcNX_k1VWy=w300",
            "globalRank": 73,
            "rankChange": 26,
            "tooltip": {
                "AppStore": "Google",
                "Title": "Castle Clash",
                "Author": "IGG.COM",
                "Icon": "https://lh3.ggpht.com/7ri9iDY6mLybEW8CU8_SgQC_PlmAH1kT8j-NzYw6zEk5E3b1XF30LxNyF-fcNX_k1VWy=w300",
                "Price": "Free",
                "Category": "Games / Strategy"
            }
        }
    ])
    .run(function($httpBackend, ServerDataModel) {
        var tableData = ServerDataModel.data,
            pageSize = 5;

        $httpBackend.whenGET('/tableData').respond(function(method, url, data) {
            return [200, tableData, {}];
        });
        // must use regex to catch query params due to issue in $httpbackend
        // also the order of query params is important
        $httpBackend.whenGET(/\/tableData\?field/).respond(function(method, url, data) {
            return [200, ServerDataModel.sortData(tableData), {}];
        });
        $httpBackend.whenGET(/\/tableData\?pageSize/).respond(function(method, url, data) {
            return [200, ServerDataModel.loadMoreData(pageSize), {}];
        });
    })
    .service('ServerDataModel', function ServerDataModel(mockData) {
        return {
            data: mockData,
            sortData: function(field, sortDirection){
                // not really sorting, just simulating with a simple reverse
                return this.data.reverse();
            },
            loadMoreData: function(pageSize){
                var data = this.data;
                for (var i = 0; i < pageSize; i++) {
                    var copy = angular.copy(this.data[0]);
                    data.push(copy);
                }
                return data;
            }
        };
    })
    .factory('HttpService', function($http, ServerDataModel) {
        return {
            query: function(params) {
                return $http.get('/tableData', { params: params });
            }
        };
    })
    .controller('mainCtrl', function ($scope, tableService, HttpService) {
        $scope.tableColumns = [
            new tableService.Column({
                field: 'name',
                displayName: 'Name',
                cellTemplate: 'templates/app-name.html'
            }),
            {
                field: 'globalRank',
                displayName: 'Global Rank',
                cellTemplate: 'templates/traffic-share.html',
                headerCellTemplate: 'templates/default-header-cell.html'
            },
            new tableService.Column({
                field: 'rankChange',
                displayName: 'Rank Change',
                cellTemplate: 'templates/traffic-share.html'
            })
        ];
        $scope.tableData = [];
        $scope.queryHttp = function(params) {
            HttpService.query(params)
                .error(function(data, status, headers) {
                    $scope.tableData = data;
                })
                .success(function(data) {
                    $scope.tableData = data;
                });
        };
        $scope.queryHttp();
    });
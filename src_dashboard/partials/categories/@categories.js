angular.module('mainApp').controller('categoriesController', ['$scope', 'mainSvc', 'actionSvc', '$rootScope', '$translate', 'modalSvc', '$timeout', '$cookies', '$stateParams',
    function ($scope, mainSvc, actionSvc, $rootScope, $translate, modalSvc, $timeout, $cookies, $stateParams) {

        $scope.lstCategories = [];
        $scope.loadList = false;
        $scope.lstBreadcrumbs = [];

        $scope.loadCategories = function() {
          if (localStorage.getItem("categories_lstBreadcrumbs")) $scope.lstBreadcrumbs = JSON.parse(localStorage.getItem("categories_lstBreadcrumbs"));
          $scope.getCategories();
        }

        $scope.getCategories = function() {
          /* Load Categories */
          $scope.loadList = false;
          $scope.lstCategories = [];
          mainSvc.callService({
            url: 'category/getcategories',
            params: {
              'catIdParent': ($scope.lstBreadcrumbs.length==0)?0:$scope.lstBreadcrumbs[$scope.lstBreadcrumbs.length-1].id
            }
          }).then(function (response) {
            $scope.lstCategories = angular.copy(response);
            $scope.loadList = true;
          });
        };

        $scope.goSubCategory = function(item) {
          $scope.lstBreadcrumbs.push(item);
          localStorage.setItem("categories_lstBreadcrumbs", JSON.stringify($scope.lstBreadcrumbs));
          $scope.getCategories();
        }

        $scope.returnSubCategory = function(item) {
          let index = $scope.lstBreadcrumbs.findIndex( record => record.id == item.id );
          if (index<$scope.lstBreadcrumbs.length-1) {
            $scope.lstBreadcrumbs.splice(index+1, $scope.lstBreadcrumbs.length-index);
            localStorage.setItem("categories_lstBreadcrumbs", JSON.stringify($scope.lstBreadcrumbs));
            $scope.getCategories();
          }
        }

        $scope.goRoot = function() {
          $scope.lstBreadcrumbs = [];
          localStorage.setItem("categories_lstBreadcrumbs", JSON.stringify($scope.lstBreadcrumbs));
          $scope.getCategories();
        }
        
        $scope.goProducts = function(item) {
          actionSvc.goToAction(11, { category : item.id })
        }

        $scope.clickNew = function () {
          actionSvc.goToAction(10.1, { 
            id: 0, 
            action: 'new'
          }); //new category
        }

        $scope.clickEdit = function(item) {
          actionSvc.goToAction(10.1, {
            id: item.id, 
            action: 'edit'
          }); //edit category
        }

        $scope.clickRemove = function(item) {
          modalSvc.showModal({
            size: 'sm'
          },{
            closeButtonText: $translate.instant('BTN_NO'),
            actionButtonText: $translate.instant('BTN_YES'),
            bodyText: $translate.instant('MSG_REMOVE_ACTION', { name: item.name})
          }).then(function (result) {
            mainSvc.callService({
                url: 'category/removecategory',
                params: {
                  'usrId': $rootScope.userInfo.id,
                  'catId': item.id
                }
            }).then(function (response) {
              $rootScope.showRefresh = true;
              $cookies.remove("LENGOLO_CATEGORY_LST");
              let index = $scope.lstCategories.findIndex( record => record.id == item.id );
              $scope.lstCategories.splice(index, 1);
              mainSvc.showAlertByCode(4);
            });
          });
        }

        $scope.activeCategory = function(item) {
          mainSvc.callService({
              url: 'category/activeCategory',
              params: {
                'usrId'  : $rootScope.userInfo.id,
                'catId'  : item.id
              }
          }).then(function (response) {
            $rootScope.showRefresh = true;
            $cookies.remove("LENGOLO_CATEGORY_LST");
            let index = $scope.lstCategories.findIndex( record => record.id == item.id );
            $scope.lstCategories[index].enable = ($scope.lstCategories[index].enable==1)?0:1;
            mainSvc.showAlertByCode(1);
          });
        };

        $scope.changePosition = function() {
          angular.forEach($scope.lstCategories, function(item, key) {
            if (item && item.action && item.action==1) {
              $timeout(function(){
                mainSvc.callService({
                  url: 'category/changeOrder',
                  params: {
                    'usrId'  : $rootScope.userInfo.id,
                    'catId'  : item.id,
                    'jump'  : item.jumpPosition
                  }
                }).then(function (response) {
                  $rootScope.showRefresh = true;
                  $cookies.remove("LENGOLO_CATEGORY_LST");
                  $scope.getCategories();
                });
              },1000);
            };
          });
        };

    }]);

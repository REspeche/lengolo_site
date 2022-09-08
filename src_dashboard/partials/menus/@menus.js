angular.module('mainApp').controller('menusController', ['$scope', 'mainSvc', 'actionSvc', '$rootScope', '$translate', 'modalSvc', '$cookies', '$timeout', 'BASE_URL', '$window',
    function ($scope, mainSvc, actionSvc, $rootScope, $translate, modalSvc, $cookies, $timeout, BASE_URL, $window) {

        $scope.lstMenus = [];
        $scope.loadList = false;
        $scope.path = changeProtocolSSL(BASE_URL.api) + '/v1/common/viewFile?type=codes&size=large&file=';

        $scope.loadMenus = function() {
          $scope.getMenus();
        }

        $scope.getMenus = function() {
          /* Load Menues */
          $scope.loadList = false;
          $scope.lstMenus = [];
          mainSvc.callService({
            url: 'menu/getMenus'
          }).then(function (response) {
            $scope.lstMenus = angular.copy(response);
            $scope.loadList = true;
          });
        };

        $scope.goProducts = function(item) {
          actionSvc.goToAction(11, { menu : item.id })
        }

        $scope.clickNew = function () {
          actionSvc.goToAction(12.1, {
            id: 0,
            action: 'new'
          }); //new menu
        }

        $scope.clickEdit = function(item) {
          actionSvc.goToAction(12.1, {
            id: item.id,
            action: 'edit'
          }); //edit menu
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
                url: 'menu/removeMenu',
                params: {
                  'usrId': $rootScope.userInfo.id,
                  'menId': item.id
                }
            }).then(function (response) {
              $rootScope.showRefresh = true;
              $cookies.remove("LENGOLO_MENU_LST");
              let index = $scope.lstMenus.findIndex( record => record.id == item.id );
              $scope.lstMenus.splice(index, 1);
              mainSvc.showAlertByCode(4);
            });
          });
        }

        $scope.activeMenu = function(item) {
          mainSvc.callService({
              url: 'menu/activeMenu',
              params: {
                'usrId'  : $rootScope.userInfo.id,
                'menId'  : item.id
              }
          }).then(function (response) {
            $rootScope.showRefresh = true;
            $cookies.remove("LENGOLO_MENU_LST");
            let index = $scope.lstMenus.findIndex( record => record.id == item.id );
            $scope.lstMenus[index].enable = ($scope.lstMenus[index].enable==1)?0:1;
            mainSvc.showAlertByCode(1);
          });
        };

        $scope.clickCopyLink = function(item) {
          var text = new String('http://menu.lengolo.com.ar/{0}?menu={1}').format($rootScope.userInfo.codeMenu,item.id);
          if (typeof(navigator.clipboard)=='undefined') {
            console.log('navigator.clipboard');
            var textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.position="fixed";  //avoid scrolling to bottom
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                document.execCommand('copy');
                mainSvc.showAlertByCode(110);
            } catch (err) {
                alert('Was not possible to copy te text: ' + err);
            }

            document.body.removeChild(textArea)
            return;
          }
          navigator.clipboard.writeText(text).then(function() {
            mainSvc.showAlertByCode(110);
          });
        };

        $scope.downloadQR = function(item) {
          mainSvc.callService({
            url: 'common/validateCodeQR',
            params: {
              'code': $rootScope.userInfo.codeMenu,
              'menu': item.id
            }
          }).then(function (response) {
            if (response.code==0) {
              $timeout(function() {
                let urlImage = $scope.path + $rootScope.userInfo.codeMenu + "_M" + item.id + '.jpg';
                $window.open(urlImage, '_blank');
              },1000);
            }
          });
        };

        $scope.setMultipleLanguage = function() {
          actionSvc.goToAction(21, {
            id: 0
          }); //set language
        };

        $scope.deliveryMenu = function(item) {
          mainSvc.callService({
              url: 'menu/deliveryMenu',
              params: {
                'usrId'  : $rootScope.userInfo.id,
                'menId'  : item.id
              }
          }).then(function (response) {
            $rootScope.showRefresh = true;
            item.delivery = (item.delivery==1)?0:1;
            mainSvc.showAlertByCode(1);
          });
        };

    }]);

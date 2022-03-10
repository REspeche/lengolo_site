angular.module('mainApp').controller('messagesController', ['$scope', 'mainSvc', 'actionSvc', '$rootScope', '$translate', 'modalSvc',
    function ($scope, mainSvc, actionSvc, $rootScope, $translate, modalSvc) {

        $scope.lstMessages = [];
        $scope.loadList = false;

        $scope.loadMessages = function() {
          /* Load Categories */
          $scope.loadList = false;
          $scope.lstMessages = [];
          mainSvc.callService({
            url: 'message/getmessages'
          }).then(function (response) {
            $scope.lstMessages = angular.copy(response);
            $scope.loadList = true;
          });
        }

        $scope.clickNew = function () {
          actionSvc.goToAction(20.1, {
            id: 0,
            action: 'new'
          }); //new message
        }

        $scope.clickEdit = function(item) {
          actionSvc.goToAction(20.1, {
            id: item.id,
            action: 'edit'
          }); //edit message
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
                url: 'message/removeMessage',
                params: {
                  'usrId': $rootScope.userInfo.id,
                  'msgId': item.id
                }
            }).then(function (response) {
              $rootScope.showRefresh = true;
              let index = $scope.lstMessages.findIndex( record => record.id == item.id );
              $scope.lstMessages.splice(index, 1);
              mainSvc.showAlertByCode(4);
            });
          });
        }

        $scope.activeMessage = function(item) {
          mainSvc.callService({
              url: 'message/activeMessage',
              params: {
                'usrId'  : $rootScope.userInfo.id,
                'msgId'  : item.id
              }
          }).then(function (response) {
            $rootScope.showRefresh = true;
            let index = $scope.lstCategories.findIndex( record => record.id == item.id );
            $scope.lstCategories[index].enable = ($scope.lstCategories[index].enable==1)?0:1;
            mainSvc.showAlertByCode(1);
          });
        };

    }]);

angular.module('mainApp').controller('getQrController', ['$scope', 'mainSvc', '$rootScope', 'actionSvc', '$translate', '$window', '$location',
    function ($scope, mainSvc, $rootScope, actionSvc, $translate, $window, $location) {

      $scope.loadForm = true;
      $scope.dataLastBuy = {
        costQr: 0,
        costShipping: 0
      };
      $scope.dataCost = [];
      $scope.lastPurchase = '';
      $scope.notAR = false;
      $scope.actionFeedback = undefined;

      $scope.loadGetQr = function() {
        if ( $location.search().hasOwnProperty('action') ) {
          $scope.actionFeedback = $location.search()['action'];
        }

        $translate.onReady(function() {
            $scope.lastPurchase = $translate.instant('MSG_INFO_LAST_PURCHASE');
        });
          
        /* Load Data */
        mainSvc.callService({
            url: 'setting/getLastBuy'
        }).then(function (response) {
            $scope.dataLastBuy = angular.copy(response[0]);
            if ($scope.dataLastBuy.couId!=10) $scope.notAR = true;
            if ($scope.dataLastBuy.lastDate) {
                $scope.lastPurchase = $scope.lastPurchase.replace('{date}', $scope.dataLastBuy.lastDate).replace('{quantity}', $scope.dataLastBuy.lastQuantity);
            }
            mainSvc.callService({
                url: 'setting/getCost'
            }).then(function (response) {
                $scope.dataCost = angular.copy(response);
                if ($scope.actionFeedback) {
                  if ($scope.actionFeedback=='success') {
                    mainSvc.callService({
                        url: 'setting/confirmPayment'
                    }).then(function (response) {
                      if (response.code==0) {
                        mainSvc.showAlertByCode(6);
                        actionSvc.goToAction(15);
                      }
                      else {
                        mainSvc.showAlertByCode(212);
                      }
                    });
                  }
                  else {
                    mainSvc.showAlertByCode(316);
                  }
                }
                $scope.loadForm = true;
            });
        });
      }

      $scope.doPay = function(item) {
        mainSvc.callService({
            url: 'setting/paymentRequest',
            params: {
              'usrId': $rootScope.userInfo.id,
              'quantity': item.quantity,
              'transaction_amount': item.cost
            }
        }).then(function (response) {
            if (response.code==0) {
                $window.open(item.url, '_self');
            }
            else {
                mainSvc.showAlertByCode(300);
            }
        });
      }

      $scope.changeAddress = function() {
        actionSvc.goToAction(6); //profile
      }

      $scope.viewStatusShipping = function() {
        actionSvc.goToAction(15); //list shipping
      }

      $scope.viewQRFree = function() {
        actionSvc.goToAction(13); //QR free
      }

}]);
angular.module('mainApp').controller('shippingController', ['$scope', 'mainSvc', 'actionSvc', 'BASE_URL',
    function ($scope, mainSvc, actionSvc, BASE_URL) {

        $scope.lstShipping = [];
        $scope.loadList = false;
        $scope.path = BASE_URL.api + '/v1/common/viewFile?type=profile&file=';

        $scope.loadShipping = function() {
          /* Load Shipping */
          $scope.lstShipping = [];
          mainSvc.callService({
            url: 'setting/getListShipping'
          }).then(function (response) {
            $scope.lstShipping = angular.copy(response);
            $scope.loadList = true;
          });
        };

        $scope.changeStatus = function(item) {
          mainSvc.callService({
            url: 'setting/changeStatusShipping',
            params: {
              'buyId': item.id
            }
          }).then(function (response) {
            let index = $scope.lstShipping.findIndex( record => record.id == item.id );
            $scope.lstShipping[index].status = ($scope.lstShipping[index].status==3)?4:3;
            mainSvc.showAlertByCode(1);
          });
        };

        $scope.clickNew = function() {
          actionSvc.goToAction(14); //new code QR
        };

        $scope.nextStatus = function(item) { 
          mainSvc.callService({
              url: 'setting/setNextStatusShipping',
              params: {
                  'buyId' : item.id
              }
          }).then(function (response) {
              item.status += 1;
              mainSvc.showAlertByCode(8);
          });
        };

        $scope.copyClipboard = function(text) {
            navigator.clipboard.writeText(text).then(function() {
                mainSvc.showAlertByCode(110);
            });
        };

        $scope.generateLabel = function(item) {
            let label = item.description+'\n-------------------------------\n'+
            'Nombre: '+item.nameClient+'\n'+
            'Dirección: '+item.address+' CP: '+item.zip+'\n'+
            'Ciudad: '+item.city+'\n'+
            'Teléfono: '+item.phone;
            $scope.copyClipboard(label);
        };

    }]);

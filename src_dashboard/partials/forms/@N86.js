angular.module('mainApp').controller('N86Controller', ['$scope', 'mainSvc', '$rootScope',
    function ($scope, mainSvc, $rootScope) {

        $scope.clients = [];
        $scope.loadList = false;
        $scope.lstDates = [];
        $scope.dateSelect = 0;

        $scope.loadClients = function() {
            let dateObj = new Date(new Date().getFullYear(),new Date().getMonth() , new Date().getDate());
            for(var x=0;x<29;x++) {
                $scope.lstDates.push({
                    id: x,
                    label: dateObj.format('mediumDate')
                });
                dateObj.setDate(dateObj.getDate()-1);
            };

            $scope.refreshList();
        };

        $scope.refreshList = function(showAlert) { 
            mainSvc.callService({
                url: 'client/getFormN86',
                params: {
                    'usrId'     : $rootScope.userInfo.id,
                    'diffDate'  : $scope.dateSelect
                }
            }).then(function (response) {
                $scope.clients = angular.copy(response);
                $scope.loadList = true;
                if (showAlert) mainSvc.showAlertByCode(9);
            });
        };

        $scope.selectDate = function() {
            $scope.refreshList();
        };

        $scope.printReport = function() {
            if ($scope.clients && $scope.clients.length>0) {
                var divContents = document.getElementById("printTable").innerHTML; 
                var a = window.open('', '', 'height=500, width=500'); 
                a.document.write('<html><body style="margin:10px;">'); 
                a.document.write(divContents); 
                a.document.write('</body></html>'); 
                a.document.close(); 
                a.print(); 
              }
        };

    }]);

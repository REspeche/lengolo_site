angular.module('mainApp').controller('showQrController', ['$scope', 'mainSvc', 'BASE_URL', '$rootScope', '$translate', '$timeout',
    function ($scope, mainSvc, BASE_URL, $rootScope, $translate, $timeout) {

      $scope.loadImage = false;
      $scope.formData = {
        code: $rootScope.userInfo.codeMenu,
        nroCodes: 10
      };
      $scope.urlMenu = encodeURI(BASE_URL.menu);
      $scope.lstQuaTables = [];
      $scope.path = BASE_URL.api + '/v1/common/viewFile?type=codes&size=large&file=';
      $scope.viewDesign = true;
      $scope.codeSimple = undefined;
      $scope.codeDesign = undefined;

      $scope.loadQr = function() {

        for (var i=1;i<21;i++) {
          $scope.lstQuaTables.push(i*10);
        };

        mainSvc.callService({
          url: 'common/validateCodeQR',
          params: {
            'code': $rootScope.userInfo.codeMenu
          }
        }).then(function (response) {
          if (response.code==0) {
            $timeout(function() {
              $scope.codeSimple = $scope.path + $scope.formData.code + '.jpg';
              $scope.codeDesign = $scope.path + "plantilla_" + $scope.formData.code + '.jpg';
              $scope.loadImage = true;  
            },1000);
          }          
        });
      };

      $scope.clickPrint = function() {
        if ($scope.formData.code && $scope.codeSimple && $scope.codeDesign) {
          var url = ($scope.viewDesign)?$scope.codeDesign:$scope.codeSimple;
          var _w = ($scope.viewDesign)?240:140;
          var imgHtml = '';
          for (var i = 0; i < $scope.formData.nroCodes; i++) {  
            imgHtml += '<div style="border:1px dashed #666;border-left:none;padding:5px;width:min-content;display:inline-block;"><img src ="'+url+'" id="myQr'+i+'" width="'+_w+'"/></div>';
          }
          var win = window.open("", "QR Codes", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=800,height=600,top=400,left="+(screen.width-840));
          win.document.body.innerHTML = imgHtml;
          setTimeout(function() {
            win.focus();
            win.print();
          },3000);
        }
      }

    }]);

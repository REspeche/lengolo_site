angular.module('mainApp').controller('ordersController', ['$scope', 'mainSvc', '$rootScope', 'BASE_URL', 'modalSvc', '$translate', '$state', '$stateParams', '$q', '$timeout', '$cookies',
    function ($scope, mainSvc, $rootScope, BASE_URL, modalSvc, $translate, $state, $stateParams, $q, $timeout, $cookies) {
        var socket = io(changeProtocolSSL(BASE_URL.socket));
        var name_socket = '';
        $scope.orders = [];
        $scope.loadList = false;
        $scope.lstMenus = [];
        $scope.lstPeriods = [];
        $scope.menIdSelect = 0;
        $scope.menId = 0;
        $scope.periodSelect = 0;

        $scope.loadOrders = function() {
          $scope.menId = ($stateParams.menu)?parseInt($stateParams.menu):0;

          $translate.onReady(function() {
            $scope.firstValueAll = [
              {id: 0, label: $translate.instant('LBL_ALL')}
            ];
            $scope.lstPeriods = [
              {id: 0, label: $translate.instant('LBL_LAST_24HOURS')},
              {id: 1, label: $translate.instant('LBL_LAST_7DAYS')},
              {id: 2, label: $translate.instant('LBL_LAST_15DAYS')},
              {id: 3, label: $translate.instant('LBL_LAST_1MONTH')}
            ];

            /* Load Filter Combo */
            var lstMen = $cookies.get("LENGOLO_MENU_LST");
            if (lstMen) $scope.lstMenus = angular.fromJson(lstMen);

            if ($scope.lstMenus.length==0) {
              mainSvc.callService({
                url: 'common/getListMenus'
              }).then(function (response) {
                $scope.lstMenus = $scope.firstValueAll.concat(angular.copy(response));
                $cookies.put("LENGOLO_MENU_LST", angular.toJson($scope.lstMenus));
              });
            };

            /* select combos */
            var cookieMen = $cookies.get("LENGOLO_MENU");
            $scope.menIdSelect = (!$scope.menId)?((cookieMen)?parseInt(cookieMen):0):$scope.menId;
            var cookiePeriod = $cookies.get("LENGOLO_PERIOD");
            $scope.periodSelect = (cookiePeriod)?parseInt(cookiePeriod):0;

            /* open socket for updates */
            if ($scope.menIdSelect>0) {
              name_socket = 'order_'+$scope.menIdSelect+'_'+$rootScope.userInfo.id;
              socket.on(name_socket, function(value){
                  if (value==1) {
                      $timeout(function() {
                          $scope.refreshOrders(true);
                      },1000);
                      let snd = new Audio('/assets/img/gong.wav'); // buffers automatically when created
                      snd.play();
                      mainSvc.showAlertByCode(108);
                  }
                  else if (value==2) {
                      $timeout(function() {
                          $scope.refreshOrders(true);
                      },1000);
                      let snd = new Audio('/assets/img/1313.wav'); // buffers automatically when created
                      snd.play();
                      mainSvc.showAlertByCode(109);
                  }
              });
            }

            //get orders
            $scope.refreshOrders(true);

          });

        }

        $scope.selectMenu = function() {
          socket.off(name_socket);
          $cookies.put("LENGOLO_MENU", $scope.menIdSelect);
          $state.reload();
        };

        $scope.selectPeriod = function() {
          $cookies.put("LENGOLO_PERIOD", $scope.periodSelect);
          //get orders
          $scope.refreshOrders(true);
        };

        $scope.refreshOrders = function(isLoad) {
            $scope.loadList = false;
            $scope.orders = [];

            mainSvc.callService({
                url: 'order/getOrders',
                params: {
                    'usrId'   : $rootScope.userInfo.id,
                    'menId'   : $scope.menIdSelect,
                    'period'  : $scope.periodSelect
                }
            }).then(function (response) {
                $scope.orders = angular.copy(response);
                $scope.loadList = true;
                if (!isLoad) mainSvc.showAlertByCode(105);
            });
        }

        $scope.nextStatus = function(item) {
            mainSvc.callService({
                url: 'order/setNextStatus',
                params: {
                    'usrId' : $rootScope.userInfo.id,
                    'ordId' : item.id
                }
            }).then(function (response) {
                item.status += 1;
                mainSvc.showAlertByCode(8);
            });
        }

        $scope.changeStatus = function(item) {
            modalSvc.showModal({
                templateUrl: '/templates/modals/modalChangeStatusOrder.html'
              },
              {
                  closeButtonText: undefined,
                  formData: {
                    status: item.status
                  },
                  lstStatus: ($rootScope.userInfo.type==4)?[
                    {'id':1,'label':$translate.instant('BUD_PENDING')},
                    {'id':2,'label':$translate.instant('BUD_COOKING')},
                    {'id':3,'label':$translate.instant('BUD_CALLING')},
                    {'id':4,'label':$translate.instant('BUD_DELIVERY')},
                    {'id':5,'label':$translate.instant('BUD_CANCELED')}
                  ]:[
                    {'id':1,'label':$translate.instant('BUD_PENDING')},
                    {'id':2,'label':$translate.instant('BUD_PROCESSING')},
                    {'id':3,'label':$translate.instant('BUD_DELIVERY')},
                    {'id':4,'label':$translate.instant('BUD_READY')},
                    {'id':5,'label':$translate.instant('BUD_CANCELED')}
                  ],
                  defer: true,
                  beforeClose: function (scope) {
                    var defered = $q.defer();
                    var promise = defered.promise;

                    mainSvc.callService({
                        url: 'order/setOrderStatus',
                        params: {
                            'usrId' : $rootScope.userInfo.id,
                            'ordId' : item.id,
                            'newStatus': scope.modalOptions.formData.status
                        }
                    }).then(function (response) {
                        if (response.code==0) {
                            item.status = scope.modalOptions.formData.status;
                            mainSvc.showAlertByCode(1);
                            defered.resolve(true);
                        }
                        else {
                            mainSvc.showAlertByCode(response.code);
                            defered.resolve(false);
                        }
                    });

                    return promise;
                  }
              });
        }

        $scope.copyClipboard = function(text) {
            navigator.clipboard.writeText(text).then(function() {
                mainSvc.showAlertByCode(110);
            });
        };

        $scope.generateLabel = function(item) {
            let label = 'Nombre: '+item.nameClient+'\n'+
            'Teléfono: '+item.phone+'\n'+
            'Dirección: '+item.address+' CP: '+item.zip+'\n'+
            ((item.comment)?'Comentario: '+item.comment+'\n':'')+
            '\n'+
            'Costo: $'+item.total;
            $scope.copyClipboard(label);
        }

        $scope.viewDetail = function(item) {
            $scope.dataDetailOrder = [];
            $scope.dataOrder = item;
            mainSvc.callService({
                url: 'order/getDetailOrder',
                params: {
                  'ordId': item.id
                }
              }).then(function (response) {
                $scope.dataDetailOrder = angular.copy(response);

                // open modal
                modalSvc.showModal({
                    size: 'lg',
                    templateUrl: '/templates/modals/modalDetailOrder.html'
                },
                {
                    arrItems: $scope.dataDetailOrder,
                    dataOrder: $scope.dataOrder,
                    nextStatus: $scope.nextStatus,
                    copyAddress: $scope.copyClipboard
                });
              });
        }

    }]);

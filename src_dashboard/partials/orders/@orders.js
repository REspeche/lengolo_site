angular.module('mainApp').controller('ordersController', ['$scope', 'mainSvc', '$rootScope', 'BASE_URL', 'modalSvc', '$translate', '$q', '$timeout',
    function ($scope, mainSvc, $rootScope, BASE_URL, modalSvc, $translate, $q, $timeout) {
        var socket = io(changeProtocolSSL(BASE_URL.socket));
        $scope.orders = [];
        $scope.loadList = false;

        $scope.loadOrders = function() {
            /* open socket for updates */
            socket.on('order_'+$rootScope.userInfo.id, function(value){
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
            $scope.refreshOrders(true);
        }

        $scope.refreshOrders = function(isLoad) {
            $scope.loadList = false;
            $scope.orders = [];
            mainSvc.callService({
                url: 'order/getOrders',
                params: {
                    'usrId'   : $rootScope.userInfo.id
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
                  lstStatus: [
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

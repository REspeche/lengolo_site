mainApp.factory('modalSvc', ['$uibModal',
        function ($uibModal) {
            var publicFunctions = {
                'showModal': showModal
            };

            var modalDefaults = {
                backdrop: true,
                keyboard: true,
                animation: true,
                templateUrl: '/templates/modals/modal.html'
            };

            var modalOptions = {
                closeButtonText: 'Cerrar',
                actionButtonText: 'Aceptar',
                headerText: '',
                bodyText: 'Desea continuar con esta accion?',
                afterOpen: undefined,
                afterClose: undefined,
                beforeClose: undefined,
                defer: false,
                width: '500px'
            };

            function showModal(customModalDefaults, customModalOptions) {
                if (!customModalDefaults) customModalDefaults = {};
                if (!customModalOptions) customModalOptions = {};
                //customModalDefaults.backdrop = 'static';
                //Create temp objects to work with since we're in a singleton service
                var tempModalDefaults = {};
                var tempModalOptions = {};

                //Map angular-ui modal custom defaults to modal defaults defined in service
                angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

                //Map modal.html $scope custom properties to defaults defined in service
                angular.extend(tempModalOptions, modalOptions, customModalOptions);

                if (!tempModalDefaults.controller) {
                    tempModalDefaults.controller = function ($scope, $uibModalInstance) {
                        $scope.modalOptions = tempModalOptions;
                        if (!$scope.modalOptions.ok)
                            $scope.modalOptions.ok = function (result) {
                                if ($scope.modalOptions.defer) {
                                    $scope.modalOptions.beforeClose($scope).then(function (val) {
                                        if (val) $uibModalInstance.close(result);
                                    });
                                }
                                else {
                                    var retBeforeClose = true;
                                    if ($scope.modalOptions.beforeClose) retBeforeClose = $scope.modalOptions.beforeClose($scope);
                                    if (retBeforeClose) $uibModalInstance.close(result);
                                }
                            };
                        if (!$scope.modalOptions.close) {
                            $scope.modalOptions.close = function (result) {
                                $uibModalInstance.dismiss('cancel');
                                if ($scope.modalOptions.afterClose) $scope.modalOptions.afterClose(result);
                            };
                        }
                        $uibModalInstance.rendered.then(function () {
                          $(".modal:visible").addClass("show");
                          if ($scope.modalOptions.afterOpen) {
                            $scope.modalOptions.afterOpen($scope);
                          }
                        });
                    };
                }

                return $uibModal.open(tempModalDefaults).result.catch(function(res) {
                    if (!(res === 'cancel' || res === 'escape key press')) {
                      throw res;
                    }
                });
            }

            return publicFunctions;
        }]);

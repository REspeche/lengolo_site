mainApp.factory('modalSvc', ['$uibModal', '$window', 'mainSvc', 'CONSTANTS',
        function ($uibModal, $window, mainSvc, CONSTANTS) {
            var publicFunctions = {
                'showModal': showModal,
                'showPopup': showPopup,
                'showModalWithFile': showModalWithFile
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

            function showModalWithFile(archivo) {
              var openFile = $window.open(archivo, '_blank', 'toolbar=no, menubar=no, resizable=yes');
              openFile.addEventListener('load', function () {
                  URL.revokeObjectURL(archivo);
              }, false);
            };

            function showModal(customModalDefaults, customModalOptions) {
                if (!customModalDefaults) customModalDefaults = {};
                if (!customModalOptions) customModalOptions = {};
                customModalDefaults.backdrop = 'static';
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

                return $uibModal.open(tempModalDefaults).result;
            }

            function showPopup(url, target, options) {
                if (!options) options = 'toolbar=no, menubar=no, resizable=yes';
                if (CONSTANTS.askOpenNewTab && target == '_self') {
                    showModal(undefined, {
                        closeButtonText: 'Misma ventana',
                        actionButtonText: 'Otra ventana',
                        bodyText: 'Lo que seleccionaste es conveniente que se abra en una nueva ventana.' +
                        'Para esto, tienen que estar habilitados los popups en tu navegador. \n' +
                        'Elegí la opción que prefieras:\n',
                        afterClose: function (res) {
                            if (!res) $window.open(url, '_self');
                        }
                    }).then(function (result) {
                        var win = $window.open(url, '_blank');
                        win.focus();
                    });
                }
                else {
                  var win = $window.open(url, ((!!target) ? target : '_blank'));
                  win.focus();
                }
            }

            return publicFunctions;
        }]);

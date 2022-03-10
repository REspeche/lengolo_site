angular.module('mainApp').controller('productFormController', ['$scope', 'actionSvc', 'modalSvc', 'mainSvc', '$rootScope', '$state', '$stateParams', '$translate',
    function ($scope, actionSvc, modalSvc, mainSvc, $rootScope, $state, $stateParams, $translate) {
        $scope.paramAction = '';
        $scope.menId = 0;
        $scope.catId = 0;
        $scope.proId = 0;
        $scope.loadForm = false;
        $scope.formData = {
          menId: 0,
          catId: 0,
          name: '',
          excerpt: '',
          price: 0,
          manyPrices: '',
          enable: 1,
          addOtherProduct: false,
          type: 1,
          delivery: 1,
          image: undefined
        };
        $scope.imageNew = undefined;
        $scope.editForm = false;
        $scope.lstMenus = [];
        $scope.lstCategories = [];
        $scope.formDataCategory = {};
        $scope.smallVersion = false;
        $scope.manyPrices = undefined;

        $scope.loadFormProduct = function() {
          $scope.paramAction = $stateParams.action;
          $scope.menId = $stateParams.menId;
          $scope.catId = $stateParams.catId;
          $scope.proId = $stateParams.proId;
          $scope.formData.menId = parseInt($scope.menId);
          $scope.formData.catId = parseInt($scope.catId);

          $translate.onReady(function() {
            $scope.msgInvalid = $translate.instant('MSG_INVALID_INPUT');
            $scope.firstValue = [
              {id: 0, label: $translate.instant('LBL_CHOOSE') + '...'}
            ];
          });

          /* Load combos */
          mainSvc.callService({
            url: 'common/getListMenus'
          }).then(function (response) {
            $scope.lstMenus = angular.copy(response);
            if ($scope.paramAction=="new") {
              $scope.lstMenus.forEach(function(item) {
                item.selected = ($scope.menId==item.id)?true:false;
              });
            }

            mainSvc.callService({
              url: 'common/getlistcategories',
              params: {
                'catIdParent': -1
              }
            }).then(function (response) {
              $scope.lstCategories = $scope.firstValue.concat(angular.copy(response));
              $scope.selectCategory(true);
            });
          });

          /* Load Data */
          if ($scope.paramAction=="edit" && $scope.proId) {
            mainSvc.callService({
                url: 'product/getproduct',
                params: {
                  'menId': $scope.menId,
                  'catId': $scope.catId,
                  'proId': $scope.proId
                }
            }).then(function (response) {
              $scope.formData = response[0];
              var arrMenues = new String($scope.formData.menId).split(',');
              if (arrMenues.length>0) {
                $scope.lstMenus.forEach(function(item) {
                  item.selected = (arrMenues.find(function(element) {
                    return parseInt(element) == item.id;
                  }))?true:false;
                });
              };
              $scope.loadForm = true;
            });
          }
          else {
            $scope.loadForm = true;
          }
        }

        $scope.selectCategory = function(_y) {
          $state.go('.', {
            menId: $scope.menId, 
            catId: $scope.formData.catId
          }, {notify: false});
          
          let index = $scope.lstCategories.findIndex( record => record.id == $scope.formData.catId );
          $scope.manyPrices = ($scope.lstCategories[index].manyPrices)?$scope.lstCategories[index].manyPrices:null;

          if (!_y) $scope.isEditingForm();
        }

        $scope.clickRemove = function() {
          modalSvc.showModal({
            size: 'sm'
          },{
            closeButtonText: $translate.instant('BTN_NO'),
            actionButtonText: $translate.instant('BTN_YES'),
            bodyText: $translate.instant('MSG_REMOVE_PRODUCT', { name: $scope.formData.name})
          }).then(function (result) {
            mainSvc.callService({
                url: 'product/removeproduct',
                params: {
                  'usrId' : $rootScope.userInfo.id,
                  'menId' : $scope.menId,
                  'catId' : $scope.catId,
                  'proId' : $scope.proId
                }
            }).then(function (response) {
              $rootScope.showRefresh = true;
              actionSvc.goToAction(11);
              mainSvc.showAlertByCode(4);
            });
          });
        };

        $scope.isEditingForm = function () {
            if (!$scope.editForm) $scope.editForm = true;
        }

        $scope.submitForm = function() {
          if (!$scope.frmProduct.$invalid) {
            $('#frmProduct').removeClass('was-validated');
            //Validations
            if (
              !$scope.formData.name || 
              $scope.formData.catId==0 ||
              (
                ($scope.manyPrices && !$scope.formData.manyPrices)
              )
              ) {
              mainSvc.showAlertByCode(101);
              return false;
            }
            var menSelected = [];
            $scope.lstMenus.forEach(function(item) {
              if (item.selected) {
                menSelected.push(item.id);
              }
            });
            if (menSelected.length==0) {
              mainSvc.showAlertByCode(209);
              return false;
            }
            else {
              $scope.formData.menId = menSelected;
            }

            //Ajax send
            var filesUpload = [];
            if ($scope.imageNew) filesUpload.push($scope.imageNew);
            mainSvc.callService({
                url: 'product/insertUpdateProduct',
                params: Object.assign({}, {
                  'usrId': $rootScope.userInfo.id,
                  'proId': ($scope.paramAction=='new')?0:$scope.proId
                }, $scope.formData),
                data: {
                  files: filesUpload
                }
            }).then(function (response) {
              if (response.code==0) {
                $rootScope.showRefresh = true;
                if ($scope.formData.addOtherProduct) {
                  let formData = angular.copy($scope.formData);
                  $scope.formData = {
                    menId: formData.menId,
                    catId: formData.catId,
                    name: '',
                    excerpt: '',
                    price: 0,
                    enable: 1,
                    addOtherProduct: true,
                    type: 1,
                    delivery: 1
                  };
                  mainSvc.showAlertByCode(107);
                }
                else {
                  mainSvc.showAlertByCode(1);
                  actionSvc.goToAction(11);
                }
              }
              else {
                mainSvc.showAlertByCode(response.code);
              }
            });
          }
          else {
            $('#frmProduct').addClass('was-validated');
            $scope.invalidForm = true;
            mainSvc.showAlertByCode(103);
          }
        }

        $scope.clickCancelForm = function() {
          if ($scope.editForm) {
            modalSvc.showModal({
              size: 'sm'
            },{
              closeButtonText: $translate.instant('BTN_NO'),
              actionButtonText: $translate.instant('BTN_YES'),
              bodyText: $translate.instant('MSG_CANCEL_ACTION')
            }).then(function (result) {
              actionSvc.goToAction(11); //list products
            });
          }
          else {
            actionSvc.goToAction(11); //list products
          }
        }

        $scope.viewSmallVersion = function() {
          $scope.smallVersion = !$scope.smallVersion;
        }

        $scope.focusPrice = function() {
          if ($scope.formData.price==0) $scope.formData.price='';
        }

        $scope.blurPrice = function() {
          if ($scope.formData.price=='') $scope.formData.price=0;
        }

        $scope.calculatePrice = function(item) {
          let price = item.price;
          if (item.manyPrices) {
            let manyP='';
            angular.forEach(item.manyPrices.split('|'), function(i, k){
              if (manyP!='') manyP+='|';
              manyP+=Math.round(i * item.rate);
            });
            return manyP;
          }
          return Math.round(item.price * item.rate);
        }
    }]);

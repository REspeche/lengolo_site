angular.module('mainApp').controller('categoryFormController', ['$scope', 'actionSvc', 'modalSvc', 'mainSvc', '$rootScope', '$stateParams', '$translate', '$cookies',
    function ($scope, actionSvc, modalSvc, mainSvc, $rootScope, $stateParams, $translate, $cookies) {
        $scope.paramAction = '';
        $scope.paramId = 0;
        $scope.loadForm = false;
        $scope.formData = {
          name: '',
          excerpt: '',
          enable: 1,
          manyPrices: '',
          catIdParent: 0,
          backColor: 'ffffff',
          fontColor: 1
        };
        $scope.lstCategories = [];
        $scope.lstBreadcrumbs = [];
        $scope.editForm = false;
        $scope.lstFontColor = [
          {'id': 1, 'label': 'Oscuro'},
          {'id': 2, 'label': 'Claro'}
        ];

        $scope.loadFormCategory = function() {
          $scope.paramAction = $stateParams.action;
          $scope.paramId = $stateParams.id;
          if (localStorage.getItem("categories_lstBreadcrumbs")) $scope.lstBreadcrumbs = JSON.parse(localStorage.getItem("categories_lstBreadcrumbs"));

          $translate.onReady(function() {
            $scope.msgInvalid = $translate.instant('MSG_INVALID_INPUT');
            if ($scope.lstBreadcrumbs.length==0) {
              $scope.firstValue = [
                {id: 0, label: $translate.instant('LBL_ROOT') + '...'}
              ];

              /* Load combos */
              mainSvc.callService({
                url: 'common/getlistcategories',
                params: {
                  'catIdParent': ($scope.lstBreadcrumbs.length==0)?0:$scope.lstBreadcrumbs[$scope.lstBreadcrumbs.length-1].id
                }
              }).then(function (response) {
                $scope.lstCategories = $scope.firstValue.concat(angular.copy(response));
              });
            }
            else {
              let lastItem = $scope.lstBreadcrumbs[$scope.lstBreadcrumbs.length-1];
              $scope.lstCategories.push({id: lastItem.id, label: lastItem.name});
              $scope.formData.catIdParent = lastItem.id;
            }
          });

          /* Load Data */
          if ($scope.paramAction=="edit" && $scope.paramId) {
            mainSvc.callService({
                url: 'category/getcategory',
                params: {
                  'catId': $scope.paramId
                }
            }).then(function (response) {
              $scope.formData = response[0];
              $scope.formData.backColorValue = '#'+$scope.formData.backColor;
              $scope.loadForm = true;
            });
          }
          else {
            $scope.formData.backColorValue = '#FFFFFF';
            $scope.loadForm = true;
          };
        }

        $scope.clickRemove = function() {
          modalSvc.showModal({
            size: 'sm'
          },{
            closeButtonText: $translate.instant('BTN_NO'),
            actionButtonText: $translate.instant('BTN_YES'),
            bodyText: $translate.instant('MSG_REMOVE_ACTION', { name: $scope.formData.name})
          }).then(function (result) {
            mainSvc.callService({
                url: 'category/removecategory',
                params: {
                  'usrId': $rootScope.userInfo.id,
                  'catId': $scope.paramId
                }
            }).then(function (response) {
              $rootScope.showRefresh = true;
              $cookies.remove("LENGOLO_CATEGORY_LST");
              actionSvc.goToAction(10); //list categories
              mainSvc.showAlertByCode(4);
            });
          });
        };

        $scope.isEditingForm = function () {
            if (!$scope.editForm) $scope.editForm = true;
        }

        $scope.submitForm = function() {
          if (!$scope.frmCategory.$invalid) {
            $('#frmCategory').removeClass('was-validated');
            //select color
            $scope.formData.backColor = $scope.formData.backColorValue.replace('#','');
            //Ajax send
            mainSvc.callService({
                url: ($scope.paramAction=='new')?'category/insertcategory':'category/updatecategory',
                params: Object.assign({}, {
                  'usrId': $rootScope.userInfo.id,
                  'catId': ($scope.paramAction=='new')?0:$scope.paramId
                }, $scope.formData)
            }).then(function (response) {
              if (response.code==0) {
                $rootScope.showRefresh = true;
                $cookies.remove("LENGOLO_CATEGORY_LST");
                actionSvc.goToAction(10); //list categories
                mainSvc.showAlertByCode(1);
              }
              else {
                mainSvc.showAlertByCode(response[0].code);
              }
            });
          }
          else {
            $('#frmCategory').addClass('was-validated');
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
              actionSvc.goToAction(10); //list categories
            });
          }
          else {
            actionSvc.goToAction(10); //list categories
          }
        }

    }]);

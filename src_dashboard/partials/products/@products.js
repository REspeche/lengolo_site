angular.module('mainApp').controller('productsController', ['$scope', 'mainSvc', 'actionSvc', '$rootScope', '$translate', 'modalSvc', '$state', '$stateParams', '$q', '$timeout', '$cookies',
    function ($scope, mainSvc, actionSvc, $rootScope, $translate, modalSvc, $state, $stateParams, $q, $timeout, $cookies) {

        $scope.lstProducts = [];
        $scope.loadList = false;
        $scope.lstMenus = [];
        $scope.lstCategories = [];
        $scope.menIdSelect = 0;
        $scope.catIdSelect = 0;
        $scope.menId = 0;
        $scope.catId = 0;

        $scope.loadProducts = function() {
          $scope.menId = ($stateParams.menu)?parseInt($stateParams.menu):0;
          $scope.catId = ($stateParams.category)?parseInt($stateParams.category):0;

          $translate.onReady(function() {
            $scope.firstValueAll = [
              {id: 0, label: $translate.instant('LBL_ALL')}
            ];
            $scope.firstValueSelect = [
              {id: 0, label: $translate.instant('LBL_SELECT')+'...'}
            ];

            /* Load Filter Combo */
            var lstMen = $cookies.get("LENGOLO_MENU_LST");
            var lstCat = $cookies.get("LENGOLO_CATEGORY_LST");
            if (lstMen) $scope.lstMenus = angular.fromJson(lstMen);
            if (lstCat) $scope.lstCategories = angular.fromJson(lstCat);

            if ($scope.lstMenus.length==0) {
              mainSvc.callService({
                url: 'common/getListMenus'
              }).then(function (response) {
                $scope.lstMenus = $scope.firstValueAll.concat(angular.copy(response));
                $cookies.put("LENGOLO_MENU_LST", angular.toJson($scope.lstMenus));
              });
            };
            if ($scope.lstCategories.length==0) {
                /* Load categories */
                mainSvc.callService({
                  url: 'common/getListCategories',
                  params: {
                    'catIdParent': -1
                  }
                }).then(function (response) {
                  $scope.lstCategories = $scope.firstValueAll.concat(angular.copy(response));
                  $cookies.put("LENGOLO_CATEGORY_LST", angular.toJson($scope.lstCategories));
                });              
            }
            /* select combos */
            var cookieMen = $cookies.get("LENGOLO_MENU");
            var cookieCat = $cookies.get("LENGOLO_CATEGORY");
            $scope.menIdSelect = (!$scope.menId)?((cookieMen)?parseInt(cookieMen):0):$scope.menId;
            $scope.catIdSelect = (!$scope.catId)?((cookieCat)?parseInt(cookieCat):0):$scope.catId;
            //get products
            $scope.getProducts();

          });

        };

        $scope.selectMenu = function() {
          $scope.getProducts();
        }

        $scope.selectCategory = function() {
          $scope.getProducts();
        }

        $scope.getProducts = function() {
          $scope.lstProducts = [];
          $scope.loadList = false;
          $state.go('.', {
            menu: $scope.menIdSelect, 
            category: $scope.catIdSelect
          }, {notify: false});
          $cookies.put("LENGOLO_MENU", $scope.menIdSelect);
          $cookies.put("LENGOLO_CATEGORY", $scope.catIdSelect);
          
          mainSvc.callService({
            url: 'product/getproducts',
            params: {
              'menId': $scope.menIdSelect,
              'catId': $scope.catIdSelect
            }
          }).then(function (response) {
            let ret = angular.copy(response);
            if (ret.length>0) {
              let itemsC = [];
              let items = [];
              let lastItem = ret[0];
              angular.forEach(ret, function(item, key) {
                if (lastItem.menId!=item.menId || lastItem.catId!=item.catId) {
                  itemsC.push({
                    catId: lastItem.catId,
                    category: lastItem.category,
                    data: angular.copy(items),
                    enable: lastItem.catEnable
                  });
                  if (lastItem.menId!=item.menId) {
                    $scope.lstProducts.push({
                      menId: lastItem.menId,
                      menu: lastItem.menu,
                      data: angular.copy(itemsC)
                    });
                    itemsC = [];
                  }
                  items = [];
                  lastItem = item;
                };
                item.action = 0;
                item.editPrice = false;
                items.push(item);
              });
              if (items) {
                itemsC.push({
                  catId: lastItem.catId,
                  category: lastItem.category,
                  data: angular.copy(items),
                  enable: lastItem.catEnable
                });
                $scope.lstProducts.push({
                  menId: lastItem.menId,
                  menu: lastItem.menu,
                  data: angular.copy(itemsC)
                });
              };
            }
            $scope.loadList = true;
          });
        }

        $scope.clickNew = function () {
          actionSvc.goToAction(11.1, { 
            menId: $scope.menIdSelect, 
            catId: $scope.catIdSelect, 
            proId: 0, 
            action: 'new'
          }); //new product
        }

        $scope.clickEdit = function(itemP) {
          actionSvc.goToAction(11.1, {
            menId: itemP.menId, 
            catId: itemP.catId, 
            proId: itemP.id, 
            action: 'edit'
          }); //edit product
        }

        $scope.clickNewCategory = function() {
          modalSvc.showModal({
            templateUrl: '/templates/modals/modalNewCategory.html'
          },
          {
              closeButtonText: undefined,
              formDataCategory: {
                name: ''
              },
              defer: true,
              beforeClose: function (scope) {
                var defered = $q.defer();
                var promise = defered.promise;

                if (!scope.frmCategory.$invalid) {
                  $('#frmCategory').removeClass('was-validated');
                  let nameCat = scope.modalOptions.formDataCategory.name;
                  mainSvc.callService({
                      url: 'category/insertcategory',
                      params: {
                        'usrId': $rootScope.userInfo.id,
                        'catId': 0,
                        'name': nameCat,
                        'excerpt': '',
                        'enable': 1
                      }
                  }).then(function (response) {
                    if (response.code==0) {
                      $cookies.remove("LENGOLO_CATEGORY_LST");
                      $scope.lstCategories.push({
                        id: response.id,
                        label: nameCat
                      });
                      $scope.catIdSelect = response.id;
                      $scope.lstProducts = [];
                      mainSvc.showAlertByCode(1);
                      defered.resolve(true);
                    }
                    else {
                      mainSvc.showAlertByCode(103);
                      defered.resolve(false);    
                    }
                  });
                }
                else {
                  $('#frmCategory').addClass('was-validated');
                  scope.invalidForm = true;
                  mainSvc.showAlertByCode(103);
                  defered.resolve(false);
                };
                return promise;
              }
          });
        }

        $scope.clickRemove = function(itemC,itemP) {
          modalSvc.showModal({
            size: 'sm'
          },{
            closeButtonText: $translate.instant('BTN_NO'),
            actionButtonText: $translate.instant('BTN_YES'),
            bodyText: $translate.instant('MSG_REMOVE_PRODUCT', { name: itemP.name})
          }).then(function (result) {
            mainSvc.callService({
                url: 'product/removeProduct',
                params: {
                  'usrId' : $rootScope.userInfo.id,
                  'menId' : itemP.menId,
                  'catId' : itemP.catId,
                  'proId' : itemP.id
                }
            }).then(function (response) {
              $rootScope.showRefresh = true;
              let index = itemC.data.findIndex( record => record.id == itemP.id );
              itemC.data.splice(index, 1);
              mainSvc.showAlertByCode(4);
            });
          });
        }

        $scope.activeProduct = function(item) {
          mainSvc.callService({
              url: 'product/activeProduct',
              params: {
                'usrId'  : $rootScope.userInfo.id,
                'menId'  : item.menId,
                'catId'  : item.catId,
                'proId'  : item.id
              }
          }).then(function (response) {
            $rootScope.showRefresh = true;
            item.enable = (item.enable==1)?0:1;
            mainSvc.showAlertByCode(1);
          });
        };

        $scope.deliveryProduct = function(item) {
          mainSvc.callService({
              url: 'product/deliveryProduct',
              params: {
                'usrId'  : $rootScope.userInfo.id,
                'menId'  : item.menId,
                'catId'  : item.catId,
                'proId'  : item.id
              }
          }).then(function (response) {
            $rootScope.showRefresh = true;
            item.delivery = (item.delivery==1)?0:1;
            mainSvc.showAlertByCode(1);
          });
        };

        $scope.goProducts = function(menId, catId) {
          $cookies.put("LENGOLO_MENU", menId);
          $cookies.put("LENGOLO_CATEGORY", catId);
          actionSvc.goToAction(11, { menu: menId, category : catId })
        };

        $scope.editPrice = function(item) {
          item.oldPrice = item.price;
          item.editPrice = true;
        };

        $scope.savePrice = function(itemP) {
          mainSvc.callService({
            url: 'product/changePrice',
            params: {
              'usrId'  : $rootScope.userInfo.id,
              'menId'  : itemP.menId,
              'catId'  : itemP.catId,
              'proId'  : itemP.id,
              'price'  : itemP.price
            }
          }).then(function (response) {
            $rootScope.showRefresh = true;
            itemP.oldPrice = null;
            angular.forEach($scope.lstProducts, function(itemM, keyM) {
              angular.forEach(itemM.data, function(itemC, keyC) {
                angular.forEach(itemC.data, function(itemP2, key) {
                  if (itemP2 && itemP2.id==itemP.id) {
                    itemP2.price = itemP.price;
                  };
                });
              });
            });
            mainSvc.showAlertByCode(1);
          });
          itemP.editPrice = false;
        };

        $scope.cancelPrice = function(item) {
          item.price = item.oldPrice;
          item.oldPrice = null;
          item.editPrice = false;
        };

        $scope.changePosition = function() {
          angular.forEach($scope.lstProducts, function(itemM, keyM) {
            angular.forEach(itemM.data, function(itemC, keyC) {
              angular.forEach(itemC.data, function(itemP, key) {
                if (itemP && itemP.action && itemP.action==1) {
  
                  $timeout(function(){
                    mainSvc.callService({
                      url: 'product/changeOrder',
                      params: {
                        'usrId'  : $rootScope.userInfo.id,
                        'menId'  : itemM.menId,
                        'catId'  : itemC.catId,
                        'proId'  : itemP.id,
                        'jump'  : itemP.jumpPosition
                      }
                    }).then(function (response) {
                      $rootScope.showRefresh = true;
                      $scope.getProducts();
                    });
                  },1000);
                  
                };
              });
            });
          });
        };

        $scope.calculatePrice = function(item) {
          let price = item.price;
          if (price.indexOf('|')>-1) {
            let manyP='';
            angular.forEach(price.split('|'), function(i, k){
              if (manyP!='') manyP+='|';
              manyP+=Math.round(i * item.rate);
            });
            return manyP;
          }
          return Math.round(item.price * item.rate);
        }

    }]);

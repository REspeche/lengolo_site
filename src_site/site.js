mainApp.controller('siteController', [ '$scope', 'mainSvc', 'BASE_URL', '$location', '$cookies', 'COOKIES', 'modalSvc', '$q', '$window',
  function ($scope, mainSvc, BASE_URL, $location, $cookies, COOKIES, modalSvc, $q, $window) {
    var socket = io(BASE_URL.socket);
    var useCDN = true;
    var isNavCategoriesVisible = false;
    var timerHideNav = null;
    var timerSec = 3000;
    var posVerticalNav = 50;
    var clickRigthSide = false;
    var fileCss = undefined;
    var fileLanguage = undefined;

    $scope.pathProfile = (!useCDN)?BASE_URL.api + '/v1/common/viewFile?type=profile&size=small&file=':BASE_URL.cdn + '/profiles/small/';
    $scope.pathProduct = (!useCDN)?BASE_URL.api + '/v1/common/viewFile?type=product&size=small&file=':BASE_URL.cdn + '/products/small/';
    $scope.pathCss = BASE_URL.api + '/v1/common/viewFile?type=css&file=';
    $scope.pathLanguage = BASE_URL.api + '/v1/common/viewFile?type=language&file=';
    $scope.restaurant = {};
    $scope.paramCode = undefined;
    $scope.paramMenu = undefined;
    $scope.lstItems = [];
    $scope.lstMessages = [];
    $scope.canPrint = false;
    $scope.limit = 2; // initial value for limit
    $scope.jsonLanguage = undefined;
    // socket to refresh -- variables
    $scope.tokenRestaurant = '';
    // delivery -- variables
    $scope.itemsToOrder = [];
    $scope.showDelivery = false;
    $scope.viewDetail = false;
    $scope.arrSizes = [];
    $scope.itemSelectSize = undefined;
    // user login data -- variables
    $scope.isLogin = false;
    $scope.dataClient = {};
    // search
    $scope.viewSearchInput = false;
    $scope.txtSearch = "";
    // order -- variables
    $scope.dataOrder = {};
    $scope.dataDetailOrder = [];
    // covid19
    $scope.verifyCovid19 = false;
    $scope.shouldBeViewFormN86 = false;
    $scope.showFormN86 = false;
    $scope.formN86 = {
      group: '1',
      email: '',
      name: '',
      dni: '',
      address: '',
      q1: 0,
      q2: 0,
      q3: 0,
      q4: 0,
      q5: 0,
      q6: 0,
      restaurant: []
    };
    //debug
    $scope.isDebug = false;
    $scope.outLogDebug = "";

    $scope.loadSite = function() {
      var locSearch = $location.search();
      if ( locSearch.hasOwnProperty('debug') ) {
        if ((locSearch['debug']==1)) {
          let dataClient = $scope.getCookie(COOKIES.files.covid19, {});
          $scope.outLogDebug = dataClient;
          $scope.isDebug = true;
          $(document).ready(function() {
            closeLoader();
          });
        };
      };
      if ( locSearch.hasOwnProperty('delivery') ) {
        $scope.showDelivery = (locSearch['delivery']==1)?true:false;
      };
      if ( locSearch.hasOwnProperty('print') ) {
        $scope.canPrint = (locSearch['print']==1)?true:false;
      };
      if ( locSearch.hasOwnProperty('menu') ) {
        $scope.paramMenu = parseInt(locSearch['menu']);
      }

      // get querystring params
      $scope.paramCode = window.location.pathname.replace('/','').substring(0,8);

      if (!$scope.isDebug && $scope.paramCode) {
        /* open socket for updates */
        socket.on('refresh_'+$scope.paramCode, function(value){
          if (value==1) $scope.refreshMenu();
        });

        /* Load Menu */
        mainSvc.callService({
          url: 'menu/getMenuSite',
          params: {
            'code': $scope.paramCode,
            'menu': ($scope.paramMenu)?$scope.paramMenu:0,
            'delivery': ($scope.showDelivery)?1:0,
            'refresh': 0,
          },
          secured: false
        }).then(function (response) {
          $scope.processResponseData(response);
        });
      }
      else {
        $(document).ready(function() {
          closeLoader();
        });
      }

      // document is ready
      $(document).ready(function() {
        $("a[href='#top']").click(function() {
          isNavCategoriesVisible = true;
          $("html, body").animate({ scrollTop: 0 }, "slow", function() {
            setTimeout(function() {
              isNavCategoriesVisible = false;
            }, 500);
          });
          return false;
        });

        $(window).scroll(function() {
          // sticky Bar
          var navbar = document.getElementById("navbar");
          if (navbar) {
            var sticky = navbar.offsetTop;
            window.onscroll = function() {
              if (window.pageYOffset >= sticky && window.pageYOffset>0) {
                navbar.classList.add("sticky")
              } else {
                navbar.classList.remove("sticky");
              }
            };
          }

          // categories Nav
          let visButton = $("a.scrollToTop").hasClass("animateRight");
          if ($(document).scrollTop()>100) {
            if (!visButton) $("a.scrollToTop").addClass("animateRight");
          }
          else {
            if (visButton) $("a.scrollToTop").removeClass("animateRight");
          }
          if (clickRigthSide && $(".scroll-categories").length>0) {
            if (!isNavCategoriesVisible) {
              timerSec = 2000;
              $(".scroll-categories").addClass("visible");
              isNavCategoriesVisible = true;
              Waypoint.refreshAll();
            }
            else {
              if($(window).scrollTop() <= 50) {
                $(".category-label").removeClass("selected");
                $(".category-label:first-child").addClass("selected");
              }
              else {
                if($(window).scrollTop() + $(window).height() >= $(document).height() - 50) {
                  $(".category-label").removeClass("selected");
                  $(".category-label:last-child").addClass("selected");
                }
              }
              if ($(".scroll-categories").height()<$(".scroll-categories ul").height()) {
                var perTop = (window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop) * 100 / $("#main").height();
                perTop = Math.floor(perTop/10) * 10;
                if (perTop <= 10) perTop = 0;
                if (perTop >= 90) perTop = 100;
                posVerticalNav = perTop;
                setVerticalPosNav();
              }
              else {
                if (posVerticalNav!=50) {
                  posVerticalNav = 50;
                  setVerticalPosNav();
                }
              }
            }
            if (timerHideNav) {
              clearTimeout(timerHideNav);
              timerHideNav = null;
            };
            timerHideNav = setTimeout(function() {
              closeNav();
            }, timerSec);
          }
        });

        var menuElement = document.getElementById('main');
        var mc = new Hammer(menuElement);
        mc.on("panup pandown", function(ev) {
          if (!clickRigthSide) {
            clickRigthSide = (($(window).outerWidth() - 100) <= ev.center.x)?true:false;
          }
        });
      });
      // -- document ready
    };

    $scope.loadMore = function (last, inview) {
      if (last && inview) {
          $scope.limit = $scope.lstItems.length;
      };
    };

    $scope.refreshMenu = function() {
      mainSvc.callService({
        url: 'menu/getMenuSite',
        params: {
          'code': $scope.paramCode,
          'menu': ($scope.paramMenu)?$scope.paramMenu:0,
          'delivery': ($scope.showDelivery)?1:0,
          'refresh': 1
        },
        secured: false
      }).then(function (response) {
        $scope.processResponseData(response);
      });
    };

    $scope.processResponseData = function(response) {
      $scope.restaurant = angular.copy(response.header);
      if ($scope.restaurant) $scope.processHeaderRestaurant();
      else {
        /* Load restaurant header */
        mainSvc.callService({
          url: 'profile/getHeaderRestaurant',
          params: {
            'code': $scope.paramCode
          },
          secured: false
        }).then(function (response) {
          $scope.restaurant = angular.copy(response);
          $scope.processHeaderRestaurant();
        });
      }
      if (response.token) $scope.tokenRestaurant = angular.copy(response.token);
      else $scope.tokenRestaurant = '';
      //menu items (with translations)
      if (response.menu) {
        const userLocale =
              navigator.languages && navigator.languages.length
                ? navigator.languages[0]
                : navigator.language;
        let lang = userLocale.split('-')[0];
        $scope.lstItems = angular.copy(response.menu);
        //load translate items menu
        if ($scope.restaurant.multiLanguage==1 && !$scope.jsonLanguage && lang!='es') {
          $scope.jsonLanguage = [];
          fileLanguage = $scope.pathLanguage + $scope.restaurant.menId + '_' + lang + '.json';
          $.when($.get(fileLanguage))
          .done(function(languageTraslated) {
            $scope.jsonLanguage = angular.copy(languageTraslated);
            angular.forEach($scope.jsonLanguage, function(item, key) {
              let objC = item.id.split('.');
              let charType = objC[0].substring(0,1);
              let _id = objC[0].replace(charType,'');
              let objNode = undefined;
              switch (charType) {
                case 'c':
                  objNode = $scope.lstItems.find(x => x.catId == _id);
                  break;
                case 'p':
                  angular.forEach($scope.lstItems, function(cObj, cIdx) {
                    if (!objNode) objNode = cObj.data.find(x => x.id == _id);
                  });
                  break;
              };
              if (objNode) {
                switch (objC[1]) {
                  case '1':
                    if (charType=='p') objNode.name = item.value;
                    else objNode.category = item.value;
                    break;
                  case '2':
                    objNode.excerpt = item.value;
                    break;
                };
              };
            });
          });
        };
      }
      else $scope.lstItems = [];

      //Messages
      if (response.messages) $scope.lstMessages = angular.copy(response.messages);
      else $scope.lstMessages = [];
    };

    $scope.processHeaderRestaurant = function() {
      let timeNow = getTimeNowInMinutes();
      if (!($scope.restaurant.timeMenuS<timeNow && $scope.restaurant.timeMenusE>timeNow) || $scope.restaurant.canDelivery==0) {
        $scope.showDelivery = false;
        $scope.restaurant.canDelivery=0;
      };
      if ($scope.restaurant.website && $scope.restaurant.website.indexOf('http')<0) $scope.restaurant.website = 'http://' + $scope.restaurant.website;

      if ($scope.showDelivery) {
        $scope.getLoginData();
        $scope.itemsToOrder = $scope.getCookie(COOKIES.files.order, []);
      };

      if ($scope.paramMenu>0 && $scope.restaurant.multipleQR==0) {
        let objQS = {};
        if ($scope.showDelivery) objQS['delivery'] = 1;
        if ($scope.canPrint) objQS['print'] = 1;
        setQuery(objQS);
      };

      if ($scope.restaurant.name && $scope.restaurant.name.indexOf('-')>-1) {
        let arrName = $scope.restaurant.name.split('-');
        $scope.restaurant.name = arrName[0];
        $scope.restaurant.subname = arrName[1];
      };

      if ($scope.lstItems.length==0) closeLoader();
    };

    /* Custom functions on js */

    var setVerticalPosNav = function () {
      $(".scroll-categories ul").css({
        "top": posVerticalNav+"%",
        "-ms-transform": "translateY(-"+posVerticalNav+"%)",
        "transform": "translateY(-"+posVerticalNav+"%)"
      });
    };

    var closeLoader = function () {
      if ($scope.lstItems) {
        if ($scope.lstItems.length==0) {
          $("#img-empty").attr("src","/assets/img/wrong-code.jpg");
        }
        else {
          if (!$('body').hasClass('enable-scroll')) $('body').addClass('enable-scroll');
          if ($(".scroll-categories").length>0) {
            if ($(".scroll-categories").height()<$(".scroll-categories ul").height()) posVerticalNav = 0;
            setVerticalPosNav();
            $('.category-title.wp-trigger').waypoint(function () {
              let id = $(this.element).data("id");
              $(".category-label").removeClass("selected");
              $("#label-cat-"+id).addClass("selected");
            }, { offset: '15%' });
          }
        }
      }
      if (!$scope.verifyCovid19 && !$scope.canPrint && $scope.restaurant && $scope.restaurant.covid19==1) {
        $scope.verifyCovid19 = true;
        let dataClient = $scope.getCookie(COOKIES.files.covid19, {});
        if (dataClient) {
          if (dataClient.email) {
            if (dataClient.restaurant) {
              let found = false;
              angular.forEach(dataClient.restaurant, function(item, key) {
                if (item.indexOf($scope.paramCode)==0) {
                  found = true;
                  var oneDay = parseInt(item.split('|')[1]) + (24 * 60 * 60 * 1000);
                  if (oneDay > new Date().getTime()) $scope.shouldBeViewFormN86 = false;
                  else $scope.shouldBeViewFormN86 = true;
                }
              });
              if (!found) $scope.shouldBeViewFormN86 = true;
            }
            else {
              dataClient.restaurant = [];
              $scope.shouldBeViewFormN86 = true;
            }
            if ($scope.shouldBeViewFormN86) {
              dataClient.group = '1';
              dataClient.q1 = 0;
              dataClient.q2 = 0;
              dataClient.q3 = 0;
              dataClient.q4 = 0;
              dataClient.q5 = 0;
              dataClient.q6 = 0;
              $scope.formN86 = angular.copy(dataClient);
            }
          }
          else {
            $scope.shouldBeViewFormN86 = true;
          }
        }
        else {
          $scope.shouldBeViewFormN86 = true;
        }
      };
      if ($scope.restaurant && $scope.restaurant.ownStyle==1) {
        //load custom styles
        if ( $('#customStyle').length==0 && !fileCss) {
          fileCss = $scope.pathCss + $scope.paramCode + '_' + $scope.restaurant.menId + '.css';
          $.when($.get(fileCss))
          .done(function(contentFile) {
            $('#customStyle').remove();
            $('<style />').attr('id', 'customStyle').text(contentFile).appendTo($('head'));
            if ($("#load_screen").length==1) $("#load_screen").remove();
          });
        };
      }
      else {
        $('#customStyle').remove();
        if ($("#load_screen").length==1) $("#load_screen").remove();
      };
    };

    var closeNav = function() {
      $(".scroll-categories").removeClass("visible");
      isNavCategoriesVisible = false;
      clickRigthSide = false;
    };

    $scope.hideNav = function() {
      if (timerHideNav) {
        clearTimeout(timerHideNav);
        timerHideNav = null;
        if ($(".scroll-categories").length>0) {
          closeNav();
        }
      };
    };

    $scope.goToCategory = function(id) {
      let nameTitle = "#category-title-" + id;
      let posY = $(nameTitle).offset().top - 60;
      if (posY < 100) posY=0;
      $('html, body').animate({
          scrollTop: posY
      }, "fast");
      timerSec = 200;
    };

    $scope.isLoadCat = function(id) {
      let nameTitle = "#category-title-" + id;
      return $(nameTitle).length>0;
    };

    $scope.scrollToTop = function() {
      $('html, body').animate({
          scrollTop: 0
      }, "fast");
    };

    $scope.finishRender = function () {
      initializeTooltips();
      closeLoader();
    };

    $scope.changeType = function() {
      $scope.showDelivery = !$scope.showDelivery;
      setQuery(($scope.showDelivery)?{
        'delivery': 1
      }:{});
      $scope.refreshMenu();
    };

    // delivery -- functions
    $scope.addItem = function(itemC, itemP) {
      if (itemP.price && new String(itemP.price).indexOf('|')>-1) {
        $scope.arrSizes = [];
        $scope.itemSelectSize = angular.copy(itemP);
        let _arrNames = new String(itemC.colSizes).split('|');
        let _arrSizes = new String(itemP.price).split('|');
        for (var y=0; y<_arrSizes.length; y++) {
          let itemSize = {
            'id': y,
            'label': _arrSizes[y] + ' (' + _arrNames[y] + ')',
            'price': Number(_arrSizes[y]),
            'size': _arrNames[y]
          };
          $scope.arrSizes.push(itemSize);
        }

        // open modal
        modalSvc.showModal({
            templateUrl: '/templates/modals/modalSelectSize.html'
        },
        {
            itemSelectSize: $scope.itemSelectSize,
            arrSizes: $scope.arrSizes,
            selectSize: $scope.arrSizes[0],
            beforeClose: function (scope) {
              $scope.itemSelectSize.price = scope.modalOptions.selectSize.price;
              $scope.itemSelectSize.size = scope.modalOptions.selectSize.size;
              $scope.addItem(null, angular.copy($scope.itemSelectSize));
              return true;
            }
        });
      }
      else {
        let index = $scope.itemsToOrder.findIndex( record => (record.id == itemP.id && record.size == itemP.size) );
        if (index>=0) {
          $scope.itemsToOrder[index].quantity+=1;
          $scope.itemsToOrder[index].price+=itemP.price;
        }
        else {
          $scope.viewDetail = false;
          var addItem = angular.copy(itemP);
          addItem.quantity=1;
          addItem.priceUnit = itemP.price;
          $scope.itemsToOrder.push(addItem);
        }
        $scope.setCookie(COOKIES.files.order, $scope.itemsToOrder, 1);
      }
    };

    $scope.setStorage = function(nameStorage, data) {
      let _nameStorage = nameStorage.toString().format($scope.paramCode);
      let _data = angular.copy(data);
      if (supports_html5_storage()) {
        localStorage.setItem(_nameStorage, angular.toJson(_data));
      };
    };

    $scope.getStorage = function(nameStorage, retEmptyValue) {
      let _nameStorage = nameStorage.toString().format($scope.paramCode);
      if (supports_html5_storage()) {
        let storageStr = localStorage.getItem(_nameStorage);
        if (storageStr) {
          return angular.fromJson(storageStr);
        }
      };
      return retEmptyValue;
    };

    $scope.setCookie = function(nameCookie, data, daysToExpire) {
      let _nameCookie = nameCookie.toString().format($scope.paramCode);
      let _data = angular.copy(data);
      var expireDate = new Date();
      expireDate.setDate(expireDate.getDate() + daysToExpire); //n day
      $cookies.put(_nameCookie, angular.toJson(_data), (expireDate)?{'expires': expireDate}:{});
    };

    $scope.getCookie = function(nameCookie, retEmptyValue) {
      let _nameCookie = nameCookie.toString().format($scope.paramCode);
      var cookieStr = $cookies.get(_nameCookie);
      if (cookieStr) {
        cookieStr = decodeURIComponent(cookieStr.replace(/\+/g, '%20'));
        return angular.fromJson(cookieStr);
      }
      return retEmptyValue;
    };

    $scope.removeItem = function(item) {
      let index = $scope.itemsToOrder.findIndex( record => record.id == item.id );
      if (index>=0) {
        if ($scope.itemsToOrder[index].quantity>1) {
          $scope.itemsToOrder[index].quantity-=1;
          $scope.itemsToOrder[index].price-=item.priceUnit;
        }
        else {
          $scope.itemsToOrder.splice(index,1);
        }
        $scope.setCookie(COOKIES.files.order, $scope.itemsToOrder, 1);
      }
    };

    $scope.sumQuantityItems = function() {
      var qty = 0;
      angular.forEach($scope.itemsToOrder, function(item, key) {
        qty += item.quantity;
      });
      return qty;
    };

    $scope.sumPriceItems = function() {
      var total = 0;
      if ($scope.lstItems.length>0) {
        angular.forEach($scope.itemsToOrder, function(item, key) {
          total += item.price;
        });
        if ($scope.restaurant && $scope.restaurant.type==1) total += $scope.restaurant.costShipping;
      }
      return total;
    };

    $scope.showHideDetails = function() {
      $scope.viewDetail = ($scope.viewDetail)?false:true;
    };

    $scope.clickFinishOrder = function() {
      if (!$scope.isLogin && $scope.restaurant.type==3) {
        mainSvc.showAlert().notifyWarning('Antes de realizar un pedido, debe autentificarse');
        $scope.login(true);
      }
      else {
        if ($scope.dataOrder && $scope.dataOrder.status<3) {
          mainSvc.showAlert().notifyWarning('No puede realizar un pedido hasta que finalice el anterior');
        }
        else {
          modalSvc.showModal({
              templateUrl: '/templates/modals/modalMakeOrder.html'
          },
          {
            defer: true,
            formData: {
              type: $scope.restaurant.type,
              comment: '',
              room: 0,
              table: 1
            },
            dataClient: $scope.dataClient,
            changeData: function(_mo) {
              if (typeof _mo.close=='function') _mo.close();
              $scope.changeDataUser();
            },
            infoLength: function(txt) {
              let size1 = 200 - ((txt)?txt.length:0);
              return new String('Máximo 200 caracteres. Quedan {0} por ingresar.').format(size1);
            },
            beforeClose: function (scope) {
              var defered = $q.defer();
              var promise = defered.promise;

              let newArrItemsToOrder = [];
              angular.forEach($scope.itemsToOrder, function(item, key) {
                newArrItemsToOrder.push({
                  'id': item.id,
                  'price': item.price,
                  'quantity': item.quantity,
                  'priceUnit': item.priceUnit
                });
              });
              mainSvc.callService({
                url: 'order/makeOrderDelivery',
                params: {
                  'code': $scope.paramCode,
                  'hash': $scope.dataClient.hash,
                  'orderJson': angular.toJson(newArrItemsToOrder),
                  'address': $scope.dataClient.address,
                  'zip': $scope.dataClient.zip,
                  'total': $scope.sumPriceItems(),
                  'comment': scope.modalOptions.formData.comment,
                  'room': (scope.modalOptions.formData.type==2)?scope.modalOptions.formData.room:scope.modalOptions.formData.table
                },
                secured: false
              }).then(function (response) {
                if (response.code==0) {
                  $scope.itemsToOrder = [];
                  $scope.getOrder();
                  $scope.setCookie(COOKIES.files.order, $scope.itemsToOrder, 1);

                  if ($scope.restaurant.type==1) {
                    let _data = {
                      id: response.id,
                      name: response.name,
                      hash: response.hash
                    };
                    var expireDate = new Date();
                    expireDate.setFullYear(expireDate.getFullYear() + 1); //1 year
                    $cookies.put(COOKIES.files.client, angular.toJson(_data), (expireDate)?{'expires': expireDate}:{});
                    $scope.getLoginData();
                  }

                  mainSvc.showAlert().notifySuccess('El pedido fue realizado satisfactoriamente!');
                  defered.resolve(true);
                }
                else {
                  mainSvc.showAlert().notifyError('Hubo un problema para crear el pedido. Por favor comuníquese con el restaurante.');
                  defered.resolve(false);
                }
              });

              return promise;
            }
          });
        }
      }
    };

    // user login data -- functions
    $scope.getLoginData = function() {
      var cookieStr = $cookies.get(COOKIES.files.client);
      if (cookieStr) {
        cookieStr = decodeURIComponent(cookieStr.replace(/\+/g, '%20'));
        $scope.dataClient = angular.fromJson(cookieStr);
        if ($scope.dataClient && $scope.dataClient.hash) {
          $scope.isLogin = true;
          $scope.getOrder();
        }
      }
    };

    $scope.getOrder = function() {
      mainSvc.callService({
        url: 'order/getOrderClient',
        params: {
          'code': $scope.paramCode,
          'hash': $scope.dataClient.hash
        },
        secured: false
      }).then(function (response) {
        $scope.dataOrder = angular.copy(response);
        if ($scope.dataOrder && $scope.dataOrder.id) {
          socket.on('refresh_'+$scope.paramCode+'-'+$scope.dataClient.hash, function(value){
            $scope.$apply(
              function() {
                let objOrder = angular.fromJson(value);
                $scope.dataOrder.status = objOrder.status;
              }
            );
          });
        }
        else {
          socket.off('refresh_'+$scope.paramCode+'-'+$scope.dataClient.hash);
        }

      });
    };

    $scope.getDetailOrder = function() {
      mainSvc.callService({
        url: 'order/getDetailOrderClient',
        params: {
          'code': $scope.paramCode,
          'hash': $scope.dataClient.hash
        },
        secured: false
      }).then(function (response) {
        $scope.dataDetailOrder = angular.copy(response);
        // open modal
        modalSvc.showModal({
            templateUrl: '/templates/modals/modalDetailOrder.html'
        },
        {
            arrItems: $scope.dataDetailOrder,
            dataOrder: $scope.dataOrder,
            cancelOrder: function(_mo) {
              let item = _mo.dataOrder;
              modalSvc.showModal({
                size: 'sm'
              },{
                closeButtonText: "No",
                actionButtonText: "Si",
                bodyText: "Está seguro que desea continuar con esta acción?"
              }).then(function (result) {
                mainSvc.callService({
                  url: 'order/cancelOrder',
                  params: {
                    'code': $scope.paramCode,
                    'hash': $scope.dataClient.hash,
                    'ordId': item.id
                  },
                  secured: false
                }).then(function (response) {
                  if (response.code==0) {
                    $scope.dataOrder.status = 5;
                    mainSvc.showAlert().notifySuccess('Su orden fue cancelada!');
                    _mo.close();
                  }
                  else {
                    mainSvc.showAlert().notifyWarning('No hemos podido cancelar la orden. Por favor, comuníquese con el restaurante.');
                  }

                });
              });
            }
        });
      });
    };

    $scope.closeSession = function(_mo) {
      modalSvc.showModal({
        size: 'sm'
      },{
        closeButtonText: "No",
        actionButtonText: "Si",
        bodyText: "Está seguro que desea cerrar su sesión?"
      }).then(function (result) {
        $cookies.remove(COOKIES.files.client);
        $scope.dataOrder = {};
        $scope.isLogin = false;
        if (typeof _mo.close=='function') _mo.close();
      });
    };

    $scope.login = function(continueOrder) {
      // open modal
      modalSvc.showModal({
          templateUrl: '/templates/modals/modalLogin.html'
      },
      {
          defer: true,
          formData: {
            type: $scope.restaurant.type,
            notUser: false,
            email: '',
            name: '',
            phone: '',
            address: '',
            zip: ''
          },
          beforeClose: function (scope) {
            var defered = $q.defer();
            var promise = defered.promise;

            if (scope.modalOptions.formData.email) {
              mainSvc.callService({
                  url: 'auth/signupclient',
                  params: {
                    'code': $scope.paramCode,
                    'email': scope.modalOptions.formData.email,
                    'name': scope.modalOptions.formData.name,
                    'phone': scope.modalOptions.formData.phone,
                    'address': scope.modalOptions.formData.address,
                    'zip': scope.modalOptions.formData.zip
                  },
                  secured: false
              }).then(function (response) {
                if (response.code==0) {
                  if (response.hash) {
                    let _data = angular.copy(response);
                    var expireDate = new Date();
                    expireDate.setFullYear(expireDate.getFullYear() + 1); //1 year
                    $cookies.put(COOKIES.files.client, angular.toJson(_data), (expireDate)?{'expires': expireDate}:{});
                    $scope.getLoginData();
                    defered.resolve(true);
                    if (continueOrder) {
                      $scope.clickFinishOrder();
                    }
                  }
                  else {
                    defered.resolve(false);
                    mainSvc.showAlert().notifyError('Hubo un error en el registro');
                  }
                }
                else {
                  if (response.code==210) {
                    scope.modalOptions.formData.notUser = true;
                    defered.resolve(false);
                    mainSvc.showAlert().notifyWarning(response.message);
                  }
                }
              });
            }
            else {
              defered.resolve(false);
              mainSvc.showAlert().notifyInfo('Ingrese una cuenta de correo para continuar');
            }


            return promise;
          }
      });
    };

    $scope.changeDataUser = function(continueOrder) {
      // open modal
      modalSvc.showModal({
          templateUrl: '/templates/modals/modalLogin.html'
      },
      {
          defer: true,
          formData: {
            type: $scope.restaurant.type,
            notUser: true,
            email: $scope.dataClient.email,
            name: $scope.dataClient.name,
            phone: $scope.dataClient.phone,
            address: $scope.dataClient.address,
            zip: $scope.dataClient.zip,
            isLogin: true
          },
          closeSession: $scope.closeSession,
          beforeClose: function (scope) {
            var defered = $q.defer();
            var promise = defered.promise;

            if (
              $scope.dataClient.name!=scope.modalOptions.formData.name ||
              $scope.dataClient.phone!=scope.modalOptions.formData.phone ||
              ($scope.restaurant.type==1 && $scope.dataClient.address!=scope.modalOptions.formData.address) ||
              ($scope.restaurant.type==1 && $scope.dataClient.zip!=scope.modalOptions.formData.zip)
            ) {
              mainSvc.callService({
                url: 'auth/changeDataClient',
                params: {
                  'code': $scope.paramCode,
                  'email': scope.modalOptions.formData.email,
                  'name': scope.modalOptions.formData.name,
                  'phone': scope.modalOptions.formData.phone,
                  'address': scope.modalOptions.formData.address,
                  'zip': scope.modalOptions.formData.zip
                },
                secured: false
            }).then(function (response) {
                if (response.code==0) {
                  if (response.hash) {
                    let _data = angular.copy(response);
                    var expireDate = new Date();
                    expireDate.setFullYear(expireDate.getFullYear() + 1); //1 year
                    $cookies.put(COOKIES.files.client, angular.toJson(_data), (expireDate)?{'expires': expireDate}:{});
                    $scope.getLoginData();
                    defered.resolve(true);
                  }
                  else {
                    defered.resolve(false);
                    mainSvc.showAlert().notifyError('Hubo un error en el cambio');
                  }
                }
                else {
                  if (response.code==211) {
                    defered.resolve(false);
                    mainSvc.showAlert().notifyWarning(response.message);
                  }
                }
              });
            }
            else {
              defered.resolve(true);
            }

            return promise;
          }
      });
    };

    $scope.viewImagePreview = function(itemP) {
      // open modal
      modalSvc.showModal({
          templateUrl: '/templates/modals/modalShowPreviewImage.html'
      },
      {
          'itemP': itemP,
          'path': $scope.pathProduct,
          defer: false
      });
    };

    $scope.clickLogo = function(rest) {
      if (rest.website) {
        $window.open(rest.website, '_blank');
      }
    };

    $scope.showFind = function() {
      $scope.viewSearchInput = !$scope.viewSearchInput;
      if (!$scope.viewSearchInput) {
        $scope.txtSearch = "";
      }
      else {
        if ($scope.limit<$scope.lstItems.length) $scope.limit = $scope.lstItems.length;
        $("input.inputSearch").focus();
      }
    };

    $scope.groupHasProducts = function(itemC) {
      if (!$scope.txtSearch) return true;
      var hasPro = 0;
      var hasCat = 0;
      var hasPro_SC = 0;
      //filter first level products
      angular.forEach(itemC.data, function(itemP, key) {
        if (removeAccents(itemP.name.toLowerCase()).indexOf(removeAccents($scope.txtSearch.toLowerCase()))>-1 || removeAccents(itemP.excerpt.toLowerCase()).indexOf(removeAccents($scope.txtSearch.toLowerCase()))>-1) hasPro++;
      });
      //filter sub levels products
      angular.forEach(itemC.childs, function(itemSB, key) {
        hasPro_SC = 0;
        angular.forEach(itemSB.data, function(itemP, key) {
          if (removeAccents(itemP.name.toLowerCase()).indexOf(removeAccents($scope.txtSearch.toLowerCase()))>-1 || removeAccents(itemP.excerpt.toLowerCase()).indexOf(removeAccents($scope.txtSearch.toLowerCase()))>-1) hasPro_SC++;
        });
        if (hasPro_SC>0) hasCat++;
      });

      return (hasCat==0 && hasPro==0 && hasPro_SC==0)?false:true;
    };

    $scope.highlightText = function(text) {
      if (!$scope.txtSearch) return text;
      var pos = removeAccents(text.toLowerCase()).indexOf(removeAccents($scope.txtSearch.toLowerCase()));
      return (pos>-1)?text.substring(0,pos) +  '<span class="highlight">' + text.substring(pos,(pos+$scope.txtSearch.length)) + '</span>' + text.substring((pos+$scope.txtSearch.length), text.length):text;
    };

    $scope.ignoreAccents = function(item) {
      if (!$scope.txtSearch) return true;
      return removeAccents(item.name.toLowerCase()).indexOf(removeAccents($scope.txtSearch.toLowerCase())) > -1 || removeAccents(item.excerpt.toLowerCase()).indexOf(removeAccents($scope.txtSearch.toLowerCase())) > -1;
    };

    // form N86

    $scope.confirmFormN86 = function() {
      if (
        $scope.formN86.group == '0'
      ) {
        mainSvc.showAlert().notifyWarning('Cuantas personas integran el grupo?');
        return false;
      }
      if (
        $scope.formN86.email == ''
        || $scope.formN86.name == ''
        || $scope.formN86.dni == ''
        || $scope.formN86.address == ''
      ) {
        mainSvc.showAlert().notifyWarning('Debe completar los campos marcados con un asterisco para continuar');
        return false;
      }
      // ok form
      mainSvc.callService({
          url: 'client/saveFormN86',
          params: Object.assign({}, {
            'code': $scope.paramCode
          }, $scope.formN86),
          secured: false
      }).then(function (response) {
          if (response.code==0) {
            mainSvc.showAlert().notifySuccess('Gracias por su colaboración!');
            if ($scope.formN86.restaurant && typeof $scope.formN86.restaurant == 'object') {
              let found = false;
              angular.forEach($scope.formN86.restaurant, function(item, key) {
                if (item.indexOf($scope.paramCode)==0) {
                  found = true;
                  item = $scope.paramCode + '|' + new Date().getTime();
                }
              });
              if (!found) $scope.formN86.restaurant.push($scope.paramCode + '|' + new Date().getTime());
            }
            else {
              $scope.formN86.restaurant = [];
              $scope.formN86.restaurant.push($scope.paramCode + '|' + new Date().getTime());
            }
            let newObjSave = {
              "email":$scope.formN86.email,
              "name":$scope.formN86.name,
              "dni":$scope.formN86.dni,
              "address":$scope.formN86.address,
              "restaurant": $scope.formN86.restaurant
            }
            $scope.setCookie(COOKIES.files.covid19, newObjSave, 365);
            $scope.shouldBeViewFormN86 = false;
            $scope.showFormN86 = false;
            $scope.scrollToTop();
          }
          else {
            mainSvc.showAlert().notifyWarning('Hubo un error en el guardado de los datos. Por favor comuniquese con el mozo para solucionar el problema.');
          }
        });
    };

    $scope.wantToShowFormN86 = function() {
      $scope.showFormN86 = !$scope.showFormN86;
    }

  }
]);

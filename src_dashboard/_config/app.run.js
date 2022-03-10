mainApp.run(['$rootScope', 'authenticationSvc', '$state', 'alertSvc', 'mainSvc', '$location', '$timeout', '$translate', 'settingSvc', 'metaTagsSvc',
    function ($rootScope, authenticationSvc, $state, alertSvc, mainSvc, $location, $timeout, $translate, settingSvc, metaTagsSvc) {
        //init vars
        $rootScope.isDashboard = true;
        $rootScope.isBusy = false;
        $rootScope.viewChangeLanguage = true;

        $rootScope.$on( '$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {
          if(toState.access && toState.access.isFree) return; // no need to redirect
          $rootScope.isBusy = true;
          $rootScope.viewChangeLanguage = true;
          // now, redirect only not authenticated
          if(!authenticationSvc.getUserInfo().isLogin) {
              if (authenticationSvc.verifyLogin()) {
                //autentificarse
                if (authenticationSvc.login(true).isLogin) {
                  //llama al servicio de alertas
                  alertSvc.getAlerts();
                }
              }
              else {
                e.preventDefault(); // stop current execution
                authenticationSvc.logout();
                $state.go('login'); // go to login
              }
          }
          else {
            //llama al servicio de alertas si es que nunca lo llamo
            if (!$rootScope.alerts.pull) alertSvc.getAlerts();
          };
          //llama al servicio de configuracion si es que nunca lo llamo
          if (!$rootScope.settings || !$rootScope.settings.pull) {
            settingSvc.getSettings().then(function () {
              $translate.onReady(function() {
                metaTagsSvc.setDefaultTags({
                  // General SEO
                  'title': $translate.instant('TITLE') + ' - ' + $translate.instant('SUBTITLE') + ' v.' + versionBuild,
                  'version': versionBuild,
                  'dc.language': $rootScope.lang,
                  // Indexing / Spiders
                  'googlebot': 'index, follow',
                  'bingbot': 'index, follow',
                  'robots': 'index, follow'
                });
              });
            });
          }
        });

        $rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams) {
          document.body.scrollTop = document.documentElement.scrollTop = 0;
          /*
          $(document).ready(function () {
              // Material Select Initialization
              $timeout(function () {
                initializeTooltips();
              }, 500);
          });
          */
          $rootScope.isBusy = false;
        });

        // is mobile
        $rootScope.isMobile = {
            Android: function () {
                return navigator.userAgent.match(/Android/i);
            },
            BlackBerry: function () {
                return navigator.userAgent.match(/BlackBerry/i);
            },
            iOS: function () {
                return navigator.userAgent.match(/iPhone|iPad|iPod/i);
            },
            Opera: function () {
                return navigator.userAgent.match(/Opera Mini/i);
            },
            Windows: function () {
                return navigator.userAgent.match(/IEMobile/i);
            },
            any: function () {
                return ($rootScope.isMobile.Android() || $rootScope.isMobile.BlackBerry() || $rootScope.isMobile.iOS() || $rootScope.isMobile.Opera() || $rootScope.isMobile.Windows());
            }
        };

        $rootScope.alerts = {
          pull: false,
          existeOtax: true,
          cantTrmReq: 0,
          cantNotifDfeNvas: 0,
          situacion: '',
          adherido: false
        };

        //language
        $rootScope.lang = $translate.proposedLanguage() || $translate.use();

        $rootScope.default_float = 'left';
        $rootScope.opposite_float = 'right';

        $rootScope.default_direction = 'ltr';
        $rootScope.opposite_direction = 'rtl';

        $rootScope.$on('$translateChangeSuccess', function (event, data) {
            var language = data.language;

            $rootScope.lang = language;

            $rootScope.default_direction = language === 'es' ? 'rtl' : 'ltr';
            $rootScope.opposite_direction = language === 'es' ? 'ltr' : 'rtl';

            $rootScope.default_float = language === 'es' ? 'right' : 'left';
            $rootScope.opposite_float = language === 'es' ? 'left' : 'right';
        });

    }]);

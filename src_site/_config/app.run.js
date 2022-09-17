mainApp.run(['$rootScope', '$translate',
    function ($rootScope, $translate) {
        //init vars
        $rootScope.isBusy = false;

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

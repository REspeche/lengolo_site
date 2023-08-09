mainApp.config(['$cookiesProvider', 'COOKIES',
  function($cookiesProvider, COOKIES) {
    // Set $cookies defaults
    $cookiesProvider.defaults.domain = COOKIES.domain;
  }
]);

mainApp.config(['$qProvider', '$locationProvider',
  function($qProvider, $locationProvider) {
    $qProvider.errorOnUnhandledRejections(false);

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
  }
]);

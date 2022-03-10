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

mainApp.config(['$translateProvider',
  function($translateProvider) {
    $translateProvider
      .registerAvailableLanguageKeys(['es'], {
        'es_*': 'es'
      })
      .useStaticFilesLoader({
        files: [
          {
              prefix: '/translations/general-',
              suffix: '.json'
          },
          {
              prefix: '/translations/locate-',
              suffix: '.json'
          }
        ]
      })
      .preferredLanguage('es')
      .use('es')
      .useLocalStorage()
      .useSanitizeValueStrategy('sanitizeParameters');
  }
]);

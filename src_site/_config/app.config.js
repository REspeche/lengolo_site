mainApp.config(['$cookiesProvider', 'COOKIES',
  function($cookiesProvider, COOKIES) {
    // Set $cookies defaults
    $cookiesProvider.defaults.domain = COOKIES.domain;
  }
]);

mainApp.config( [ '$locationProvider', function( $locationProvider ) {
    // In order to get the query string from the
    // $location object, it must be in HTML5 mode.
    $locationProvider.html5Mode( true );
 }
]);
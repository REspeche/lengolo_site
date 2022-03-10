mainApp.controller('dashboardController', [ '$scope', '$rootScope', '$location', 'actionSvc',
      function ($scope, $rootScope, $location, actionSvc) {
        var skinPage = 'deep-purple-skin';
        $scope.bodyClasses = 'fixed-sn '+skinPage;
        $rootScope.itemRoute = '';

        $scope.loadDashboard = function() {
          /* Scroll top */
          $('html, body').animate({
              scrollTop:0
          });

          var arrRoutes = $location.url().split('?')[0].split('/');
          $rootScope.itemRoute = arrRoutes[arrRoutes.length-1];

          $scope.$on('$viewContentLoaded', function() {
            if ($("#load_screen").length==1) {
              $("#load_screen").delay(1000).fadeOut(function () {
                  $('body').addClass('enable-scroll');
                  $("#load_screen").remove();
              });
            }
          });
        };

        $scope.loadSideNav = function() {
          var container = document.querySelector('.custom-scrollbar');
          var ps = new PerfectScrollbar(container, {
            wheelSpeed: 2,
            wheelPropagation: true,
            minScrollbarLength: 20
          });
          $('ul.collapsible li').on('click', 'a.link-menu', function () {
            if ($('.button-collapse').is(":visible")) {
              $('#sidenav-overlay').remove();
              $('#slide-out').attr('style','display: block; transform: translateX(-100%);');
            }
          });
        }

        $scope.clickSite = function() {
           actionSvc.goToAction(1); //site
        }

        $scope.clickItemMenu = function(action) {
            actionSvc.goToAction(action);
        };

        // this'll be called on every state change in the app
        $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
            if (toState.data && angular.isDefined(toState.data.bodyClasses)) {
                $scope.bodyClasses = toState.data.bodyClasses;
                return;
            }
            $scope.bodyClasses = 'fixed-sn '+skinPage;
        });
      }
    ]);

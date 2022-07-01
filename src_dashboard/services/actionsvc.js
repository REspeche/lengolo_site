mainApp.factory('actionSvc', ['$state', '$rootScope',
		function ($state, $rootScope) {
			var _publicFunctions = {
				'goToAction': goToAction,
				'goToExternal': goToExternal,
				'goToNewTab': goToNewTab,
				'getURL': getURL,
				'goToDashboard': goToDashboard,
				'goToSite': goToSite,
				'reload': reload
			};

			function getURL(action) {
				var retRoute = '';
				switch (action) {
					case 1: retRoute = 'panel'; break;
					case 2: retRoute = 'login'; break;
					case 2.1: retRoute = "login?endSession=1"; break;
          			case 2.2: retRoute = "login?endToken=1"; break;
					case 3: retRoute = 'error-login'; break;
					case 4: retRoute = 'sign-up'; break;
					case 5: retRoute = 'forgot'; break;
					case 6: retRoute = 'setting/profile'; break;
					case 7: retRoute = 'setting/account'; break;
					case 8: retRoute = 'alerts'; break;
					case 9: retRoute = 'contact'; break;
					case 10: retRoute = 'categories'; break;
					case 10.1: retRoute = 'categories/form'; break;
					case 11: retRoute = 'products'; break;
					case 11.1: retRoute = 'products/form'; break;
					case 12: retRoute = 'menus'; break;
					case 12.1: retRoute = 'menus/form'; break;
					case 13: retRoute = 'code/showqr'; break;
					case 14: retRoute = 'code/getqr'; break;
					case 15: retRoute = 'code/shipping'; break;
					case 16: retRoute = 'members'; break;
					case 16.1: retRoute = 'members/form'; break;
					case 17: retRoute = 'orders'; break;
					case 18: retRoute = 'setting/general'; break;
					case 19: retRoute = 'forms/N86'; break;
					case 20: retRoute = 'messages'; break;
					case 20.1: retRoute = 'messages/form'; break;
					case 21: retRoute = 'menus/language'; break;

					case 101: retRoute = ''; break;
				}
				var arrRoutes = retRoute.split('/');
				$rootScope.itemRoute = arrRoutes[arrRoutes.length-1];
				return retRoute;
			};

			function goToAction(action, param) {
				if (!param) $state.go(getURL(action));
				else $state.go(getURL(action), param);
			};

			function goToExternal(action) {
				$state.go('redirect-external', {
					page: getURL(action)
				});
			};

			function goToNewTab(action, param) {
				$state.goNewTab(getURL(action), (param)?param:{});
			};

			function goToDashboard(action, param, newTab) {
				$state.goDashboard(getURL(action), (param)?param:{}, (newTab)?true:false);
			};

			function goToSite(action, param, newTab) {
				$state.goSite(getURL(action), (param)?param:{}, (newTab)?true:false);
			};

			function reload() {
				$state.reload();
			}

			return _publicFunctions;
		}
	]);

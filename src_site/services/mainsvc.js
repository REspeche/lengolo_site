mainApp.factory('mainSvc', ['BASE_URL', '$rootScope', '$http', '$q',
		function (BASE_URL, $rootScope, $http, $q,) {

			var _paramSvc = {
				path: '',
				version: 1,
				url: '',
				params: {},
				data: undefined,
				method: 'post',
				secured: BASE_URL.secured, //[true:default]
				concatURL: true,
				isFileResponse: false,
				showMessage: true
			};

			toastr.options = {
				"closeButton": true,
				"positionClass": "toast-top-left",
				"preventDuplicates": true
			};

			var _publicFunctions = {
				'callService': callService,
				'showAlert': showAlert
			};

			function runCallService(paramReq) {
				var defered = $q.defer();
				var promise = defered.promise;
				var headers = (paramReq.secured && $rootScope.userInfo) ? {
					'Content-Type': (paramReq.data) ? undefined : 'application/json',
					'x-access-token': $rootScope.userInfo.token
				} : {
					'Content-Type': (paramReq.data) ? undefined : 'application/json'
				};
				$rootScope.isBusy = true;
				$http({
					'url': paramReq.path + paramReq.url,
					'method': paramReq.method,
					'params': (!paramReq.params.usrId && $rootScope.userInfo)?Object.assign({}, {'usrId':$rootScope.userInfo.id}, paramReq.params):paramReq.params,
					'data': paramReq.data,
					'headers': headers,
					'cache': false,
					'encoding': null,
					'transformRequest': (paramReq.data)?function (data, headersGetter) {
					    var formData = undefined;
							if (data) {
								formData = new FormData();
								if (data.fields) {
									angular.forEach(data.fields, function(item, key){
										formData.append(key, item);
									});
								}
								if (data.files && data.files.length > 0) {
									for (var i = 0; i < data.files.length; i++) {
										formData.append("files[" + i + "]", data.files[i]);
									}
								}
								if (data.gallery && data.gallery.length > 0) {
									for (var i = 0; i < data.gallery.length; i++) {
										formData.append("gallery[" + i + "]", data.gallery[i]);
									}
								}
							}
					    return formData;
					}:angular.identity
				}).then(function (response) {
					var processMesage = function(response) {
						var status = (response.data.code)?parseInt(response.data.code):0;
						if (status > 0 && status < 400) { // 1 and 399
							return (status >= 300 && status < 400) ? false : true; //error
						};
					}
					$rootScope.isBusy = false;
					if (response.status == 200) {
						if (paramReq.isFileResponse) defered.resolve(response.data);
						else {
							if (response.data.code > 0) {
								if (processMesage(response)) defered.resolve(response.data.data);
								else defered.reject(response.data.data);
							} else defered.resolve(response.data.data);
						}
					} else {
						defered.reject(undefined);
					}
				}).catch(function (err) {
					$rootScope.isBusy = false;
					defered.reject(undefined);
				});
				return promise;
			}

			//Public Functions
			function callService(paramSvc) {
				var version = '';
				var p = Object.assign({}, _paramSvc, paramSvc);
				if (p.version!='') version = '/v' + p.version;
				if (p.concatURL) p.path = changeProtocolSSL(BASE_URL.api) + version + '/' + ((p.secured) ? 'secured/' : '');
				return runCallService(p);
			}

			// Alerts
			function showAlert() {
				toastr.clear();
				return {
					notifySuccess: function (msg) {
						if (msg) toastr.success(msg);
					},
					notifyError: function (msg) {
						if (msg) toastr.error(msg);
					},
					notifyWarning: function (msg) {
						if (msg) toastr.warning(msg);
					},
					notifyInfo: function (msg) {
						if (msg) toastr.info(msg);
					}
				};
			}

			return _publicFunctions;
		}
	]);

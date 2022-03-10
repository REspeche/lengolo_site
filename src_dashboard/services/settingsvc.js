mainApp.factory('settingSvc', ['mainSvc', '$rootScope', '$q', 'BASE_URL', '$cookies', 'COOKIES',
  function (mainSvc, $rootScope, $q, BASE_URL, $cookies, COOKIES) {
      var _defered = $q.defer();
      var _promise = undefined;
      var _publicFunctions = {
        getSettings: getSettings,
        setSettings: setSettings
      };

      var _data = {
        pull: false,
        emailNoReply: '',
        emailAdmin: '',
        autoApprove: 2,
        captcha: 2,
        emailVerification: 2,
        projectsShow: 0,
        fileSize: 0,
        minProject: 0,
        maxProject: 0,
        minDonation: 0,
        maxDonation: 0,
        currencyCode: '',
        paymentGateway: 0,
        paypalAccount: '',
        paypalSandbox: 1,
        stripeSecret: '',
        stripePublishable: ''
      };

      function getSettings() {
        if (!!$cookies.get(COOKIES.files.settings)) {
          var cookieStr = decodeURIComponent($cookies.get(COOKIES.files.settings).replace(/\+/g, '%20'));
          var cookieObjMain = angular.fromJson(cookieStr);
          var cookieObjLogin = undefined;
          if (!!$cookies.get(COOKIES.files.settings)) {
            cookieStr = decodeURIComponent($cookies.get(COOKIES.files.settings).replace(/\+/g, '%20'));
            cookieObjLogin = angular.fromJson(cookieStr);
          }
          _data = {
              pull: true,
              emailNoReply: cookieObjMain.emailNoReply,
              emailAdmin: cookieObjMain.emailAdmin,
              autoApprove: cookieObjMain.autoApprove,
              captcha: cookieObjMain.captcha,
              emailVerification: cookieObjMain.emailVerification,
              projectsShow: cookieObjMain.projectsShow,
              fileSize: cookieObjMain.fileSize,
              minProject: cookieObjMain.minProject,
              maxProject: cookieObjMain.maxProject,
              minDonation: cookieObjMain.minDonation,
              maxDonation: cookieObjMain.maxDonation,
              currencyCode: cookieObjMain.currencyCode,
              paymentGateway: cookieObjMain.paymentGateway,
              paypalAccount: cookieObjMain.paypalAccount,
              paypalSandbox: cookieObjMain.paypalSandbox,
              stripeSecret: cookieObjMain.stripeSecret,
              stripePublishable: cookieObjMain.stripePublishable
          };
          $rootScope.settings = _data;
          _defered.resolve(_data);
          return _defered.promise;
        }
        else {
          if (!_promise && !_data.pull) {
            _promise = _defered.promise;
            //llama al servicio de alertas
            mainSvc.callService({
              url: 'common/getSettings',
              secured: false
            }).then(function (response) {
              _data = {
                pull: true,
                emailNoReply: response.emailNoReply,
                emailAdmin: response.emailAdmin,
                autoApprove: response.autoApprove,
                captcha: response.captcha,
                emailVerification: response.emailVerification,
                projectsShow: response.projectsShow,
                fileSize: response.fileSize,
                minProject: response.minProject,
                maxProject: response.maxProject,
                minDonation: response.minDonation,
                maxDonation: response.maxDonation,
                currencyCode: response.currencyCode,
                paymentGateway: response.paymentGateway,
                paypalAccount: response.paypalAccount,
                paypalSandbox: response.paypalSandbox,
                stripeSecret: response.stripeSecret,
                stripePublishable: response.stripePublishable
              };
              var expireDate = new Date();
              expireDate.setHours(expireDate.getHours() + 24);
              $cookies.put(COOKIES.files.settings, angular.toJson(_data), {'expires': expireDate});
              $rootScope.settings = _data;
              _defered.resolve(_data);
            }).catch(function(err) {
              _defered.reject(_data);
            });
          }
          else {
            if (_data.pull) _defered.resolve(_data);
          }
        }
        return _promise;
      }

      function setSettings(formData) {
        if(!!formData.emailNoReply) $rootScope.settings.emailNoReply = formData.emailNoReply;
        if(!!formData.emailAdmin) $rootScope.settings.emailAdmin = formData.emailAdmin;
        if(!!formData.autoApprove) $rootScope.settings.autoApprove = formData.autoApprove;
        if(!!formData.captcha) $rootScope.settings.captcha = formData.captcha;
        if(!!formData.emailVerification) $rootScope.settings.emailVerification = formData.emailVerification;
        if(!!formData.projectsShow) $rootScope.settings.projectsShow = formData.projectsShow;
        if(!!formData.fileSize) $rootScope.settings.fileSize = formData.fileSize;
        if(!!formData.minProject) $rootScope.settings.minProject = formData.minProject;
        if(!!formData.maxProject) $rootScope.settings.maxProject = formData.maxProject;
        if(!!formData.minDonation) $rootScope.settings.minDonation = formData.minDonation;
        if(!!formData.maxDonation) $rootScope.settings.maxDonation = formData.maxDonation;
        if(!!formData.currencyCode) $rootScope.settings.currencyCode = formData.currencyCode;
        if(!!formData.paymentGateway) $rootScope.settings.paymentGateway = formData.paymentGateway;
        if(!!formData.paypalAccount) $rootScope.settings.paypalAccount = formData.paypalAccount;
        if(!!formData.paypalSandbox) $rootScope.settings.paypalSandbox = formData.paypalSandbox;
        if(!!formData.stripeSecret) $rootScope.settings.stripeSecret = formData.stripeSecret;
        if(!!formData.stripePublishable) $rootScope.settings.stripePublishable = formData.stripePublishable;
      }

      return _publicFunctions;
  }]);

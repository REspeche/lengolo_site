mainApp.constant('BASE_URL', {
    'api': 'http://dashboard.lengolo.com.ar:8080/api',
    'secured': true, //[true:default]
    'dashboard': 'http://dashboard.lengolo.com.ar/',
    'site': 'http://lengolo.com.ar/',
    'menu': 'http://menu.lengolo.com.ar/',
    'socket': 'http://dashboard.lengolo.com.ar:8080',
    'cdn': 'https://incloux-lengolo-cdn.sfo3.cdn.digitaloceanspaces.com'
  })
  .constant('CONSTANTS', {
    'timeout_ajax': 35000, //milliseconds
    'askOpenNewTab': true,
    'regexMail': '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$',
    'maxFileUpload': '10MB',
    'files': {
      'profile': [400, 400],
      'product': [400, 400]
    },
    'meta': {
      'keywords': 'IOT, internet of things, internet de las cosas, internet das coisas, financiacion, financiamento, garage, internet, campañas, campaign, campanhas, software, Kickstarter, Indiegogo, Crowdfunding.'
    },
    'dateExpire': '01/09/2022'
  })
  .constant('COOKIES', {
    'files': {
      'main': 'LENGOLO',
      'settings': 'LENGOLO_SETTINGS',
      'client': 'LENGOLO_CLIENT',
      'order': 'LENGOLO_ORDER_{0}',
      'menu': 'LENGOLO_MENU_{0}',
      'covid19': 'LENGOLO_COVID19'
    },
    'domain': '.lengolo.com.ar'
  })
  .constant('LOGIN', {
    email: '',
    password: ''
  });

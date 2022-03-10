mainApp.constant('BASE_URL', {
    'api': 'http://localhost:3000/api',
    'secured': true, //[true:default]
    'dashboard': 'http://localhost:8080/',
    'site': 'http://localhost/',
    'menu': 'http://localhost/',
    'socket': 'http://localhost:3000',
    'cdn': 'https://cdn.lengolo.com.ar'
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
      'keywords': ''
    }
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
    'domain': 'localhost'
  })
  .constant('LOGIN', {
    email: 'ricardo_espeche@hotmail.com',
    password: 'ricardo123'
  });

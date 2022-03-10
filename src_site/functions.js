/* Default Values */
var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

/* Commons Functions */
function initializeTooltips () {
    if (isMobile.any()) {
        //show
        $('[data-toggle="tooltip"]').on('click',function() {
            $(this).tooltip({
                container: $(this).parent(),
                fontSize: '10px',
                offset: 1
            });
            $(this).trigger('mouseenter');
        });
    }
    else {
        $('[data-toggle="tooltip"]').each(function() {
            $(this).tooltip({
                container: $(this).parent(),
                fontSize: '10px',
                offset: 1
            });
        });   
    };
};

function isHidden() {
    var prop = getHiddenProp();
    if (!prop) return false;

    return document[prop];
}

function getHiddenProp(){
    var prefixes = ['webkit','moz','ms','o'];

    // if 'hidden' is natively supported just return it
    if ('hidden' in document) return 'hidden';

    // otherwise loop over all the known prefixes until we find one
    for (var i = 0; i < prefixes.length; i++){
        if ((prefixes[i] + 'Hidden') in document) 
            return prefixes[i] + 'Hidden';
    }

    // otherwise it's not supported
    return null;
}

function getTimeNowInMinutes() {
    let d = new Date(); // for now
    let hours1 = Math.floor(d.getHours() * 60);
    let minutes1 = d.getMinutes();
    return hours1+minutes1;
}

function setQuery(objParams) {
    var value = '';
    var route = (window.location.href.indexOf('?')>0)?window.location.href.split('?')[0]:window.location.href;
    for (k in objParams) {
      if (objParams.hasOwnProperty(k)) {
        if (value!='') value+='&';
        value+=k+'='+objParams[k];
      }
    }
    if (value!='') {
      value = route+'?'+value;
      window.location.hash = '';
      window.history.pushState(null, null, value);
    }
    else {
      window.history.pushState(null, null, route);
    }
}

function supports_html5_storage() {
    try {
      return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
      return false;
    }
}

function removeAccents(value) {
    return value
        .replace(/á/g, 'a')            
        .replace(/é/g, 'e')
        .replace(/í/g, 'i')
        .replace(/ó/g, 'o')
        .replace(/ú/g, 'u')
        .replace(/Á/g, 'A')            
        .replace(/É/g, 'E')
        .replace(/Í/g, 'I')
        .replace(/Ó/g, 'O')
        .replace(/Ú/g, 'U');
}

/* Prototype functions */
String.prototype.format = function() {
    a = this;
    for (k in arguments) {
      a = a.replace("{" + k + "}", arguments[k])
    }
    return a
}


/* Default Values */
var _datePickerDefault = {
    monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
    weekdaysFull: ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado'],
    showMonthsShort: true,
    labelMonthNext: 'Próximo mes',
    labelMonthPrev: 'Mes anterior',
    labelMonthSelect: 'Seleccione un mes',
    labelYearSelect: 'Seleccione un año',
    selectMonths: true,
    format: 'dd/mm/yyyy',
    formatSubmit: 'dd/mm/yyyy',
    today: '',
    clear: '',
    close: '',
    closeOnSelect: true,
    showWeekdaysFull: false,
    selectYears: 100
};
var _timePickerDefault = {
    autoclose: true,
    donetext: '',
    twelvehour: true
};
var _dataTableDefault = {
    stateSave: true,
    deferRender: true,
    destroy: true
};
var _tinyMCEDefault = {
    selector: 'textarea#txtDescription',
    plugins: [ 'code', 'lists', 'table', 'fullscreen'],
    toolbar: 'undo redo styleselect bold italic alignleft aligncenter alignright image bullist numlist outdent indent code',
    a11y_advanced_options: true,
    mobile: {
      plugins: [ 'autosave', 'lists', 'autolink' ],
      toolbar: [ 'undo', 'bold', 'italic', 'styleselect' ]
    },
    placeholder: 'Type here...',
    skin: 'oxide-dark'
  };
  var _sideNavDefault = {
    edge: 'left', // Choose the horizontal origin
    closeOnClick: false, // Closes side-nav on &lt;a&gt; clicks, useful for Angular/Meteor
    timeDurationOpen: 300, // Time duration open menu
    timeDurationClose: 200, // Time duration open menu
    timeDurationOverlayOpen: 50, // Time duration open overlay
    timeDurationOverlayClose: 200, // Time duration close overlay
    easingOpen: 'easeOutQuad', // Open animation
    easingClose: 'easeOutCubic', // Close animation
    showOverlay: true, // Display overflay
    showCloseButton: false, // Append close button into siednav
    slim: true
  };

/* Commons Functions */
function getHash() {
    var hash = '';
    if (window.location.hash.length > 0) hash = window.location.hash.split('?')[0].substring(1).toLowerCase().replace('/', '');
    return hash;
}
function setHash(value) {
    window.location.hash = '';
    window.history.pushState(null, null, value);
}
function getQueryStringValue(key,defValue) {
    var value = unescape(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + escape(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
    return (value)?value:defValue;
}
function getQueryIntValue(key,defValue) {
    var value = unescape(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + escape(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
    return (value)?parseInt(value):defValue;
}
function getQueryBoolValue(key,defValue) {
    var value = unescape(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + escape(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
    return (value=='true')?true:(value=='false')?false:defValue;
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
function setUrlQuery(urlQ) {
  window.location.hash = '';
  window.history.pushState(null, null, urlQ);
}
function initializeTooltips () {
    $('[data-toggle="tooltip"]').each(function() {
        $(this).tooltip({
            container: $(this).parent(),
            fontSize: '10px',
            offset: 1
        });
    });
};
function DateTimeToDateObj(DATETIME) {
    if (DATETIME == null) return null;
    var date = DATETIME.split("/");
    var d1 = new Date(Number(date[2]), Number(date[1]) - 1, Number(date[0]));
    return d1;
}

function DateTimeToUnixTimestamp(DATETIME) {
    if (DATETIME == null) return null;
    var parts = DATETIME.split(" ");
    var date = parts[0].split("/");
    var time = parts[1].split(":");
    var d1 = new Date(Number(date[2]), Number(date[1]) - 1, Number(date[0]), time[0], time[1]);
    return d1.getTime() / 1000;
}
function DateToUnixTimestamp(DATETIME) {
    if (DATETIME == null) return null;
    var parts = DATETIME.split(" ");
    var date = parts[0].split("/");
    var d1 = new Date(Number(date[2]), Number(date[1]) - 1, Number(date[0]), 0, 0);
    return d1.getTime() / 1000;
}

function UnixTimeStampToDateTime(UNIX_timestamp, obj = false) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    var monthsStr = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    var year = a.getFullYear();
    var date = a.getDate();
    var hour = (a.getHours()<10)?a.getHours()+'0':a.getHours();
    var min = (a.getMinutes()<10)?a.getMinutes()+'0':a.getMinutes();
    var dateReturn = (!obj) ?  date + '/' + months[a.getMonth()] + '/' + year + ' ' + hour + ':' + min : new Date(year, a.getMonth(), date, hour, min);;
    return dateReturn;
}
function UnixTimeStampToDate(UNIX_timestamp, obj = false) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    var monthsStr = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    var year = a.getFullYear();
    var date = a.getDate();
    var dateReturn = (!obj) ?  date + '/' + months[a.getMonth()] + '/' + year: new Date(year, a.getMonth(), date);
    return dateReturn;
}

/* Prototype functions */
String.prototype.format = function() {
  a = this;
  for (k in arguments) {
    a = a.replace("{" + k + "}", arguments[k])
  }
  return a
}
var dateFormat = function () {
    var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
        timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
        timezoneClip = /[^-+\dA-Z]/g,
        pad = function (val, len) {
            val = String(val);
            len = len || 2;
            while (val.length < len) val = "0" + val;
            return val;
        };

    // Regexes and supporting functions are cached through closure
    return function (date, mask, utc) {
        var dF = dateFormat;

        // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
        if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
            mask = date;
            date = undefined;
        }

        // Passing date through Date applies Date.parse, if necessary
        date = date ? new Date(date) : new Date;
        if (isNaN(date)) throw SyntaxError("invalid date");

        mask = String(dF.masks[mask] || mask || dF.masks["default"]);

        // Allow setting the utc argument via the mask
        if (mask.slice(0, 4) == "UTC:") {
            mask = mask.slice(4);
            utc = true;
        }

        var _ = utc ? "getUTC" : "get",
            d = date[_ + "Date"](),
            D = date[_ + "Day"](),
            m = date[_ + "Month"](),
            y = date[_ + "FullYear"](),
            H = date[_ + "Hours"](),
            M = date[_ + "Minutes"](),
            s = date[_ + "Seconds"](),
            L = date[_ + "Milliseconds"](),
            o = utc ? 0 : date.getTimezoneOffset(),
            flags = {
                d:    d,
                dd:   pad(d),
                ddd:  dF.i18n.dayNames[D],
                dddd: dF.i18n.dayNames[D + 7],
                m:    m + 1,
                mm:   pad(m + 1),
                mmm:  dF.i18n.monthNames[m],
                mmmm: dF.i18n.monthNames[m + 12],
                yy:   String(y).slice(2),
                yyyy: y,
                h:    H % 12 || 12,
                hh:   pad(H % 12 || 12),
                H:    H,
                HH:   pad(H),
                M:    M,
                MM:   pad(M),
                s:    s,
                ss:   pad(s),
                l:    pad(L, 3),
                L:    pad(L > 99 ? Math.round(L / 10) : L),
                t:    H < 12 ? "a"  : "p",
                tt:   H < 12 ? "am" : "pm",
                T:    H < 12 ? "A"  : "P",
                TT:   H < 12 ? "AM" : "PM",
                Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
            };

        return mask.replace(token, function ($0) {
            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
        });
    };
}();

// Some common format strings
dateFormat.masks = {
    "default":      "ddd mmm dd yyyy HH:MM:ss",
    shortDate:      "m/d/yy",
    mediumDate:     "mmm d, yyyy",
    longDate:       "mmmm d, yyyy",
    fullDate:       "dddd, mmmm d, yyyy",
    shortTime:      "h:MM TT",
    mediumTime:     "h:MM:ss TT",
    longTime:       "h:MM:ss TT Z",
    isoDate:        "yyyy-mm-dd",
    isoTime:        "HH:MM:ss",
    isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
    isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
    dayNames: [
        "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ],
    monthNames: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
    return dateFormat(this, mask, utc);
};

function isNumberKey(evt){
    var charCode = (evt.which) ? evt.which : evt.keyCode
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
}

function initRangeTime(timeS, timeE, controller) {

    $( document ).ready(function() {
      var formatTime = function(ui) {
        let hours1 = Math.floor(ui.values[0] / 60);
        let minutes1 = ui.values[0] - (hours1 * 60);

        if (hours1.length == 1) hours1 = '0' + hours1;
        if (minutes1.length == 1) minutes1 = '0' + minutes1;
        if (minutes1 == 0) minutes1 = '00';
        if (hours1 >= 12) {
            if (hours1 == 12) {
                hours1 = hours1;
                minutes1 = minutes1 + " PM";
            } else {
                hours1 = hours1 - 12;
                minutes1 = minutes1 + " PM";
            }
        } else {
            hours1 = hours1;
            minutes1 = minutes1 + " AM";
        }
        if (hours1 == 0) {
            hours1 = 12;
            minutes1 = minutes1;
        }

        $('.slider-time-start').html(hours1 + ':' + minutes1);

        let hours2 = Math.floor(ui.values[1] / 60);
        let minutes2 = ui.values[1] - (hours2 * 60);

        if (hours2.length == 1) hours2 = '0' + hours2;
        if (minutes2.length == 1) minutes2 = '0' + minutes2;
        if (minutes2 == 0) minutes2 = '00';
        if (hours2 >= 12) {
            if (hours2 == 12) {
                hours2 = hours2;
                minutes2 = minutes2 + " PM";
            } else if (hours2 == 24) {
                ui.values[1]-=1;
                hours2 = 11;
                minutes2 = "59 PM";
            } else {
                hours2 = hours2 - 12;
                minutes2 = minutes2 + " PM";
            }
        } else {
            hours2 = hours2;
            minutes2 = minutes2 + " AM";
        }

        $('.slider-time-end').html(hours2 + ':' + minutes2);
      };

      //slider time range
      $("#slider-range").slider({
          range: true,
          min: 0,
          max: 1440,
          step: 30,
          values: [timeS, timeE],
          create: function( event, ui ) {
            formatTime ({
              values: [timeS, timeE]
            });
          },
          slide: function (e, ui) {
            formatTime (ui);

            let $scope = angular.element(document.getElementById(controller)).scope();
            $scope.$apply(
              function() {
                $scope.formData.timeS = ui.values[0];
                $scope.formData.timeE = ui.values[1];
                $scope.editForm = true;
              }
            );
          }
      });
    });
  }

  function keydownTextarea(e) {
    var keyCode = e.keyCode || e.which;

    if (keyCode == 9) {
      e.preventDefault();
      var start = this.selectionStart;
      var end = this.selectionEnd;

      // set textarea value to: text before caret + tab + text after caret
      $(this).val($(this).val().substring(0, start)
                  + "\t"
                  + $(this).val().substring(end));

      // put caret at right position again
      this.selectionStart =
      this.selectionEnd = start + 1;
    };
  }

  function changeProtocolSSL(url) {
    var ssl = ('https:' == document.location.protocol)?true:false;
    return (ssl)?url.replace('http:','https:').replace(':8080',':443'):url;
  }

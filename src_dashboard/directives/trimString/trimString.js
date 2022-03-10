mainApp.filter('trimString', ['$filter',
  function( $filter ){
  return function(input){
    var customLength = 100;
    if(input.length<customLength){
      return input;
    } else {
      return  input.substring(0,customLength) + ((input.length>customLength)?'...':'');
    }
  }
}]);

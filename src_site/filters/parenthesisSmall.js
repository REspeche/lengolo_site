mainApp.filter('parenthesisSmall', function () {
    return function (input) {
        return (!input)?'':input.replace(/\(/g, '<small>\(').replace(/\)/g, '\)</small>');
    };
});
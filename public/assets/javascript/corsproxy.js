jQuery.ajaxPrefilter(function(options) {
    if (options.crossDomain && jQuery.support.cors) {
        options.url = 'https://uncc-cors-proxy.herokuapp.com/' + options.url;
    }
});
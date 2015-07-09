$(function() {

    // Google Analytics event tracking
    (function($) {

        function eventTracker (category, action, label) {
            return function (event) {
                ga('send', 'event', category, action, label);
            };
        }

        // linkTracker defers visiting the target URL and sends
        // event tracking to Google Analytics first
        function linkTracker (category, action, label) {
            return function(event) {
                var url = event.target.href;
                // if no label given, use the url
                label = typeof label !== 'undefined' ? label : url;

                ga('send', 'event', category, action, label, {
                       'hitCallback': function() {
                       document.location = url;
                   }});
                // return false to prevent going to the target URL directly
                return false;
            };
        }

        function trackOutboundLink () {
            return linkTracker('outbound', 'click');
        }

        // Playing the home video differs on mobile and desktop (model popup vs
        // visiting the video URL). Both cases are tracked as identical events.
        var eventLabel = $('title').text() + ' Video';
        $('#play-home-video').click(eventTracker('Videos', 'Play', eventLabel));
        $('#goto-home-video').click(linkTracker('Videos', 'Play', eventLabel));

    }(jQuery));

    // Preserving greenhouse tacking query string parameter
    // for reference see https://app.greenhouse.io/jobboard/integration/documentation/api_board_embedded_apps
    (function($, URI) {
        var currentUrl  = new URI();
        var GH_QUERYKEY = 'gh_src';

        function getQueryParamValue(uri, key) {
            return uri.query(true)[key];
        }

        function appendTrailingSlash(uri) {
            uri.segment("");
            return uri;
        }

        function sanitizePathsForS3(uri) {
            if(uri.suffix() === '') {
                appendTrailingSlash(uri);
            }
            return uri;
        }

        if (currentUrl.hasQuery(GH_QUERYKEY, true)) {
            var ghSrcValue = getQueryParamValue(currentUrl, GH_QUERYKEY);

            // append query string param to all links on the same domain and
            // relative links
            var $sameOriginLinks = $('a:uri(is: relative)')
                    .add('a:uri(domain = ' + currentUrl.domain() + ')');
            $sameOriginLinks.each(function(index, element) {
                var targetUrl = sanitizePathsForS3(new URI(element));
                targetUrl.addQuery(GH_QUERYKEY, ghSrcValue);
                $(element).attr('href', targetUrl);
            });
        }

    }(jQuery, URI));
});

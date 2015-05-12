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

                ga('send', 'event', category, action, label,
                   {'hitCallback': function() {
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
        $("#play-home-video").click(eventTracker("Videos", "Play", "Tech Home Video"));
        $("#goto-home-video").click(linkTracker("Videos", "Play", "Tech Home Video"));

    }(jQuery));
});

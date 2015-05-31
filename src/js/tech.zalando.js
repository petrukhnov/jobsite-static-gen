(function ($) {
    var cookieName = "zalandoCookieWarning";

    var hideCookieBar = function () {
        $(".cookie-bar").toggleClass("table-hidden", "none");
    };

    var getCookie = function (cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i=0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1);
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    };

    // Show the cookie bar if there is no old cookie
    if (getCookie(cookieName) === "") {
        $(".cookie-bar").toggleClass("table-hidden", "none");
    }

    // Set the cookie
    var d = new Date();
    d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cookieName + "=1;" + expires;

    // add handler to hide the warning
    $(".cookie-bar").click(hideCookieBar);
}(jQuery));

$(function() {

    var scene = document.getElementById('scene');
    if (scene) {
        var parallax = new Parallax(scene);
    }

    var videoOpen = false;
    var backgroundVideo = $('#background-video');
    var homeVideo;// = $('#home-video');
    var homeVideoMobile = $('#home-video-mobile');
    var videoOverlay = $('#video-overlay');
    var playHomeButton = $('#play-home-video');
    var playHomeMobileButton = $('#play-home-video-mobile');
    var stopHomeButton = $('#stop-home-video');

    function openHomeVideo() {

        // pause background video
        if (backgroundVideo) {
            backgroundVideo.get(0).pause();
        }

        // show overlay
        if (videoOverlay) {
            videoOverlay.show();
        }

        // create player
        $( "#video-overlay" ).show();
        videojs("home-video", {
            "width": 716,
            "height": 404
        }, function(){
          // Player (this) is initialized and ready.
          homeVideo = this;
        });

        // resume playing
        if (homeVideo) {
            homeVideo.play();
        }

        videoOpen = true;

        return false;
    }

    function closeHomeVideo() {
        videoOpen = false;

        // stop home video
        if (homeVideo) {
            homeVideo.pause();
        }

        // hide overlay
        if (videoOverlay) {
            videoOverlay.hide();
        }

        // replay background video
        if (backgroundVideo) {
            backgroundVideo.get(0).play();
        }

        return false;
    }


    if (playHomeButton) {
        playHomeButton.click(openHomeVideo);
    }
    if (playHomeMobileButton) {
        playHomeMobileButton.click(function() {
            // alert('test');
            homeVideoMobile.get(0).play();
        });
    }
    if (videoOverlay) {
        videoOverlay.click(function (e) {
            if (e.target===videoOverlay.get(0)) {
                closeHomeVideo();
            }
        });
    }
    if (stopHomeButton) {
        stopHomeButton.click(closeHomeVideo);
    }

    $(document).keyup(function(e) {
        if (e.which == 27 && videoOpen) {
            closeHomeVideo();
        }
    });

    var cards = $(".card");
    if (cards) {
        cards.each(function(i, c) {
            window.setTimeout(function(){$(c).removeClass("shrunken");}, i * 30);
        });
    }

});

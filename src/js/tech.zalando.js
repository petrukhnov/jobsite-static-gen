;(function ($) {
    var cookieName = "zalandoCookieWarning";

    $(document).ready(function() {
        if ($('.job-application-form').length === 0) {
            return;
        }

        $('.IN-widget').click(trackLinkedInClick).find(':contains(with LinkedIn)').last().text('Apply with LinkedIn');

        var $jobAppError = $('.job-application-error');
        var $jobAppStatus = $('.job-application-status');
        var $jobAppSubmit = $('.job-application-submit');
        var $jobAppForm = $('.job-application-form');
        var jobAppId = $('.job-application-id').val();
        var jobAppTitle = $('title').text();

        $jobAppForm.ajaxForm({
            dataType: 'json',
            beforeSubmit: function() {
                $jobAppSubmit.attr('disabled', 'disabled').val('Processing...');
                $jobAppError.text('').hide();
                trackSubmitEvent('clicked', 'submit');
            },
            success: function(response, statusText) {
                $jobAppForm.replaceWith('<div class="job-application-success"><h1>Thank you for applying!</h1><p>It is great to see that you are interested in joining us at Zalando. Your application has been received and we are doing our best to provide you feedback as soon as possible. Please be patient while we review your details.</p><p>Your Zalando Team</p></div>');
                trackSubmitEvent('applied', 'success');
            },
            error: function(xhr, name, error) {
                $jobAppError.text('Sorry, your application could not be sent right now. Please try again later.').show();
                $jobAppSubmit.removeAttr('disabled').val('Submit Application');
                trackSubmitEvent('applied', 'error');
            }
        });

        function trackSubmitEvent(eventAction, eventLabel) {
            ga('send', 'event', 'jobs', eventAction, eventLabel);
        }

        function trackLinkedInClick() {
            ga('send', 'event', 'jobs', 'clicked', 'linkedin');
        }
    });

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

    var loopVideoScrolledAway = false;
    var loopVideoVisible = true;

    function windowOnResize() {
        loopVideoVisible = $(window).width() >= 1200;
        updateLoopVideoPlaying();
        resizeBlogContentIframes();
    }

    function resizeBlogContentIframes() {
        var $iframes = $(".blog-post-content iframe");
        var heightToWidthRatio = 3/4;

        $iframes.each(function() {
            var width = $(this).parent().width();
            $(this).width(width).height(width * heightToWidthRatio);
        });
    }

    function windowOnScroll() {
        var scrollTop = $(window).scrollTop();
        loopVideoScrolledAway = scrollTop > 500;
        updateLoopVideoPlaying();
    }

    function updateLoopVideoPlaying() {
        if (loopVideoVisible && !loopVideoScrolledAway) {
            if (backgroundVideo && backgroundVideo.get(0) && backgroundVideo.get(0).paused) {
                backgroundVideo.get(0).play();
            }
        } else {
            if (backgroundVideo && backgroundVideo.get(0) && !backgroundVideo.get(0).paused) {
                backgroundVideo.get(0).pause();
            }
        }
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

    $(window).scroll(windowOnScroll);
    $(window).resize(windowOnResize);
    windowOnScroll();
    windowOnResize();

    window.setTimeout(updateLoopVideoPlaying, 2000);
});

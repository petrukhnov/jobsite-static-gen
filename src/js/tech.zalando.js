(function ($) {
    var cookieName = "zalandoCookieWarning";
    
    var hideCookieBar = function () {
        $(".cookie-bar").hide();
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
        $(".cookie-bar").show();
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

    var carousel = new SwipeView('#home-blog-swipe', {
        numberOfPages: 3,
        hastyPageFlip: true
    });

    var cards = $("#home-blog-swipe-cards .card");

    // console.log(cards[0].cloneNode(true));

    // Load initial data
    for (i=0; i<3; i++) {
        carousel.masterPages[i].appendChild(cards[i].cloneNode(true))
    }

});


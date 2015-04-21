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
    
    // Show the cookie warning if there is no cookie
    (function () {
        var oldCookie = getCookie(cookieName);
        if (oldCookie === "") {
            $(".cookie-bar").show();
        }
    })();

    // Set the cookie
    (function (days) {
        var d = new Date();
        d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toGMTString();
        document.cookie = cookieName + "=1;" + expires;
    })(365);
    
    // add handler to hide the warning
    $(".cookie-bar").click(hideCookieBar);
}(jQuery));

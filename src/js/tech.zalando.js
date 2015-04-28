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

});

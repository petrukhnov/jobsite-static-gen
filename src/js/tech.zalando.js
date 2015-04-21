var test = 'TEST3';

(function closeCookieBarOnClick($) {
    var closeBar = function () {
        $(".cookie-bar").hide();
    };

    var setCookie = function (days) {
        var d = new Date();
        d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toGMTString();
        document.cookie = "cookiewarning=1;" + expires;
    };
    $(".cookie-bar").click(closeBar);
}(jQuery));
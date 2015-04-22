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

    function createCardSwipe(wrapper) {
        var swipe, cards;

        cards = $("#" + $(wrapper).data("swipe-source") +" .card");
        swipe = new SwipeView(wrapper, {
            numberOfPages: cards.length,
            hastyPageFlip: true
        });

        var i, page;
        for (i=0; i<3; i++) {
            page = i==0 ? cards.length-1 : i-1;
            swipe.masterPages[i].appendChild(cards[page].cloneNode(true));
        }

        swipe.onFlip(function () {
            var el,
                upcoming,
                i;

            for (i=0; i<3; i++) {
                upcoming = swipe.masterPages[i].dataset.upcomingPageIndex;
                if (upcoming != swipe.masterPages[i].dataset.pageIndex) {
                    $(swipe.masterPages[i]).empty();
                    swipe.masterPages[i].appendChild(cards[upcoming].cloneNode(true));
                }
            }
        });
    }

    $.each($(".card-swipe .wrapper"), function(index, swipeComponent) {
        createCardSwipe(swipeComponent);
    });

});


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

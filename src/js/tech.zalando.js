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

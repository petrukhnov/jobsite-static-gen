var techZalando = techZalando || {};

/* global React */
(function () {
    'use strict';

    var BLOG_POSTS_DATA_RELATIVE_URL = 'js/data/jobsData.json';

    var ItemsContainer = techZalando.ItemsContainer,
        BlogpostCard = techZalando.BlogpostCard;

    var BlogPage = techZalando.BlogPage = function(options) {
            this.options = options || {};

            this.init();
            this.render();
        };

    BlogPage.prototype.init = function() {
        console.log('BlogPage.init', this.options);
        // TODO
    };

    BlogPage.prototype.render = function() {
        console.log('BlogPage.render');
        // TODO
    };

})();
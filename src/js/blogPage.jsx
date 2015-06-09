var techZalando = techZalando || {};

/* global React */
(function () {
    'use strict';

    var RELATIVE_URL_TO_BLOG_POSTS_DATA = 'js/data/blogPostsData.json';

    var ItemsContainer = techZalando.ItemsContainer,
        BlogpostCard = techZalando.BlogpostCard;

    var BlogPage = techZalando.BlogPage = function(options) {
            this.options = options || {};

            this.init();
        };

    BlogPage.prototype.init = function() {
        this.model = {
            blogpostViewModelsSignal: Rx.DOM.getJSON(
                this.options.relative_path_to_root + RELATIVE_URL_TO_BLOG_POSTS_DATA)
        }

        // render components after data was loaded
        this.model.blogpostViewModelsSignal
            .subscribe(this.render.bind(this));
    };

    BlogPage.prototype.render = function() {
        // render blog posts container
        React.render(
            <ItemsContainer
                viewModelsSignal={this.model.blogpostViewModelsSignal}
                itemComponent={BlogpostCard}
                relativePathToRoot={this.options.relative_path_to_root} />,
            document.getElementById('blog-posts-content')
        );
    };

})();
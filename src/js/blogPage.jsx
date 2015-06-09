var techZalando = techZalando || {};

/* global React */
(function () {
    'use strict';

    var BLOG_POSTS_DATA_RELATIVE_URL = 'js/data/blogPostsData.json';

    var ItemsContainer = techZalando.ItemsContainer,
        BlogpostCard = techZalando.BlogpostCard;

    var BlogPage = techZalando.BlogPage = function(options) {
            this.options = options || {};

            this.init();
        };

    BlogPage.prototype.init = function() {
        this.model = {
            blogpostViewModelsSignal: Rx.DOM.getJSON(
                this.options.relative_path_to_root + BLOG_POSTS_DATA_RELATIVE_URL)
        }

        this.model.blogpostViewModelsSignal
            .subscribe(function(__) {
                this.render();
            }.bind(this))
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
var app = app || {};

(function () {
    'use strict';

    var ItemsContainer = app.ItemsContainer,
        BlogpostCard = app.BlogpostCard,
        viewModels = store.blogposts;

    function render() {
        React.render(
            <ItemsContainer viewModels={viewModels} itemComponent={BlogpostCard} />,
            document.getElementById('blog-posts-content')
        );
    }

    render();

})();

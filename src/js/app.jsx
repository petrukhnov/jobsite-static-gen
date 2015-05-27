var techZalando = techZalando || {};

(function () {
    'use strict';

    var ItemsContainer = techZalando.ItemsContainer,
        BlogpostCard = techZalando.BlogpostCard,
        viewModels = techZalando.Store.blogposts;

    function render() {
        React.render(
            <ItemsContainer viewModels={viewModels} itemComponent={BlogpostCard} />,
            document.getElementById('blog-posts-content')
        );
    }

    render();

})();

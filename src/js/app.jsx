var techZalando = techZalando || {};

(function () {
    'use strict';

    var App = techZalando.App = function(options) {
        this.options = options || {};

        switch(options.page) {
            case 'jobs':
                new techZalando.JobsPage(options);
                break;
        }
    }

    App.prototype.initJobs = function() {
        

        console.log(this.searchField);
    };

    App.prototype.getJobsIndex = function() {
        
    };

    /*
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
    */

})();

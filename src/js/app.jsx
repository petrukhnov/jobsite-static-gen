var techZalando = techZalando || {};

(function () {
    'use strict';

    var App = techZalando.App = function(options) {
        this.options = options || {};

        switch(options.page) {
            case 'jobs':
                new techZalando.JobsPage(options);
                break;
            case 'blog':
                new techZalando.BlogPage(options);
                break;
        }
    }

})();

var techZalando = techZalando || {};

(function () {
    'use strict';

    var SearchField = techZalando.SearchField;

    var JobsPage = techZalando.JobsPage = function(options) {
        this.options = options || {};

        this.searchFieldActions = {
            enableSignal: new Rx.BehaviorSubject(false),
            updateTextSignal: new Rx.BehaviorSubject('')
        }

        this.init();
    };

    JobsPage.prototype.init = function() {

        this.searchField = React.createElement(
            SearchField, {});

        // render search field and jobs container
        React.render(
            <SearchField actions={this.searchFieldActions} />,
            document.getElementById('searchField')
        );

        console.log('this1', this);
        this.getJobsIndex();
    };

    JobsPage.prototype.getJobsIndex = function() {
        console.log('this2', this);
        $.get(this.options.relative_path_to_root + 'js/indexableJobs.json', function(data, status) {
            var lunrIndex = lunr(function () {
                this.field('title', { boost: 10 });
                this.field('location', { boost: 5 });
                this.field('content');
            });

            $.each(data, function(index, job) {
                lunrIndex.add(job);
            });

            var search = lunrIndex.search('berlin');

            console.log('this3', this.searchFieldActions);
            console.log('search', search);

            this.searchFieldActions.enableSignal.onNext(true);

        }.bind(this));
    };

})();
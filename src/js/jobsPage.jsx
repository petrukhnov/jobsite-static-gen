var techZalando = techZalando || {};

/* global React */
(function () {
    'use strict';

    var SearchField = techZalando.SearchField;

    var JobsPage = techZalando.JobsPage = function(options) {
        this.options = options || {};

        this.init();
        this.render();
    };

    JobsPage.prototype.init = function() {

        this.searchFieldActions = {
            enableSignal: new Rx.BehaviorSubject(false),
            searchTextSignal: new Rx.BehaviorSubject('')
        }

        this.searchFieldActions.searchTextSignal
            .filter(function(text) {
                return text==='' || text.length > 1;
            })
            .debounce(400 /* ms */)
            .subscribe(this.search);

        this.getJobsIndex();

        // this.router = Router({
        //     '/': this.search2.bind(this, ''),
        //     '/search/:text': this.search2
        // });
        // this.router.init('/');

        console.log('after router');
    };

    JobsPage.prototype.render = function() {
        // render search field
        React.render(
            <SearchField actions={this.searchFieldActions} />,
            document.getElementById('searchField')
        );
        // render jobs container
        // TODO
    };

    JobsPage.prototype.getJobsIndex = function() {
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

            this.searchFieldActions.enableSignal.onNext(true);

        }.bind(this));
    };

    JobsPage.prototype.search = function(text) {
        console.log('search for:', text);
        document.location.hash = text==='' ? '/' : '/search/' + encodeURIComponent(text);
    };

    // JobsPage.prototype.search2 = function(text) {
    //     console.log('search2 for:', text);
    // };

})();
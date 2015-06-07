var techZalando = techZalando || {};

/* global React */
(function () {
    'use strict';

    var SEARCH_URL_STRING = "search";

    var SearchField = techZalando.SearchField;

    var JobsPage = techZalando.JobsPage = function(options) {
        this.options = options || {};

        this.init();
        this.render();
    };

    JobsPage.prototype.init = function() {

        this.model = {
            enableSearchSignal: new Rx.BehaviorSubject(false),
            searchTextSignal: new Rx.BehaviorSubject(''),
            locationHashSignal: Rx.Observable.fromEvent(window, 'hashchange')
                .map(function(hashEvent) {
                    return hashEvent.target.location.hash;
                })
                .startWith(window.location.hash)
        }

        this.model.locationHashSignal
            .subscribe(this.updateHash.bind(this));

        this.model.searchTextSignal
            .distinctUntilChanged()
            .debounce(400 /* ms */)
            .filter(function(text) { return text==='' || text.length > 1; })
            .subscribe(this.search.bind(this));

        this.model.searchTextSignal
            // skip first value to ignore searches that were triggered by direct URL input
            .skip(1)
            .distinctUntilChanged()
            .debounce(2000 /* ms */)
            .filter(function(text) { return text.length > 1; })
            .subscribe(this.logSearch.bind(this));

        this.createJobsIndex();
    };

    JobsPage.prototype.render = function() {
        // render search field
        React.render(
            <SearchField
                enableSignal={this.model.enableSearchSignal}
                searchTextSignal={this.model.searchTextSignal} />,
            document.getElementById('searchField')
        );
        // render jobs container
        // TODO
    };

    JobsPage.prototype.createJobsIndex = function() {
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

            this.model.enableSearchSignal.onNext(true);

        }.bind(this));
    };

    JobsPage.prototype.search = function(text) {
        document.location.hash = text==='' ? '/' : '/' + SEARCH_URL_STRING + '/' + encodeURIComponent(text);
    };

    JobsPage.prototype.logSearch = function(text) {
        console.log('Log search for:', text);

        // TODO
        // send event to google analytics
    };

    JobsPage.prototype.updateHash = function(hash) {
        var regex = new RegExp('^#\/' + SEARCH_URL_STRING + '\/([^\/]*)'),
            match = hash.match(regex),
            search = match ? match[1] : '';

        this.model.searchTextSignal.onNext(decodeURIComponent(search));
    };

})();

var techZalando = techZalando || {};

/* global React */
(function () {
    'use strict';

    var SEARCH_URL_STRING = "search",
        JOKER_NON_TECH_JOBS_POSITION = 2,
        JOKER_TALENT_POOL_POSITION = 10

    var SearchField = techZalando.SearchField,
        ItemsContainer = techZalando.ItemsContainer;
        // JobCard = techZalando.JobCard,
        // jobViewModels = techZalando.Store.jobs;

    var JobsPage = techZalando.JobsPage = function(options) {
        this.options = options || {};

        this.init();
        this.render();
    };

    JobsPage.prototype.init = function() {

        this.model = {
            enableSearchSignal: new Rx.BehaviorSubject(false),
            searchTextSignal: new Rx.BehaviorSubject(''),
            searchSignal: undefined,
            locationHashSignal: Rx.Observable.fromEvent(window, 'hashchange')
                .map(function(hashEvent) {
                    return hashEvent.target.location.hash;
                })
                .startWith(window.location.hash),
            jobsStoreSignal: Rx.DOM.getJSON(this.options.relative_path_to_root + 'js/data/jobsStore.json'),
            jobViewModelsSignal: new Rx.BehaviorSubject([])
        }

        this.model.locationHashSignal
            .subscribe(this.updateHash.bind(this));

        this.model.searchSignal = this.model.searchTextSignal
            .distinctUntilChanged()
            .debounce(200 /* ms */)
            .filter(function(text) { return text==='' || text.length > 2; });

        this.model.searchSignal
            .subscribe(this.search.bind(this));

        this.model.searchTextSignal
            // skip first value to ignore searches that were triggered by direct URL input
            .skip(1)
            .distinctUntilChanged()
            .debounce(2000 /* ms */)
            .filter(function(text) { return text.length > 2; })
            .subscribe(this.logSearch.bind(this));

        this.model.jobsStoreSignal
            .subscribe(this.createJobsIndex.bind(this));

        Rx.Observable
            .combineLatest(
                this.model.searchSignal,
                this.model.jobsStoreSignal.map(function(__) { return true; }),
                this.searchJobs.bind(this)
            )
            .subscribe(function(jobs) {
                console.log('jobs signal', jobs);
            });

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
        // React.render(
        //     <ItemsContainer viewModelsSignal={jobViewModelsSignal} itemComponent={JobCard} />,
        //     document.getElementById('jobs-content')
        // );
    };

    JobsPage.prototype.createJobsIndex = function(data) {
        this.jobsIndex = lunr(function () {
            this.field('title', { boost: 10 });
            this.field('locations', { boost: 5 });
            this.field('content');
        });

        this.jobsStore = data;

        data.forEach(function(job) {
            console.log(job);
            this.jobsIndex.add({
                id: job.id,
                title: job.title,
                locations: job.locations.replace(/\s*,\s*/g,' '),
                content: ''
            });
        }.bind(this));

        console.log('jobs:', this.jobsStore);

        // enable search field
        this.model.enableSearchSignal.onNext(true);
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

    JobsPage.prototype.searchJobs = function(text) {
        var foundJobIds = [],
            filteredJobs;

        if (text === '') {
            filteredJobs = this.jobsStore.slice();

            // add 'we also have non-tech jobs'-card
            // filteredJobs.splice(
            //     Math.min(JOKER_NON_TECH_JOBS_POSITION, filteredJobs.length),
            //     0,
            //     {
            //         jokerCard: 'non-tech-jobs'
            //     });

        } else {
            foundJobIds = this.jobsIndex
                .search(text)
                .map(function(foundItem) { return parseInt(foundItem.ref); });

            filteredJobs = this.jobsStore.filter(function(job) {
                return foundJobIds.indexOf(job.id) > -1;
            });
        }

        // add 'we also have non-tech jobs'-card
        // filteredJobs.splice(
        //     Math.min(JOKER_TALENT_POOL_POSITION, filteredJobs.length),
        //     0,
        //     {
        //         jokerCard: 'talent-pool'
        //     });

        return filteredJobs;
    };

})();

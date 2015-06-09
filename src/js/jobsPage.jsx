var techZalando = techZalando || {};

/* global React */
(function () {
    'use strict';

    var SEARCH_URL_STRING = "search",
        RELATIVE_URL_TO_JOBS_DATA = 'js/data/jobsData.json'
        JOKER_NON_TECH_JOBS_POSITION = 2,
        JOKER_TALENT_POOL_POSITION = 10

    var SearchField = techZalando.SearchField,
        ItemsContainer = techZalando.ItemsContainer,
        JobCard = techZalando.JobCard;

    var JobsPage = techZalando.JobsPage = function(options) {
            this.options = options || {};

            this.init();
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
            jobsDataSignal: Rx.DOM.getJSON(this.options.relative_path_to_root + RELATIVE_URL_TO_JOBS_DATA),
            jobViewModelsSignal: undefined
        }

        this.model.locationHashSignal
            .subscribe(this.onHashChanged.bind(this));

        this.model.searchSignal = this.model.searchTextSignal
            .distinctUntilChanged()
            .debounce(200 /* ms */);

        this.model.searchSignal
            .subscribe(this.updateHash.bind(this));

        this.model.searchTextSignal
            // skip first value to ignore searches that were triggered by direct URL input
            .skip(1)
            .distinctUntilChanged()
            .debounce(2000 /* ms */)
            .filter(function(text) { return text.length > 2; })
            .subscribe(this.logSearch.bind(this));

        this.model.jobsDataSignal
            .subscribe(this.createJobsIndex.bind(this));

        this.model.jobViewModelsSignal = Rx.Observable
            .combineLatest(
                this.model.searchSignal,
                this.model.jobsDataSignal,

                this.searchJobs.bind(this)
            );

        // render components after data was loaded
        this.model.jobViewModelsSignal
            .take(1)
            .subscribe(this.render.bind(this));
    };

    JobsPage.prototype.render = function() {
        // render search field
        React.render(
            <SearchField
                enableSignal={this.model.enableSearchSignal}
                searchTextSignal={this.model.searchTextSignal}
                relativePathToRoot={this.options.relative_path_to_root} />,
            document.getElementById('searchField')
        );

        // render jobs container
        React.render(
            <ItemsContainer
                viewModelsSignal={this.model.jobViewModelsSignal}
                itemComponent={JobCard}
                relativePathToRoot={this.options.relative_path_to_root} />,
            document.getElementById('jobs-content')
        );
    };

    JobsPage.prototype.createJobsIndex = function(data) {
        this.jobsIndex = lunr(function () {
            this.field('title', { boost: 10 });
            this.field('locations', { boost: 5 });
            this.field('content');
        });

        this.jobsStore = data.filter(function(job) {
            return job.categories.indexOf(this.options.category) >= 0;
        }.bind(this));

        this.jobsStore.forEach(function(job) {
            this.jobsIndex.add({
                id: job.id,
                title: processForLunr(job.title),
                locations: processForLunr(job.locations),
                content: processForLunr(job.content)
            });
        }.bind(this));

        // enable search field
        this.model.enableSearchSignal.onNext(true);


        function processForLunr(text) {
            return text.replace(/[^a-zA-Z\d\s]+/g,' ');
        }
    };

    JobsPage.prototype.updateHash = function(text) {
        document.location.hash = text==='' ? '/' : '/' + SEARCH_URL_STRING + '/' + encodeURIComponent(text);
    };

    JobsPage.prototype.logSearch = function(text) {
        console.log('Log search for:', text);

        // TODO
        // send event to google analytics
    };

    JobsPage.prototype.onHashChanged = function(hash) {
        var regex = new RegExp('^#\/' + SEARCH_URL_STRING + '\/([^\/]*)'),
            match = hash.match(regex),
            search = match ? match[1] : '';

        this.model.searchTextSignal.onNext(decodeURIComponent(search));
    };

    JobsPage.prototype.searchJobs = function(text) {
        var foundJobIds = [],
            filteredJobs;

        // Workaround for lunr.js to search for 2 letter words
        if (text.length === 2) {
            text = text + ' ';
        }

        if (text.length < 3) {
            filteredJobs = this.jobsStore.slice(); // fast copy array

            // add 'we also have non-tech jobs'-card
            filteredJobs.splice(
                Math.min(JOKER_NON_TECH_JOBS_POSITION, filteredJobs.length),
                0,
                jokerCardNonTechJobs());

        } else {
            foundJobIds = this.jobsIndex
                .search(text)
                .map(function(foundItem) { return parseInt(foundItem.ref, 10); });

            filteredJobs = this.jobsStore.filter(function(job) {
                return foundJobIds.indexOf(job.id) > -1;
            });
        }

        // add 'Can't find the right job'-card
        filteredJobs.splice(
            Math.min(JOKER_TALENT_POOL_POSITION - 1, filteredJobs.length),
            0,
            JokerCardTalentPool());

        return filteredJobs;


        function jokerCardNonTechJobs() {
            return {
                id: 'JokerCardNonTechJobs',
                jokerCard: 'non-tech-jobs',
                link: 'http://jobs.zalando.de/en/',
                title: 'We also have non-tech jobs!',
                text: 'Have a look at our amazing job opportunities for non-techies'
            };
        }

        function JokerCardTalentPool() {
            return {
                id: 'JokerCardTalentPool',
                jokerCard: 'talent-pool',
                link: this.options.relative_path_to_root + 'jobs/65731/?gh_jid=65731',
                title: 'Can’t find the right job?',
                text: 'Apply to our talent pool and create your own job'
            };
        }
    };

})();

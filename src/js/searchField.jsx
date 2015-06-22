var techZalando = techZalando || {};

(function () {
    'use strict';

    var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

    techZalando.SearchField = React.createClass({

        componentWillMount: function() {
            var setState = this.setState.bind(this),
                enableSignal = this.props.enableSignal,
                searchTextSignal = this.props.searchTextSignal;

            this.inputFieldChangeSignal = new Rx.Subject();
            this.inputFieldChangeSignal
                .map(function (e) {
                    return e.target.value;
                })
                .subscribe(searchTextSignal);

            // set enabled/disabled related states
            enableSignal
                .map(function(enable) {
                    return {
                        visible: enable
                    }
                })
                .subscribe(setState);

            // set search field value related states
            searchTextSignal
                .map(function(text) {
                    return {
                        showClearButton: text.length > 0,
                        inputText: text
                    }
                })
                .distinctUntilChanged()
                .subscribe(setState);

        },

        inputFieldChange: function(e) {
            this.inputFieldChangeSignal.onNext(e);
        },

        inputFieldKeyDown: function(e) {
            this.props.searchKeyDownSignal.onNext(e);
        },

        clearButtonClick: function(e) {
            this.props.searchTextSignal.onNext('');
            this.props.clearButtonSignal.onNext(e);
        },

        searchButtonClick: function(e) {
            this.props.searchButtonSignal.onNext(e);
        },

        render: function() {
            var searchField = '',
                clearButton = '',
                searchButton = '';

            if (this.state.showClearButton) {
                clearButton = (
                    <button
                        key="clearButton"
                        className="close-button"
                        onClick={this.clearButtonClick}>
                    </button>
                );
            }

            if (this.props.searchButtonSignal) {
                searchButton = (
                    <button
                        className="default-button"
                        onClick={this.searchButtonClick}>
                        search
                    </button>
                );
            }

            if (this.state.visible) {
                searchField = (
                    <div key="searchField" className="search-field">
                        <div className="search-button-wrapper">
                            {searchButton}
                        </div>
                        <div className="close-button-wrapper">
                            {clearButton}
                        </div>
                        <input
                            type="text"
                            className="input"
                            placeholder="Search for a job"
                            value={this.state.inputText}
                            onChange={this.inputFieldChange}
                            onKeyDown={this.inputFieldKeyDown} />
                    </div>
                );
            }

            return (
                <ReactCSSTransitionGroup transitionName="fade" component="div" className="search-field-wrapper">
                    {searchField}
                </ReactCSSTransitionGroup>
            );
        }
    });

})();

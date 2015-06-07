var techZalando = techZalando || {};

(function () {
    'use strict';

    var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

    techZalando.SearchField = React.createClass({

        // getInitialState: function() {
        //     return {
        //         visible: false,
        //         inputText: this.props.actions.searchTextSignal.getValue(),
        //         showClearButton: false
        //     };
        // },

        componentWillMount: function() {
            var setState = this.setState.bind(this),
                enableSignal = this.props.actions.enableSignal,
                searchTextSignal = this.props.actions.searchTextSignal;

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

        render: function() {
            var searchField = '';

            if (this.state.visible) {
                searchField = (
                    <div key="searchField" className="search-field">
                        <input
                            type="text"
                            className="input"
                            placeholder="Search for a job"
                            value={this.state.inputText}
                            onChange={this.inputFieldChange} />
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

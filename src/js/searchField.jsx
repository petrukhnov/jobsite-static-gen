var techZalando = techZalando || {};

(function () {
    'use strict';

    var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

    techZalando.SearchField = React.createClass({

        getInitialState: function() {
            return {
                visible: false,
                inputText: ''
            };
        },

        componentWillMount: function() {
            var setState = this.setState.bind(this),
                enableSignal = this.props.actions.enableSignal,
                updateTextSignal = this.props.actions.updateTextSignal,
                inputFieldValueSignal;

            this.inputFieldChangeSignal = new Rx.Subject();
            inputFieldValueSignal = this.inputFieldChangeSignal
                .map(function (e) {
                    return e.target.value;
                })
                .startWith('');

            inputFieldValueSignal
                .filter(function(text) {
                    return text==='' || text.length > 1;
                })
                .debounce(500 /* ms */)
                .subscribe(function(search) {
                    console.log('search:', search);
                });

            Rx.Observable
                .combineLatest(
                    enableSignal,
                    inputFieldValueSignal,
                    function(enable, text) {
                        return {
                            visible: enable,
                            showClearButton: text.length > 0,
                            inputText: text
                        }
                    }
                )
                .subscribe(this.setState.bind(this));
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

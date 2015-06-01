var techZalando = techZalando || {};

(function () {
    'use strict';

    var INITIAL_SHOWN_ITEMS  = 12;
    var SHOWN_ITEMS_INCREASE = 12;

    var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

    techZalando.ItemsContainer = React.createClass({

        getInitialState: function() {
            return {
                shownItems: INITIAL_SHOWN_ITEMS
            };
        },

        increaseShownItems: function() {
            this.setState({ shownItems: Math.min(
                this.state.shownItems + SHOWN_ITEMS_INCREASE,
                this.props.viewModels.length
            ) });
        },

        onClickMore: function(e) {
            this.increaseShownItems();
        },

        render: function() {
            var shownViewModels = this.props.viewModels.filter(function(_, index) {
                    return index < this.state.shownItems;
                }, this),
                items = shownViewModels.map(renderItem(), this);

            return (
                <div className="fullsize-container light-gray">
                    <div className="container">
                        <ReactCSSTransitionGroup transitionName="fade" component="div" className="cards element-spacing">
                            {items}
                        </ReactCSSTransitionGroup>
                    </div>
                    <div className="container text-center">
                        {showMoreButton.call(this)}
                    </div>
                </div>
            );

            function renderItem() {
                return function(viewModel) {
                    return React.createElement(
                        this.props.itemComponent,
                        {key: viewModel.id, viewModel: viewModel});
                }
            }

            function showMoreButton() {
                if (this.props.viewModels.length > this.state.shownItems) {
                    return (
                        <button onClick={this.onClickMore} className="default-button large color-zalando element-spacing">
                            Show More
                        </button>
                    );
                } else {
                    return '';
                }
            }
        }
    });

})();
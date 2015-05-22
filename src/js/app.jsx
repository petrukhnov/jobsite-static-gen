var app = app || {};

(function () {
    'use strict';

    app.INITIAL_SHOWN_POSTS  = 4;
    app.SHOWN_POSTS_INCREASE = 4;

    var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
    var BlogpostCard = app.BlogpostCard;
    var viewModels = store.blogposts;

    var BlogpostsContainer = React.createClass({

        getInitialState: function() {
            return {
                shownPosts: app.INITIAL_SHOWN_POSTS
            };
        },

        increaseShownPosts: function() {
            this.setState({ shownPosts: Math.min(
                this.state.shownPosts + app.SHOWN_POSTS_INCREASE,
                this.props.viewModels.length
            ) });
        },

        onClickMore: function(e) {
            this.increaseShownPosts();
        },

        render: function() {
            var shownViewModels = this.props.viewModels.filter(function(_, index) {
                    return index < this.state.shownPosts;
                }, this),
                blogpostsCards = shownViewModels.map(renderedCard(), this);

            return (
                <div className="fullsize-container light-gray">
                    <div className="container">
                        <ReactCSSTransitionGroup transitionName="fade" component="div" className="cards element-spacing">
                            {blogpostsCards}
                        </ReactCSSTransitionGroup>
                    </div>
                    <div className="container text-center">
                        {showMoreButton.call(this)}
                    </div>
                </div>
            );

            function renderedCard() {
                return function(viewModel) {
                    return (<BlogpostCard key={viewModel.id} viewModel={viewModel}/>);
                }
            }

            function showMoreButton() {
                if (this.props.viewModels.length > this.state.shownPosts) {
                    return (
                        <button onClick={this.onClickMore} className="default-button color-zalando element-spacing">
                            Show More
                        </button>
                    );
                } else {
                    return '';
                }
            }
        }
    });

    function render() {
        React.render(
            <BlogpostsContainer viewModels={viewModels}/>,
            document.getElementById('blog-posts-content')
        );
    }

    render();

})();

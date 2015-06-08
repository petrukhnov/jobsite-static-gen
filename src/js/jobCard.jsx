var techZalando = techZalando || {};

(function () {
    'use strict';

    techZalando.JobCard = React.createClass({
        render: function() {
            var model = this.props.viewModel;

            return model.jokerCard ? this.renderJokerCard(model) : this.renderJobCard(model);
        },

        renderJobCard: function(model) {
            var mediaStyle = { backgroundImage: 'url(' + this.props.relativePathToRoot + model.thumbnail + ')' },
                categoryLink = '',
                link = this.props.relativePathToRoot + model.link;

            if (model.category && model.category_link) {
                categoryLink = <a href={model.category_link} className="category">{model.category}</a>;
            }

            return (
                <div className="card-container">
                    {categoryLink}
                    <a href={link}>
                        <div className="card job">
                            <div className="media" style={mediaStyle}></div>
                            <div className="content">
                                <p className="title">{model.title}</p>
                                <p className="subtitle">{model.firstCategory}</p>
                                <p className="footer"><span className="glyphicon glyphicon-map-marker" aria-hidden="true"></span> {model.locations}</p>
                            </div>
                        </div>
                    </a>
                </div>
            );
        },

        renderJokerCard: function(model) {
            var className = 'card joker-' + model.jokerCard;

            return (
                <div className="card-container">
                    <a href={ model.link }>
                        <div className={ className }>
                            <div className="media">
                            </div>
                            <div className="content">
                                <p className="title">{ model.title }</p>
                                <p className="text">{ model.text }</p>
                            </div>
                        </div>
                    </a>
                </div>
            );
        }

    });

})();
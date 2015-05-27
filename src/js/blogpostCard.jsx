var techZalando = techZalando || {};

(function () {
    'use strict';

    techZalando.BlogpostCard = React.createClass({
        onCardClick: function() {
            location.href = '../blog/' + this.props.viewModel.slug;
        },

        render: function () {
            var model = this.props.viewModel,
                mediaStyle = { backgroundImage: 'url(' + model.thumbnail + ')' },
                categoryLink = '',
                subTitle = 'by ' + model.authorNames.join(', ') + ' - ' + model.date;

            if (model.category && model.category_link) {
                categoryLink = <a href={model.category_link} className="category">{model.category}</a>;
            }

            return (
                <div className="card-container">
                    {categoryLink}
                    <div className="card blog" onClick={this.onCardClick}>
                        <div className="media" style={mediaStyle}></div>
                        <div className="content">
                            <p className="title">{model.title}</p>
                            <p className="subtitle">{subTitle}</p>
                            <p className="text bodycopy">{model.description}</p>
                        </div>
                    </div>
                </div>
            );
        }
    });

})();
var app = app || {};

(function () {
    'use strict';

    app.BlogpostCard = React.createClass({
        render: function () {
            var model = this.props.viewModel,
                link = '../blog/' + model.slug,
                mediaStyle = { backgroundImage: 'url(' + model.image + ')' },
                categoryLink = '',
                subTitle = 'by ' + model.authorNames.join(', ') + ' - ' + model.date;

            if (model.category && model.category_link) {
                categoryLink = <a href={model.category_link} className="category">{model.category}</a>;
            }

            return (
                <div className="card-container">
                    {categoryLink}
                    <div className="card blog">
                        <div className="media" style={mediaStyle}>
                            <a href={link}></a>
                        </div>
                        <div className="content">
                            <p className="title"><a href={link}>{model.title}</a></p>
                            <p className="subtitle">{subTitle}</p>
                            <p className="text bodycopy">{model.description}</p>
                        </div>
                    </div>
                </div>
            );
        }
    });

})();
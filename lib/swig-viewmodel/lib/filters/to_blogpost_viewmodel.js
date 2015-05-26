'use strict';

var _ = require('underscore'),
    viewmodel = require('./viewmodel'),
    to_authors_viewmodel = require('./to_authors_viewmodel');

/**
 * Transform input blogposts model to a blogposts view model.
 *
 * @example
 * {% set blogposts_viewmodel =
 *     prismic.blogposts|to_blogposts_viewmodel(prismic.authors) %}
 *
 * @param  {*}      input raw blogposts data
 * @param  {object} authors Raw authors model.
 * @return {*}
 */
module.exports = function (blogposts, authors, rst_blogposts) {
    return (blogposts && blogposts.results && getViewmodel(viewmodel.getBlogpost, blogposts))
        || (rst_blogposts && rst_blogposts.results && getViewmodel(viewmodel.getRstBlogpost, rst_blogposts))
        || {};

    function getViewmodel(viewmodelFunc, posts) {
        return viewmodelFunc(
            posts.results[0],
            to_authors_viewmodel(authors));
    }
}

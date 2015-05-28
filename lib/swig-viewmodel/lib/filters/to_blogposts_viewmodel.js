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
module.exports = function (blogposts, authors, rst_blogposts, md_blogposts, options) {
    var authorsViewmodel = to_authors_viewmodel(authors);
    blogposts = (blogposts && blogposts.results) || [];
    rst_blogposts = (rst_blogposts && rst_blogposts.results) || [];
    md_blogposts = (md_blogposts && md_blogposts.results) || [];

    return _.chain([])
        .concat(
            blogposts.map(blogpostIntoViewmodel),
            rst_blogposts.map(rstBlogpostIntoViewmodel),
            md_blogposts.map(mdBlogpostIntoViewmodel)
        )
        .sortBy(publishDate)
        .value();

    function blogpostIntoViewmodel(blogpost_input) {
        return viewmodel.getBlogpost(
            blogpost_input,
            authorsViewmodel,
            options);
    }
    function rstBlogpostIntoViewmodel(rst_blogpost_input) {
        return viewmodel.getRstBlogpost(
            rst_blogpost_input,
            authorsViewmodel,
            options);
    }
    function mdBlogpostIntoViewmodel(md_blogpost_input) {
        return viewmodel.getMdBlogpost(
            md_blogpost_input,
            to_authors_viewmodel(authors),
            options);
    }
    function publishDate(blogpost) {
        return -blogpost.rawDate;
    }
}

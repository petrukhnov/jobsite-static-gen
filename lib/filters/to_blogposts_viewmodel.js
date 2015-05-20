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
module.exports = function (input, authors, rst_blogposts) {
    if (!input || !input.results) { return []; }

    return input.results.map(blogpostIntoViewmodel);
        // Pseudo-code:
        //_.chain([])
        //.append(input.results.map(blogpostIntoViewmodel))
        //.append(rst_blogposts.map(rstBlogpostIntoViewmodel))
        //.sort(foo)
        //.value();

    function blogpostIntoViewmodel(blogpost_input) {
        return viewmodel.getBlogpost(
            blogpost_input,
            to_authors_viewmodel(authors));
    }
    function rstBlogpostIntoViewmodel(rst_blogpost_input) {
        return viewmodel.getRstBlogpost(
            rst_blogpost_input,
            to_authors_viewmodel(authors));
    }
}

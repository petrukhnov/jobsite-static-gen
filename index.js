/**
 * Raw filter methods.
 * @type {object}
 */
exports.filters = require('./lib/filters');

/**
 * Add a view model filter to your swig instance.
 *
 * @example
 * var swig = require('swig'),
 *     viewmodel = require('swig-viewmodel');
 * viewmodel.useFilter(swig, 'to_blogposts_viewmodel');
 *
 * @param  {object} swig   Swig instance.
 * @param  {string} filter Viewmodel filter name.
 * @return {undefined}
 * @throws {Error} If the view model does not have a filter with the given name.
 */
exports.useFilter = function (swig, filter) {
  var f = exports.filters[filter];
  if (!f) {
    throw new Error('Filter "' + filter + '" does not exist.');
  }
  swig.setFilter(filter, f);
};

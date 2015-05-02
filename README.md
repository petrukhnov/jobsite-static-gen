Swig Viewmodel
==============

A collection of filters for [Swig](http://paularmstrong.github.io/swig/) that transforms given API data to view model objects.

Usage
-----

Use the filters:

```js
var swig = require('swig'),
    viewmodel = require('swig-viewmodel');
viewmodel.useFilter(swig, 'to_blogposts_viewmodel');
```

Available Filters
-----------------

* to_blogposts_viewmodel
* to_blogpost_viewmodel
* to_authors_viewmodel
* to_doc_viewmodel
* to_jobs_viewmodel

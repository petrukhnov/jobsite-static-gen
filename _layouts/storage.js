{% set blogposts_viewmodel = prismic.blogposts | to_blogposts_viewmodel(prismic.authors, {
    ignoreContent: true
}) %}

var storage = storage || {};
storage.blogposts = {{ JSON.stringify(blogposts_viewmodel) }};

console.log('Data loaded:', storage);

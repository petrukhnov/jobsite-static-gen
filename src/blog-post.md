---
template: blog-post.html
relative_path_to_root: ../../
prismic:
  blogpost:
    query: '[[:d = at(document.type, "blog")]]'
    collection:
      fileExtension: 'html'
  authors:
    query: '[[:d = at(document.type, "author")]]'
---

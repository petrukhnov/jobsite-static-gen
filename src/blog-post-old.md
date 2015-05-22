---
template: blog-post.html
relative_path_to_root: ../../
prismic:
  rstblogpost:
    query: '[[:d = at(document.type, "blog-rst")]]'
    collection:
      fileExtension: 'html'
    pageSize: 100
  authors:
    query: '[[:d = at(document.type, "author")]]'
---

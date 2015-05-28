---
template: blog-post.html
relative_path_to_root: ../../
prismic:
  rstblogpost:
    query: '[[:d = at(document.type, "blog-rst")]]'
    collection:
      fileExtension: 'html'
    allPages: true
  authors:
    query: '[[:d = at(document.type, "author")]]'
    allPages: true
---

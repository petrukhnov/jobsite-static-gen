---
template: blog.html
relative_path_to_root: ../
prismic:
  blogposts:
    query: '[[:d = at(document.type, "blog")]]'
  authors:
    query: '[[:d = at(document.type, "author")]]'
  rstblogposts:
    query: '[[:d = at(document.type, "blog-rst")]]'
---

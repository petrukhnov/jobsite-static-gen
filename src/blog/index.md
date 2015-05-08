---
template: blog.html
relative_path_to_root: ../
prismic:
  blogposts:
    query: '[[:d = at(document.type, "blog")]]'
    orderings: '[my.blog.date desc]'
  authors:
    query: '[[:d = at(document.type, "author")]]'
---

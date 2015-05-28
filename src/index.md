---
template: index.html
relative_path_to_root: ./
permalink: false
prismic:
  blogposts:
    query: '[[:d = at(document.type, "blog")]]'
    orderings: '[my.blog.date desc]'
    pageSize: 3
  authors:
    query: '[[:d = at(document.type, "author")]]'
    allPages: true
---

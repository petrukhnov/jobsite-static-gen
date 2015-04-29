---
template: index.html
permalink: false
prismic:
  blogposts:
    query: '[[:d = at(document.type, "blog")]]'
    orderings: '[my.blog.date desc]'
    pageSize: 3
  authors:
    query: '[[:d = at(document.type, "author")]]'
---
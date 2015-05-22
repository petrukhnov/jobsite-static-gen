---
template: store.js
permalink: false
prismic:
  blogposts:
    query: '[[:d = at(document.type, "blog")]]'
    pageSize: 100
  rstblogposts:
    query: '[[:d = at(document.type, "blog-rst")]]'
    pageSize: 100
  authors:
    query: '[[:d = at(document.type, "author")]]'
---

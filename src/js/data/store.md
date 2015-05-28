---
template: store.js
permalink: false
prismic:
  blogposts:
    query: '[[:d = at(document.type, "blog")]]'
  rstblogposts:
    query: '[[:d = at(document.type, "blog-rst")]]'
  mdblogposts:
    query: '[[:d = at(document.type, "blog-md")]]'
  authors:
    query: '[[:d = at(document.type, "author")]]'
---

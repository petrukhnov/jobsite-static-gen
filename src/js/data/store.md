---
template: store.js
permalink: false
prismic:
  blogposts:
    query: '[[:d = at(document.type, "blog")]]'
    allPages: true
  rstblogposts:
    query: '[[:d = at(document.type, "blog-rst")]]'
    allPages: true
  mdblogposts:
    query: '[[:d = at(document.type, "blog-md")]]'
    allPages: true
  authors:
    query: '[[:d = at(document.type, "author")]]'
    allPages: true
---

---
template: blog.html
prismic:
  blogposts:
    query: '[[:d = at(document.type, "blog")]]'
    orderings: '[my.blog.date desc]'
  authors:
    query: '[[:d = at(document.type, "author")]]'
---

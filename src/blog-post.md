---
template: blog-post.html
prismic:
  blogpost:
    query: '[[:d = at(document.type, "blog")]]'
    collection:
      fileExtension: 'html'
  authors:
    query: '[[:d = at(document.type, "author")]]'
---

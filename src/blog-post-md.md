---
template: blog-post.html
relative_path_to_root: ../../
prismic:
  mdblogpost:
    query: '[[:d = at(document.type, "blog-md")]]'
    collection:
      fileExtension: 'html'
    allPages: true
  authors:
    query: '[[:d = at(document.type, "author")]]'
    allPages: true
---

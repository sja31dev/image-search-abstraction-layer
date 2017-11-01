# image-search-abstraction-layer

## Part 4 of Free Code Camp Backend Challenges

1. User Story: I can get the image URLs, alt text and page urls for a set of images relating to a given search string.

2. User Story: I can paginate through the responses by adding a ?offset=2 parameter to the URL.

3. User Story: I can get a list of the most recently submitted search strings.

### Example use

* `https://<host>/api/imagesearch/<query string>?offset=<offset>`

### Example response
      
```
[
  {
    "url": "http://i0.kym-cdn.com/photos/images/facebook/000/024/740/lolcats-funny-pictures-halp-not-for-sale.jpg",
    "snippet": "Image - 24740] | LOLcats | Know Your Meme",
    "thumbnail": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwAVlPDkEfE65WZ-UmL7KxfK0sC9jCjwnujwvTDleqQ_BrB93WAT2m2fyQ",
    "context": "http://knowyourmeme.com/photos/24740-lolcats"
  },
...
]
```

### Example use

* `https://<host>/api/latest/imagesearch/`

### Example response
      
```
[
  {
    "term": "lolcats funny",
    "when": "2017-10-23T19:15:43.269Z"
  },
...
]
```

import { groq } from "next-sanity";

// Get all posts
export const postsQuery = groq`*[_type == "post"] | order(_createdAt desc) {
  _createdAt,
  title,
  description,
  slug,
  mainImage,
  "imageURL": mainImage.asset->url,
  "authorName": author->name,
}`;

// Get a single post by its slug
export const postQuery = groq`*[_type == "post" && slug.current == $slug][0]{ 
    title,
    description,
    mainImage,
    body[]{
      ...,
      _type == "image" => {
        ...,
        asset->{
          ...,
          metadata
        }
      }
    },
    "authorName": author->name,
    "authorImage": author->image,
    "authorTwitter": author->twitter
  }`;

// Get posts by task filter value
export const taskPostsQuery = groq`*[_type == "task" && filterValue == $filterValue] | order(_createdAt desc)  {
  _id,
  title,
  description,
  mainImage{
    asset->{
      _id,
      url
    },
    alt
  },
  body[]{
    ...,
    _type == "image" => {
      ...,
      asset->{
        ...,
        metadata
      }
    }
  },
  "authorName": author->name,
  "authorImage": author->image,
  "authorTwitter": author->twitter,
  filterValue
}`;

// Get posts by domain filter value
export const domainPostsQuery = groq`*[_type == "domain" && filterValue == $filterValue] {
  _id,
  title,
  description,
  mainImage{
    asset->{
      _id,
      url
    },
    alt
  },
  body[]{
    ...,
    _type == "image" => {
      ...,
      asset->{
        ...,
        metadata
      }
    }
  },
  "authorName": author->name,
  "authorImage": author->image,
  "authorTwitter": author->twitter,
  filterValue
}`;

// Get posts by country filter value
export const countryPostsQuery = groq`*[_type == "country" && filterValue == $filterValue] {
  _id,
  title,
  description,
  mainImage{
    asset->{
      _id,
      url
    },
    alt
  },
  body[]{
    ...,
    _type == "image" => {
      ...,
      asset->{
        ...,
        metadata
      }
    }
  },
  "authorName": author->name,
  "authorImage": author->image,
  "authorTwitter": author->twitter,
  filterValue
}`;

// Get posts by organization filter value
export const organizationPostsQuery = groq`*[_type == "organization" && filterValue == $filterValue] {
  _id,
  title,
  description,
  mainImage{
    asset->{
      _id,
      url
    },
    alt
  },
  body[]{
    ...,
    _type == "image" => {
      ...,
      asset->{
        ...,
        metadata
      }
    }
  },
  "authorName": author->name,
  "authorImage": author->image,
  "authorTwitter": author->twitter,
  filterValue
}`;

// Get all post slugs
export const postPathsQuery = groq`*[_type == "post" && defined(slug.current)][]{
    "params": { "slug": slug.current }
  }`;

// Get 4 most recent posts
export const recentPostsQuery = groq`*[_type == "post"] | order(date desc) [0...4] {
  "slug": slug.current,
  title,
  description,
  date,
  "image": mainImage.asset->url
}`;

export const postSlugsQuery = groq`*[_type == "post"] {
  "slug": slug.current,
  date
}`;

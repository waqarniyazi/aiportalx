import { client } from "./client";

export async function fetchFilteredBlogPost(filters: {
  task?: string;
  domain?: string;
  organization?: string;
  country?: string;
}) {
  const query = `*[_type == "filteredBlogPost" && (!defined(filters.task) || filters.task == $task) && (!defined(filters.domain) || filters.domain == $domain) && (!defined(filters.organization) || filters.organization == $organization) && (!defined(filters.country) || filters.country == $country)][0]{
    title,
    description,
    content
  }`;
  return client.fetch(query, filters);
}

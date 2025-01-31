import type { QueryParams } from "@sanity/client";
import { client } from "./client";

const DEFAULT_PARAMS = {} as QueryParams;
const DEFAULT_TAGS = [] as string[];

export async function sanityFetch<QueryResponse>({
  query,
  params = DEFAULT_PARAMS,
  tags = DEFAULT_TAGS,
}: {
  query: string;
  params?: QueryParams;
  tags?: string[];
}): Promise<QueryResponse> {
  try {
    const result = await client.fetch<QueryResponse>(query, params);
    return result;
  } catch (error) {
    console.error("Sanity Fetch Error:", error);
    throw error;
  }
}

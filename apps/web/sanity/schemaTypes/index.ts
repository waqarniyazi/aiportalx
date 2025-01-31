import type { SchemaTypeDefinition } from "sanity";

import { blockContentType } from "./blockContentType";
import { categoryType } from "./categoryType";
import { postType } from "./postType";
import { authorType } from "./authorType";
import { domainType } from "./domainType";
import { taskType } from "./taskType";
import { countryType } from "./countryType";
import { organizationType } from "./organizationType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType,
    categoryType,
    postType,
    authorType,
    domainType,
    taskType,
    countryType,
    organizationType,
  ],
};

import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Blog")
    .items([
      S.documentTypeListItem("post").title("Posts"),
      S.documentTypeListItem("category").title("Categories"),
      S.documentTypeListItem("author").title("Authors"),
      S.documentTypeListItem("domain").title("Domains"),
      S.documentTypeListItem("task").title("Tasks"),
      S.documentTypeListItem("country").title("Countries"),
      S.documentTypeListItem("organization").title("Organizations"),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) =>
          item.getId() &&
          ![
            "post",
            "category",
            "author",
            "domain",
            "task",
            "country",
            "organization",
          ].includes(item.getId()!),
      ),
    ]);

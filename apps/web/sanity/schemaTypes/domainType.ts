import { DocumentTextIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const domainType = defineType({
  name: "domain",
  title: "Domain",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "string",
    }),
    defineField({
      name: "author",
      type: "reference",
      to: { type: "author" },
    }),
    defineField({
      name: "mainImage",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative text",
        },
        {
          title: "SEO",
          name: "seo",
          type: "seoMetaFields",
        },
      ],
    }),
    defineField({
      name: "body",
      type: "blockContent",
    }),
    defineField({
      name: "filterValue",
      title: "Filter Value",
      type: "string",
      options: {
        list: [
          { title: "Audio", value: "audio" },
          { title: "Biology", value: "biology" },
          // Add other domain filters here
        ],
      },
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "mainImage",
    },
  },
});

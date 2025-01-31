export async function generateMetadata({
  params,
}: {
  params: { filters?: string[] };
}): Promise<Metadata> {
  let pageTitle = "AI Models";

  if (params.filters && params.filters.length >= 2) {
    const filterType = params.filters[0]; // task, domain, etc.
    const filterValue = decodeURIComponent(params.filters[1]).replace(
      /-/g,
      " ",
    );

    const filterLabels: Record<string, string> = {
      task: "Task",
      domain: "Domain",
      country: "Country",
      organization: "Organization",
    };

    if (filterLabels[filterType]) {
      pageTitle = `Best AI Models for ${filterValue} - ${filterLabels[filterType]} | AIportalX`;
    }
  }

  return {
    title: pageTitle,
    description: `Discover top AI models related to ${pageTitle}. Explore the best models categorized by ${params.filters?.[0]} for optimal results.`,
  };
}

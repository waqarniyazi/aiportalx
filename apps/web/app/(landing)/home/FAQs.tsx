const faqs = [
  {
    question: "What is AI PortalX?",
    answer:
      "AI PortalX is a platform that helps users discover and compare AI models while offering rich blog content to enhance understanding of these technologies.",
  },
  {
    question: "How do I filter AI models?",
    answer:
      "You can filter models by task (e.g., image recognition), domain (e.g., healthcare), company, and country using our intuitive filtering options.",
  },
  {
    question: "Are the AI models free to use?",
    answer:
      "While some models are free, others may require subscriptions or licenses. Each model page provides detailed pricing and access information.",
  },
  {
    question: "Can I contribute to the blog?",
    answer:
      "Yes! We welcome expert contributions. Reach out to us via the Contribute section to share your insights.",
  },
  {
    question: "How often is the data updated?",
    answer:
      "Our database and blog are updated regularly to ensure users access the latest information and trends.",
  },
];

export function FAQs() {
  return (
    <div
      className="mx-auto max-w-2xl divide-y divide-gray-900/10 px-6 pb-8 sm:pb-24 sm:pt-12 lg:max-w-7xl lg:px-8 lg:pb-32"
      id="faq"
    >
      <h2 className="font-cal text-2xl leading-10 text-blue-600">
        Frequently asked questions
      </h2>
      <dl className="mt-10 space-y-8 divide-y divide-gray-900/10 dark:divide-gray-600">
        {faqs.map((faq) => (
          <div
            key={faq.question}
            className="pt-8 lg:grid lg:grid-cols-12 lg:gap-8"
          >
            <dt className="text-base font-semibold leading-7 lg:col-span-5">
              {faq.question}
            </dt>
            <dd className="mt-4 lg:col-span-7 lg:mt-0">
              <p className="text-base leading-7 text-gray-600 dark:text-gray-400">
                {faq.answer}
              </p>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

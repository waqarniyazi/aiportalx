import clsx from "clsx";
import Image from "next/image";

const featuredTestimonial = {
  body: "AI PortalX is a game-changer for researchers! The filtering options save me hours of work.",
  author: {
    name: "Arjun Nair, AI Researcher",
    handle: "jonnilundy",
    imageUrl:
      "https://pbs.twimg.com/profile_images/1651273413053542400/6ul40RRM_400x400.jpg",
  },
};
const testimonials: {
  body: string;
  author: {
    name: string;
    handle: string;
    imageUrl: string;
  };
}[][][] = [
  [
    [
      {
        body: "A perfect blend of data and content. The blogs help me understand how to use models in my projects.",
        author: {
          name: "Ravi Sharma, Developer",
          handle: "steventey",
          imageUrl:
            "https://pbs.twimg.com/profile_images/1506792347840888834/dS-r50Je_400x400.jpg",
        },
      },
      {
        body: "Finding the right AI model has never been easier. The interface is intuitive and sleek.",
        author: {
          name: "Priya Verma, Data Scientist",
          handle: "",
          imageUrl:
            "/images/testimonials/midas-hofstra-a6PMA5JEmWE-unsplash.jpg",
        },
      },
      {
        body: "The rich blog content is a treasure trove for someone new to AI like me!",
        author: {
          name: "Ali Khan, Student",
          handle: "ktyr",
          imageUrl:
            "https://ph-avatars.imgix.net/2743360/28744c72-2267-49ed-999d-5bdab677ec28?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=120&h=120&fit=crop&dpr=2",
        },
      },
    ],
    [
      {
        body: `AI PortalX’s comprehensive database helped us select the best AI model for our healthcare app.`,
        author: {
          name: "Vikram Desai, CTO, MedTech Solutions",
          handle: "emarky",
          imageUrl:
            "https://ph-avatars.imgix.net/28450/8c4c8039-003a-4b3f-80ec-7035cedb6ac3?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=120&h=120&fit=crop&dpr=2",
        },
      },
    ],
  ],
  [
    [
      {
        body: "I appreciate the balance between data depth and user-friendly design. Highly recommended!",
        author: {
          name: "Shreya Mehta, ML Engineer",
          handle: "kadlac",
          imageUrl:
            "https://pbs.twimg.com/profile_images/1558195781089120256/RWvUylSb_400x400.jpg",
        },
      },
      {
        body: "Finally, a platform that combines AI model data with insightful content. Love it!",
        author: {
          name: "Prem Saini",
          handle: "prem_saini1",
          imageUrl:
            "https://ph-avatars.imgix.net/4438396/079fabcb-7d01-42d9-a98f-2fc7befce04e?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=120&h=120&fit=crop&dpr=2",
        },
      },
    ],
    [
      {
        body: "The expert reviews are spot-on. AI PortalX has become my go-to resource for AI projects.",
        author: {
          name: "Ananya Kapoor, AI Consultant",
          handle: "",
          imageUrl:
            "/images/testimonials/joseph-gonzalez-iFgRcqHznqg-unsplash.jpg",
        },
      },
      {
        body: "With AI PortalX, exploring AI models feels like a breeze. Their blog is a cherry on top!",
        author: {
          name: "Neha Jain, Product Manager",
          handle: "alexhbass",
          imageUrl:
            "https://ph-avatars.imgix.net/3523155/original?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=120&h=120&fit=crop&dpr=2",
        },
      },
    ],
  ],
];

export function Testimonials() {
  return (
    <div className="relative isolate bg-background pb-20 pt-24 sm:pt-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-lg font-semibold leading-8 tracking-tight text-blue-600">
            AI PortalX Love
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            AI Models made easy for Everyone
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 grid-rows-1 gap-8 text-sm leading-6 text-gray-600 dark:text-gray-400 sm:mt-20 sm:grid-cols-2 xl:mx-0 xl:max-w-none xl:grid-flow-col xl:grid-cols-4">
          <figure className="rounded-2xl bg-background shadow-lg ring-1 ring-gray-900/5 dark:ring-gray-600 sm:col-span-2 xl:col-start-2 xl:row-end-1">
            <blockquote className="p-6 text-lg font-semibold leading-7 tracking-tight text-gray-600 dark:text-gray-400 sm:p-12 sm:text-xl sm:leading-8">
              <p>{`“${featuredTestimonial.body}”`}</p>
            </blockquote>
            <figcaption className="flex flex-wrap items-center gap-x-4 gap-y-4 border-t border-gray-900/10 px-6 py-4 sm:flex-nowrap">
              <Image
                className="h-10 w-10 flex-none rounded-full bg-gray-50"
                src={featuredTestimonial.author.imageUrl}
                alt=""
                width={40}
                height={40}
              />
              <div className="flex-auto">
                <div className="font-semibold text-gray-900 dark:text-gray-300">
                  {featuredTestimonial.author.name}
                </div>
                <div className="text-gray-700 dark:text-gray-400">{`@${featuredTestimonial.author.handle}`}</div>
              </div>
            </figcaption>
          </figure>
          {testimonials.map((columnGroup, columnGroupIdx) => (
            <div
              key={columnGroupIdx}
              className="space-y-8 xl:contents xl:space-y-0"
            >
              {columnGroup.map((column, columnIdx) => (
                <div
                  key={columnIdx}
                  className={clsx(
                    (columnGroupIdx === 0 && columnIdx === 0) ||
                      (columnGroupIdx === testimonials.length - 1 &&
                        columnIdx === columnGroup.length - 1)
                      ? "xl:row-span-2"
                      : "xl:row-start-1",
                    "space-y-8",
                  )}
                >
                  {column.map((testimonial) => (
                    <figure
                      key={testimonial.author.handle}
                      className="rounded-2xl bg-background p-6 shadow-lg ring-1 ring-gray-900/5 dark:ring-gray-600"
                    >
                      <blockquote className="text-gray-600 dark:text-gray-400">
                        <p>{`“${testimonial.body}”`}</p>
                      </blockquote>
                      <figcaption className="mt-6 flex items-center gap-x-4">
                        <Image
                          className="h-10 w-10 rounded-full bg-gray-50"
                          src={testimonial.author.imageUrl}
                          alt=""
                          width={40}
                          height={40}
                        />
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-gray-300">
                            {testimonial.author.name}
                          </div>
                          {testimonial.author.handle ? (
                            <div className="text-gray-700 dark:text-gray-400">
                              @{testimonial.author.handle}
                            </div>
                          ) : undefined}
                        </div>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

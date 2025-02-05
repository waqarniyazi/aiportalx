import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";

interface MyFormProps {
  model?: {
    Organization?: string[];
    Model?: string;
    // ...other properties
  };
}

const formSchema = z.object({
  fullName: z.string().min(1).max(255),
  email: z.string().email().min(1).max(255),
  myNumber: z.string().regex(/^\d{10,15}$/, "Invalid phone number"),
  dateOfBirth: z.date(),
  company: z.string().min(1).max(255),
  industry: z.string(),
  jobRole: z.string(),
  workEmail: z.string().email().min(1).max(9999999999),
  newsletter: z.boolean(),
});

const languagee = [
  { label: "Healthcare", value: "healthcare" },
  { label: "Finance", value: "finance" },
  { label: "Education", value: "education" },
  { label: "Retail/E-commerce", value: "retail" },
  { label: "Manufacturing", value: "manufacturing" },
  { label: "Media/Entertainment", value: "media" },
  { label: "Other", value: "other" },
];

const job = [
  { label: "Developer/Engineer", value: "dev/eng" },
  { label: "Data Scientist", value: "datasci" },
  { label: "Product Manager", value: "PM" },
  { label: "Business Executive", value: "BE" },
  { label: "Content/SEO", value: "SEO" },
  { label: "Student/Academic", value: "student" },
];

export function MyForm({ model }: MyFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      myNumber: "",
      dateOfBirth: "",
      company: "",
      industry: "",
      jobRole: "",
      workEmail: "",
      newsletter: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch("/api/ModelCTA", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        window.location.href = "/refining";
      } else {
        alert("Failed to submit data!");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  }

  return (
    <Form {...form}>
      <div className="mx-auto ml-2 w-full p-6 sm:max-w-md lg:max-w-xl">
        {model && (
          <div className="mb-4 flex items-center space-x-2">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={`/OrganizationIcons/${model.Organization?.[0]
                  ?.toLowerCase()
                  .replace(/\s+/g, "_")}.png`}
                alt={model.Organization?.[0]}
              />
              <AvatarFallback>
                <img
                  src="/avatarfallback.png"
                  alt="Avatar Fallback"
                  className="h-full w-full rounded-full object-contain"
                />
              </AvatarFallback>
            </Avatar>
            <h2 className="text-lg font-semibold">
              {" "}
              Test {model.Model} AI model on AIPortalX{" "}
            </h2>
          </div>
        )}

        <form
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8max-h-full overflow-y-auto"
        >
          <div className="grid gap-4 pt-3 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem className="flex-1 pl-1 pr-1">
                  <FormLabel className="text-sm font-normal">Name</FormLabel>
                  <FormControl>
                    <Input
                      className="h-8 max-w-xs text-sm placeholder:text-xs"
                      placeholder="Enter your name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-1 pl-1 pr-1">
                  <FormLabel className="text-sm font-normal">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Email"
                      className="h-8 text-sm placeholder:text-xs"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-4 pt-2 sm:grid-cols-3">
            <FormField
              control={form.control}
              name="myNumber"
              render={({ field }) => (
                <FormItem className="mt-2 flex-1 pl-1 pr-1">
                  <FormLabel className="text-sm font-normal">
                    Phone Number
                  </FormLabel>
                  <FormControl>
                    <PhoneInput
                      country={"in"}
                      value={field.value ? String(field.value) : ""}
                      onChange={(phone) => field.onChange(phone)}
                      inputProps={{
                        name: "phone",
                        required: true,
                        autoComplete: "off",
                      }}
                      inputStyle={{
                        width: "100%",
                        height: "2rem", // Reduced height
                        fontSize: "0.75rem", // Smaller text
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem className="mt-2 flex-1 pl-1 pr-1">
                  <FormLabel className="mt-2 text-sm font-normal">
                    Date of Birth
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "h-8 w-[240px] justify-start text-left text-sm font-normal placeholder:text-xs",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(new Date(field.value), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        captionLayout="dropdown-buttons"
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={(value: Date | undefined) => {
                          if (value) {
                            field.onChange(value);
                          }
                        }}
                        fromYear={1960}
                        toYear={2030}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-4 pt-2 sm:grid-cols-3">
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem className="flex-1 pl-1 pr-1">
                  <FormLabel className="text-sm font-normal">Company</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Company Name"
                      className="h-8 text-sm placeholder:text-xs"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="jobRole"
              render={({ field }) => (
                <FormItem className="flex-1 pl-1 pr-1">
                  <FormLabel className="mt-2 text-sm font-normal">
                    Job Role
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="h-8 w-full justify-between text-sm font-normal text-gray-500 placeholder:text-xs"
                        >
                          {field.value
                            ? job.find((item) => item.value === field.value)
                                ?.label
                            : "Select job role"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search job role..."
                          className="h-8 text-sm placeholder:text-xs"
                        />
                        <CommandEmpty>No roles found.</CommandEmpty>
                        <CommandGroup>
                          {job.map((item) => (
                            <CommandItem
                              key={item.value}
                              value={item.label}
                              onSelect={() =>
                                form.setValue("jobRole", item.value)
                              }
                            >
                              <Check
                                className={`mr-2 h-4 w-4 ${
                                  item.value === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                }`}
                              />
                              {item.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem className="flex-1 pl-1 pr-1">
                  <FormLabel className="mt-2 text-sm font-normal">
                    Industry
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="h-8 w-full justify-between text-sm font-normal text-gray-500 placeholder:text-xs"
                        >
                          {field.value
                            ? languagee.find(
                                (item) => item.value === field.value,
                              )?.label
                            : "Select industry"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search industry..."
                          className="h-8 text-sm placeholder:text-xs"
                        />
                        <CommandEmpty>No industry found.</CommandEmpty>
                        <CommandGroup>
                          {languagee.map((item) => (
                            <CommandItem
                              value={item.label}
                              key={item.value}
                              onSelect={() =>
                                form.setValue("industry", item.value)
                              }
                            >
                              <Check
                                className={`mr-2 h-4 w-4 ${
                                  item.value === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                }`}
                              />
                              {item.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="workEmail"
            render={({ field }) => (
              <FormItem className="mt-2 flex-1 pl-1 pr-1">
                <FormLabel className="mt-2 text-sm font-normal">
                  Work Email
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Work Email"
                    className="h-8 text-sm placeholder:text-xs"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="inline-flex items-center space-y-2 pt-2">
            <FormField
              name="newsletter"
              control={form.control}
              render={({ field }) => (
                <FormItem className="inline-flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="pt-2"
                    />
                  </FormControl>
                  <FormLabel className="-mt-2 inline-flex p-0 text-xs font-normal">
                    Subscribe to newsletter
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>
          <div className="pt-5">
            <Button disabled={form.formState.isSubmitting} type="submit">
              {form.formState.isSubmitting && (
                <LoaderCircle
                  className="-ms-1 me-2 animate-spin"
                  size={16}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              )}
              Submit
            </Button>
          </div>
          <div className="pt-3">
            <p className="text-xs text-gray-400">
              By clicking Submit, you agree to our{" "}
              <a href="/terms" className="underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="underline">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </form>
      </div>
    </Form>
  );
}

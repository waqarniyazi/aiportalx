import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/utils";

export function StatsCards(props: {
  stats: {
    name: string;
    value: string | number;
    subvalue?: string;
    icon: React.ReactNode;
  }[];
}) {
  return (
    <div
      className={cn(
        "grid gap-2 md:grid-cols-2 md:gap-4",
        props.stats.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4",
      )}
    >
      {props.stats.map((stat) => {
        return (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="">
                <span className="text-2xl font-bold">{stat.value}</span>
                <span className="ml-2 text-sm text-muted-foreground">
                  {stat.subvalue}
                </span>
              </div>
              {/* <p className="text-muted-foreground text-xs">{stat.subvalue}</p> */}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

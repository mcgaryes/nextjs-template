import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface UserProfileLoadingProps {
  indicator?: ReactNode;
  text?: string;
}

export function UserProfileLoading(props: UserProfileLoadingProps) {
  const { indicator, text = "Loading" } = props;

  return (
    <Card className="w-full">
      <CardContent className="flex items-center gap-4 p-4">
        {indicator ?? (
          <>
            <div className="h-12 w-12 animate-pulse rounded-full bg-muted" />
            <div className="flex flex-col gap-2">
              <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              <div className="h-4 w-32 animate-pulse rounded bg-muted" />
            </div>
          </>
        )}
        {indicator ? null : text ? (
          <span className="sr-only">{text}</span>
        ) : null}
      </CardContent>
    </Card>
  );
}

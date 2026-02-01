import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface UserProfileErroredProps {
  message?: string;
  action?: ReactNode;
}

export function UserProfileErrored(props: UserProfileErroredProps) {
  const { message = "Failed to load user profile", action } = props;

  return (
    <Card className="w-full">
      <CardContent className="space-y-3 p-4">
        <p className="text-sm text-destructive">{message}</p>
        {action ? <div>{action}</div> : null}
      </CardContent>
    </Card>
  );
}

import { Card, CardContent } from "@/components/ui/card";

interface UserProfileEmptyProps {
  message?: string;
}

export function UserProfileEmpty(props: UserProfileEmptyProps) {
  const { message = "No user data available" } = props;

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  );
}

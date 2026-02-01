"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserProfileViewProps {
  name: string;
  email: string;
  avatarUrl?: string;
  onClick?: () => void;
}

export function UserProfileView(props: UserProfileViewProps) {
  const { name, email, avatarUrl, onClick } = props;

  const [isHovered, setIsHovered] = useState(false);

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card
      className={`w-full transition-shadow ${isHovered ? "shadow-md" : ""} ${onClick ? "cursor-pointer" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <CardContent className="flex items-center gap-4 p-4">
        <Avatar className="h-12 w-12">
          <AvatarImage
            src={avatarUrl ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`}
            alt={name}
          />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-medium">{name}</span>
          <span className="text-sm text-muted-foreground">{email}</span>
        </div>
      </CardContent>
    </Card>
  );
}

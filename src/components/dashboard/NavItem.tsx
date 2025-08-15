
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem = ({ icon, label, isActive, onClick }: NavItemProps) => {
  return (
    <li>
      <Button 
        variant="ghost" 
        className={cn(
          "w-full justify-start",
          isActive 
            ? "bg-warning-purple/20 text-warning-purple" 
            : "text-white/60 hover:bg-warning-purple/10 hover:text-white"
        )}
        onClick={onClick}
      >
        {icon}
        {label}
      </Button>
    </li>
  );
};

export default NavItem;

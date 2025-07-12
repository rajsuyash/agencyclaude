import { type ClassValue, clsx } from "clsx";
import { cva } from "class-variance-authority";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-apple focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export const cardVariants = cva(
  "rounded-2xl border bg-card text-card-foreground shadow-apple transition-apple",
  {
    variants: {
      size: {
        default: "p-6",
        sm: "p-4",
        lg: "p-8",
      },
      hover: {
        true: "hover:shadow-apple-lg hover:-translate-y-1",
        false: "",
      },
    },
    defaultVariants: {
      size: "default",
      hover: false,
    },
  }
);

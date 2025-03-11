import { cn } from "@/shadcn/lib/utils";

export interface ISVGProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

export interface LoadingSpinnerProps extends ISVGProps {
  visible?: boolean; // Prop to toggle visibility
}

export const LoadingSpinner = ({
  size = 48,
  className,
  visible = true, // Default is false
  ...props
}: LoadingSpinnerProps) => {
  if (!visible) return null; // Return null if not visible

  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0 flex justify-center items-center z-50">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          {...props}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn("animate-spin", className)}
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      </div>
    </div>
  );
};

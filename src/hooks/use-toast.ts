
import { useToast as useToastUI } from "@/components/ui/use-toast";
import type { ToastActionElement, ToastProps } from "@/components/ui/toast";

type ToastPropsWithoutChildren = Omit<ToastProps, "children">

// Define the type for toast parameters
export interface Toast extends ToastPropsWithoutChildren {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
}

// Export the toast function that can be imported anywhere
export const toast = ({ ...props }: Toast) => {
  const { toast } = useToastUI();
  return toast(props);
};

// Export the hook for use in components
export const useToast = () => {
  const { toast, ...rest } = useToastUI();

  return {
    toast: ({ ...props }: Toast) => toast(props),
    ...rest
  };
};

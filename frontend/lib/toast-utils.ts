const successToastStyle = { background: "rgb(34 197 94)", color: "#fff" };

const showToast = (toast: any, message: string, isSuccess: boolean) => {
  toast({
    description: message,
    duration: isSuccess ? 3000 : 5000,
    ...(isSuccess ? { style: successToastStyle } : { variant: "destructive" }),
  });
};

export const withErrorHandling =
  <T extends (...args: any[]) => Promise<void>>(
    action: T,
    successMessage: string,
    defaultErrorMessage: string,
    toast: any
  ) =>
  async (...args: Parameters<T>): Promise<void> => {
    try {
      await action(...args);
      showToast(toast, successMessage, true);
    } catch (error) {
      console.error(`Error: ${defaultErrorMessage}`, error);
      let errorMessage = defaultErrorMessage;
      if (error instanceof Error && error.message) {
        errorMessage = error.message;
      }
      showToast(toast, errorMessage, false);
    }
  };

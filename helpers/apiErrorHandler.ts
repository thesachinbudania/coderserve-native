import errorHandler from "./general/errorHandler";

const handleApiError = (error: any, setError: any) => {
  const response = error?.response || {};
  const { data, status } = response;

  // Clear previous server errors
  setError("root", { type: "server" });
  // Handle 405 Method Not Allowed and similar standard errors
  if (status === 405 || data?.detail) {
    setError("root", {
      type: "server",
      message: data?.detail || "This action is not allowed",
    });
    return;
  }

  // Handle validation errors (field-specific and non-field)
  if (data) {
    let hasHandledErrors = false;

    // Handle field-specific errors
    Object.entries(data).forEach(([field, messages]) => {
      if (field === 'non_field_errors' || field === 'detail') return;
      const message = Array.isArray(messages) ? messages[0] : messages;
      if (field === '0') {
        setError('root', {
          type: 'server',
          message,
        })
      }
      if (message) {
        setError(field, {
          type: "server",
          message,
        });
        hasHandledErrors = true;
      }
    });

    // Handle non-field errors
    if (data.non_field_errors) {
      const message = Array.isArray(data.non_field_errors)
        ? data.non_field_errors[0]
        : data.non_field_errors;
      setError("root", {
        type: "server",
        message,
      });
      hasHandledErrors = true;
    }

    if (hasHandledErrors) return;
  }

  // Fallback for unhandled errors
  setError("root", {
    type: "server",
    message: "Something went wrong. Please try again later.",
  });
  errorHandler(error);
};

export default handleApiError;

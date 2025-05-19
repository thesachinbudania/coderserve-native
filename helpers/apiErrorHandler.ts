const handleApiError = (error: any, setError: any) => {
	let errors = 0;
	// Check if error response contains field-specific errors
	if (error?.response?.data) {
		const { data } = error.response;

		// Handle field-specific errors (e.g., email, password, etc.)
		Object.keys(data).forEach((field) => {
			if (data[field]) {
				setError(field, {
					type: "server",
					message: data[field][0], // Take the first error message
				});
				errors += 1;
			}
		});

		// Handle non-field errors (if any)
		if (data.non_field_errors) {
			setError("root", {
				type: "server",
				message: data.non_field_errors[0],
			});
			errors += 1;
		}
	} else {
		// Handle generic error (e.g., network issues)
		setError("root", {
			type: "server",
			message: "Something went wrong. Please try again later.",
		});
		errors += 1;
	}
	if (errors === 0) {
		setError("root", {
			type: "server",
			message: "An unknown error occurred.",
		});
	}
};

export default handleApiError;

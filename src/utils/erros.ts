export function processServerError(error: any) {
  if (error.response?.data?.message === "This resource already exists") {
    return {
      message: "A user with this email already exists",
      duplicateUser: true,
    };
  } else {
    return {
      unknownError: true,
      message: "Something has gone wrong, please try again",
    };
  }
}

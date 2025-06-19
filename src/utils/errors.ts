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

export function processLoggingInError(error: any) {
  if (error.status === 401)
    return {
      authenticationError: true,
      message: "Incorrect email address or password",
    };
  else {
    return {
      unknownError: true,
      message: "Something has gone wrong, please try again",
    };
  }
}

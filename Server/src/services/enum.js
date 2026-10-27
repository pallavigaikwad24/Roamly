const HTTP_CODE = {
  // 1xx: Informational
  CONTINUE: { code: 100, message: "Please continue your request." },
  SWITCHING_PROTOCOLS: { code: 101, message: "The server is switching protocols as requested." },
  EARLY_HINTS: { code: 103, message: "Preparing your request for processing." },

  // 2xx: Success
  OK: { code: 200, message: "Request completed successfully." },
  CREATED: { code: 201, message: "Your resource has been created successfully." },
  ACCEPTED: { code: 202, message: "Your request has been accepted for processing." },
  NON_AUTHORITATIVE_INFORMATION: { code: 203, message: "Information returned may not be authoritative." },
  NO_CONTENT: { code: 204, message: "Request successful, but there's no content to return." },
  RESET_CONTENT: { code: 205, message: "Please reset the content for this request." },
  PARTIAL_CONTENT: { code: 206, message: "Partial content delivered successfully." },

  // 3xx: Redirection
  MULTIPLE_CHOICES: { code: 300, message: "There are multiple options for this request." },
  MOVED_PERMANENTLY: { code: 301, message: "This resource has been moved permanently." },
  FOUND: { code: 302, message: "This resource has been temporarily moved." },
  SEE_OTHER: { code: 303, message: "Check another location for the requested resource." },
  NOT_MODIFIED: { code: 304, message: "The resource has not been modified." },
  TEMPORARY_REDIRECT: { code: 307, message: "The resource is temporarily redirected." },
  PERMANENT_REDIRECT: { code: 308, message: "The resource has been permanently redirected." },

  // 4xx: Client Errors
  BAD_REQUEST: { code: 400, message: "The server couldn't understand your request." },
  UNAUTHORIZED: { code: 401, message: "You need to log in to access this resource." },
  FORBIDDEN: { code: 403, message: "You don't have permission to access this resource." },
  NOT_FOUND: { code: 404, message: "The requested resource could not be found." },

  // 5xx: Server Errors
  INTERNAL_SERVER_ERROR: { code: 500, message: "An error occurred on the server. Please try again later." },
};

module.exports = HTTP_CODE;

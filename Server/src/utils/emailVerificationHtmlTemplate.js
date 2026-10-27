// The link has to point at the browser-facing origin of the React app, which
// is not always where this request arrived. APP_PUBLIC_URL wins when set (local
// dev, where the app is on Vite's port, and any real deployment behind a domain
// or HTTPS); otherwise the request's own host is correct, because the
// single-container build serves the API and the app on the same origin.
const publicBaseUrl = (host) =>
    (process.env.APP_PUBLIC_URL || `http://${host}`).replace(/\/+$/, "");

const emailVerificationHtmlTemplate = (host, token) =>
    `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }

        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .email-header {
            background-color: #4CAF50;
            color: #ffffff;
            text-align: center;
            padding: 20px;
        }

        .email-body {
            padding: 20px;
            line-height: 1.6;
            color: #333333;
        }

        .email-body h1 {
            margin: 0 0 20px;
        }

        .email-footer {
            background-color: #f4f4f4;
            text-align: center;
            padding: 10px;
            font-size: 14px;
            color: #777777;
        }

        .btn {
            display: inline-block;
            margin: 20px 0;
            padding: 12px 20px;
            font-size: 16px;
            background-color: #4CAF50;
            color: #ffffff;
            text-decoration: none;
            border-radius: 4px;
        }

        .btn:hover {
            background-color: #45a049;
        }

        @media (max-width: 600px) {
            .email-body {
                font-size: 16px;
            }

            .btn {
                padding: 10px 15px;
                font-size: 14px;
            }
        }
    </style>
</head>

<body>
    <div class="email-container">
        <!-- Header -->
        <div class="email-header">
            <h1>Email Verification</h1>
        </div>

        <!-- Body -->
        <div class="email-body">
            <a href="${publicBaseUrl(host)}/email-verification/${token}" class="btn">Verify Email</a>
            <p>
                If you didn’t sign up for an account, you can safely ignore this email.
            </p>
        </div>

        <!-- Footer -->
        <div class="email-footer">
            <p>
                If you have any questions, feel free to contact us at <a href="mailto:support@example.com">support@example.com</a>.
            </p>
            <p>Thank you for choosing Travelling App!</p>
        </div>
    </div>
</body>

</html>


`;

module.exports = emailVerificationHtmlTemplate;
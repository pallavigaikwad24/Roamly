const otpEmailHtmlTemplate = (otpCode) =>
    `
  <!DOCTYPE html>
  <html lang="en">
  
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>OTP Login</title>
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
              background-color: #007BFF;
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
              font-size: 24px;
          }
  
          .otp-code {
              display: inline-block;
              font-size: 20px;
              font-weight: bold;
              background-color: #f9f9f9;
              border: 1px dashed #007BFF;
              padding: 10px 20px;
              color: #007BFF;
              border-radius: 4px;
              margin: 20px 0;
          }
  
          .email-footer {
              background-color: #f4f4f4;
              text-align: center;
              padding: 10px;
              font-size: 14px;
              color: #777777;
          }
  
          a {
              color: #007BFF;
              text-decoration: none;
          }
  
          a:hover {
              text-decoration: underline;
          }
  
          @media (max-width: 600px) {
              .email-body {
                  font-size: 16px;
              }
  
              .otp-code {
                  font-size: 18px;
              }
          }
      </style>
  </head>
  
  <body>
      <div class="email-container">
          <!-- Header -->
          <div class="email-header">
              <h1>OTP Login</h1>
          </div>
  
          <!-- Body -->
          <div class="email-body">
              <div class="otp-code">${otpCode}</div>
              <p>
                  This OTP is valid for 10 minutes. Please do not share it with anyone.
              </p>
              <p>
                  If you did not request this OTP, please ignore this email or contact us immediately.
              </p>
          </div>
  
          <!-- Footer -->
          <div class="email-footer">
              <p>
                  Need help? Contact us at <a href="mailto:support@example.com">support@example.com</a>.
              </p>
              <p>Thank you for using Travelling App!</p>
          </div>
      </div>
  </body>
  
  </html>
  `;

module.exports = otpEmailHtmlTemplate;

export const WelcomeEmail = (username = "there") => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Welcome to Yarny</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f8f9fa;
      color: #333;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      background: #ffffff;
      border-radius: 8px;
      padding: 30px;
      margin: auto;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    h1 {
      color: #5a67d8;
    }
    p {
      font-size: 16px;
      line-height: 1.6;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #888;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>👋 Welcome to Yarny, ${username}!</h1>
    <p>Thanks for signing up for <strong>Yarny</strong> — your new favorite chat app!</p>
    <p>We're thrilled to have you here. Start chatting, sharing, and connecting!</p>
    <p>Cheers,<br/>– The Yarny Team</p>
    <div class="footer">
      © ${new Date().getFullYear()} Yarny Inc.
    </div>
  </div>
</body>
</html>
`;
export const ResetPasswordEmail = (resetLink, username = "there") => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Reset Your Password</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      color: #333;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: auto;
      background: #fff;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    h2 {
      color: #5a67d8;
    }
    p {
      font-size: 15px;
      line-height: 1.6;
    }
    .btn {
      display: inline-block;
      background-color: #5a67d8;
      color: #fff;
      padding: 12px 20px;
      text-decoration: none;
      border-radius: 5px;
      margin-top: 20px;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #888;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Hello ${username},</h2>
    <p>You recently requested to reset your password for your Yarny account. Click the button below to reset it:</p>
    <a href="${resetLink}" class="btn">Reset Password</a>
    <p>This password reset link is valid for the next 1 hour. If you didn’t request this, please ignore this email or contact support.</p>
    <p>Stay secure,<br/>The Yarny Team</p>
    <div class="footer">
      © ${new Date().getFullYear()} Yarny Inc. All rights reserved.
    </div>
  </div>
</body>
</html>
`;
export const PasswordResetConfirmationEmail = (username = "there") => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Password Reset Successful</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f9fafb;
      color: #333;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: auto;
      background: #fff;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }
    h2 {
      color: #38a169;
    }
    p {
      font-size: 16px;
      line-height: 1.6;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #999;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Password Changed Successfully</h2>
    <p>Hi ${username},</p>
    <p>This is a confirmation that your Yarny account password was successfully updated.</p>
    <p>If you didn't perform this action, please reset your password again or contact support immediately.</p>
    <p>Thanks for keeping your account secure!<br/>– The Yarny Team</p>
    <div class="footer">
      © ${new Date().getFullYear()} Yarny Inc. All rights reserved.
    </div>
  </div>
</body>
</html>
`;

export const VerificationEmail = (verifyLink, username = "there") => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Verify Your Email</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f9fafb;
      color: #333;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: auto;
      background: #ffffff;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.06);
    }
    h2 {
      color: #5a67d8;
    }
    p {
      font-size: 15px;
      line-height: 1.6;
    }
    a.verify-btn {
      display: inline-block;
      margin-top: 20px;
      padding: 12px 20px;
      background-color: #5a67d8;
      color: #fff;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #999;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Welcome to Yarny, ${username}!</h2>
    <p>Thanks for joining our community 🎉</p>
    <p>Please verify your email address to activate your Yarny account:</p>
    <a href="${verifyLink}" class="verify-btn">Verify Email</a>
    <p>If you did not create this account, you can safely ignore this message.</p>
    <div class="footer">
      © ${new Date().getFullYear()} Yarny Inc. All rights reserved.
    </div>
  </div>
</body>
</html>
`;

export const verificationEmail = (VERIFICATION_LINK: string): string => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Verification</title>
  </head>
  <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
      <h2 style="color: #333333;">Verify Your Email</h2>
      <p style="color: #555555; font-size: 16px;">
        Thank you for signing up! Please verify your email address by clicking the button below.
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${VERIFICATION_LINK}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-size: 16px;">
          Verify Email
        </a>
      </div>
      <p style="color: #888888; font-size: 14px;">
        If you didn’t request this, you can ignore this email.
      </p>
    </div>
  </body>
</html>
`;
};

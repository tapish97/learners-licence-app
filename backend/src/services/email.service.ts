export const sendEmailToAdmin = (submissionId: string, userEmail: string) => {
  console.log(`📩 New submission received: ID ${submissionId}, from ${userEmail}`);
};

export const sendConfirmationToUser = (userEmail: string, submissionId: string) => {
  console.log(`✅ Confirmation email sent to ${userEmail} for submission ID ${submissionId}`);
};

export const sendStatusUpdateToUser = (
  email: string,
  submissionId: string,
  status: string
) => {
  console.log(`📢 Status update email sent to ${email} for ID ${submissionId}: ${status}`);
};

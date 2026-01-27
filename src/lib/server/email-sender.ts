import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
if (!resendApiKey) {
	console.warn("RESEND_API_KEY not set. Email sending will not work.");
}

const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function sendVerificationEmail(email: string, code: string): Promise<void> {
	if (!resend) {
		console.log(`[TEST] Verification code for ${email}: ${code}`);
		return;
	}

	try {
		await resend.emails.send({
			from: process.env.EMAIL_FROM || "onboarding@resend.dev",
			to: email,
			subject: "Verify your email",
			html: `
				<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
					<h2>Verify your email</h2>
					<p>Your verification code is:</p>
					<div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
						<code style="font-size: 24px; font-weight: bold; letter-spacing: 2px;">${code}</code>
					</div>
					<p>This code expires in 10 minutes.</p>
					<p>If you didn't request this, you can ignore this email.</p>
				</div>
			`
		});
	} catch (err) {
		console.error("Failed to send verification email:", err);
	}
}

export async function sendPasswordResetEmail(email: string, code: string): Promise<void> {
	if (!resend) {
		console.log(`[TEST] Password reset code for ${email}: ${code}`);
		return;
	}

	try {
		await resend.emails.send({
			from: process.env.EMAIL_FROM || "onboarding@resend.dev",
			to: email,
			subject: "Reset your password",
			html: `
				<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
					<h2>Reset your password</h2>
					<p>Your password reset code is:</p>
					<div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
						<code style="font-size: 24px; font-weight: bold; letter-spacing: 2px;">${code}</code>
					</div>
					<p>This code expires in 10 minutes.</p>
					<p>If you didn't request this, you can ignore this email.</p>
				</div>
			`
		});
	} catch (err) {
		console.error("Failed to send password reset email:", err);
	}
}

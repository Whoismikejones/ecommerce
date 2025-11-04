// "use server";

// import { EmailTemplate } from "@/components/ui/email-template";
// import { Resend } from "resend";
// import { z } from "zod";
// import { emailFormSchema } from "@/lib/validators";

// const resend = new Resend(process.env.RESEND_API_KEY);

// export const send = async (emailFormData: z.infer<typeof emailFormSchema>) => {
//   try {
//     console.log("Sending email with data:", emailFormData);

//     const { error } = await resend.emails.send({
//       from: `Snap-Controls <${process.env.RESEND_FROM_EMAIL}>`,
//       to: [process.env.CONTACT_FORM_RECIPIENT_EMAIL!],
//       replyTo: emailFormData.email,
//       subject: `New Contact Form: ${emailFormData.firstName} ${emailFormData.lastName}`,
//       react: EmailTemplate({
//         firstName: emailFormData.firstName,
//         lastName: emailFormData.lastName,
//         email: emailFormData.email,
//         message: emailFormData.message,
//         companyName: emailFormData.companyName,
//       }) as React.ReactElement,
//     });

//     if (error) {
//       console.error("Resend error:", error);
//       return { success: false, error: error.message };
//     }

//     console.log("Email sent successfully!");
//     return { success: true };
//   } catch (e) {
//     console.error("Email send error:", e);
//     return {
//       success: false,
//       error: e instanceof Error ? e.message : "Failed to send email",
//     };
//   }
// };

//html

"use server";

import { Resend } from "resend";
import { z } from "zod";
import { emailFormSchema } from "@/lib/validators";

const resend = new Resend(process.env.RESEND_API_KEY);

export const send = async (emailFormData: z.infer<typeof emailFormSchema>) => {
  try {
    console.log("Sending email with data:", emailFormData);

    const { error } = await resend.emails.send({
      from: `Snap-Controls <${process.env.RESEND_FROM_EMAIL}>`,
      to: [process.env.CONTACT_FORM_RECIPIENT_EMAIL!],
      replyTo: emailFormData.email,
      subject: `New Contact Form: ${emailFormData.firstName} ${emailFormData.lastName}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
          <h1 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            New Contact Form Submission
          </h1>
          
          <div style="margin-top: 20px;">
            <p><strong>Name:</strong> ${emailFormData.firstName} ${emailFormData.lastName}</p>
            <p><strong>Email:</strong> ${emailFormData.email}</p>
            ${emailFormData.companyName ? `<p><strong>Company:</strong> ${emailFormData.companyName}</p>` : ''}
            
            <div style="margin-top: 20px; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
              <strong>Message:</strong>
              <p style="margin-top: 10px; white-space: pre-wrap;">${emailFormData.message}</p>
            </div>
          </div>
          
          <div style="margin-top: 30px; font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 10px;">
            <p>This email was sent from your contact form.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error: error.message };
    }

    console.log("Email sent successfully!");
    return { success: true };
  } catch (e) {
    console.error("Email send error:", e);
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to send email",
    };
  }
};
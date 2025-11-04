import * as React from "react";

interface EmailTemplateProps {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  companyName?: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
  lastName,
  email,
  message,
  companyName,
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '600px' }}>
    <h1 style={{ color: '#333', borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>
      New Contact Form Submission
    </h1>
    
    <div style={{ marginTop: '20px' }}>
      <p><strong>Name:</strong> {firstName} {lastName}</p>
      <p><strong>Email:</strong> {email}</p>
      {companyName && <p><strong>Company:</strong> {companyName}</p>}
      
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
        <strong>Message:</strong>
        <p style={{ marginTop: '10px', whiteSpace: 'pre-wrap' }}>{message}</p>
      </div>
    </div>
    
    <div style={{ marginTop: '30px', fontSize: '12px', color: '#666', borderTop: '1px solid #ddd', paddingTop: '10px' }}>
      <p>This email was sent from your contact form.</p>
    </div>
  </div>
);

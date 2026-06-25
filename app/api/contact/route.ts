import { NextRequest, NextResponse } from 'next/server';
import { submitContactForm, trackEvent } from '@/lib/data-access';
import { ContactSubmission } from '@/lib/types';
import { z } from 'zod';
import nodemailer from 'nodemailer';

// Rate limiting (in production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address').max(255),
  subject: z.string().max(255).optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
  phone: z.string().max(20).optional(),
  service_type: z.string().max(100).optional(),
  utm_source: z.string().max(100).optional(),
  utm_medium: z.string().max(100).optional(),
  utm_campaign: z.string().max(100).optional(),
  utm_term: z.string().max(100).optional(),
  utm_content: z.string().max(100).optional(),
});

function getRateLimitKey(ip: string): string {
  return `contact_${ip}`;
}

function isRateLimited(ip: string): boolean {
  const key = getRateLimitKey(ip);
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 5; // Max 5 contact form submissions per 15 minutes

  const record = rateLimitMap.get(key);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return false;
  }
  
  if (record.count >= maxRequests) {
    return true;
  }
  
  record.count++;
  return false;
}

// Helper function to get client IP
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  return '127.0.0.1';
}

async function sendNotificationEmail(contactData: ContactSubmission): Promise<void> {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    console.warn('SMTP configuration missing, skipping email notification');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #e86e2a, #0a447c); padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">New Contact Form Submission</h1>
      </div>
      
      <div style="padding: 20px; background: #f9f9f9;">
        <h2 style="color: #333; margin-top: 0;">Contact Details</h2>
        
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Name:</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${contactData.name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Email:</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${contactData.email}</td>
          </tr>
          ${contactData.phone ? `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Phone:</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${contactData.phone}</td>
          </tr>
          ` : ''}
          ${contactData.subject ? `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Subject:</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${contactData.subject}</td>
          </tr>
          ` : ''}
          ${contactData.service_type ? `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Service Type:</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${contactData.service_type}</td>
          </tr>
          ` : ''}
        </table>
        
        <h3 style="color: #333; margin-top: 20px;">Message:</h3>
        <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #e86e2a;">
          ${contactData.message.replace(/\n/g, '<br>')}
        </div>
        
        ${contactData.utm_source ? `
        <h3 style="color: #333; margin-top: 20px;">Marketing Attribution:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          ${contactData.utm_source ? `<tr><td style="padding: 5px; font-weight: bold;">Source:</td><td style="padding: 5px;">${contactData.utm_source}</td></tr>` : ''}
          ${contactData.utm_medium ? `<tr><td style="padding: 5px; font-weight: bold;">Medium:</td><td style="padding: 5px;">${contactData.utm_medium}</td></tr>` : ''}
          ${contactData.utm_campaign ? `<tr><td style="padding: 5px; font-weight: bold;">Campaign:</td><td style="padding: 5px;">${contactData.utm_campaign}</td></tr>` : ''}
        </table>
        ` : ''}
        
        <div style="margin-top: 20px; padding: 15px; background: #e8f4f8; border-radius: 5px;">
          <p style="margin: 0; color: #666; font-size: 12px;">
            Submitted: ${new Date(contactData.submitted_at).toLocaleString()}<br>
            IP Address: ${contactData.ip_address || 'Unknown'}<br>
            User Agent: ${contactData.user_agent || 'Unknown'}
          </p>
        </div>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.FROM_EMAIL || process.env.SMTP_USER,
    to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
    subject: `New Contact Form Submission - ${contactData.name}`,
    html: emailHtml,
    replyTo: contactData.email,
  });
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.ip || 
               request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // Check rate limiting
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Too many requests. Please try again later.',
          code: 'RATE_LIMITED'
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    
    // Validate input
    const validationResult = contactSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid input data',
          validation_errors: validationResult.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      );
    }

    const contactData: ContactSubmission = {
      name: validationResult.data.name || '',
      email: validationResult.data.email || '',
      phone: validationResult.data.phone,
      subject: validationResult.data.subject,
      message: validationResult.data.message || '',
      service_type: validationResult.data.service_type,
      utm_source: validationResult.data.utm_source,
      utm_medium: validationResult.data.utm_medium,
      utm_campaign: validationResult.data.utm_campaign,
      utm_term: validationResult.data.utm_term,
      utm_content: validationResult.data.utm_content,
      id: 0, // Will be set by database
      status: 'new',
      ip_address: getClientIP(request),
      user_agent: request.headers.get('user-agent') || '',
      submitted_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Submit to database
    const result = await submitContactForm(contactData);
    
    if (!result.success) {
      console.error('Failed to submit contact form:', result.error);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to submit contact form. Please try again.',
          code: 'DATABASE_ERROR'
        },
        { status: 500 }
      );
    }

    // Track analytics event
    await trackEvent({
      event_name: 'contact_form_submission',
      event_category: 'engagement',
      event_label: contactData.service_type || 'general',
      page_url: request.headers.get('referer') || undefined,
      utm_source: contactData.utm_source,
      utm_medium: contactData.utm_medium,
      utm_campaign: contactData.utm_campaign,
      utm_term: contactData.utm_term,
      utm_content: contactData.utm_content,
      ip_address: ip,
      user_agent: contactData.user_agent,
    });

    // Send notification email (async, don't wait)
    sendNotificationEmail(result.data!).catch(error => {
      console.error('Failed to send notification email:', error);
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you for your message. We will get back to you soon!',
      data: {
        id: result.data!.id,
        submitted_at: result.data!.submitted_at
      }
    });

  } catch (error) {
    console.error('Contact form submission error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error. Please try again later.',
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
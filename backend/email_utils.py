import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from config import SMTP_EMAIL, SMTP_PASSWORD, logger


def send_email(to_email: str, subject: str, body_html: str):
    if not SMTP_EMAIL or not SMTP_PASSWORD:
        logger.warning("SMTP credentials not configured, skipping email.")
        return
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"Sky Bound Martial Arts Academy <{SMTP_EMAIL}>"
        msg["To"] = to_email
        msg.attach(MIMEText(body_html, "html"))

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(SMTP_EMAIL, SMTP_PASSWORD)
            server.sendmail(SMTP_EMAIL, to_email, msg.as_string())
        logger.info(f"Email sent to {to_email}: {subject}")
    except Exception as e:
        logger.error(f"Failed to send email to {to_email}: {e}")


def trial_accepted_email(student_name: str, to_email: str, program: str, preferred_date: str):
    subject = "Your Trial Class at Sky Bound Martial Arts Academy is Confirmed!"
    body = f"""
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px;">
      <div style="text-align:center;margin-bottom:24px;">
        <h1 style="color:#dc2626;font-size:22px;margin:0;">Sky Bound Martial Arts Academy</h1>
        <p style="color:#6b7280;font-size:13px;margin:4px 0;">Karate Do Sports Federation</p>
      </div>
      <h2 style="color:#111827;font-size:18px;">Hi {student_name},</h2>
      <p style="color:#374151;">Great news! Your trial class request has been <strong style="color:#16a34a;">accepted</strong>.</p>
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin:20px 0;">
        <p style="margin:4px 0;color:#374151;"><strong>Program:</strong> {program}</p>
        <p style="margin:4px 0;color:#374151;"><strong>Preferred Date:</strong> {preferred_date or 'To be confirmed'}</p>
      </div>
      <p style="color:#374151;">Our Sensei will contact you shortly to confirm the exact time and location.</p>
      <p style="color:#374151;">We look forward to welcoming you to the dojo!</p>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
      <p style="color:#6b7280;font-size:12px;text-align:center;">Sky Bound Martial Arts Academy &bull; skyboundmartialartsacademy@gmail.com &bull; +91 90357 07028</p>
    </div>
    """
    send_email(to_email, subject, body)


def trial_rejected_email(student_name: str, to_email: str):
    subject = "Update on Your Trial Class Request – Sky Bound Martial Arts Academy"
    body = f"""
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px;">
      <div style="text-align:center;margin-bottom:24px;">
        <h1 style="color:#dc2626;font-size:22px;margin:0;">Sky Bound Martial Arts Academy</h1>
        <p style="color:#6b7280;font-size:13px;margin:4px 0;">Karate Do Sports Federation</p>
      </div>
      <h2 style="color:#111827;font-size:18px;">Hi {student_name},</h2>
      <p style="color:#374151;">Thank you for your interest in our trial class. Unfortunately, we are unable to accommodate your request at this time.</p>
      <p style="color:#374151;">Please feel free to book another slot and we will do our best to find a suitable time for you.</p>
      <p style="color:#374151;">If you have any questions, don't hesitate to reach out to us directly.</p>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
      <p style="color:#6b7280;font-size:12px;text-align:center;">Sky Bound Martial Arts Academy &bull; skyboundmartialartsacademy@gmail.com &bull; +91 90357 07028</p>
    </div>
    """
    send_email(to_email, subject, body)


def booking_accepted_email(student_name: str, to_email: str, program: str, date: str):
    subject = "Your Trial Booking is Confirmed – Sky Bound Martial Arts Academy"
    body = f"""
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px;">
      <div style="text-align:center;margin-bottom:24px;">
        <h1 style="color:#dc2626;font-size:22px;margin:0;">Sky Bound Martial Arts Academy</h1>
        <p style="color:#6b7280;font-size:13px;margin:4px 0;">Karate Do Sports Federation</p>
      </div>
      <h2 style="color:#111827;font-size:18px;">Hi {student_name},</h2>
      <p style="color:#374151;">Your booking has been <strong style="color:#16a34a;">accepted</strong>!</p>
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin:20px 0;">
        <p style="margin:4px 0;color:#374151;"><strong>Program:</strong> {program}</p>
        <p style="margin:4px 0;color:#374151;"><strong>Date:</strong> {date}</p>
      </div>
      <p style="color:#374151;">Our Sensei will reach out to you shortly. See you at the dojo!</p>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
      <p style="color:#6b7280;font-size:12px;text-align:center;">Sky Bound Martial Arts Academy &bull; skyboundmartialartsacademy@gmail.com &bull; +91 90357 07028</p>
    </div>
    """
    send_email(to_email, subject, body)


def student_welcome_email(student_name: str, to_email: str, password: str, instructor_name: str, login_url: str):
    subject = "Welcome to Sky Bound Martial Arts Academy!"
    body = f"""
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px;">
      <div style="text-align:center;margin-bottom:24px;">
        <h1 style="color:#dc2626;font-size:22px;margin:0;">Sky Bound Martial Arts Academy</h1>
        <p style="color:#6b7280;font-size:13px;margin:4px 0;">Karate Do Sports Federation</p>
      </div>
      <h2 style="color:#111827;font-size:20px;">Congratulations, {student_name}! 🎉</h2>
      <p style="color:#374151;font-size:15px;">You have been officially enrolled at <strong>Sky Bound Martial Arts Academy</strong> under the guidance of <strong>{instructor_name}</strong>.</p>
      <p style="color:#374151;">Here are your login credentials to access your student portal:</p>
      <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:20px;margin:20px 0;">
        <p style="margin:6px 0;color:#374151;font-size:15px;"><strong>Email:</strong> {to_email}</p>
        <p style="margin:6px 0;color:#374151;font-size:15px;"><strong>Password:</strong> {password}</p>
        <p style="margin:12px 0 4px 0;"><a href="{login_url}" style="background:#dc2626;color:white;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:14px;">Login to Student Portal</a></p>
      </div>
      <p style="color:#6b7280;font-size:13px;">Please change your password after your first login.</p>
      <p style="color:#374151;">We are excited to have you on this journey. Train hard, stay disciplined!</p>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
      <p style="color:#6b7280;font-size:12px;text-align:center;">Sky Bound Martial Arts Academy &bull; skyboundmartialartsacademy@gmail.com &bull; +91 90357 07028</p>
    </div>
    """
    send_email(to_email, subject, body)


def booking_rejected_email(student_name: str, to_email: str):
    subject = "Update on Your Booking – Sky Bound Martial Arts Academy"
    body = f"""
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px;">
      <div style="text-align:center;margin-bottom:24px;">
        <h1 style="color:#dc2626;font-size:22px;margin:0;">Sky Bound Martial Arts Academy</h1>
        <p style="color:#6b7280;font-size:13px;margin:4px 0;">Karate Do Sports Federation</p>
      </div>
      <h2 style="color:#111827;font-size:18px;">Hi {student_name},</h2>
      <p style="color:#374151;">We regret to inform you that your booking could not be accepted at this time.</p>
      <p style="color:#374151;">Please try booking again for a different date or contact us directly and we will find a suitable slot for you.</p>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
      <p style="color:#6b7280;font-size:12px;text-align:center;">Sky Bound Martial Arts Academy &bull; skyboundmartialartsacademy@gmail.com &bull; +91 90357 07028</p>
    </div>
    """
    send_email(to_email, subject, body)

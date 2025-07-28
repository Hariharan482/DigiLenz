from services.asset_service import get_all_assets
from fastapi import APIRouter, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse
from fastapi import status
import smtplib
from email.message import EmailMessage

from core.config import settings

router = APIRouter()

SMTP_USER = settings.SMTP_USER
SMTP_PASS = settings.SMTP_PASS


@router.get("/api/all-assets")
async def all_assets():
    try:
        assets = get_all_assets()
        return {"assets": assets}
    except Exception as e:
        print(f"[ALL ASSETS ERROR] {e}")
        import traceback; traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to fetch all assets: {str(e)}")

@router.post("/api/send-asset-report")
async def send_asset_report(
    to: str = Form(...),
    subject: str = Form(...),
    content: str = Form(...),
    file: UploadFile = None
):
    try:
        msg = EmailMessage()
        msg["From"] = SMTP_USER
        msg["To"] = to
        msg["Subject"] = subject
        msg.set_content(content)

        if file:
            file_bytes = await file.read()
            msg.add_attachment(
                file_bytes,
                maintype="application",
                subtype="vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                filename=file.filename or "AssetReport.xlsx"
            )

        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASS)
            server.send_message(msg)

        return JSONResponse({"message": "Email sent successfully"}, status_code=status.HTTP_200_OK)
    except Exception as e:
        print(f"[EMAIL ERROR] {e}")
        import traceback; traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to send email: {str(e)}")

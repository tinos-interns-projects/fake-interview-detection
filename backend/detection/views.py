import threading

import json

import cv2

import mediapipe as mp

import numpy as np

import time



from django.http import JsonResponse, StreamingHttpResponse, HttpResponse

from django.views.decorators.csrf import csrf_exempt



from reportlab.platypus import SimpleDocTemplate, Paragraph

from reportlab.lib.styles import getSampleStyleSheet



from .models import InterviewSession, DetectionLog, UserRegister

from .shared import latest_data

from .behavior_analysis import analyze_behavior

from .lip_sync import analyze_lip_sync

from .suspicious import calculate_suspicious_score

from .decision_engine import update_history, make_decision





# ===============================

# GLOBALS

# ===============================

running = False

camera = None

output_frame = None

session = None

camera_thread = None





# ===============================

# ▶ CAMERA LOOP (THREAD)

# ===============================

def camera_loop():

    global running, camera, output_frame, session



    print("🎥 Camera loop started")

    

    try:

        mp_face = mp.solutions.face_detection

        face_detection = mp_face.FaceDetection(

            model_selection=0,

            min_detection_confidence=0.5

        )



        while running:

            if camera is None:

                print("❌ Camera not initialized")

                break

                

            success, frame = camera.read()

            if not success:

                print("❌ Failed to read frame from camera")

                time.sleep(0.1)

                continue



            frame = cv2.resize(frame, (480, 360))

            frame = cv2.flip(frame, 1)



            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

            results = face_detection.process(rgb)

            face_count = len(results.detections) if results.detections else 0



            # ✅ FULL AI ANALYSIS

            behavior = analyze_behavior(frame)

            lip = analyze_lip_sync(frame)

            score, _ = calculate_suspicious_score(face_count, behavior, lip)

            

            update_history(face_count, behavior, lip)

            final_status = make_decision(score)



            # DRAW DETECTIONS

            h, w, _ = frame.shape

            if results.detections:

                for detection in results.detections:

                    bbox = detection.location_data.relative_bounding_box

                    x = int(bbox.xmin * w)

                    y = int(bbox.ymin * h)

                    bw = int(bbox.width * w)

                    bh = int(bbox.height * h)



                    color = (0, 255, 0) if final_status == "Normal" else (0, 0, 255)

                    cv2.rectangle(frame, (x, y), (x + bw, y + bh), color, 2)



            # ADD TEXT INFO only in outer detection panel; keep frame clean

            # The video feed shows bounding boxes only, while the dashboard displays status text.



            # ===============================

            # SAVE TO DB

            # ===============================

            if session:

                DetectionLog.objects.create(

                    session=session,

                    face_count=face_count,

                    behavior=behavior,

                    lip_status=lip,

                    score=score,

                    final_status=final_status

                )



            # ===============================

            # UPDATE API DATA

            # ===============================

            latest_data["faces"] = face_count

            latest_data["behavior"] = behavior

            latest_data["lip"] = lip

            latest_data["score"] = score

            latest_data["final"] = final_status



            output_frame = frame.copy()



    except Exception as e:

        print(f"❌ Camera loop error: {e}")

    finally:

        print("🛑 Camera loop ended")





# ===============================

# ▶ START CAMERA

# ===============================

# @csrf_exempt

# def start_camera(request):

#     global running, camera, session, camera_thread



#     if running:

#         return JsonResponse({"status": "already running"})



#     print("🚀 Starting camera...")

    

#     # Try multiple camera backends

#     camera = None

#     for backend in [cv2.CAP_DSHOW, cv2.CAP_ANY]:

#         try:

#             camera = cv2.VideoCapture(0, backend)

#             if camera.isOpened():

#                 print(f"✅ Camera opened with backend: {backend}")

#                 break

#             camera.release()

#             camera = None

#         except Exception as e:

#             print(f"⚠️ Backend {backend} failed: {e}")

#             camera = None

    

#     if camera is None or not camera.isOpened():

#         return JsonResponse({"error": "Failed to access camera. Check if camera is connected and not in use by another application."}, status=400)



#     running = True



#     # Create user session

#     user = UserRegister.objects.first()

#     if not user:

#         camera.release()

#         running = False

#         return JsonResponse({"error": "No user found"}, status=400)



#     session = InterviewSession.objects.create(user=user)



#     # Start camera thread

#     camera_thread = threading.Thread(target=camera_loop, daemon=True)

#     camera_thread.start()



#     return JsonResponse({"status": "started", "message": "Camera is running"})



@csrf_exempt

def start_camera(request):

    global running, camera, session, camera_thread



    if running:

        return JsonResponse({"status": "already running"})



    # --- NEW: get user_id from POST data ---

    if request.method == 'POST':

        try:

            if request.body:

                data = json.loads(request.body)

                user_id = data.get('user_id')

            else:

                user_id = None

        except json.JSONDecodeError:

            user_id = None

    else:

        user_id = None



    print("🚀 Starting camera...")



    # Try multiple camera backends

    camera = None

    for backend in [cv2.CAP_DSHOW, cv2.CAP_ANY]:

        try:

            camera = cv2.VideoCapture(0, backend)

            if camera.isOpened():

                print(f"✅ Camera opened with backend: {backend}")

                break

            camera.release()

            camera = None

        except Exception as e:

            print(f"⚠️ Backend {backend} failed: {e}")

            camera = None



    if camera is None or not camera.isOpened():

        return JsonResponse({"error": "Failed to access camera. Check if camera is connected and not in use by another application."}, status=400)



    running = True



    # Create user session - login guard removed

    if user_id:

        try:

            user = UserRegister.objects.get(id=user_id)

        except UserRegister.DoesNotExist:

            # Create default user if not found

            user = UserRegister.objects.create(

                name="Guest User",

                email="guest@example.com", 

                password="guest123"

            )

    else:

        user = UserRegister.objects.first()

        if not user:

            # Create default user if none exists

            user = UserRegister.objects.create(

                name="Guest User",

                email="guest@example.com",

                password="guest123"

            )



    session = InterviewSession.objects.create(user=user)



    # Start camera thread

    camera_thread = threading.Thread(target=camera_loop, daemon=True)

    camera_thread.start()



    return JsonResponse({"status": "started", "message": "Camera is running"})



    

# ===============================

# 🛑 STOP CAMERA

# ===============================

@csrf_exempt

def stop_camera(request):

    global running, camera, session



    print("🛑 Stopping camera...")

    running = False



    if camera:

        camera.release()

        camera = None



    if session:

        session.save()

        session = None



    latest_data["faces"] = 0

    latest_data["behavior"] = "No Face"

    latest_data["lip"] = "No Face"

    latest_data["score"] = 0

    latest_data["final"] = "Camera Off"



    return JsonResponse({"status": "stopped"})





# ===============================

# 🎥 VIDEO STREAM

# ===============================

def generate_frames():

    global output_frame



    # Placeholder frame used while the camera thread warms up.

    placeholder = np.zeros((480, 640, 3), dtype=np.uint8)

    cv2.putText(placeholder, "Camera Starting...", (50, 240), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)



    while True:

        try:

            frame_data = output_frame if output_frame is not None else placeholder

            ret, buffer = cv2.imencode('.jpg', frame_data)

            if not ret:

                time.sleep(0.05)

                continue



            frame = buffer.tobytes()

            yield (b'--frame\r\n'

                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

            time.sleep(0.05)

        except Exception as e:

            print(f"❌ Frame generation error: {e}")

            time.sleep(0.05)

            continue





def video_feed(request):

    """

    Returns an MJPEG stream for the current video feed.

    """

    return StreamingHttpResponse(

        generate_frames(),

        content_type='multipart/x-mixed-replace; boundary=frame'

    )





# ===============================

#  LIVE STATUS

# ===============================

def get_status(request):

    return JsonResponse(latest_data)





# ===============================

# 📝 REGISTER

# ===============================

@csrf_exempt

def register(request):

    if request.method == "POST":

        data = json.loads(request.body)



        user = UserRegister.objects.create(

            name=data.get("name"),

            email=data.get("email"),

            password=data.get("password")

        )



        return JsonResponse({"status": "success"})



    return JsonResponse({"error": "Invalid request"})





# ===============================

# 🔐 LOGIN

# ===============================

@csrf_exempt

def login(request):

    if request.method == "POST":

        data = json.loads(request.body)



        try:

            user = UserRegister.objects.get(email=data.get("email"))



            if user.password == data.get("password"):

                return JsonResponse({

                    "status": "success",

                    "user": {

                        "id": user.id,

                        "name": user.name,

                        "email": user.email

                    }

                })

            else:

                return JsonResponse({"status": "error", "message": "Wrong password"})



        except UserRegister.DoesNotExist:

            return JsonResponse({"status": "error", "message": "User not found"})



    return JsonResponse({"error": "Invalid request"})





# ===============================

# 📄 PDF REPORT

# ===============================

def download_report(request):

    response = HttpResponse(content_type='application/pdf')

    response['Content-Disposition'] = 'attachment; filename="report.pdf"'



    doc = SimpleDocTemplate(response)

    styles = getSampleStyleSheet()



    logs = DetectionLog.objects.all().order_by('-id')[:20]



    content = []

    content.append(Paragraph("Interview AI Report", styles['Title']))



    for log in logs:

        text = f"Faces: {log.face_count}, Score: {log.score}, Status: {log.final_status}"

        content.append(Paragraph(text, styles['Normal']))



    doc.build(content)

    return response





# ===============================

# 🧠 HISTORY DATA

# ===============================

def history_data(request):

    sessions = InterviewSession.objects.all().order_by('-id')[:30]

    

    data = []

    for session in sessions:

        # Get the latest log for this session to determine final result

        latest_log = DetectionLog.objects.filter(session=session).order_by('-timestamp').first()

        

        # Calculate duration

        duration = None

        if session.end_time:

            duration = session.end_time - session.start_time

            duration_seconds = int(duration.total_seconds())

            hours = duration_seconds // 3600

            minutes = (duration_seconds % 3600) // 60

            seconds = duration_seconds % 60

            duration_str = f"{hours:02d}:{minutes:02d}:{seconds:02d}"

        else:

            duration_str = "In Progress"

        

        data.append({

            "id": session.id,

            "user_name": session.user.name,

            "meeting_id": getattr(session.user, 'meetingId', 'N/A'),

            "start_time": session.start_time.strftime("%Y-%m-%d %H:%M:%S"),

            "end_time": session.end_time.strftime("%Y-%m-%d %H:%M:%S") if session.end_time else None,

            "duration": duration_str,

            "score": latest_log.score if latest_log else 0,

            "faces": latest_log.face_count if latest_log else 0,

            "behavior": latest_log.behavior if latest_log else "No Face",

            "lip": latest_log.lip_status if latest_log else "No Face",

            "final_result": latest_log.final_status if latest_log else "In Progress"

        })



    return JsonResponse(data, safe=False)





# ===============================

# 👥 USER STATS

# ===============================

def user_stats(request, user_id):

    logs = DetectionLog.objects.filter(session__user_id=user_id)



    total = logs.count()

    suspicious = logs.filter(final_status="Suspicious").count()



    return JsonResponse({

        "total": total,

        "suspicious": suspicious

    })





# ===============================

# 📋 SESSION DETAILS

# ===============================

def session_details(request, session_id):

    try:

        session = InterviewSession.objects.get(id=session_id)

        logs = DetectionLog.objects.filter(session=session).order_by('-timestamp')

        

        # Calculate duration

        duration = None

        if session.end_time:

            duration = session.end_time - session.start_time

            duration_seconds = int(duration.total_seconds())

            hours = duration_seconds // 3600

            minutes = (duration_seconds % 3600) // 60

            seconds = duration_seconds % 60

            duration_str = f"{hours:02d}:{minutes:02d}:{seconds:02d}"

        else:

            duration_str = "In Progress"

        

        # Get final result

        final_result = "In Progress"

        if logs.exists():

            last_log = logs.first()

            final_result = last_log.final_status

        

        # Prepare logs data

        logs_data = []

        for log in logs:

            logs_data.append({

                "timestamp": log.timestamp.strftime("%Y-%m-%d %H:%M:%S"),

                "face_count": log.face_count,

                "behavior": log.behavior,

                "lip_status": log.lip_status,

                "score": log.score,

                "final_status": log.final_status

            })

        

        return JsonResponse({

            "session": {

                "id": session.id,

                "user_name": session.user.name,

                "user_email": session.user.email,

                "meeting_id": getattr(session.user, 'meetingId', 'N/A'),

                "start_time": session.start_time.strftime("%Y-%m-%d %H:%M:%S"),

                "end_time": session.end_time.strftime("%Y-%m-%d %H:%M:%S") if session.end_time else None,

                "duration": duration_str,

                "final_result": final_result

            },

            "logs": logs_data

        })

        

    except InterviewSession.DoesNotExist:

        return JsonResponse({"error": "Session not found"}, status=404)





# ===============================

# 📄 USER SESSION REPORT

# ===============================

def user_session_report(request, session_id):

    try:

        session = InterviewSession.objects.get(id=session_id)

        logs = DetectionLog.objects.filter(session=session)

        

        # Create PDF for this specific session

        response = HttpResponse(content_type='application/pdf')

        response['Content-Disposition'] = f'attachment; filename="interview_report_{session.id}.pdf"'

        

        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle

        from reportlab.lib.styles import getSampleStyleSheet

        from reportlab.lib import colors

        from reportlab.lib.units import inch

        

        doc = SimpleDocTemplate(response)

        styles = getSampleStyleSheet()

        

        content = []

        

        # Title

        content.append(Paragraph(f"Interview Report - Session {session.id}", styles['Title']))

        content.append(Spacer(1, 12))

        

        # User Info

        content.append(Paragraph("User Information", styles['Heading2']))

        user_data = [

            ['Name:', session.user.name],

            ['Email:', session.user.email],

            ['Meeting ID:', getattr(session.user, 'meetingId', 'N/A')],

            ['Start Time:', session.start_time.strftime("%Y-%m-%d %H:%M:%S")],

            ['End Time:', session.end_time.strftime("%Y-%m-%d %H:%M:%S") if session.end_time else 'In Progress'],

        ]

        

        user_table = Table(user_data, colWidths=[1.5*inch, 4*inch])

        user_table.setStyle(TableStyle([

            ('BACKGROUND', (0, 0), (-1, -1), colors.lightgrey),

            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),

            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),

            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),

            ('FONTSIZE', (0, 0), (-1, -1), 10),

            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),

        ]))

        

        content.append(user_table)

        content.append(Spacer(1, 12))

        

        # Detection Logs

        content.append(Paragraph("Detection Logs", styles['Heading2']))

        

        log_data = [['Time', 'Faces', 'Behavior', 'Lip Sync', 'Score', 'Status']]

        for log in logs.order_by('-timestamp')[:20]:  # Last 20 logs

            log_data.append([

                log.timestamp.strftime("%H:%M:%S"),

                str(log.face_count),

                log.behavior,

                log.lip_status,

                f"{log.score:.1f}",

                log.final_status

            ])

        

        log_table = Table(log_data, colWidths=[0.8*inch, 0.8*inch, 1.2*inch, 1.2*inch, 0.8*inch, 1.2*inch])

        log_table.setStyle(TableStyle([

            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),

            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),

            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),

            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),

            ('FONTSIZE', (0, 0), (-1, 0), 10),

            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),

            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),

            ('GRID', (0, 0), (-1, -1), 1, colors.black)

        ]))

        

        content.append(log_table)

        

        doc.build(content)

        return response

        

    except InterviewSession.DoesNotExist:

        return JsonResponse({"error": "Session not found"}, status=404)
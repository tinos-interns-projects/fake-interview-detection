import cv2
import mediapipe as mp

mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(
    static_image_mode=False,
    max_num_faces=1,
    refine_landmarks=True,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)


def analyze_lip_sync(frame):
    h, w, _ = frame.shape
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = face_mesh.process(rgb)

    if not results.multi_face_landmarks:
        return "No Face"

    face_landmarks = results.multi_face_landmarks[0]
    top_lip = face_landmarks.landmark[13]
    bottom_lip = face_landmarks.landmark[14]

    mouth_gap = abs(bottom_lip.y - top_lip.y)
    top_face = face_landmarks.landmark[10]
    bottom_face = face_landmarks.landmark[152]
    face_height = abs(bottom_face.y - top_face.y)

    if face_height <= 0:
        return "Not Talking"

    ratio = mouth_gap / face_height

    if ratio > 0.05:
        return "Talking"
    if ratio > 0.03:
        return "Possible Talking"

    return "Not Talking"

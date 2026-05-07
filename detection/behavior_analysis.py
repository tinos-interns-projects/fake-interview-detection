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


def analyze_behavior(frame):
    h, w, _ = frame.shape

    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = face_mesh.process(rgb)

    if not results.multi_face_landmarks:
        return "No Face"

    face_landmarks = results.multi_face_landmarks[0]
    nose = face_landmarks.landmark[1]
    nose_x = int(nose.x * w)
    nose_y = int(nose.y * h)

    center_x = w // 2
    center_y = h // 2

    dx = nose_x - center_x
    dy = nose_y - center_y

    horizontal_threshold = 40
    vertical_threshold = 40

    if abs(dx) < horizontal_threshold and abs(dy) < vertical_threshold:
        return "Focused"

    if abs(dx) > abs(dy):
        return "Looking Left" if dx < 0 else "Looking Right"

    if dy > vertical_threshold:
        return "Looking Down"

    if dy < -vertical_threshold:
        return "Looking Up"

    return "Focused"

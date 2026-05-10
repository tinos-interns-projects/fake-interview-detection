# def calculate_suspicious_score(face_count, behavior, lip):
#     score = 0
#     reasons = []

#     # ? Multiple faces = HIGH suspicion
#     if face_count > 1:
#         score += 50
#         reasons.append("Multiple faces detected")

#     # ? No face
#     elif face_count == 0:
#         score += 30
#         reasons.append("No face detected")

#     # ? Behavior analysis
#     if behavior == "Looking Left" or behavior == "Looking Right":
#         score += 15
#         reasons.append("Looking away")

#     elif behavior == "Looking Down":
#         score += 10
#         reasons.append("Looking down")

#     elif behavior == "Suspicious":
#         score += 25
#         reasons.append("Suspicious movement")

#     # ? Lip sync mismatch
#     if lip == "Talking":
#         score += 20
#         reasons.append("Talking detected")

#     return score, reasons

def calculate_suspicious_score(face_count, behavior, lip):
    score = 0
    reasons = []

    if face_count > 1:
        score += 50
        reasons.append("Multiple faces")

    elif face_count == 0:
        score += 40
        reasons.append("No face")

    if behavior in ["Looking Left", "Looking Right"]:
        score += 20
        reasons.append("Looking away")
    elif behavior == "Looking Down":
        score += 15
        reasons.append("Looking down")
    elif behavior == "Looking Up":
        score += 10
        reasons.append("Looking up")

    if lip == "Talking":
        score += 15
        reasons.append("Talking detected")
    elif lip == "Possible Talking":
        score += 8
        reasons.append("Possible talking")

    return score, reasons

from flask import Flask, request, send_file, render_template
import cv2
import numpy as np
from io import BytesIO

app = Flask(__name__)

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

def detect_face(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

    if len(faces) == 0:
        raise Exception("No faces detected!")

    x, y, w, h = faces[0]
    face_region = image[y:y + h, x:x + w]
    return face_region, (x, y, w, h)

def swap_faces(image1, image2):
    face1, coords1 = detect_face(image1)
    face2, coords2 = detect_face(image2)

    face2_resized = cv2.resize(face2, (coords1[2], coords1[3]))

    mask = np.zeros_like(image1[coords1[1]:coords1[1] + coords1[3], coords1[0]:coords1[0] + coords1[2]])
    mask[:] = 255

    swapped_image = cv2.seamlessClone(
        face2_resized,
        image1,
        mask,
        (coords1[0] + coords1[2] // 2, coords1[1] + coords1[3] // 2),
        cv2.NORMAL_CLONE
    )
    return swapped_image

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/swap', methods=['POST'])
def swap():
    try:
        image1 = cv2.imdecode(np.frombuffer(request.files['image1'].read(), np.uint8), cv2.IMREAD_COLOR)
        image2 = cv2.imdecode(np.frombuffer(request.files['image2'].read(), np.uint8), cv2.IMREAD_COLOR)

        swapped_image = swap_faces(image1, image2)

        _, buffer = cv2.imencode('.jpg', swapped_image)
        return send_file(BytesIO(buffer), mimetype='image/jpeg')

    except Exception as e:
        print(f"Error: {e}")
        return f"Face swapping failed: {e}", 500

if __name__ == '__main__':
    app.run(debug=True)

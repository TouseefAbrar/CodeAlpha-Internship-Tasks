import cv2
from ultralytics import YOLO

# Pre-trained YOLO model 
model = YOLO('yolov8n.pt')

cap = cv2.VideoCapture(0)

print("Webcam open ho raha hai... Band karne ke liye keyboard se 'q' dabayein.")

while True:
    ret, frame = cap.read()
    if not ret:
        print("Webcam se frame nahi aa raha.")
        break

    results = model.track(frame, persist=True, device='cpu')

    annotated_frame = results[0].plot()

    cv2.imshow('CodeAlpha Task 4: Object Tracking', annotated_frame)

    # Window close karne ke liye 'q' press karein
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
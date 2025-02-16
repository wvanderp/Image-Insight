import sys
import json
import cv2
import numpy as np
from retinaface import RetinaFace
import os

os.environ['CUDA_VISIBLE_DEVICES'] = '-1'
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

def detect_faces(image_path):
    faces = RetinaFace.detect_faces(image_path)
    results = []

    if isinstance(faces, dict):
        for key in faces.keys():
            identity = faces[key]
            facial_area = identity["facial_area"]
            landmarks = identity["landmarks"]
            results.append({
                "facial_area": facial_area,
                "landmarks": landmarks
            })

    return results


def main(image_path):
    try:
        results = detect_faces(image_path)
        output = {
            "RetinaFaceTool": {
                "faces": results,
                "count": len(results)
            }
        }
        print(json.dumps(output, indent=4))
    except Exception as e:
        error_output = {
            "RetinaFaceTool": {
                "error": str(e)
            }
        }
        print(json.dumps(error_output, indent=4))


if __name__ == "__main__":
    image_path = sys.argv[1]
    main(image_path)

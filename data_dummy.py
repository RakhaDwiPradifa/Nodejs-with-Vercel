import requests
import random
import time

# URL endpoint backend yang ada di Vercel
URL = "https://your-project-name.vercel.app/api/sensor"

# Fungsi untuk mengirim data dummy
def send_dummy_data():
    try:
        # Pilih data sensor secara acak
        sensors = ["MQ135", "DHT11"]
        sensor = random.choice(sensors)

        # Buat data dummy
        payload = {
            "sensor": sensor,
            "value": round(random.uniform(10, 100), 2),
            "temperature": round(random.uniform(20, 35), 2) if sensor == "DHT11" else None,
            "humidity": round(random.uniform(40, 80), 2) if sensor == "DHT11" else None
        }

        # Kirim data ke endpoint backend
        response = requests.post(URL, json=payload)
        if response.status_code == 201:
            print(f"Success: {response.json()}")
        else:
            print(f"Failed: {response.status_code} - {response.text}")

    except Exception as e:
        print(f"Error: {e}")


if __name__ == "__main__":
    while True:
        send_dummy_data()
        time.sleep(5)  

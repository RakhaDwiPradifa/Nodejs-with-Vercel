import requests
import random
import time

# URL endpoint backend yang ada di Vercel
URL = "https://nodejs-with-vercel.vercel.app/api"

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
            # Kirim data suhu dan kelembaban hanya untuk DHT11
            "temperature": round(random.uniform(20, 35), 2) if sensor == "DHT11" else None,
            "humidity": round(random.uniform(40, 80), 2) if sensor == "DHT11" else None
        }

        # Kirim data ke endpoint backend
        response = requests.post(URL, json=payload)
        if response.status_code == 200:  # Periksa kode status 200
            response_data = response.json()
            print(f"Success: {response_data['message']} - {response_data['data']}")
        else:
            print(f"Failed: {response.status_code} - {response.text}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    while True:
        send_dummy_data()
        time.sleep(5)  # Kirim data setiap 5 detik

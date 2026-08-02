import requests

from database.urls import TEST_RESULT_URL

BASE_URL = "http://django:8000/v1/"


def get_all(url):
    try:
        response = requests.get(url)
        if response.status_code == 200:
            return response.json()
        else:
            return f"Xatolik ({response.status_code}): {response.text}"
    except Exception as e:
        return f"Error: {e}"



def get_id(url, data_id):
    try:
        response = requests.get(f"{url}{data_id}/")
        if response.status_code == 200:
            return response.json()
        else:
            return f"Xatolik ({response.status_code}): {response.text}"
    except Exception as e:
        return f"Error: {e}"


def create(url, data):
    try:
        response = requests.post(url, json=data)
        print("Response Text:", response.text)
        if response.status_code == 201:
            return "OK"
        else:
            return f"Xatolik ({response.status_code}): {response.text}"

    except Exception as e:
        return f"Error: {e}"


def update_id(url, data_id, data):
    try:
        response = requests.patch(f"{url}{data_id}/", json=data)
        if response.status_code == 200:
            return "Ok"
        else:
            return f"Xatolik ({response.status_code}): {response.text}"
    except Exception as e:
        return f"Error: {e}"

def delete_id(url, data_id):
    try:
        response = requests.delete(f"{url}{data_id}/")
        if response.status_code == 204:
            return "OK"
        else:
            return f"Xatolik ({response.status_code}): {response.text}"
    except Exception as e:
        return f"Error: {e}"



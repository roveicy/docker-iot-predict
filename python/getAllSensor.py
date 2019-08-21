import requests

url = "http://ec2-54-146-44-86.compute-1.amazonaws.com:3000/composer/admin/getAllSensor"

headers = {'cache-control': "no-cache"}

response = requests.request("GET", url, headers=headers)

print(response.text)

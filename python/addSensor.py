import requests
import json

url = "http://ec2-54-146-44-86.compute-1.amazonaws.com:3000/composer/admin/addSensor"
headers = {'content-type': "application/json", 'cache-control': "no-cache"}

payload = '{"device":"3","ts":"98977966695555","seq":"DD","data":"ddd","dsize":"1024","dhash":"########"}'

response = requests.request("POST", url, data=payload, headers=headers)

print(response.text)

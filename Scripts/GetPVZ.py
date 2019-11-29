import requests
import base64
import json
import os

access_token = "ACCESS TOKEN"
key = "KEY"
protocol 	= "https://"
host 		= "otpravka-api.pochta.ru"

request_headers = {
	"Content-Type": "application/json",
	"Accept": "application/json;charset=UTF-8",
	"Authorization": "AccessToken " + access_token,
	"X-User-Authorization": "Basic " + key
}

path = "/1.0/delivery-point/findAll"
url = protocol + host + path
response = requests.get(url, headers=request_headers)

f = open(os.path.join(os.path.dirname(__file__),'pvz.json'), "w", encoding="utf-8")
f.write(response.text)
f.close()
import json
import urllib.request
import urllib.error

url = "http://127.0.0.1:8000/v1/qa"
payload = {"question": "como emitir NF-e?", "top_k": 3}
data = json.dumps(payload).encode("utf-8")
req = urllib.request.Request(
    url,
    data=data,
    headers={"Content-Type": "application/json", "x-api-key": "local-dev"},
)

try:
    with urllib.request.urlopen(req, timeout=60) as resp:
        body = resp.read().decode("utf-8", errors="ignore")
        print("STATUS", resp.status)
        print(body)
except urllib.error.HTTPError as e:
    print("HTTPERROR", e.code)
    print(e.read().decode("utf-8", errors="ignore"))
except Exception as e:
    print("FAIL", e)

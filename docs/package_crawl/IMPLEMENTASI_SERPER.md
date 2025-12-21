# Package Serper | <https://serper.dev/>

## API KEYS

```
70b6e0bfbc9079ef7860c4c088a777135e1bc68a
```

## Goal

- Crawl data dari menggunakan serper
- Data Response disimpan dalam bentuk CSV
- Letakan didalam folder `ai/output/data/crawl_serper/{keyword}.csv`
- Apa saja yang disimpan?
  - Title,
  - Link,
  - Snippet,
  - Position

## Implementasi

- Terapkan di beberapa layer ```Yang Saya Tandai TODO!!!``` :

1. Request ```ScrapeSerperRequestV1```
2. Response ```ScrapeSerperResponseV1```
3. Service ```TugasAkhirServiceV1```
4. ServiceImpl ```TugasAkhirServiceImplV1```
5. Repository ```TugasAkhirRepositoriesV1```
6. Controller ```TugasAkhirControllerV1```
7. ControllerImpl ```TugasAkhirControllerImplV1```

### Contoh Apa saja yang dikirim ?

```python
import http.client
import json

conn = http.client.HTTPSConnection("google.serper.dev")
payload = json.dumps({
  "q": "SLOT",
  "location": "Indonesia",
  "gl": "id",
  "hl": "id",
  "page": 100
})
headers = {
  'X-API-KEY': '70b6e0bfbc9079ef7860c4c088a777135e1bc68a',
  'Content-Type': 'application/json'
}
conn.request("POST", "/search", payload, headers)
res = conn.getresponse()
data = res.read()
print(data.decode("utf-8"))
```

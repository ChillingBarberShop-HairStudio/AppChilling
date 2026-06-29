import urllib.request
import re

req = urllib.request.Request('https://lottiefiles.com/free-animation/barber-s-pole-EUNQf4fKp8', headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    match = re.search(r'https://[^"]*?\.json', html)
    if match:
        print(match.group(0))
    else:
        print("Not found")
except Exception as e:
    print(e)

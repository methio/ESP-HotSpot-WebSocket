# ESP HotSpot and WebSocket Server + ESP and JS Clients

Working on places with often limited WiFi, the idea behind this project is to have an ESP board like the [Adafruit Feather Huzzah32](https://www.adafruit.com/product/3405) or [Adafruit Feather Huzzah(ESP 8266)](https://www.adafruit.com/product/2821) to create a Wifi hotspot and a WebSocket server that broadcasts all the messages it receives. 

⚠️ Chrome now treats `localhost` as an insecure origin unless using a HTTPS certificate and will block usage of websockets. You can still modify this behavior by activating this chrome flag: `chrome://flags/#unsafely-treat-insecure-origin-as-secure`

### Sources
- https://www.upesy.fr/blogs/tutorials/how-create-a-wifi-acces-point-with-esp32
- https://shawnhymel.com/1675/arduino-websocket-server-using-an-esp32/


--- 
## How does it works 

Server receives messages from one client and broadcast it to all clients. 

-gif schema connexion-

Todo: 
- [ ] can send a message to a targeted client by its ID and avoir broadcasting to all.
- [ ] create example list simple components from kit 


## What to do 
First, make sure all huzzah32 files have the same credentials : 
```
const char *ssid = "huzzah32";
const char *password = "huzzah32";
```

Use your name to avoid problems in class

To use webClient on your computer, put your laptop wifi to "huzzah32" hotspot and then run liveserver.
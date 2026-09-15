![cover image](images/cover.png)

# ESP HotSpot and WebSocket Server + ESP and JS Clients

>[!TIP]
>You can use this repo/project when adafruit.io doesn't fit to your needs. 

This project turns your huzzah 32 ([Adafruit Feather Huzzah32↗](https://www.adafruit.com/product/3405) or [Adafruit Feather Huzzah(ESP 8266)↗](https://www.adafruit.com/product/2821)) into a **WiFi hotspot** and a **WebSocket server**. The Huzzah32 creates its own WiFi network, and every device connected to that network (other Huzzah32 and computers) can exchange messages in real time via WebSockets.


## 💡 Usefuls concepts

### WiFi access point (Hotspot / Access Point)
Normally, your huzzah 32 connects to an existing WiFi network (like your smartphone hotspot). Here it's the opposite: the huzzah 32 **creates its own WiFi network**, which other devices then connect to. This is called an "access point" (AP) or "hotspot".

### Client / Server
- The **server** is the program that waits for connections and centralizes the exchanges (here, the huzzah 32 running `ESP_Server`).
- A **client** is a program that connects to the server to send or receive information (here, the other huzzah 32 boards `ESP_Clients` or a web page running on your laptop `Web_Client`).

### WebSocket
[Websocket↗](https://github.com/Links2004/arduinoWebSockets) is a communication protocol that keeps a connection **open at all times** between a client and a server, unlike classic HTTP where every exchange requires a new request. This allows instant two-way communication.





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
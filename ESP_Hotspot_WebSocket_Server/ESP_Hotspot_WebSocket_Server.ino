// Creates a Wifi Hotspot and init a WebSocket Server that broadcasts incoming messages

// https://www.upesy.fr/blogs/tutorials/how-create-a-wifi-acces-point-with-esp32
// https://shawnhymel.com/1675/arduino-websocket-server-using-an-esp32/

#include <WiFi.h> // for ESP32
//#include <ESP8266WiFi.h> // for ESP8266
#include <WebSocketsServer.h>
#include <ArduinoJson.h> 

/* TEST ZONE */
#define LED 14
bool state = false;
#define BUTTON 21
bool bstate = false;

/* Set these to your desired credentials. */
const char *ssid = "huzzah32";
const char *password = "huzzah32";

WebSocketsServer webSocket = WebSocketsServer(80);

void onWebSocketEvent(uint8_t num,
                      WStype_t type,
                      uint8_t* payload,
                      size_t length) {

  // Figure out the type of WebSocket event
  switch (type) {
    Serial.println(type);

    // Client has disconnected
    case WStype_DISCONNECTED:
      Serial.printf("[%u] Disconnected!\n", num);
      break;

    // New client has connected
    case WStype_CONNECTED:
      {
        IPAddress ip = webSocket.remoteIP(num);
        Serial.printf("[%u] Connection from ", num);
        Serial.println(ip.toString());
      }
      break;

    // broadcast text message to all clients
    case WStype_TEXT:
      {
      JsonDocument doc; // prepare to read message as JSON
      DeserializationError error = deserializeJson(doc, payload, length);
      if (error) {
        Serial.print("JSON parse failed: ");
        Serial.println(error.f_str());
        break;
      }
      int action = doc["action"] | 0;  // Defaults to 0 if missing
      Serial.print("Action: ");
      Serial.println(action);
      if(action == 1){
        state = 1;
      }else{
        state = 0;
      }
      // Serial.printf("[%u] Text: %s\n", num, payload);
      // Serial.printf("info %s\n");
      webSocket.broadcastTXT(payload);
      break;
      }
    // For everything else: do nothing
    case WStype_BIN:
    case WStype_ERROR:
    case WStype_FRAGMENT_TEXT_START:
    case WStype_FRAGMENT_BIN_START:
    case WStype_FRAGMENT:
    case WStype_FRAGMENT_FIN:
    default:
      break;
  }
}

void setup() {
  Serial.begin(115200);
  Serial.println("\n[*] Creating AP");

  WiFi.mode(WIFI_AP);
  WiFi.softAP(ssid);
  //WiFi.softAP(ssid, password); // if you want a password

  Serial.print("[+] AP Created with IP Gateway ");
  Serial.println(WiFi.softAPIP());

  // Start WebSocket server and assign callback
  webSocket.begin();
  webSocket.onEvent(onWebSocketEvent);

  pinMode(LED, OUTPUT);
  pinMode(BUTTON, INPUT);

}

void loop() {
  // Look for and handle WebSocket data
  webSocket.loop();
  digitalWrite(LED, state);

  // read button and send a message to clients
  if(digitalRead(BUTTON) == 0){
    JsonDocument doc;
    doc["message"] = "hello";
    doc["action"] = 1;
    String message;
    serializeJson(doc, message);

    webSocket.broadcastTXT(message);
    Serial.println("clicked once");
    delay(500);
  }
}

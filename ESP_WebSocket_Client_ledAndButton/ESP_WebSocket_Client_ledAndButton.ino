// ESP WebSocket Client
#include <Arduino.h>
#include <WiFi.h>
#include <WiFiMulti.h>
#include <WebSocketsClient.h>
#include <ArduinoJson.h>

/* ######### CLIENT 2 = bouton + led #########  */
#define LED 14
bool state = false;
#define BUTTON 21
bool bstate = false;


#define CLIENT_ID 2
#define PRINT_LOGS false

// credentials
const char* ssid = "huzzah32";
const char* password = "huzzah32";

WiFiMulti WiFiMulti;
WebSocketsClient webSocket;

void webSocketEvent(WStype_t type, uint8_t* payload, size_t length) {
  switch (type) {
    case WStype_DISCONNECTED:
      if(PRINT_LOGS) Serial.printf("[LOG] Disconnected!\n");
      break;

    case WStype_CONNECTED:
      if(PRINT_LOGS) Serial.printf("[LOG] Connected to url: %s\n", payload);
      break;

    case WStype_TEXT:
      {
        if(PRINT_LOGS) Serial.printf("[LOG] get text: %s\n", payload);
        JsonDocument doc;
        char raw[length];
        memcpy(raw, payload, length);
        DeserializationError error = deserializeJson(doc, raw);

        if (error) {
          Serial.print(F("[LOG] deserializeJson() failed: "));
          Serial.println(error.f_str());
        }
        else {
          int clientID = doc["clientID"];
          if(clientID != CLIENT_ID) {
            // do something if message from another client
            // Serial.printf("%s\n", payload);
            int action = doc["action"] | 0;  // Defaults to 0 if missing
            Serial.print("Action: ");
            Serial.println(action);
            if(action == 1){
              state = 1;
            }else{
              state = 0;
            }     

          }
        }
      }
      break;

    case WStype_BIN:
    case WStype_ERROR:
    case WStype_FRAGMENT_TEXT_START:
    case WStype_FRAGMENT_BIN_START:
    case WStype_FRAGMENT:
    case WStype_FRAGMENT_FIN:
      break;
  }
}

void setup() {
  Serial.begin(115200);
  Serial.print("CLIENT_ID ");
  Serial.println(CLIENT_ID);

  WiFiMulti.addAP(ssid, password);

  //WiFi.disconnect();
  while (WiFiMulti.run() != WL_CONNECTED) {
    delay(100);
  }

  // server address, port and URL
  webSocket.begin("192.168.4.1", 80, "/");

  // event handler
  webSocket.onEvent(webSocketEvent);

  // try ever 5000 again if connection has failed
  webSocket.setReconnectInterval(5000);

  pinMode(LED, OUTPUT);
  pinMode(BUTTON, INPUT);
}

void loop() {
  webSocket.loop();

  digitalWrite(LED, state);

  // read button and send a message to clients
  if(digitalRead(BUTTON) == 0){
    JsonDocument doc;
    doc["message"] = "clicked";
    doc["action"] = 1;
    String message;
    serializeJson(doc, message);

    webSocket.sendTXT(message);
    Serial.println("clicked once");
    delay(500);
  }
  delay(100);
}

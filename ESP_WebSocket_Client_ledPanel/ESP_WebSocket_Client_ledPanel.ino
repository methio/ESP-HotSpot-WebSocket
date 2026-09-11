// ESP WebSocket Client
#include <Arduino.h>
#include <WiFi.h>
#include <WiFiMulti.h>
#include <WebSocketsClient.h>
#include <ArduinoJson.h>
#include <Adafruit_GFX.h>
#include <Adafruit_NeoMatrix.h>
#include <Adafruit_NeoPixel.h>
#include <Fonts/Picopixel.h> // font mini


/* ######### CLIENT 3 = panneau led #########  */
Adafruit_NeoMatrix matrix(8, 8, 21, 
  NEO_MATRIX_TOP + NEO_MATRIX_RIGHT + 
  NEO_MATRIX_COLUMNS + NEO_MATRIX_ZIGZAG, 
  NEO_GRB + NEO_KHZ800);

#define CLIENT_ID 3
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
            // clean screen
            matrix.fillScreen(0);
            matrix.show();

            // from https://arduinojson.org/v7/api/jsonarray/
            JsonArray array = doc.as<JsonArray>();
            for (JsonObject obj : array) {
              int x = obj["x"].as<int>(); // make sure value is a int
              int y = obj["y"].as<int>();
              int r = obj["r"].as<int>();
              int g = obj["g"].as<int>();
              int b = obj["b"].as<int>();
              Serial.printf("x=%d y=%d r=%d g=%d b=%d\n", x, y, r, g, b);
              matrix.drawPixel(x, y, matrix.Color(r,g,b));              
            }
            matrix.show();
            // Serial.printf("%s\n", payload);
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

  // matrix setup
  matrix.begin();
  matrix.setBrightness(10);
  matrix.fillScreen(0);

  // hello screen
  matrix.setFont(&Picopixel); 
  matrix.setTextColor(matrix.Color(0, 255, 0));
  matrix.setCursor(0, 5);
  matrix.print("Hi");
  matrix.show();
}

void loop() {
  webSocket.loop();
}

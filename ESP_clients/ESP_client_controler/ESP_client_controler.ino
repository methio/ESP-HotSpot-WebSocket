// ESP WebSocket Client
#include <Arduino.h>
#include <WiFi.h>
#include <WiFiMulti.h>
#include <WebSocketsClient.h>
#include <ArduinoJson.h>
#include <sensorShieldLib.h>

/* ## CLIENTS CREDENTIALS ### */
const char* ssid = "thomas32";
const char* password = "thomas32";
#define CLIENT_ID 2
#define PRINT_LOGS false

/* ######### GPIOS ######### */
#define TILT_PIN 21
#define BUTTON_LEFT_PIN 32
#define BUTTON_RIGHT_PIN 14
#define JOYSTICK_X_PIN A3
#define JOYSTICK_Y_PIN A4

/* ####### OCJETS ######### */
SensorShield board;
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
            Serial.printf("%s\n", payload);
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

  // client prints its ID
  Serial.print("CLIENT_ID ");
  Serial.println(CLIENT_ID);

  // connect to wifi
  WiFiMulti.addAP(ssid, password);
  while (WiFiMulti.run() != WL_CONNECTED) {
    delay(100);
  }

  // server address, port and URL
  webSocket.begin("192.168.4.1", 80, "/");

  // event handler
  webSocket.onEvent(webSocketEvent);

  // try ever 5000 again if connection has failed
  webSocket.setReconnectInterval(5000);

  // init board
  board.init(Serial);

  // set expected pins
  board.setDigitalPinsRange(14, 32);
  board.setAnalogPinsRange(A4, A3);

  // attach sensor to the board
  //.addSensor( "name_of_JSON_key", PIN_VALUE)
  board.addSensor("tilt", TILT_PIN);
  board.addSensor("button_left", BUTTON_LEFT_PIN, INPUT_PULLUP);
  board.addSensor("button_right", BUTTON_RIGHT_PIN, INPUT_PULLUP);

  board.addSensor("joystick_x", JOYSTICK_X_PIN);
  board.setSensorSensitivity("joystick_x", 100);
  board.setSensorLimits("joystick_x", 0, 4000);

  board.addSensor("joystick_y", JOYSTICK_Y_PIN);
  board.setSensorSensitivity("joystick_y", 100);
  board.setSensorLimits("joystick_y", 0, 4000);
}

void loop() {
  webSocket.loop();

  // board listen to all sensors attached
  board.update();

  // if new value, then lets send it
  if(board.hasNewValue == true) {
    webSocket.sendTXT(board.JSONMessage);
  }
}

import { Injectable, OnModuleInit } from '@nestjs/common';
import { connect } from 'mqtt';

@Injectable()
export class MqttService implements OnModuleInit {
  private mqttClient;
  onModuleInit() {
    const url = process.env.MQTT_URL;
    const options = {
      clientId: process.env.MQTT_CLIENTID,
      username: process.env.MQTT_USERNAME,
      password: process.env.MQTT_PASSWORD,
    };

    this.mqttClient = connect(url, options);
    this.mqttClient.on('Connect', () => {
      console.log('Connected to MQTT');
    });
    this.mqttClient.on('Error', () => {
      console.log('Error in connecting to MQTT');
    });
  }

  publish(topic: string, payload) {
    this.mqttClient.publish(topic, payload, { retain: false, qos: 2 });
  }
}

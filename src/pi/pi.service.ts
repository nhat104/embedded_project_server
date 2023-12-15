import { Injectable, OnModuleInit } from '@nestjs/common';
import { connect } from 'mqtt';

@Injectable()
export class MqttService implements OnModuleInit {
  private piClient;
  onModuleInit() {
    const url = process.env.MQTT_URL;
    const options = {
      clientId: process.env.MQTT_CLIENTID,
      username: process.env.MQTT_USERNAME,
      password: process.env.MQTT_PASSWORD,
    };

    this.piClient = connect(url, options);
    this.piClient.on('Connect', () => {
      console.log('Connected to MQTT');
    });
    this.piClient.on('Error', () => {
      console.log('Error in connecting to MQTT');
    });
  }

  publish(topic: string, payload) {
    this.piClient.publish(topic, payload, { retain: false, qos: 2 });
  }
}

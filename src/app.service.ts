import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import * as mqtt from "mqtt";

@Injectable()
export class AppService {
    // connectMQTT() {
    //     const broker = 'broker.hivemq.com';
    //     const port = 1883;
    //     const topic = 'iot/group8/test';
    //     const url = `mqtt://${broker}:${port}`;
    //     const options = {
    //         clientId: 'iot_group8',
    //         connectTimeout: 5000,
    //         username: process.env.MQTT_USERNAME,
    //         password: process.env.MQTT_PASSWORD,
    //     }
    //     try {
    //         const client = mqtt.connect(url, options)
    //         console.log('MQTT connected!');
    //         client.on('connect', () => {
    //             client.subscribe(topic);
    //         })
    //         client.on('message', (tp, msg: string) => {
    //             console.log(JSON.parse(msg))
    //             // var data = JSON.parse(msg)
    //             // console.log('Received MQTT msg:', data);
    //         })
    //     } catch (err) {
    //         console.log(err);
    //     }
    // }
    // onApplicationBootstrap() {
    //     this.connectMQTT();
    // }
}
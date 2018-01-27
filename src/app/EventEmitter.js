

import {EventEmitter} from 'fbemitter';

let ee = null;

class LoggingEventEmitter extends EventEmitter {

  emit(eventType, ...args){
    console.log('eventemitter.emit(): '+eventType, args);
    super.emit(eventType, args);
  }
}

export default class EventEmitterSingleton {

  static createInstance(){
    ee = new LoggingEventEmitter();
    return ee;
  }

  static getInstance(){
    return ee;
  }
}

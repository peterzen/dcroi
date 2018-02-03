import React from 'react';

import EventEmitterSingleton from '../EventEmitter';


export default class ProgressbarComponent extends React.Component {

  constructor(props) {
    super(props);
    this.eventEmitter = EventEmitterSingleton.getInstance();

    this.state = {
      progress: 0
    };

    this.progressHandler = this.progressHandler.bind(this);
  }

  componentDidMount() {
    this.listenerToken = this.eventEmitter.addListener('progress:update', this.progressHandler);
  }

  componentWillUnmount() {
    this.listenerToken.remove();
  }

  progressHandler(progress) {
    console.log(progress);
    this.setState({
      progress: progress
    });
    this.render();
  }

  render() {

    return (
      <div className="progress-bar-stakey">
        <div className="stakey"/>
        <div className="progress">
          <div className="progress-bar"
               role="progressbar"
               style={{width: this.state.progress + "%"}}
               aria-valuenow={this.state.progress}
               aria-valuemin="0"
               aria-valuemax="100"/>
        </div>
      </div>
    );
  }

}

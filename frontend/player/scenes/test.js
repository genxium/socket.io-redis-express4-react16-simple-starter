'use strict';

import React from 'react';
const Component = React.Component;

class TestPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    const sceneRef = this;
    sceneRef.props.changeSceneTitle(sceneRef, __("testPageTitle"));
  }

  componentWillUnmount() {}

  render() {
    const sceneRef = this;

    const mainScene = (
      <div style={ { textAlign: 'left' } }>
        {__("testPageHint")}
      </div>
    );

    return (
      <div>
        { mainScene }
      </div>
    );
  }
}

module.exports = TestPage;

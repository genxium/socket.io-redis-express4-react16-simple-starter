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
    sceneRef.props.changeSceneTitle(sceneRef, "Test page");
  }

  componentWillUnmount() {}

  render() {
    const sceneRef = this;

    const mainScene = (
      <div style={ { textAlign: 'left', } }>
        This is a test page to show that both your backend-router (e.g. express.Router) and frontend-router (e.g. react-router) are working.
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

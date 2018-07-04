'use strict';

import React from 'react';
const Component = React.Component;

import NetworkFunc from '../../../common/NetworkFunc';
import constants from '../../../common/constants';

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    const sceneRef = this;
    sceneRef.props.changeSceneTitle(sceneRef, __("loginPageTitle"));
  }

  componentWillUnmount() {}

  triggerLoginRequest() {
    const sceneRef = this;
    const {location, params, RoleLoginSingleton, replaceNewScene, ...other} = sceneRef.props;
    const paramDict = {
    };

    // TODO: Collect `paramDict`.

    const url = location.basename + constants.ROUTE_PATHS.API_V1 + constants.ROUTE_PATHS.INT_AUTH_TOKEN + constants.ROUTE_PATHS.LOGIN;

    NetworkFunc.get(url, paramDict)
      .then(function(response) {
        return response.json();
      })
      .then(function(responseData) {
        console.log("Accessing %s and got responseData == %o.", url, responseData);
        if (constants.RET_CODE.OK != responseData.ret) {
          return;
        }
        RoleLoginSingleton.instance.saveLoggedInRole(responseData);

        // TODO: Appropriate posterior action.
      });
  }

  render() {
    const sceneRef = this;

    const mainScene = (
      <div style={ { textAlign: 'center' } }>
      </div>
    );

    return (
      <div>
        { mainScene }
      </div>
    );
  }
}

module.exports = Login;

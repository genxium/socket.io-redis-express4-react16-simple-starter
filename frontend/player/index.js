'use strict';

const baseAbsPath = __dirname + '/';

import React from 'react';
const Component = React.Component;
import ReactDOM from 'react-dom';

import { BrowserRouter as Router, Route } from "react-router-dom";

import NetworkFunc from '../../common/NetworkFunc';
import constants from '../../common/constants';
import PlayerManager from './PlayerManager';
import Loadable from 'react-loadable';

import queryString from 'query-string';

import './index.less';

class StatelessTopbar extends Component {
  componentDidMount() {
    const {onHasLoggedIn, onHasNotLoggedIn, sceneRef, ...other} = this.props;
    const accManager = PlayerManager.instance;
    accManager.loadLoggedInRoleAsync(sceneRef)
      .then(function() {
        if (undefined === onHasLoggedIn || null === onHasLoggedIn) return;
        if (accManager.hasLoggedIn()) {
          onHasLoggedIn();
        } else {
          onHasNotLoggedIn();
        }
      });
  }

  render() {
    const widgetRef = this;
    const {style, sceneRef, children, ...other} = widgetRef.props;

    const outerMostStyle = Object.assign({
      position: 'relative',
      width: '100%',
      color: constants.THEME.MAIN.WHITE,
      paddingTop: 5,
      paddingBottom: 5,
      marginBottom: 0,
      height: '55px',
      backgroundColor: constants.THEME.MAIN.BLACK,
      background: '#01A18F 100%'
    }, style);

    return (
      <div
       className='topbar'
        style={outerMostStyle}>
        {children}
      </div>
      );
  }
}

import CommonLoading from '../shared_scenes/loading';
const TestPage = Loadable({
  loader: () => import('./scenes/test'),
  loading: CommonLoading,
});

class Image extends React.Component {
  state = {
    src: null
  };

  changeSrc = (newSrc) => {
    this.setState({
      src: newSrc
    });
  };

  render() {
    const {src, ...other} = this.props;
    const finalizedSrc = (null === this.state.src ? src : this.state.src);
    return (
      <img
      src={finalizedSrc}
      {...other}
      >
        {this.props.children}
      </img>
      );
  }
}

function ImageAlternative(props) {
  const overallStyle = {
    width: '100%',
    height: '32px',
    lineHeight: '32px',
    textAlign: 'center',
    verticalAlign: 'middle',
  };
  if (props.error) {
    // TODO 
    return (
      <div
      style={overallStyle}
      >
      ......
      </div>
    );
  } else if (props.timedOut) {
    // TODO 
    return (
      <div
      style={overallStyle}
      >
      ......
      </div>
    );
  } else if (props.pastDelay) {
    // TODO
    return (
      <div
      style={overallStyle}
      >
      ......
      </div>
    );
  } else {
    // When the loader has just started
    return (
      <div
      style={overallStyle}
      >
      ......
      </div>
    );
  }
}

const LoadableImage = Loadable({
  loader: Image, 
  loading: ImageAlternative,
});

// Reference 1 https://facebook.github.io/react/docs/transferring-props.html
// Reference 2 https://github.com/reactjs/react-router/issues/1531
const dict = {
  Image: Image,
  Topbar: StatelessTopbar,
  RoleLoginSingleton: PlayerManager,
  getRootElementSize: function() {
    const width = "innerWidth" in window
      ? window.innerWidth
      : document.documentElement.offsetWidth;
    const height = "innerHeight" in window
      ? window.innerHeight
      : document.documentElement.offsetHeight;
    return {
      width: width,
      height: height,
    }
  },
  goBack: function(sceneRef) {
    sceneRef.props.history.goBack();
  },
  pushNewScene: function(sceneRef, pathname, query) { 
    const searchStr = (typeof query === 'object' ? queryString.stringify(query) : query);
    sceneRef.props.history.push({
      pathname: pathname,
      search: searchStr 
    });
  },
  replaceNewScene: function(sceneRef, pathname, query) {
    const searchStr = (typeof query === 'object' ? queryString.stringify(query) : query);
    sceneRef.props.history.replace({
      pathname: pathname,
      search: searchStr 
    });
  },
  changeSceneTitle: function(sceneRef, title) {
    // Reference http://stackoverflow.com/questions/33866140/how-to-dynamically-change-document-title-in-js-so-wechat-browser-will-detect-it.
    document.title = title;
    const iframe = document.createElement('iframe');

    let _l = null;
    _l = function() {
      window.setTimeout(function() {
        iframe.removeEventListener('load', _l);
        document.body.removeChild(iframe);
      }, 0);
    }

    iframe.addEventListener('load', _l);
    /*
      // NOTE: Loading a blank page, i.e. `about:blank` DOESN'T work!!! 
      iframe.setAttribute("src", 'about:blank');
    */
    iframe.setAttribute("src", constants.ROUTE_PATHS.BASE + constants.ROUTE_PATHS.ROOT + "favicon.ico");
    iframe.style.display = "none";
    document.body.appendChild(iframe);
  },
};
    
const synthesizeRouteProps = (props) => {
  const newProps = {};
  Object.assign(newProps, dict);
  Object.assign(newProps, props);
  Object.assign(newProps, props.match); // For v3 compatibility
  Object.assign(newProps.location, {
    query: queryString.parse(props.location.search),
    basename: constants.ROUTE_PATHS.BASE + constants.ROUTE_PATHS.PLAYER,
  }); // For v3 compatibility
  return newProps;
};

/*
The `fetch` API is now natively supported by most modern mobile browsers.
*/
// import('whatwg-fetch').then(() => {
const PlayerConsole = ( 
  <Router basename={constants.ROUTE_PATHS.BASE + constants.ROUTE_PATHS.PLAYER}>
    <div>
      <Route exact path={constants.ROUTE_PATHS.PAGE + constants.ROUTE_PATHS.TEST} render={(props) => {
        return (
          <TestPage
          {...synthesizeRouteProps(props)}
          />
        );
      }} />
    </div>
  </Router>
);
export default PlayerConsole;

if (constants.NOT_IN_PRODUCTION) {
  import('vconsole').then(VConsolePlugin => {
    const vConsole = new VConsolePlugin.default();
    ReactDOM.render(PlayerConsole, document.getElementById('react-root'));
  });
} else {
  import('vconsole').then(VConsolePlugin => {
    ReactDOM.render(PlayerConsole, document.getElementById('react-root'));
  });
}

(function(window){
  // Really basic check for the ios platform
  // https://stackoverflow.com/questions/9038625/detect-if-device-is-ios
  var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  // Get the device pixel ratio
  var ratio = window.devicePixelRatio || 1;

  // Define the users device screen dimensions
  var screen = {
    width : window.screen.width * ratio,
    height : window.screen.height * ratio
  };

  // iPhone X Detection
  if (iOS && screen.width == 1125 && screen.height === 2436) {

    // Set a global variable now we've determined the iPhoneX is true
    window.iphoneX = true;

    // Adds a listener for ios devices that checks for orientation changes.
    window.addEventListener('orientationchange', update);
    update();
  }

  // Each time the device orientation changes, run this update function
  function update() {
    notch();
  }

  // Notch position checker
  function notch() {

    var _notch = '';

    if( 'orientation' in window ) {
      // Mobile
      if (window.orientation == 90) {
        _notch = 'left';
      } else if (window.orientation == -90) {
        _notch = 'right';
      }
    } else if ( 'orientation' in window.screen ) {
      // Webkit
      if( screen.orientation.type === 'landscape-primary') {
        _notch = 'left';
      } else if( screen.orientation.type === 'landscape-secondary') {
        _notch = 'right';
      }
    } else if( 'mozOrientation' in window.screen ) {
      // Firefox
      if( screen.mozOrientation === 'landscape-primary') {
        _notch = 'left';
      } else if( screen.mozOrientation === 'landscape-secondary') {
        _notch = 'right';
      }
    }

    window.notch = _notch;
  }
})(window);

if ( window.iphoneX === true ) {
  document.getElementById('react-root').classList = ['iphone-x'];
}


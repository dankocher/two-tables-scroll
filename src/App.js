import React from 'react';
import './App.scss';
import TwoTablesScroll from './components/TwoTablesScroll';

class App extends React.Component {

  state = {
    left: 0,
    top: 0,
    showTable: false,
    scrollPosition: 0
  };

  componentDidMount() {
    this.setState({
      left: this.left.clientWidth,
      top: this.header.clientHeight,
      showTable: true
    })
  }
  getContent = () => {
      let content = [];
      for (let i = 0; i < 5; i++) {
        content.push(<p key={'p-'+i}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>)
      }
      return content;
  };

  getLeftComponent = () => {
    return <div style={{backgroundColor: 'red', width: 938, height: 2000}}>{this.getContent()}</div>
  };
  getRightComponent = () => {
    return <div style={{backgroundColor: 'green', width: 1567, height: 2000}}>{this.getContent()}</div>
  };

  setScrollPosition = scrollPosition => {
    // console.log(scrollPosition)
    this.setState({scrollPosition})
  };

  render() {
    return <div className="App">
      <div className="header" ref={header => this.header = header}>
        Header
      </div>
      <div className="content">
        <div className="left-section" ref={left => this.left = left}>
          Left section
        </div>
        <div className="right-section">
          { !this.state.showTable ? null :
            <TwoTablesScroll
                leftPosition={this.state.left}
                topPosition={this.state.top}
                leftComponent={this.getLeftComponent()}
                rightComponent={this.getRightComponent()}
                leftMinSize={500}
                setScrollPosition={this.setScrollPosition}
            />
          }
        </div>
      </div>
    </div>
  }
}

export default App;


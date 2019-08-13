import React from 'react';
import './TwoTablesScroll.scss';
import PropTypes from 'prop-types';

class TwoTablesScroll extends React.Component {

    static propTypes = {
        leftComponent: PropTypes.object.isRequired,
        rightComponent: PropTypes.object.isRequired,
        leftMinSize: PropTypes.number.isRequired,
        leftPosition: PropTypes.number.isRequired,
        topPosition: PropTypes.number.isRequired
    };

    state = {
        scrolled: false,
        leftSidePosition: 0,
        topSidePosition: 0
    };


    componentDidMount() {
        console.log(this.__left.clientWidth, this.props.leftMinSize, this.props.leftPosition);
        this.setState({
            leftSidePosition: -(this.__left.clientWidth - this.props.leftMinSize) + this.props.leftPosition
        })
    }

    handleHorizontalScroll = (e) => {
        const scrollLeft = this.__scroll.scrollLeft;
        const leftWidth = this.__left.clientWidth;
        const minLeftScroll = leftWidth - this.props.leftMinSize;
        console.log(this.__scroll.scrollTop, this.props.topPosition)
        this.setState({
            topSidePosition: -this.__scroll.scrollTop + this.props.topPosition
        });
        if (scrollLeft > minLeftScroll) {
            if (!this.state.scrolled) {
                this.setState({scrolled: true})
            }
        } else {
            if (this.state.scrolled) {
                this.setState({scrolled: false})
            }
        }
    };

    render() {
        const {leftComponent, rightComponent, leftMinSize} = this.props;
        return <div className={`two-tables-scroll${this.state.scrolled ? " -scrolled" : ""}`}
                    ref={__scroll => this.__scroll = __scroll}
            onScroll={this.handleHorizontalScroll}
        >
            <div className={`scroll-content`}
                 style={{paddingLeft: this.state.scrolled ? this.__left.clientWidth : 0}}>
                <div className="left-component"
                    ref={__left => this.__left = __left}
                     style={{
                         left: this.state.scrolled ? this.state.leftSidePosition : 0,
                         top: this.state.scrolled ? this.state.topSidePosition : 0,
                     }}>
                    {leftComponent}
                </div>
                <div className="right-component"
                     ref={__right => this.__right = __right}>
                    {rightComponent}
                </div>
            </div>
        </div>
    }
}

export default TwoTablesScroll;
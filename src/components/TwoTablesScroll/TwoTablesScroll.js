import React from 'react';
import './TwoTablesScroll.scss';
import PropTypes from 'prop-types';

class TwoTablesScroll extends React.Component {

    static propTypes = {
        leftComponent: PropTypes.object.isRequired,
        rightComponent: PropTypes.object.isRequired,
        leftMinSize: PropTypes.number.isRequired,
        leftPosition: PropTypes.number.isRequired,
        topPosition: PropTypes.number.isRequired,
        setScrollPosition: PropTypes.func.isRequired
    };

    state = {
        scrolled: false,
        leftSidePosition: 0,
        topSidePosition: 0,
        leftScroll: 0,
        hWidthScroll: 240,
        vWidthScroll: 0,
        topScroll: 0
    };


    componentDidMount() {
        this.setState({
            leftSidePosition: -(this.__left.clientWidth - this.props.leftMinSize) + this.props.leftPosition
        });

        let aspectRatio = this.__scroll.clientWidth / this.__content.clientWidth;
        let hWidthScroll = aspectRatio * this.__scroll.clientWidth;
        this.setState({hWidthScroll});
        this.startScroll()
    }

    handleHorizontalScroll = (e) => {
        const scrollLeft = this.__scroll.scrollLeft;
        const leftWidth = this.__left.clientWidth;
        const minLeftScroll = leftWidth - this.props.leftMinSize;
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
        let leftScroll = this.__left.clientWidth - this.__scroll.scrollLeft;
        if (leftScroll < this.props.leftMinSize) {
            leftScroll = this.props.leftMinSize
        }
        this.props.setScrollPosition(leftScroll);

        let aspectRatio = this.__scroll.clientWidth / this.__content.clientWidth;
        this.setState({leftScroll: scrollLeft * aspectRatio });
    };

    render() {
        const {leftComponent, rightComponent, leftPosition} = this.props;
        return <div className={`two-tables-scroll${this.state.scrolled ? " -scrolled" : ""}`}
                    ref={__scroll => this.__scroll = __scroll}
            onScroll={this.handleHorizontalScroll}
        >
            <div className={`scroll-content`}
                 ref={__content => this.__content = __content}
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
            <div className="hor-scroll"
                 style={{
                     width: `calc(100% - ${leftPosition}px)`,
                     left: leftPosition
                 }}
            >
                <div className="s-thumb"
                     onMouseUp={this.mouseUpHandle}
                     onMouseMove={this.mouseMoveHandle}
                     onMouseDown={this.mouseDownHandle}
                     style={{
                    width: this.state.hWidthScroll,
                    left: this.state.leftScroll
                }}/>
            </div>
            <div className="v-scroll">
                <div className="-thumb"/>
            </div>
        </div>
    }

    startScroll() {
        if (!this.state.scrollStarted) {
            window.addEventListener('mouseup', this.mouseUpHandle);
            window.addEventListener('mousemove', this.mouseMoveHandle);
            this.setState({scrollStarted: true})
        }
    }

    componentWillUnmount() {
        window.removeEventListener('mouseup', this.mouseUpHandle);
        window.removeEventListener('mousemove', this.mouseMoveHandle);
    }

    mouseUpHandle = (e) => {
        if (this.state.dragging) {
            this.setState({dragging: false});
        }
    };

    mouseDownHandle = (e) => {
        if (!this.state.dragging) {
            this.setState({dragging: true});
            this.lastClientX = e.clientX;
            e.preventDefault();
        }
    };

    mouseMoveHandle = (e) => {
        if (this.state.dragging) {
            // let scrollTop = scroll_top * this.__container.offsetHeight / this.state.height;

            this.__scroll.scrollLeft += (-this.lastClientX + (this.lastClientX = e.clientX)) * this.__content.offsetWidth / this.__scroll.offsetWidth;
        }
    };
}

export default TwoTablesScroll;
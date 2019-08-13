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
        vHeightScroll: 0,
        topScroll: 0,
        hAspectRatio: 1,
        vAspectRatio: 1,
    };

    componentWillReceiveProps(nextProps, nextContext) {
        setTimeout(() => this.updateProps(nextProps), 0);
    }

    componentDidMount() {
        this.start();
    }
    start = async () => {
        await this.updateProps(this.props);
        this.startScroll();
    };

    updateProps = async props => {

        const leftSidePosition = -(this.__left.clientWidth - props.leftMinSize) + props.leftPosition;
        if (leftSidePosition !== this.state.leftSidePosition) {
            await this.setState({
                leftSidePosition: -(this.__left.clientWidth - props.leftMinSize) + props.leftPosition
            });
        }

        let hAspectRatio = (this.__scroll.clientWidth - 17) / this.__content.clientWidth;
        let hWidthScroll = hAspectRatio * this.__scroll.clientWidth;
        if(hWidthScroll !== this.state.hWidthScroll) {
            this.setState({hWidthScroll, hAspectRatio: (this.__scroll.clientWidth / this.__content.clientWidth)});
        }

        let vAspectRatio = (this.__scroll.clientHeight - 17) / this.__content.clientHeight;
        let vHeightScroll = vAspectRatio * this.__scroll.clientHeight;
        if(vHeightScroll !== this.state.vHeightScroll) {
            this.setState({vHeightScroll, vAspectRatio: (this.__scroll.clientHeight / this.__content.clientHeight)});
        }

    };

    handleHorizontalScroll = (e) => {
        const scrollLeft = this.__scroll.scrollLeft;
        const scrollTop = this.__scroll.scrollTop;
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

        let hAspectRatio = (this.__scroll.clientWidth - 17) / this.__content.clientWidth;
        let vAspectRatio = (this.__scroll.clientHeight - 17) / this.__content.clientHeight;
        this.setState({
            leftScroll: scrollLeft * hAspectRatio,
            topScroll: scrollTop * vAspectRatio
        });
    };

    render() {
        const {leftComponent, rightComponent, leftPosition, topPosition} = this.props;
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
                <div className="right-component">
                    {rightComponent}
                </div>
            </div>

            {   this.state.hAspectRatio >= 1 ? null :
                <div className="h-scroll" style={{width: `calc(100% - ${leftPosition}px)`, left: leftPosition}}>
                    <div className="-thumb"
                         onMouseUp={this.mouseUpHandle_horizontal}
                         onMouseMove={this.mouseMoveHandle_horizontal}
                         onMouseDown={this.mouseDownHandle_horizontal}
                         style={{width: this.state.hWidthScroll, left: this.state.leftScroll}}/>
                </div>
            }
            {   this.state.vAspectRatio >= 1 ? null :
                <div className="v-scroll" style={{height: `calc(100% - ${topPosition}px)`, top: topPosition}}>
                    <div className="-thumb"
                         onMouseUp={this.mouseUpHandle_vertical}
                         onMouseMove={this.mouseMoveHandle_vertical}
                         onMouseDown={this.mouseDownHandle_vertical}
                         style={{height: this.state.vHeightScroll, top: this.state.topScroll}}/>
                    <div className="-end"/>
                </div>
            }
        </div>
    }

    startScroll() {
        if (!this.state.scrollStarted) {
            window.addEventListener('mouseup', this.mouseUpHandle_horizontal);
            window.addEventListener('mousemove', this.mouseMoveHandle_horizontal);
            window.addEventListener('mouseup', this.mouseUpHandle_vertical);
            window.addEventListener('mousemove', this.mouseMoveHandle_vertical);
            this.setState({scrollStarted: true})
        }
    }

    componentWillUnmount() {
        window.removeEventListener('mouseup', this.mouseUpHandle_horizontal);
        window.removeEventListener('mousemove', this.mouseMoveHandle_horizontal);
        window.removeEventListener('mouseup', this.mouseUpHandle_vertical);
        window.removeEventListener('mousemove', this.mouseMoveHandle_vertical);
    }
    mouseUpHandle_horizontal = (e) => {
        if (this.state.draggingH) {
            this.setState({draggingH: false});
        }
    };
    mouseDownHandle_horizontal = (e) => {
        if (!this.state.draggingH) {
            this.setState({draggingH: true});
            this.lastClientX = e.clientX;
            e.preventDefault();
        }
    };

    mouseMoveHandle_horizontal = (e) => {
        if (this.state.draggingH) {
            this.__scroll.scrollLeft += (-this.lastClientX + (this.lastClientX = e.clientX)) * this.__content.offsetWidth / this.__scroll.offsetWidth;
        }
    };
    mouseUpHandle_vertical = (e) => {
        if (this.state.draggingV) {
            this.setState({draggingV: false});
        }
    };
    mouseDownHandle_vertical = (e) => {
        if (!this.state.draggingV) {
            this.setState({draggingV: true});
            this.lastClientY = e.clientY;
            e.preventDefault();
        }
    };

    mouseMoveHandle_vertical = (e) => {
        if (this.state.draggingV) {
            this.__scroll.scrollTop += (-this.lastClientY + (this.lastClientY = e.clientY)) * this.__content.offsetHeight / this.__scroll.offsetHeight;
        }
    };
}

export default TwoTablesScroll;
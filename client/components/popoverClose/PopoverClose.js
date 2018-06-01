import React from 'react';
import PropTypes from 'prop-types';

/**
 * 用于手动关闭antd的Popover
 * @param {*ReactComponent} Component 
 */
export default function PopoverClose (Component) {

  return class extends React.Component {

    static propTypes = {
      getValue: PropTypes.func,
      tabFocus: PropTypes.number
    }

    state = {
      isShowSelf: true,
      tabFocus: 1,
    }

    closeSelf = () => {
      setTimeout(() => {
        this.setState({
          isShowSelf: false
        }, () => {
          this.setState({
            isShowSelf: true
          });
        });
      }, 100);
    } 

    onTab = (tabFocus=1) => {
      this.setState({tabFocus});
    }

    getValue = (value) => {
      const { getValue } = this.props;
      getValue && getValue(value);
    }

    render() {
      const { isShowSelf, tabFocus } = this.state;
      const visible = isShowSelf ? {} : { visible: false };

      return (
        <Component
          tabFocus={tabFocus}
          visible={visible}
          onTab={this.onTab}
          getValue={this.getValue}
          closePopover={this.closeSelf}
          {...this.props}
        />
      );
    }
  };
}
import React, { Component } from 'react';
import { Popover, Icon } from 'antd';
import PopoverClose from '../popoverClose';
import styles from './Add.css';

const opts = [
  {
    name: '项目',
    value: 0,
    icon: 'appstore-o',
  },
  {
    name: '任务',
    value: 1,
    icon: 'profile'
  }
];

@PopoverClose
export default class Add extends Component {

  onSelect(value) {
    const { getValue, closePopover } = this.props;
    getValue(value);
    closePopover();
  }

  render() {
    const {
      children,
      visible,
    } = this.props;

    return (
      <Popover
        {...visible}
        content={this.renderContent()}
        trigger="click"
        placement="bottom"
      >
        {children}
      </Popover>
    );
  }

  renderContent() {

    return (
      <ul className={styles.add}>
        {
          opts.map(opt => (
            <li
              key={opt.value}
              onClick={() => this.onSelect(opt.value)}
              className="click-btn"
            >
              <span><Icon type={opt.icon} /></span>
              <span>{opt.name}</span>
            </li>
          ))
        }
      </ul>
    );
  }
}
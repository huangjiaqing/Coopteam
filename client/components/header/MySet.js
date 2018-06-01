import React, { Component } from 'react';
import { Popover } from 'antd';
import PopoverClose from '../popoverClose';
import styles from './MySet.css';

const opts = [
  {
    name: '账号设置',
    value: 0
  },
  {
    name: '个人中心',
    value: 1
  },
  {
    name: '退出登录',
    value: 2
  },
];

@PopoverClose
export default class MySet extends Component {

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
      <ul className={styles.mySet}>
        {
          opts.map(opt => (
            <li
              key={opt.value}
              onClick={() => this.onSelect(opt.value)}
              className="click-btn"
            >
              {opt.name}
            </li>
          ))
        }
      </ul>
    );
  }
}
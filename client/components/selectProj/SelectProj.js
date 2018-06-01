import React, { Component } from 'react';
import { Popover, Icon, Input } from 'antd';
import PopoverClose from 'components/popoverClose';
import className from 'classnames';
import styles from './SelectProj.css';

@PopoverClose
export default class SelectProj extends Component {

  handleClick = () => {
    this.props.closePopover();
  }

  render() {
    const { children, visible } = this.props;

    return (
      <Popover
        {...visible}
        trigger="click"
        placement="bottom"
        content={this.renderContent()}
      >
        <div className={className(styles.selectProjBtn, 'click-btn')}>
          <span>{children}</span>
          <span><Icon type="down" /></span>
        </div>
      </Popover>
    );
  }

  renderContent() {

    return (
      <div className={styles.selectProj}>
        <div className={styles.search}>
          <Input placeholder="查找项目" />
        </div>
        <h2>
          所有项目
        </h2>
        <ul>
          {this.renderProjectItem(true)}
          {this.renderProjectItem()}
          {this.renderProjectItem()}
          {this.renderProjectItem()}
        </ul>
      </div>
    );
  }

  renderProjectItem(seleced=false) {

    return (
      <li
        onClick={this.handleClick}
        className={className(styles.projectItem, 'click-btn')}
      >
        <div className={styles.itemImg}/>
        <h2>立白悦协作</h2>
        { seleced && <span><Icon type="check" /></span> }
      </li>
    );
  }
}
import React, { Component } from 'react';
import { Popover, Icon } from 'antd';
import PropTypes from 'prop-types';
import className from 'classnames';
import PopoverClose from '../popoverClose';
import styles from './OrgSelect.css';

@PopoverClose
export default class OrgSelect extends Component {

  static propTypes = {
    opts: PropTypes.array,
    selected: PropTypes.string,
    children: PropTypes.any
  }

  onSelect(opt) {
    const {
      onTab,
      closePopover,
      getValue
    } = this.props;

    onTab(opt._organizationId);
    getValue(opt);
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

  componentDidMount() {
    this.onSelect(this.props.opts[0]);
  }

  renderContent() {
    const { tabFocus, opts=[] } = this.props;
    
    return (
      <div className={styles.orgSelect}>
        <ul>
          {
            opts.length && opts.map(opt => {
              return this.renderOrgItem({
                data: opt,
                onSelect: (opt) => this.onSelect(opt),
                selected: tabFocus === opt._organizationId
              });
            })
          }
        </ul>
        <div className={className(styles.addOrg, 'click-btn')}>
          <span>
            <Icon
              type="plus"
              className={className(styles.addIcon, 'click-btn')}
            />
          </span>
          <span>创建企业</span>
        </div>
      </div>
    );
  }

  renderOrgItem({data, selected=false, onSelect}) {

    return (
      <li
        key={data._organizationId}
        onClick={() => onSelect(data)}
        className={
          className(
            styles.orgItem,
            selected ? styles.selectItem : '',
            'click-btn'
          )
        }
      >
        <span>
          {selected && (
            <span>
              <Icon
                type='check'
                className={styles.selectIcon}
              /> 
            </span>
          )}
        </span>
        <span>{data.name}</span>
      </li>
    );
  }
}
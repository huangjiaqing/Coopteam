import React from 'react';
import PropTypes from 'prop-types';
import { Breadcrumb, Icon } from 'antd';
import { Link } from 'react-router-dom';
import { SelectProj } from 'components';
import styles from './Header.css';

const Header = ({ isOpenMenu, onMenuClick }) => (
  <div className={styles.header}>
    <section className={styles.nav}>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>
          <Link to="/org">首页</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <SelectProj>
            立白悦协作
          </SelectProj>
        </Breadcrumb.Item>
      </Breadcrumb>
    </section>
    <section className={styles.action}>
      <li className="click-btn" onClick={() => onMenuClick(!isOpenMenu)}>
        <Icon type="menu-unfold" className={styles.actionIcon}/>
        <span>菜单</span>
      </li>
    </section>
  </div>
);

Header.propTypes = {
  isOpenMenu: PropTypes.bool,
  onMenuClick: PropTypes.func,
};

export default Header;
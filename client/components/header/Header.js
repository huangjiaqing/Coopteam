import React, { PureComponent } from 'react';
import { Layout, Icon, Input, Avatar, Spin } from 'antd';
import { OrgStore, ProjectStore } from 'store';
import { Listen } from 'ctx';
import className from 'classnames';
import OrgSelect from './OrgSelect';
import MySet from './MySet';
import Add from './Add';
import styles from './Header.css';

const { Header } = Layout;
const { Search } = Input;

export default class extends PureComponent {
  
  render() {

    return (
      <Header
        style={{
          width: '100%',
          backgroundColor: '#fff',
          height: '48px',
          boxShadow: '0 1px 3px 0 rgba(0,0,0,.15)',
          padding: '0',
          position: 'relative'
        }}
      >
        <div className={styles.header}>
          {this.renderOrg()}
          {this.renderSearch()}
          {this.renderMe()}
        </div>
      </Header>
    );
  }

  renderOrg() {

    return (
      <Listen
        to={[ OrgStore, ProjectStore ]}
        didMount={(OrgStore) => {
          OrgStore.getOrgs();
        }}
      >
        {(OrgStore, ProjectStore) => {
          const { orgs=[], currentOrg } = OrgStore.state;

          return (
            <section className={styles.org}>
              {
                orgs.length
                  ? [
                    <span className={styles.orgIcon} key={1}>
                      <OrgSelect
                        opts={orgs}
                        getValue={(org) => {
                          // 选择组织，获取组织下的项目
                          ProjectStore.getProjects(org._organizationId);
                          // header 显示的组织
                          OrgStore.setCurrentOrg(org);
                        }}
                      >
                        <Icon type="bars" className="click-btn" />
                      </OrgSelect>
                    </span>,
                    <h2 onClick={this.handleClick} key={2}>
                      {currentOrg ? currentOrg.name : '无组织'}
                    </h2>
                  ]
                  : <Spin />
              }
            </section>
          );
        }}
      </Listen>
    );
  }

  renderSearch() {

    return (
      <section className={styles.search}>
        <Search
          placeholder="在个人项目中搜索"
          onSearch={value => console.log(value)}
          style={{ width: 240 }}
        />
        <Add>
          <Icon
            onClick={this.handleClick}
            type="plus-circle"
            className={className(styles.addTask, 'click-btn')}
          />
        </Add>
      </section>
    );
  }

  renderMe() {

    return (
      <section className={styles.me}>
        <MySet>
          <Avatar
            icon="user"
            size="small"
            className="click-btn"
          />
        </MySet>
      </section>
    );
  }
}

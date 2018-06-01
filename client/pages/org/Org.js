import React, { PureComponent } from 'react';
import { Header, ProjectSet } from 'components';
import { ProjectStore } from 'store';
import { Listen } from 'ctx';
import Project from './Project';
import styles from './Org.css';

let blocks = [
  {
    name: '星标项目',
    isShowSelf: false,
    isShowContent: true,
    projects: []
  },
  {
    name: '企业项目',
    isShowSelf: true,
    isShowContent: true,
    projects: []
  },
  {
    name: '项目回收站',
    isShowSelf: false,
    isShowContent: true,
    projects: []
  },
];

export default class Org extends PureComponent {

  state = {
    isShowProjectSet: true,
  }

  render() {
    const { isShowProjectSet } = this.state;

    return (
      <Listen to={[ProjectStore]}>
        {ProjectStore => {
          blocks.forEach(item => {
            if (item.name === '企业项目') {
              item.projects = ProjectStore.state.projects;
            }
          });

          return (
            <div className={styles.org}>
              <Header />
              {this.renderMain()}
              {isShowProjectSet && (
                <ProjectSet />
              )}
            </div>
          );
        }}
      </Listen>
    );
  }

  renderMain() {

    return (
      <div className={styles.main}>
        <div className={styles.center}>
          {
            blocks.map(block => (
              this.renderBlock(block)
            ))
          }
        </div>
      </div>
    );
  }

  renderBlock({ name, isShowSelf, isShowContent, projects }) {

    return isShowSelf && (
      <section key={name}>
        <h2>{name}</h2>
        {isShowContent && (
          <div className={styles.projGroup}>
            {projects.map(item => (
              <Project
                key={item.name}
                data={item}
                openEdit={() => console.log('点击编辑啦')}
              />
            ))}
          </div>
        )}
      </section>
    );
  }
}
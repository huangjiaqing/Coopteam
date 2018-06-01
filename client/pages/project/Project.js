import React, { Component } from 'react';
import Header from 'components/header';
import SubHeader from './Header';
import Board from './Board';
import styles from './Project.css';

export default class Project extends Component {

  state = {
    isOpenMenu: false
  }

  onClickMenuBtn = (isOpenMenu=true) => {
    this.setState({
      isOpenMenu
    });
  }

  render() {
    const { isOpenMenu } = this.state;
    const { _projectId } = this.props.match.params;

    return (
      <div className={styles.project}>
        <Header />
        <SubHeader
          isOpenMenu={isOpenMenu}
          onMenuClick={this.onClickMenuBtn}
        />
        <Board
          isOpenMenu={isOpenMenu}
          closeMenu={() => this.onClickMenuBtn(false)}
          projectId={_projectId}
        />
      </div>
    );
  }
}
import React, { Component } from 'react';
import { StageStore } from 'store';
import { Listen } from 'ctx';
import { Spin } from 'antd';
import ProjectMenu from 'components/projectMenu';
import Scrum from './Scrum';
import Stage from './Stage';
import styles from './Board.css';

export default class Board extends Component {

  render() {
    const { isOpenMenu, closeMenu, projectId } = this.props;

    return (
      <div className={styles.board}>
        <Scrum>
          <Listen
            to={[StageStore]}
            didMount={(StageStore) => StageStore.getStages(projectId)}
          >
            {(StageStore) => {
              const { stages, isLoadingStages } = StageStore.state;
              return (
                isLoadingStages
                  ? (<Spin />)
                  : stages.map(stage => (
                    <Stage data={stage} key={stage.order}/>
                  ))
              );
            }}
          </Listen>
          <Stage create />
        </Scrum>
        <ProjectMenu
          isOpenMenu={isOpenMenu}
          closeMenu={closeMenu}
        />
      </div>
    );
  }
}
import React from 'react';
import { TaskStore } from 'store';
import { Listen } from 'ctx';
import { Icon } from 'antd';
import Task from './Task';
import className from 'classnames';
import styles from './Stage.css';

export default function Stage({ data={}, create }) {
  const { name, _stageId } = data;

  return (
    <li className={className(styles.stage, create ? styles.create : '')}>
      {create
        ? (
          <div className={className(styles.createStage, 'can-click')}>
            <Icon type="plus" className={styles.createIcon}/>
            <span>新建任务列表 ...</span>
          </div>
        )
        : [
          <h2 className={styles.title} key="title">{name} · {0}</h2>,
          <div
            className={styles.tasks}
            key="list"
          >
            <div className={styles.list}>
              <Listen
                to={[TaskStore]}
                didMount={(TaskStore) => { TaskStore.getTasks(_stageId);}}
              >
                {(TaskStore) => {
                  const tasks = TaskStore.state.tasks[_stageId] || [];
                  return (
                    tasks.length
                      ? (
                        tasks.map(task => (
                          <Task
                            key={task.order}
                            data={task}
                            openTaskDetail={() => {}}
                          />
                        ))
                      )
                      : ''
                  );
                }}
              </Listen>
            </div>
            <div className={styles.addTask} key="add">
              
            </div>
          </div>
        ]}
    </li>
  );
}
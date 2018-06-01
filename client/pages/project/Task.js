import React from 'react';
import styles from './task.css';
import className from 'classnames';
import { Avatar, Icon } from 'antd';

export default function Task ({ data, openTaskDetail }) {

  const { content } = data;

  return (
    <div className={styles.task}>
      <div
        className={className(styles.body, 'can-click')}
        onClick={openTaskDetail}
      >
        <Icon type="minus-square-o" style={{ fontSize: 16, top: 2, position: 'relative' }}/>
        <section className={styles.taskInfo}>
          <h2 className={styles.content}>
            {content}
          </h2>
        </section>
        <Avatar
          icon="user"
          size="small"
          src="https://i.loli.net/2018/03/25/5ab6f20c79726.jpg"
        />
      </div>
    </div>
  );
}
import React from 'react';
import PropTypes from 'prop-types';
import styles from './Project.css';
import className from 'classnames';
import { Link } from 'react-router-dom';
import { Icon } from 'antd';

const Project = ({ data={}, openEdit }) => {
  const { name, stared, _projectId } = data;

  return (
    <Link
      to={`/project/${_projectId}`}
      className={styles.projItem}
    >
      <div className={styles.projInfo}>
        <h2>{name}</h2>
        <div className={styles.action}>
          <Icon
            type="edit"
            className={className(styles.projIcon, styles.iconEdit)}
            onClick={openEdit}
          />
          <Icon
            type="star"
            className={className(styles.projIcon, styles.iconStar, stared ? styles.stared : '')}
            // onClick={this.star}
          />
        </div>
      </div>
    </Link>
  );
};

Project.propTypes = {
  data: PropTypes.object,
  openEdit: PropTypes.func,
};

export default Project;
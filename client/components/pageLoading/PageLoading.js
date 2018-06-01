import React from 'react';
import { Spin } from 'antd';

const PageLoading = () => (
  <div style={{
    width: '100%',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }}>
    <Spin size="large" />
  </div>
);

export default PageLoading;
import React, { Component } from 'react';

export default (loadComponent, placeholder = '加载中 ..') => {

  return class Loadable extends Component {

    state = {
      Component: null
    }

    componentWillUnmount() {
      this.unmount = true;
    }

    async componentDidMount() {
      const { default: Component } = await loadComponent();

      if (this.unmount) return;

      this.setState({ Component });
    }

    render() {
      const { Component } = this.state;

      return (
        Component
          ? <Component {...this.props} />
          : placeholder
      );
    }
  };
};

/**
 * 描述：基于 React16 Context API 的状态管理方案 
 * 时间：2018/05/01
 * 作者：GaKing
 * 参考：https://github.com/215566435/rectx
 */

import React from 'react';

const Context = React.createContext();

export class Store {
  constructor(setState) {
    this.state = {};
    this.setFaterState = setState;
  }

  setState(partial, cb) {
    setImmediate(() => {
      if (typeof partial === 'function') {
        this.state = partial(this.state);
      } else {
        const newState = { ...this.state, ...partial };
        this.state = newState;
      }

      this.setFaterState(this.state, cb);
    });
  }
}

/**
 * render props（推荐）
 */
export class Listen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.Machines = [];
    this._isMounted = false;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
    this.props.didMount && this.props.didMount.apply(null, this.Machines);
  }

  _noopUpdate = (state, cb) => {
    if (this._isMounted) this.setState({}, cb);
  }

  createMachine = context => {
    if (context === void 666) {
      throw new Error('<Listen/> components must be wrapped in a <Provider/>');
    }

    const MachineConstructor = this.props.to;

    let newMachines = MachineConstructor.map(Machine => {
      if (context.get(Machine)) {
        return context.get(Machine);
      }
      let newInstance = new Machine(this._noopUpdate);
      context.set(Machine, newInstance);
      return newInstance;
    });

    this.Machines = newMachines;
    // 返回状态机
    return this.Machines;
  }

  render() {
    return (
      <Context.Consumer>
        {context => this.props.children.apply(null, this.createMachine(context))}
      </Context.Consumer>
    );
  }
}

export class Provider extends React.Component {

  render() {
    return (
      <Context.Consumer>
        {topState => {
          let childState = new Map(topState);
          return (
            <Context.Provider value={childState}>
              {this.props.children}
            </Context.Provider>
          );
        }}
      </Context.Consumer>     
    );
  }
}

/**
 * HOC (废弃)
 */
export function connect ({to=[], didMount=()=>{}}) {
  if (!(to instanceof Array)) {
    throw new Error('to 必须为数组');
  }
  if (!(didMount instanceof Function)) {
    throw new Error('didMount 必须为函数');
  }

  return function (Component) {

    return class extends React.Component {
      state = {}
      stores = []
      _isMounted = false

      componentWillMount() {
        this._isMounted = false;
      }

      componentDidMount() {
        this._isMounted = true; 
        didMount.apply(null, this.stores); 
      }

      // 与Store建立连接
      _noopUpdate = (state, cb) => {
        if (this._isMounted) this.setState({}, cb);
      }

      createStore = state => {
        if (state === void 666) {
          throw new Error('<Connect /> 组件必须包裹于一个 <Provider /> 之下');
        }
    
        let storeForChildren = {};
        for (let StoreFactory of to) {
          if (state.get(StoreFactory)) {
            storeForChildren[StoreFactory.name] = state.get(StoreFactory);
          } else {
            let newStoreInstance = new StoreFactory(this._noopUpdate);
            state.set(StoreFactory, newStoreInstance);
            storeForChildren[StoreFactory.name] = newStoreInstance;
          }
        }

        return storeForChildren;
      }

      render() {
        return (
          <Context.Consumer>
            {
              context => {
                let store = this.createStore(context);
                return (
                  <Component
                    {...store}
                    {...this.props}
                  />
                );
              }
            }
          </Context.Consumer>
        );  
      }
    };
  };
}
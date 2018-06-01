/**
 * 描述：基于 React16 Context API 的状态管理方案 
 * 时间：2018/05/01
 * 作者：GaKing
 * 参考：https://github.com/215566435/rectx
 */

import React from 'react';
import produce from 'immer';

const Context = React.createContext();
let ListenerID = 0;

export class Store {
  constructor() {
    this.state = {};
    this.setFaterState = [];
    this.produce = produce;
    this.isDirty = false;
    this.map = new Map();
  }

  addListener = (setState, id) => {
    if (!this.map.get(id)) {
      this.map.set(id, true);
      this.setFaterState.push({ fn: setState, id: id });
    }
  }

  removeListener = id => {
    this.map.delete(id);
    this.setFaterState = this.setFaterState.filter(i => i.id !== id);
  }

  setState(partial, cb) {
    this.isDirty = true;

    setImmediate(() => {
      let newState;
      if (typeof partial === 'function') {
        newState = produce(this.state, partial);
      } else {
        newState = { ...this.state, ...partial };
      }

      this.state = newState;

      // 广播
      let callbackLength = this.setFaterState.length;
      this.setFaterState.forEach(({ fn }) => {
        fn(this.state, () => {
          callbackLength--;
          if (callbackLength <=0 ) {
            this.isDirty = false;
          }
          cb && cb(this.state);
        });
      });
    });
  }
}

/**
 * render props（推荐）
 */
export class Listen extends React.Component {
  constructor(props) {
    super(props);
    ListenerID++;
    this.id = ListenerID;
    this.state = {};
    this.Machines = [];
    this._isMounted = false;
  }

  componentWillUnmount() {
    this.Machines.forEach(m => {
      m.removeListener(this.id);
    });
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
    this.props.didMount && this.props.didMount.apply(null, this.Machines);
  }

  _noopUpdate = (state, cb) => {
    // if (this._isMounted) this.setState({}, cb);
    this.setState({}, cb);
  }

  createMachine = context => {
    if (context === void 666) {
      throw new Error('<Listen/> components must be wrapped in a <Provider/>');
    }

    const MachineConstructor = this.props.to;

    let newMachines = MachineConstructor.map(Machine => {
      if (context.get(Machine)) {
        const instance = context.get(Machine);
        instance.addListener(this._noopUpdate.bind(this), this.id);
        return instance;
      }
      let newInstance = new Machine(this._noopUpdate);
      newInstance.addListener(this._noopUpdate.bind(this), this.id);
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
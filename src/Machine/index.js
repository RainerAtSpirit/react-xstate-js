import { Component } from 'react';
import PropTypes from 'prop-types';
import { Machine } from 'xstate';

class MachineComponent extends Component {
  constructor(props) {
    super(props);

    const { statechart } = this.props;
    this.machine = Machine(statechart);
    this.state = { machineStateNode: this.machine.initialState };

    this.transition = this.transition.bind(this);
    this.triggerActionsCalcData = this.triggerActionsCalcData.bind(this);
  }

  componentDidMount() {
    const { machine } = this;

    this.triggerActionsCalcData(machine.initialState, null);
  }

  transition(event) {
    const {
      state: {
        data: currentData,
        machineStateNode: currentStateNode,
      },
      triggerActionsCalcData,
    } = this;

    const nextStateNode = this.machine.transition(currentStateNode, event.type);
    const newData = triggerActionsCalcData(nextStateNode, event);

    this.setState({
      machineStateNode: nextStateNode,
      data: {
        ...currentData,
        ...newData,
      },
    });
  }

  triggerActionsCalcData(stateNode, event) {
    const {
      props: { actionMap },
      transition,
    } = this;

    return stateNode.actions.reduce(
      (acc, actionKey) => ({
        ...acc,
        // takes in the event data & a transition function incase the action will dispatch more events.
        ...actionMap[actionKey](event, transition),
      }),
      {},
    );
  }

  render() {
    const {
      props: { children },
      state: { machineStateNode, data },
      transition,
    } = this;

    return children({
      transition,
      state: machineStateNode.value,
      data,
    });
  }
}

MachineComponent.propTypes = {
  // eslint-disable-next-line
  statechart: PropTypes.object.isRequired,
  // eslint-disable-next-line
  actionMap: PropTypes.object.isRequired,
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.element]).isRequired,
};

export default MachineComponent;

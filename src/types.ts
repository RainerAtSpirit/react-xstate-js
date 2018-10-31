import {
  // MachineConfig, ParallelMachineConfig,
  StateInterface
} from 'xstate/lib/types'

export interface IEvent {
  type: string
  [key: string]: any
}

export interface IData {
  [key: string]: any
}

export type Send = (event: IEvent) => void

export interface IActionMap {
  [key: string]: (event?: IEvent, send?: Send) => IData | void
}

export interface IReturnProps {
  state: any
  send: Send
  data: IData
}

export interface IProps {
  // see workaround stated in ./Machine/index.tsx
  // config: MachineConfig | ParallelMachineConfig
  config: any
  actionMap?: IActionMap
  defaultData?: IData
  children: (args: IReturnProps) => JSX.Element
}

export interface IState {
  data: IData
  machineStateNode: StateInterface
}

import type { CodeLine,PlayerMethod } from '../../components/player/types'
export interface MinStackStep{operation:string;stack:Array<[number,string]>;result:string;phase:'init'|'push'|'read'|'pop'|'done';lineId:string;message:string}
export const minStackMethods:PlayerMethod[]=[{id:'paired',label:'值 + 当前最小值',complexity:'O(1) / 操作',languages:['javascript']}]
export const minStackCode:CodeLine[]=[{id:'class',text:'class MinStack {'},{id:'constructor',text:'  constructor() {'},{id:'sentinel',text:'    this.st = [[0, Infinity]]'},{id:'constructor-end',text:'  }'},{id:'push',text:'  push(val) {'},{id:'push-body',text:'    this.st.push([val, Math.min(this.getMin(), val)])'},{id:'push-end',text:'  }'},{id:'pop',text:'  pop() {'},{id:'pop-body',text:'    this.st.pop()'},{id:'pop-end',text:'  }'},{id:'top',text:'  top() {'},{id:'top-body',text:'    return this.st[this.st.length - 1][0]'},{id:'top-end',text:'  }'},{id:'min',text:'  getMin() {'},{id:'min-body',text:'    return this.st[this.st.length - 1][1]'},{id:'min-end',text:'  }'},{id:'end',text:'}'}]
export const minStackSteps:MinStackStep[]=[
 {operation:'MinStack()',stack:[[0,'∞']],result:'null',phase:'init',lineId:'sentinel',message:'压入不可见的栈底哨兵 [0, Infinity]，真实栈仍为空'},
 {operation:'push(-2)',stack:[[0,'∞'],[-2,'-2']],result:'null',phase:'push',lineId:'push-body',message:'min(Infinity, -2) = -2，新帧保存 [-2, -2]'},
 {operation:'push(0)',stack:[[0,'∞'],[-2,'-2'],[0,'-2']],result:'null',phase:'push',lineId:'push-body',message:'min(-2, 0) = -2，新帧保存 [0, -2]'},
 {operation:'push(-3)',stack:[[0,'∞'],[-2,'-2'],[0,'-2'],[-3,'-3']],result:'null',phase:'push',lineId:'push-body',message:'min(-2, -3) = -3，栈顶最小值更新为 -3'},
 {operation:'getMin()',stack:[[0,'∞'],[-2,'-2'],[0,'-2'],[-3,'-3']],result:'-3',phase:'read',lineId:'min-body',message:'直接读取栈顶帧的 min 列，O(1) 返回 -3'},
 {operation:'pop()',stack:[[0,'∞'],[-2,'-2'],[0,'-2']],result:'null',phase:'pop',lineId:'pop-body',message:'弹出 [-3, -3]；前一帧保存的最小值 -2 自动恢复'},
 {operation:'top()',stack:[[0,'∞'],[-2,'-2'],[0,'-2']],result:'0',phase:'read',lineId:'top-body',message:'读取栈顶帧的 value 列，返回 0'},
 {operation:'getMin()',stack:[[0,'∞'],[-2,'-2'],[0,'-2']],result:'-2',phase:'done',lineId:'min-body',message:'读取栈顶帧的 min 列，返回 -2；所有操作均为 O(1)'},
]

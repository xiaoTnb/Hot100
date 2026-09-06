import type { CodeLine,PlayerMethod } from '../../components/player/types'
export interface TopKStep{consumed:number;counts:Record<number,number>;buckets:number[][];scanBucket:number|null;output:number[];active:number|null;phase:'count'|'bucket'|'collect'|'done';lineId:string;message:string}
export const topKNums=[1,1,1,2,2,3], topK=2
export const topKMethods:PlayerMethod[]=[{id:'bucket',label:'频率桶排序',complexity:'O(N) · O(N)',languages:['javascript']}]
export const topKCode:CodeLine[]=[{id:'function',text:'var topKFrequent = function (nums, k) {'},{id:'map',text:'  const cnt = new Map()'},{id:'count-loop',text:'  for (const x of nums) {'},{id:'count',text:'    cnt.set(x, (cnt.get(x) ?? 0) + 1)'},{id:'count-close',text:'  }'},{id:'max',text:'  const maxCnt = Math.max(...cnt.values())'},{id:'buckets',text:'  const buckets = Array.from({length:maxCnt+1}, () => [])'},{id:'bucket-loop',text:'  for (const [x, c] of cnt.entries()) {'},{id:'bucket',text:'    buckets[c].push(x)'},{id:'bucket-close',text:'  }'},{id:'ans',text:'  const ans = []'},{id:'scan',text:'  for (let i=maxCnt; i>=0 && ans.length<k; i--) {'},{id:'collect',text:'    ans.push(...buckets[i])'},{id:'scan-close',text:'  }'},{id:'return',text:'  return ans'},{id:'end',text:'}'}]
export const topKSteps:TopKStep[]=[
 {consumed:0,counts:{},buckets:[[],[],[],[]],scanBucket:null,output:[],active:null,phase:'count',lineId:'map',message:'创建频率 Map，从左到右统计每个数字'},
 {consumed:1,counts:{1:1},buckets:[[],[],[],[]],scanBucket:null,output:[],active:1,phase:'count',lineId:'count',message:'读到 1：cnt[1] = 1'},
 {consumed:2,counts:{1:2},buckets:[[],[],[],[]],scanBucket:null,output:[],active:1,phase:'count',lineId:'count',message:'再次读到 1：cnt[1] = 2'},
 {consumed:3,counts:{1:3},buckets:[[],[],[],[]],scanBucket:null,output:[],active:1,phase:'count',lineId:'count',message:'第三次读到 1：cnt[1] = 3'},
 {consumed:4,counts:{1:3,2:1},buckets:[[],[],[],[]],scanBucket:null,output:[],active:2,phase:'count',lineId:'count',message:'读到 2：cnt[2] = 1'},
 {consumed:5,counts:{1:3,2:2},buckets:[[],[],[],[]],scanBucket:null,output:[],active:2,phase:'count',lineId:'count',message:'再次读到 2：cnt[2] = 2'},
 {consumed:6,counts:{1:3,2:2,3:1},buckets:[[],[],[],[]],scanBucket:null,output:[],active:3,phase:'count',lineId:'max',message:'读到 3 后统计完成，最大频率 maxCnt = 3'},
 {consumed:6,counts:{1:3,2:2,3:1},buckets:[[],[3],[2],[1]],scanBucket:null,output:[],active:null,phase:'bucket',lineId:'bucket',message:'按频率分桶：3 在桶 1，2 在桶 2，1 在桶 3'},
 {consumed:6,counts:{1:3,2:2,3:1},buckets:[[],[3],[2],[1]],scanBucket:3,output:[1],active:1,phase:'collect',lineId:'collect',message:'从频率 3 开始倒序扫描，收集元素 1'},
 {consumed:6,counts:{1:3,2:2,3:1},buckets:[[],[3],[2],[1]],scanBucket:2,output:[1,2],active:2,phase:'collect',lineId:'collect',message:'扫描频率 2 的桶，收集元素 2；答案已达到 k = 2'},
 {consumed:6,counts:{1:3,2:2,3:1},buckets:[[],[3],[2],[1]],scanBucket:2,output:[1,2],active:null,phase:'done',lineId:'return',message:'停止扫描并返回 [1, 2]'},
]

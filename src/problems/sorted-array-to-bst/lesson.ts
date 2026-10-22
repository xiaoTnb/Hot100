import { java, recorder, type TreeFrame, type TreeLesson } from '../tree-lessons/model'

const code = java(`
class Solution {
  public TreeNode sortedArrayToBST(int[] nums) {
@start|    return dfs(nums, 0, nums.length);
  }
  // 处理左闭右开区间 [left, right)
  private TreeNode dfs(int[] nums, int left, int right) {
@base|    if (left == right) return null;
@middle|    int m = (left + right) >>> 1;
@create|    TreeNode node = new TreeNode(nums[m]);
@left|    node.left = dfs(nums, left, m);
@right|    node.right = dfs(nums, m + 1, right);
@return|    return node;
  }
}`)

export const sortedArrayLesson: TreeLesson = {
  methods: [{ id: 'divide', label: '中点分治 · 左闭右开', complexity: 'O(N) · O(log N)', languages: ['java'], code }],
  scenarios: [
    { id: 'sample', label: '数组 [-10,-3,0,5,9]', input: [-10,-3,0,5,9] },
    { id: 'even', label: '偶数长度 [1,3]', input: [1,3] },
    { id: 'single', label: '单个元素', input: [0] },
  ],
  legend: '蓝色：当前选择的中点。左右子问题各取约一半，偶数长度选中间偏右的数。',
  makeFrames(_method, scenario) {
    const r = recorder([])
    const nums = scenario.input as number[]
    let root: number | null = null
    const rows = (left: number, right: number, middle?: number): TreeFrame['rows'] => [
      { label: 'nums（下标 : 值）', items: nums.map((value, index) => `${index}: ${value}${middle === index ? ' ← m' : ''}`) },
      { label: `本次 [${left},${right})`, items: nums.slice(left,right).map(String), tone: 'orange' },
    ]
    const push = (lineId: string, title: string, message: string, left: number, right: number, middle?: number, active: number[] = []) => r.push(lineId,title,message,{ root, active, variables: [['left', String(left)], ['right（不包含）', String(right)], ...(middle === undefined ? [] : [['m', String(middle)] as [string,string], ['nums[m]', String(nums[middle])] as [string,string]])], rows: rows(left,right,middle) })
    push('start','从整个数组开始','调用 dfs(nums, 0, nums.length)。区间是左闭右开，right 不包含在本次数组中。',0,nums.length)
    const dfs = (left: number, right: number, parent: number | null, side?: 'left' | 'right'): number | null => {
      r.stack.push(`dfs([${left}, ${right}))`)
      if (left === right) {
        push('base','空区间返回 null',`left == right == ${left}，没有元素，不创建节点。`,left,right)
        r.stack.pop()
        return null
      }
      const middle = (left + right) >>> 1
      push('middle','选择区间中点',`m = (${left} + ${right}) >>> 1 = ${middle}；nums[${middle}] = ${nums[middle]} 将作为当前子树的根。`,left,right,middle)
      const id = r.nodes.length
      r.nodes.push({ id, value: nums[middle], left: null, right: null })
      if (parent === null) root = id
      else if (side) r.nodes[parent][side] = id
      push('create',`创建节点 ${nums[middle]}`,`创建值为 ${nums[middle]} 的新节点；左边的数都比它小，右边的数都比它大。`,left,right,middle,[id])
      push('left','构造左子树',`递归区间 [${left},${middle})，对应中点左边的元素；返回后接到 node.left。`,left,right,middle,[id])
      const l = dfs(left,middle,id,'left')
      r.nodes[id].left = l
      push('right','构造右子树',`左子树已返回，递归区间 [${middle + 1},${right})；跳过中点自身，避免重复建树。`,left,right,middle,[id])
      const rr = dfs(middle + 1,right,id,'right')
      r.nodes[id].right = rr
      r.completed.push(id)
      push('return','返回已连接的子树',`节点 ${nums[middle]} 的左右子树均已构造完毕，返回当前 node。`,left,right,middle,[id])
      r.stack.pop()
      return id
    }
    dfs(0,nums.length,null)
    r.push('start','平衡二叉搜索树构造完成','每个数组元素恰好创建一次节点；左右子问题规模接近，递归深度 O(log N)。返回值的空间不计入额外空间。',{root,done:true,rows:[{label:'原升序数组',items:nums.map(String),tone:'green'}]})
    return r.frames
  },
}

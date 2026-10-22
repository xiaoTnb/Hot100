import { java, recorder, type TreeLesson } from '../tree-lessons/model'

const preorder = java(`
class Solution {
  public boolean isValidBST(TreeNode root) {
@start|    return isValidBST(root, Long.MIN_VALUE, Long.MAX_VALUE);
  }
  private boolean isValidBST(TreeNode node, long left, long right) {
@base|    if (node == null) return true;
    long x = node.val;
@check|    return left < x && x < right &&
@left|        isValidBST(node.left, left, x) &&
@right|        isValidBST(node.right, x, right);
  }
}`)
const inorder = java(`
class Solution {
  private long pre = Long.MIN_VALUE;
  public boolean isValidBST(TreeNode root) {
@base|    if (root == null) return true;
@left|    if (!isValidBST(root.left)) return false;
@check|    if (root.val <= pre) return false;
@save|    pre = root.val;
@right|    return isValidBST(root.right);
  }
}`)
const postorder = java(`
class Solution {
  public boolean isValidBST(TreeNode root) {
@start|    return dfs(root)[1] != Long.MAX_VALUE;
  }
  private long[] dfs(TreeNode node) {
@base|    if (node == null) return new long[]{Long.MAX_VALUE, Long.MIN_VALUE};
@left|    long[] left = dfs(node.left);
@right|    long[] right = dfs(node.right);
    long x = node.val;
@check|    if (x <= left[1] || x >= right[0]) {
@invalid|      return new long[]{Long.MIN_VALUE, Long.MAX_VALUE};
    }
@return|    return new long[]{Math.min(left[0], x), Math.max(right[1], x)};
  }
}`)

const lo = '-∞ (Long.MIN)', hi = '+∞ (Long.MAX)'
const label = (value: number) => value === -Infinity ? lo : value === Infinity ? hi : String(value)

export const validateBSTLesson: TreeLesson = {
  methods: [
    { id:'preorder', label:'前序 · 传递合法范围', complexity:'O(N) · O(H)', languages:['java'], code:preorder },
    { id:'inorder', label:'中序 · 严格递增', complexity:'O(N) · O(H)', languages:['java'], code:inorder },
    { id:'postorder', label:'后序 · 返回最小最大值', complexity:'O(N) · O(H)', languages:['java'], code:postorder },
  ],
  scenarios: [
    { id:'yes', label:'合法 [2,1,3]', input:[2,1,3] },
    { id:'ancestor', label:'反例：符合父节点，却违反祖先', input:[5,1,7,null,null,4,8] },
    { id:'sample-no', label:'示例反例 [5,1,4,null,null,3,6]', input:[5,1,4,null,null,3,6] },
    { id:'equal', label:'重复值不合法', input:[2,2,3] },
    { id:'limit', label:'int 最大值也能合法', input:[2147483647] },
  ],
  legend:'左子树所有值 < 根 < 右子树所有值。比较必须严格，不能只检查直接孩子。long 边界容纳全部 int 值。',
  makeFrames(method,scenario) {
    const r = recorder(scenario.input)
    let answer: boolean
    const visited: string[] = []
    let lastId: number | null = null
    if (method === 'preorder') {
      r.push('start','从完整 long 范围开始','初始范围为 (Long.MIN_VALUE, Long.MAX_VALUE)，int 的最小值和最大值都严格位于其中。')
      const dfs = (id: number|null,left: number,right: number): boolean => {
        r.stack.push(`check(${r.name(id)}, ${label(left)}, ${label(right)})`)
        if (id === null) { r.push('base','空子树合法','node = null，返回 true。'); r.stack.pop(); return true }
        lastId = id
        const node = r.nodes[id], x = node.value
        const valid = left < x && x < right
        r.push('check',valid ? '检查继承的范围' : '违反祖先传下的范围',`${label(left)} < ${x} < ${label(right)} 为 ${valid}。${valid ? '接下来收窄孩子的范围。' : '范围来自整条祖先路径，不能只看父节点。'}`,{active:[id],failed:!valid,variables:[['left（严格下界）',label(left)],['x',String(x)],['right（严格上界）',label(right)]]})
        if (!valid) { r.stack.pop(); return false }
        r.push('left','向左传递更小的上界',`左子树范围为 (${label(left)}, ${x})。`,{active:[id]})
        if (!dfs(node.left,left,x)) { r.stack.pop(); return false }
        r.push('right','向右传递更大的下界',`右子树范围为 (${x}, ${label(right)})。`,{active:[id]})
        const validRight = dfs(node.right,x,right)
        if (validRight) r.completed.push(id)
        r.stack.pop()
        return validRight
      }
      answer = dfs(r.root,-Infinity,Infinity)
    } else if (method === 'inorder') {
      let pre = -Infinity
      const dfs = (id: number|null): boolean => {
        r.stack.push(`isValidBST(${r.name(id)})`)
        if (id === null) { r.push('base','空子树返回 true','空节点不改变 pre，也不参与相邻值比较。',{variables:[['pre',label(pre)]]}); r.stack.pop(); return true }
        const node=r.nodes[id]
        r.push('left','先递归左子树','按左 → 根 → 右的顺序访问，pre 保存上一次真正访问的节点值。',{active:[id],variables:[['pre',label(pre)]]})
        if (!dfs(node.left)) { r.stack.pop(); return false }
        lastId=id
        const valid=node.value>pre
        r.push('check','检查是否严格递增',`${node.value} > pre(${label(pre)}) 为 ${valid}。${valid ? '本次值大于上次访问的值。' : '遇到相等或下降，立即返回 false。'}`,{active:[id],failed:!valid,variables:[['pre',label(pre)],['root.val',String(node.value)]],rows:[{label:'中序访问序列',items:[...visited,String(node.value)],tone:valid?'blue':'orange'}]})
        if (!valid) { r.stack.pop(); return false }
        pre=node.value
        visited.push(String(pre))
        r.completed.push(id)
        r.push('save','保存本次值为 pre',`pre = ${pre}；它将作为下一个中序节点的严格下界。`,{active:[id],variables:[['pre',String(pre)]],rows:[{label:'中序访问序列',items:[...visited],tone:'green'}]})
        r.push('right','再检查右子树','左侧和当前根已合法，继续访问右侧。',{active:[id]})
        const right=dfs(node.right)
        r.stack.pop()
        return right
      }
      answer=dfs(r.root)
    } else {
      const returns: string[]=[]
      const dfs=(id:number|null):[number,number]=>{
        r.stack.push(`dfs(${r.name(id)})`)
        if(id===null){r.push('base','空子树的范围哨兵','返回 [Long.MAX_VALUE, Long.MIN_VALUE]，使空左/右子树都不限制父节点。',{variables:[['返回 [min,max]',`[${hi}, ${lo}]`]]});r.stack.pop();return[Infinity,-Infinity]}
        const node=r.nodes[id]
        r.push('left','先求左子树 min / max','等待左子树返回最小值和最大值。',{active:[id]})
        const left=dfs(node.left)
        r.push('right','再求右子树 min / max',`左子树已返回 [${label(left[0])}, ${label(left[1])}]。`,{active:[id]})
        const right=dfs(node.right)
        lastId=id
        const valid=node.value>left[1]&&node.value<right[0]
        const variables:[string,string][]=[['左子树最大值',label(left[1])],['x',String(node.value)],['右子树最小值',label(right[0])]]
        r.push('check','用子树范围检查根',`${node.value} > 左最大 ${label(left[1])} 且 ${node.value} < 右最小 ${label(right[0])} 为 ${valid}。`,{active:[id],failed:!valid,variables})
        const result:[number,number]=valid?[Math.min(left[0],node.value),Math.max(right[1],node.value)]:[-Infinity,Infinity]
        returns.push(`${node.value}: [${label(result[0])}, ${label(result[1])}]`)
        if(valid)r.completed.push(id)
        r.push(valid?'return':'invalid',valid?'返回整棵子树的范围':'返回无效哨兵并向上传播',valid?`本次返回 [${label(result[0])}, ${label(result[1])}]，供父节点检查。`:'返回 [Long.MIN_VALUE, Long.MAX_VALUE]；上层也会判为无效，不能把错误子树当作合法范围。',{active:[id],failed:!valid,variables:[['返回 [min,max]',`[${label(result[0])}, ${label(result[1])}]`]],rows:[{label:'子树返回值',items:[...returns],tone:valid?'green':'orange'}]})
        r.stack.pop()
        return result
      }
      answer=dfs(r.root)[1]!==Infinity
    }
    r.push(method==='inorder'?(answer?'right':'check'):'start',`返回 ${answer}`,answer?'所有节点都满足严格的二叉搜索树性质。':'出现不满足条件的子树，整棵树不是有效二叉搜索树。',{done:true,failed:!answer,active:!answer&&lastId!==null?[lastId]:[],variables:[['答案',String(answer)]],rows:visited.length?[{label:'已通过的中序序列',items:visited,tone:'green'}]:[]})
    return r.frames
  },
}

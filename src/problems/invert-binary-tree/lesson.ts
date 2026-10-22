import { java, recorder, type TreeLesson } from '../tree-lessons/model'

const afterCode = java(`
class Solution {
  public TreeNode invertTree(TreeNode root) {
@base|    if (root == null) return null;
@left|    TreeNode left = invertTree(root.left);
@right|    TreeNode right = invertTree(root.right);
@set-left|    root.left = right;
@set-right|    root.right = left;
@return|    return root;
  }
}`)
const beforeCode = java(`
class Solution {
  public TreeNode invertTree(TreeNode root) {
@base|    if (root == null) return null;
@save|    TreeNode tmp = root.left;
@set-left|    root.left = root.right;
@set-right|    root.right = tmp;
@left|    invertTree(root.left);
@right|    invertTree(root.right);
@return|    return root;
  }
}`)

export const invertLesson: TreeLesson = {
  methods: [
    { id: 'after', label: '先递归，再交换', complexity: 'O(N) · O(H)', languages: ['java'], code: afterCode },
    { id: 'before', label: '先交换，再递归', complexity: 'O(N) · O(H)', languages: ['java'], code: beforeCode },
  ],
  scenarios: [
    { id: 'full', label: '完整树 [4,2,7,1,3,6,9]', input: [4,2,7,1,3,6,9] },
    { id: 'small', label: '三个节点', input: [2,1,3] },
    { id: 'empty', label: '空树', input: [] },
  ],
  legend: '蓝色：当前 root；绿色：已完成翻转。每个节点都要交换自己的左右孩子。',
  makeFrames(method, scenario) {
    const r = recorder(scenario.input)
    const visit = (id: number | null): number | null => {
      r.stack.push(`invertTree(${r.name(id)})`)
      if (id === null) {
        r.push('base', '递归边界', 'root = null，返回 null；空孩子不需要交换。', { variables: [['root', 'null']] })
        r.stack.pop()
        return null
      }
      const node = r.nodes[id]
      r.push('base', `进入节点 ${node.value}`, `检查 root=${node.value}，不是空节点，继续翻转这棵子树。`, { active: [id], variables: [['root', String(node.value)]] })
      const swap = (left: number | null, right: number | null) => {
        const variables: [string, string][] = [['root', r.name(id)], [method === 'after' ? 'left' : 'tmp', r.name(left)], ['right', r.name(right)]]
        r.push('set-left', '准备交换：先查看暂存引用', `即将执行 root.left = ${r.name(right)}；${method === 'after' ? 'left' : 'tmp'} 保存了原左子树 ${r.name(left)}。树图保留交换前状态，下一步展示两次赋值后的连线。`, { active: [id], variables, rows: [{ label: '接下来两次赋值', items: [`root.left → ${r.name(right)}`, `root.right → ${r.name(left)}`], tone: 'orange' }] })
        node.left = right
        node.right = left
        r.push('set-right', '左右孩子交换完成', `root.right = ${r.name(left)}；节点 ${node.value} 现在左接 ${r.name(right)}、右接 ${r.name(left)}。`, { active: [id], variables })
      }
      if (method === 'after') {
        r.push('left', '递归翻转左子树', `暂存当前调用，先进入 ${node.value} 的左子树 ${r.name(node.left)}。`, { active: [id] })
        const left = visit(node.left)
        r.push('right', '左侧返回，递归右侧', `左子树返回 ${r.name(left)}，再翻转右子树 ${r.name(node.right)}。`, { active: [id], variables: [['left', r.name(left)]] })
        const right = visit(node.right)
        swap(left, right)
      } else {
        const left = node.left, right = node.right
        r.push('save', '先保存左孩子', `tmp = ${r.name(left)}；保存后交换才不会丢失原左子树。`, { active: [id], variables: [['tmp', r.name(left)]] })
        swap(left, right)
        r.push('left', '翻转交换后的左子树', `此时左孩子是 ${r.name(node.left)}，递归处理它的内部。`, { active: [id] })
        visit(node.left)
        r.push('right', '翻转交换后的右子树', `左侧完成，继续递归右孩子 ${r.name(node.right)}。`, { active: [id] })
        visit(node.right)
      }
      r.completed.push(id)
      r.push('return', `返回子树根 ${node.value}`, `节点 ${node.value} 的左右子树和孩子位置都已翻转，返回当前 root。`, { active: [id], completed: [...r.completed] })
      r.stack.pop()
      return id
    }
    visit(r.root)
    r.push(r.root === null ? 'base' : 'return', '翻转完成', '所有节点都已处理；返回原根节点，整棵树已成为镜像。', { done: true })
    return r.frames
  },
}

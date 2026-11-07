import { java, recorder, type TreeLesson } from '../tree-lessons/model'

const bottomUp = java(`
class Solution {
  public int maxDepth(TreeNode root) {
@base|    if (root == null) return 0;
@left|    int lDepth = maxDepth(root.left);
@right|    int rDepth = maxDepth(root.right);
@return|    return Math.max(lDepth, rDepth) + 1;
  }
}`)

const topDown = java(`
class Solution {
  private int ans;
  public int maxDepth(TreeNode root) {
@init|    ans = 0;
@start|    dfs(root, 0);
@answer|    return ans;
  }
  private void dfs(TreeNode node, int depth) {
@base|    if (node == null) return;
@depth|    depth++;
@update|    ans = Math.max(ans, depth);
@left|    dfs(node.left, depth);
@right|    dfs(node.right, depth);
  }
}`)

export const maximumDepthLesson: TreeLesson = {
  showCurrentStatement: false,
  methods: [
    { id: 'bottom-up', label: '自底向上 · 返回子树深度', complexity: 'O(N) · O(H)', languages: ['java'], code: bottomUp },
    { id: 'top-down', label: '自顶向下 · 传递当前深度', complexity: 'O(N) · O(H)', languages: ['java'], code: topDown },
  ],
  scenarios: [
    { id: 'sample', label: '示例：最大深度 3', input: [3,9,20,null,null,15,7] },
    { id: 'chain', label: '右侧单链：深度 2', input: [1,null,2] },
    { id: 'single', label: '只有根节点：深度 1', input: [1] },
    { id: 'empty', label: '空树：深度 0', input: [] },
  ],
  legend: '深度按节点数计算。蓝色：当前调用；绿色：已完成。H 为树高，最坏退化成链时 H=N。',
  makeFrames(method, scenario) {
    const r = recorder(scenario.input)
    const results: string[] = []
    let answer = 0
    let deepest: number[] = []
    const origin = (parent: number | null, side?: 'left' | 'right') => parent === null ? '根节点' : `${r.name(parent)} 的${side === 'left' ? '左' : '右'}孩子`
    if (method === 'bottom-up') {
      const dfs = (id: number | null, parent: number | null = null, side?: 'left' | 'right'): { depth: number; chain: number[] } => {
        const source = origin(parent, side)
        r.stack.push(id === null ? `maxDepth(null) · ${source}：null` : `maxDepth(${r.name(id)})`)
        if (id === null) {
          r.push('base', `${source}：null，返回 0`, `${source}是 null，这次递归返回 0${parent === null ? '，空树深度为 0。' : `，回到节点 ${r.name(parent)} 后赋给 ${side === 'left' ? 'lDepth' : 'rDepth'}。`}`, { active: parent === null ? [] : [parent], variables: [['本次调用来源', source], ['root', 'null'], ['返回深度', '0']] })
          r.stack.pop()
          return { depth: 0, chain: [] }
        }
        const node = r.nodes[id]
        r.push('left', `求节点 ${node.value} 的左子树深度`, `当前调用先等待 maxDepth(${r.name(node.left)}) 的返回结果。`, { active: [id], variables: [['root', r.name(id)]] })
        const left = dfs(node.left, id, 'left')
        r.push('left', `左子树返回 ${left.depth}`, `lDepth = ${left.depth}；它是左子树自己的深度，还没有算当前节点 ${node.value}。`, { active: [id], variables: [['lDepth', String(left.depth)]] })
        r.push('right', '继续求右子树深度', `保存 lDepth=${left.depth}，递归调用 maxDepth(${r.name(node.right)})。`, { active: [id], variables: [['lDepth', String(left.depth)]] })
        const right = dfs(node.right, id, 'right')
        r.push('right', `右子树返回 ${right.depth}`, `rDepth = ${right.depth}；左右两侧的结果现在都已得到。`, { active: [id], variables: [['lDepth', String(left.depth)], ['rDepth', String(right.depth)]] })
        const depth = Math.max(left.depth,right.depth) + 1
        const chain = [id, ...(left.depth >= right.depth ? left.chain : right.chain)]
        results.push(`${node.value} → ${depth}`)
        r.completed.push(id)
        r.push('return', `返回节点 ${node.value} 的子树深度 ${depth}`, `max(${left.depth}, ${right.depth}) + 1 = ${depth}。取较深的子树，再加上当前节点这 1 层；叶子节点就是 max(0,0)+1=1。`, { active: [id], path: chain, variables: [['lDepth', String(left.depth)], ['rDepth', String(right.depth)], ['返回深度', String(depth)]], rows: [{ label: '已返回：节点 → 子树深度', items: [...results], tone: 'green' }] })
        r.stack.pop()
        return { depth, chain }
      }
      const result = dfs(r.root)
      answer = result.depth
      deepest = result.chain
    } else {
      r.push('init', '初始化最大深度', 'ans = 0；从根节点开始调用 dfs(root, 0)，还没有计入任何节点。', { variables: [['ans', '0']] })
      const dfs = (id: number | null, depth: number, ancestors: number[], parent: number | null = null, side?: 'left' | 'right') => {
        const source = origin(parent, side)
        r.stack.push(id === null ? `dfs(null, depth=${depth}) · ${source}：null` : `dfs(${r.name(id)}, depth=${depth})`)
        if (id === null) {
          r.push('base', `${source}：null，结束本次调用`, `${source}是 null，不执行 depth++${parent === null ? '，直接回到入口方法' : `，回到节点 ${r.name(parent)} 继续执行`}；ans 仍为 ${answer}。`, { active: parent === null ? [] : [parent], path: [...deepest], variables: [['本次调用来源', source], ['node', 'null'], ['传入 depth', String(depth)], ['ans', String(answer)]] })
          r.stack.pop()
          return
        }
        const node = r.nodes[id]
        const before = depth
        depth++
        const chain = [...ancestors,id]
        r.push('depth', `计入当前节点 ${node.value}`, `depth 从 ${before} 加到 ${depth}；根到节点 ${node.value} 的路径上共有 ${depth} 个节点。`, { active: [id], path: chain, variables: [['传入 depth', String(before)], ['depth++ 后', String(depth)], ['ans', String(answer)]] })
        const old = answer
        if (depth > answer) { answer = depth; deepest = [...chain] }
        r.push('update', '更新目前最深的层数', `ans = max(${old}, ${depth}) = ${answer}。dfs 不返回深度，而是把最深值保存在 ans 中。`, { active: [id], path: [...deepest], variables: [['depth', String(depth)], ['ans', String(answer)]] })
        r.push('left', '把当前深度传给左孩子', `调用 dfs(${r.name(node.left)}, ${depth})；孩子会在自己的调用中再执行 depth++。`, { active: [id], variables: [['本层 depth', String(depth)], ['ans', String(answer)]] })
        dfs(node.left,depth,chain,id,'left')
        r.push('right', '回到本层，再进入右孩子', `左子调用返回，本层 depth 仍为 ${depth}。调用 dfs(${r.name(node.right)}, ${depth})；左侧的 depth++ 不会改变本层的整数变量。`, { active: [id], path: [...deepest], variables: [['本层 depth', String(depth)], ['ans', String(answer)]] })
        dfs(node.right,depth,chain,id,'right')
        r.completed.push(id)
        r.stack.pop()
      }
      dfs(r.root,0,[])
    }
    r.push(method === 'bottom-up' ? r.root === null ? 'base' : 'return' : 'answer', `最大深度为 ${answer}`, `最长的根到叶路径有 ${answer} 个节点${answer ? `：${deepest.map(r.name).join(' → ')}` : '，因为输入是空树'}。这里数的是节点，不是边。`, { done: true, path: deepest, variables: [['答案', String(answer)]], rows: [{ label: '最深路径（根 → 叶）', items: deepest.map(r.name), tone: 'orange' }] })
    return r.frames
  },
}

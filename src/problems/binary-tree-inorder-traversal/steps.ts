import type { CodeLine,PlayerMethod } from '../../components/player/types'

export type InorderMethod='recursive'|'morris'
export interface InorderStep{phase:'enter'|'left'|'visit'|'thread'|'restore'|'done';active:number|null;visited:number[];stack:number[];thread:boolean;lineId:string;message:string}

export const inorderMethods:PlayerMethod[]=[
 {id:'recursive',label:'递归 DFS',complexity:'O(N) · O(H)',languages:['java']},
 {id:'morris',label:'Morris 遍历',complexity:'O(N) · O(1)',languages:['java']},
]

const recursiveCode:CodeLine[]=[
 {id:'r-import',text:'import java.util.*;'},
 {id:'r-class',text:'class Solution {'},
 {id:'r-method',text:'  public List<Integer> inorderTraversal(TreeNode root) {'},
 {id:'r-ans',text:'    List<Integer> ans = new ArrayList<>();'},
 {id:'r-call',text:'    dfs(root, ans);'},
 {id:'r-return',text:'    return ans;'},
 {id:'r-method-end',text:'  }'},
 {id:'r-dfs',text:'  private void dfs(TreeNode node, List<Integer> ans) {'},
 {id:'r-null',text:'    if (node == null) return;'},
 {id:'r-left',text:'    dfs(node.left, ans);'},
 {id:'r-add',text:'    ans.add(node.val);'},
 {id:'r-right',text:'    dfs(node.right, ans);'},
 {id:'r-dfs-end',text:'  }'},
 {id:'r-class-end',text:'}'},
]

const morrisCode:CodeLine[]=[
 {id:'m-import',text:'import java.util.*;'},
 {id:'m-class',text:'class Solution {'},
 {id:'m-method',text:'  public List<Integer> inorderTraversal(TreeNode root) {'},
 {id:'m-ans',text:'    List<Integer> ans = new ArrayList<>();'},
 {id:'m-loop',text:'    while (root != null) {'},
 {id:'m-no-left',text:'      if (root.left == null) {'},
 {id:'m-add-direct',text:'        ans.add(root.val);'},
 {id:'m-right-direct',text:'        root = root.right;'},
 {id:'m-else',text:'      } else {'},
 {id:'m-pre',text:'        TreeNode pre = root.left;'},
 {id:'m-find',text:'        while (pre.right != null && pre.right != root) pre = pre.right;'},
 {id:'m-first',text:'        if (pre.right == null) {'},
 {id:'m-thread',text:'          pre.right = root;'},
 {id:'m-go-left',text:'          root = root.left;'},
 {id:'m-second',text:'        } else {'},
 {id:'m-restore',text:'          pre.right = null;'},
 {id:'m-add-return',text:'          ans.add(root.val);'},
 {id:'m-go-right',text:'          root = root.right;'},
 {id:'m-if-end',text:'        }'},
 {id:'m-else-end',text:'      }'},
 {id:'m-loop-end',text:'    }'},
 {id:'m-return',text:'    return ans;'},
 {id:'m-method-end',text:'  }'},
 {id:'m-class-end',text:'}'},
]

const recursiveSteps:InorderStep[]=[
 {phase:'enter',active:1,visited:[],stack:[1],thread:false,lineId:'r-call',message:'调用 dfs(1)，调用栈记住遍历完左子树后还要回到节点 1'},
 {phase:'left',active:1,visited:[],stack:[1],thread:false,lineId:'r-left',message:'先递归 node.left；节点 1 的左子树为空，立即返回'},
 {phase:'visit',active:1,visited:[1],stack:[1],thread:false,lineId:'r-add',message:'左子树处理完，记录根节点 1；ans = [1]'},
 {phase:'enter',active:2,visited:[1],stack:[1,2],thread:false,lineId:'r-right',message:'再进入节点 1 的右子树，调用栈变为 [1, 2]'},
 {phase:'left',active:3,visited:[1],stack:[1,2,3],thread:false,lineId:'r-left',message:'节点 2 有左孩子 3，继续向左递归到节点 3'},
 {phase:'visit',active:3,visited:[1,3],stack:[1,2,3],thread:false,lineId:'r-add',message:'节点 3 没有左孩子，记录 3；ans = [1, 3]'},
 {phase:'visit',active:2,visited:[1,3,2],stack:[1,2],thread:false,lineId:'r-add',message:'节点 3 返回后记录节点 2；顺序始终是左 → 根 → 右'},
 {phase:'done',active:null,visited:[1,3,2],stack:[],thread:false,lineId:'r-return',message:'递归完成，返回 [1, 3, 2]；最坏调用栈空间 O(N)'},
]

const morrisSteps:InorderStep[]=[
 {phase:'enter',active:1,visited:[],stack:[],thread:false,lineId:'m-loop',message:'从 root=1 开始；Morris 不使用递归栈'},
 {phase:'visit',active:1,visited:[1],stack:[],thread:false,lineId:'m-add-direct',message:'节点 1 没有左孩子，直接记录 1，然后走向右孩子 2'},
 {phase:'left',active:2,visited:[1],stack:[],thread:false,lineId:'m-find',message:'节点 2 有左子树：寻找左子树最右节点，得到前驱 pre=3'},
 {phase:'thread',active:3,visited:[1],stack:[],thread:true,lineId:'m-thread',message:'pre.right 为空，临时建立 3 → 2 的橙色线索，再让 root 走到左孩子 3'},
 {phase:'visit',active:3,visited:[1,3],stack:[],thread:true,lineId:'m-add-direct',message:'节点 3 没有左孩子，记录 3；沿临时线索回到节点 2'},
 {phase:'restore',active:2,visited:[1,3],stack:[],thread:false,lineId:'m-restore',message:'再次找到 pre=3，发现 pre.right 指向 root：删除临时线索，恢复原树'},
 {phase:'visit',active:2,visited:[1,3,2],stack:[],thread:false,lineId:'m-add-return',message:'线索删除后记录节点 2，再走向它的右子树'},
 {phase:'done',active:null,visited:[1,3,2],stack:[],thread:false,lineId:'m-return',message:'Morris 遍历完成，返回 [1, 3, 2]；树已恢复，额外空间 O(1)'},
]

export function getInorderCode(method:InorderMethod){return method==='recursive'?recursiveCode:morrisCode}
export function getInorderSteps(method:InorderMethod){return method==='recursive'?recursiveSteps:morrisSteps}

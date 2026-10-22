import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { execFileSync } from 'node:child_process'
import ts from 'typescript'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

const require = createRequire(import.meta.url)
const root = path.resolve(import.meta.dirname, '..')
const cache = new Map()
function load(file) {
  const absolute = path.resolve(root, file)
  if (cache.has(absolute)) return cache.get(absolute)
  const source = fs.readFileSync(absolute, 'utf8')
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText
  const module = { exports: {} }
  const localRequire = specifier => {
    if (specifier.endsWith('.css')) return { default: new Proxy({}, { get: (_, key) => String(key) }) }
    if (!specifier.startsWith('.')) return require(specifier)
    const target = path.resolve(path.dirname(absolute), specifier)
    return load(`${target}${fs.existsSync(`${target}.ts`) ? '.ts' : '.tsx'}`)
  }
  new Function('require', 'module', 'exports', compiled)(localRequire, module, module.exports)
  cache.set(absolute, module.exports)
  return module.exports
}

const { treeFromLevelOrder } = load('src/problems/tree-lessons/model.ts')
const { TreeLessonPlayer } = load('src/problems/tree-lessons/TreeLessonPlayer.tsx')
const { LanguageProvider } = load('src/components/player/LanguageProvider.tsx')
const entries = [
  ['invert-binary-tree', 'invertLesson', 'invertTree'],
  ['symmetric-tree', 'symmetricLesson', 'isSymmetric'],
  ['diameter-binary-tree', 'diameterLesson', 'diameterOfBinaryTree'],
  ['binary-tree-level-order', 'levelOrderLesson', 'levelOrder'],
  ['sorted-array-to-bst', 'sortedArrayLesson', 'sortedArrayToBST'],
  ['validate-bst', 'validateBSTLesson', 'isValidBST'],
]
function encode(nodes, id) {
  if (id === null) return '#'
  const node = nodes.find(item => item.id === id)
  assert.ok(node, `missing node ${id}`)
  return `${node.value}(${encode(nodes,node.left)},${encode(nodes,node.right)})`
}
function inorder(nodes, id) {
  if (id === null) return []
  const node = nodes.find(item => item.id === id)
  return [...inorder(nodes,node.left),node.value,...inorder(nodes,node.right)]
}
function height(nodes, id) {
  if (id === null) return 0
  const node = nodes.find(item => item.id === id)
  const left = height(nodes,node.left), right = height(nodes,node.right)
  assert.ok(Math.abs(left-right) <= 1, 'constructed tree must be balanced')
  return 1 + Math.max(left,right)
}
function expected(folder, input) {
  const tree = treeFromLevelOrder(input)
  const get = id => tree.nodes[id]
  if (folder === 'invert-binary-tree') {
    for (const node of tree.nodes) [node.left,node.right] = [node.right,node.left]
    return encode(tree.nodes,tree.root)
  }
  if (folder === 'symmetric-tree') {
    function mirror(a,b) { return a === null || b === null ? a === b : get(a).value === get(b).value && mirror(get(a).left,get(b).right) && mirror(get(a).right,get(b).left) }
    return String(tree.root === null || mirror(get(tree.root).left,get(tree.root).right))
  }
  if (folder === 'diameter-binary-tree') {
    let answer = 0
    function depth(id) { if (id === null) return 0; const node=get(id), l=depth(node.left), r=depth(node.right); answer=Math.max(answer,l+r); return 1+Math.max(l,r) }
    depth(tree.root)
    return String(answer)
  }
  if (folder === 'binary-tree-level-order') {
    const answer=[]
    let layer=tree.root===null?[]:[tree.root]
    while (layer.length) { answer.push(layer.map(id=>get(id).value)); layer=layer.flatMap(id=>[get(id).left,get(id).right].filter(child=>child!==null)) }
    return JSON.stringify(answer)
  }
  if (folder === 'validate-bst') {
    const values=inorder(tree.nodes,tree.root)
    return String(values.every((value,index)=>index===0||value>values[index-1]))
  }
  return null
}

let cases = 0, framesChecked = 0
const javaFiles = []
for (const [folder,exportName,javaMethod] of entries) {
  const lesson = load(`src/problems/${folder}/lesson.ts`)[exportName]
  for (const method of lesson.methods) {
    const ids = method.code.map(line=>line.id)
    assert.equal(new Set(ids).size,ids.length,`${folder}/${method.id}: duplicate code ID`)
    const javaAssertions=[]
    for (const scenario of lesson.scenarios) {
      const frames = lesson.makeFrames(method.id,scenario)
      const label = `${folder}/${method.id}/${scenario.id}`
      const html = renderToStaticMarkup(React.createElement(LanguageProvider, { value: { language: 'java', setLanguage() {} } }, React.createElement(TreeLessonPlayer, { lesson: { ...lesson, methods: [method], scenarios: [scenario] } })))
      assert.ok(html.includes('animation-canvas'),`${label}: rendered animation missing`)
      assert.ok(!html.includes('NaN'),`${label}: invalid rendered coordinates`)
      assert.ok(frames.length>0,label)
      for (const frame of frames) {
        assert.ok(ids.includes(frame.lineId),`${label}: unknown line ${frame.lineId}`)
        assert.equal(new Set(frame.nodes.map(n=>n.id)).size,frame.nodes.length,`${label}: duplicate node ID`)
        assert.ok(frame.active.every(id=>frame.nodes.some(n=>n.id===id)),`${label}: unknown active node`)
        framesChecked++
      }
      const last = frames.at(-1)
      assert.equal(last.done,true,`${label}: missing completion`)
      let result
      if (folder === 'invert-binary-tree' || folder === 'sorted-array-to-bst') result=encode(last.nodes,last.root)
      else if (folder === 'symmetric-tree' || folder === 'validate-bst') result=last.variables.find(([name])=>name==='答案')[1]
      else if (folder === 'diameter-binary-tree') result=last.variables.find(([name])=>name==='ans（边数）')[1]
      else result=JSON.stringify(last.rows.find(row=>row.label==='ans：已完成的层'||row.label==='ans').items.map(value=>JSON.parse(value)))
      if (folder === 'sorted-array-to-bst') {
        assert.deepEqual(inorder(last.nodes,last.root),scenario.input,label)
        height(last.nodes,last.root)
      } else assert.equal(result,expected(folder,scenario.input),label)
      // Rebuilding a method must not retain mutations from a previous playback.
      assert.deepEqual(lesson.makeFrames(method.id,scenario),frames,`${label}: nondeterministic replay`)
      const values=scenario.input.map(value=>value===null?'null':value).join(',')
      const arg=folder==='sorted-array-to-bst'?`new int[]{${values}}`:`build(new Integer[]{${values}})`
      let call=`new Solution().${javaMethod}(${arg})`
      if(folder==='invert-binary-tree'||folder==='sorted-array-to-bst')call=`encode(${call})`
      javaAssertions.push(`    check(String.valueOf(${call}).replace(" ", ""), ${JSON.stringify(result)}, ${JSON.stringify(label)});`)
      cases++
    }
    const source = `${method.code.map(line=>line.text).join('\n')}
class TreeNode {
  int val; TreeNode left, right;
  TreeNode(int value) { val=value; }
  TreeNode(int value, TreeNode l, TreeNode r) { val=value; left=l; right=r; }
}
class Main {
  static TreeNode build(Integer[] values) {
    if(values.length==0||values[0]==null)return null;
    TreeNode root=new TreeNode(values[0]);
    java.util.Queue<TreeNode> q=new java.util.ArrayDeque<>(); q.add(root);
    int i=1;
    while(!q.isEmpty()&&i<values.length){
      TreeNode n=q.remove();
      if(i<values.length&&values[i]!=null){n.left=new TreeNode(values[i]);q.add(n.left);} i++;
      if(i<values.length&&values[i]!=null){n.right=new TreeNode(values[i]);q.add(n.right);} i++;
    }
    return root;
  }
  static String encode(TreeNode n){return n==null?"#":n.val+"("+encode(n.left)+","+encode(n.right)+")";}
  static void check(String actual,String expected,String label){if(!actual.equals(expected))throw new AssertionError(label+": "+actual+" != "+expected);}
  public static void main(String[] args){
${javaAssertions.join('\n')}
    System.out.println("PASS ${folder}/${method.id}");
  }
}
`
    javaFiles.push({path:`.tree-java-checks/${folder}-${method.id}/Main.java`,source})
  }
}

const registry=fs.readFileSync(path.join(root,'src/problems/registry.ts'),'utf8')
const order=registry.match(/export const problems:[\s\S]*?=\s*\[([\s\S]*?)\]/)[1].match(/\w+Problem/g)
const defs=new Map()
for(const entry of fs.readdirSync(path.join(root,'src/problems'),{withFileTypes:true})){
  const file=path.join(root,'src/problems',entry.name,'definition.tsx')
  if(!entry.isDirectory()||!fs.existsSync(file))continue
  const source=fs.readFileSync(file,'utf8')
  defs.set(source.match(/export const (\w+)/)[1],Number(source.match(/number:\s*'(\d+)'/)[1]))
}
assert.equal(order.length,53)
assert.equal(new Set(order).size,53)
order.forEach((name,index)=>assert.equal(defs.get(name),index+1,`registry position for ${name}`))
const previousRegistry=execFileSync('git',['show','HEAD:src/problems/registry.ts'],{cwd:root,encoding:'utf8'})
const previousOrder=previousRegistry.match(/export const problems:[\s\S]*?=\s*\[([\s\S]*?)\]/)[1].match(/\w+Problem/g)
assert.deepEqual(order.slice(0,36),previousOrder.slice(0,36),'first 36 entries must not change')
if(process.argv.includes('--java-json'))console.log(JSON.stringify(javaFiles))
else console.log(`PASS: ${entries.length} lessons, ${javaFiles.length} Java methods, ${cases} scenarios, ${framesChecked} frames; registry 1–53 contiguous, first 36 unchanged`)

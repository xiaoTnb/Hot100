import { useMemo, useState, type CSSProperties } from 'react'
import { AlgorithmPlayer } from '../../components/player/AlgorithmPlayer'
import { usePlayback } from '../../components/player/usePlayback'
import { getPalindromeCode, makePalindromeSteps, palindromeMethods, palindromeValues, type PalindromeMethod } from './steps'
import styles from './visualizer.module.css'

export function PalindromeLinkedListVisualizer() {
  const [method, setMethod] = useState<PalindromeMethod>('recursive')
  const steps = useMemo(() => makePalindromeSteps(method), [method])
  const playback = usePlayback(steps.length, 1650), step = steps[playback.stepIndex]
  const change = (id: string) => { setMethod(id as PalindromeMethod); playback.reset() }
  const phaseIndex = method === 'recursive' ? step.phase === 'descend' || step.phase === 'start' ? 0 : 1 : step.phase === 'start' || step.phase === 'middle' ? 0 : step.phase === 'reverse' ? 1 : 2
  const phases = method === 'recursive' ? ['01 right 递到末尾', '02 归程逐对比较'] : ['01 找到中点', '02 反转后半段', '03 两端比较']
  return <AlgorithmPlayer methods={palindromeMethods} activeMethod={method} onMethodChange={change} playback={playback} code={getPalindromeCode(method)} activeLineId={step.lineId}>
    <div className="animation-canvas">
      <div className={styles.phaseRail} data-count={phases.length}>{phases.map((label, index) => <span data-active={index === phaseIndex || undefined} data-done={index < phaseIndex || undefined} key={label}><i>{index < phaseIndex ? '✓' : index + 1}</i>{label.slice(3)}</span>)}</div>
      {method === 'recursive' && <div className={styles.callStack}><b>递归栈</b><div>{step.stack.length ? step.stack.map((index) => <span key={index}>right: node {index + 1}</span>) : <em>空</em>}</div></div>}
      <div className={styles.board} data-reversed={step.reversed || undefined}>
        <div className={styles.laneLabel}>{method === 'recursive' ? 'left 向右 · right 在归程向左' : step.reversed ? '前半段 / 已反转后半段' : '原链表'}</div>
        <div className={styles.list}>{palindromeValues.map((value, index) => {
          const active = step.slow === index || step.fast === index || step.left === index || step.right === index
          return <div className={styles.nodeWrap} data-half={index > 1 ? 'right' : 'left'} data-active={active || undefined} data-compared={step.compared.includes(index) || undefined} style={{ '--slot': step.reversed && index > 1 ? 5 - index : index } as CSSProperties} key={index}>
            <div className={styles.pointers}>{step.slow === index && <span className={styles.slow}>slow</span>}{step.fast === index && <span className={styles.fast}>fast</span>}{step.left === index && <span className={styles.head}>{method === 'recursive' ? 'left' : 'head'}</span>}{step.right === index && <span className={styles.head2}>{method === 'recursive' ? 'right' : 'head2'}</span>}</div>
            <div className={styles.node}>{value}</div><small>node {index + 1}</small>
          </div>})}{[0,1,2].map((index) => <span className={styles.arrow} data-index={index} key={index}>→</span>)}</div>
      </div>
      <div className={styles.comparison} data-visible={step.phase === 'compare' || step.phase === 'done' || undefined}>{step.phase === 'done' ? <><b>TRUE</b><span>每一对节点值都相等</span></> : step.left !== null && step.right !== null && step.phase === 'compare' ? <><strong>{palindromeValues[step.left]}</strong><i>=</i><strong>{palindromeValues[step.right]}</strong><span>比较的是值，两个指针继续向中间推进</span></> : <span>{method === 'recursive' ? '先让 right 到达 null，归程才开始比较' : '反转完成后，从两段表头开始比较'}</span>}</div>
      <div className={'step-message ' + (step.phase === 'done' ? 'success' : '')}><span>{step.phase === 'done' ? <i className="check-symbol">✓</i> : String(playback.stepIndex + 1).padStart(2, '0')}</span><p>{step.message}</p></div>
    </div>
  </AlgorithmPlayer>
}

import { groupAnagramsProblem } from './group-anagrams/definition'
import { longestConsecutiveProblem } from './longest-consecutive/definition'
import { maxWaterProblem } from './max-water/definition'
import { moveZeroesProblem } from './move-zeroes/definition'
import { threeSumProblem } from './three-sum/definition'
import { trappingRainWaterProblem } from './trapping-rain-water/definition'
import { twoSumProblem } from './two-sum/definition'
import type { ProblemDefinition } from './types'

export const problems: ProblemDefinition[] = [
  twoSumProblem,
  groupAnagramsProblem,
  longestConsecutiveProblem,
  moveZeroesProblem,
  maxWaterProblem,
  threeSumProblem,
  trappingRainWaterProblem,
]

export function findProblem(slug: string | null): ProblemDefinition | undefined {
  return problems.find((problem) => problem.slug === slug)
}

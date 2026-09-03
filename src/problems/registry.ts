import { groupAnagramsProblem } from './group-anagrams/definition'
import { findAnagramsProblem } from './find-anagrams/definition'
import { longestConsecutiveProblem } from './longest-consecutive/definition'
import { longestSubstringProblem } from './longest-substring/definition'
import { maxWaterProblem } from './max-water/definition'
import { moveZeroesProblem } from './move-zeroes/definition'
import { slidingWindowMaximumProblem } from './sliding-window-maximum/definition'
import { subarraySumProblem } from './subarray-sum/definition'
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
  longestSubstringProblem,
  findAnagramsProblem,
  subarraySumProblem,
  slidingWindowMaximumProblem,
]

export function findProblem(slug: string | null): ProblemDefinition | undefined {
  return problems.find((problem) => problem.slug === slug)
}

import { groupAnagramsProblem } from './group-anagrams/definition'
import { findAnagramsProblem } from './find-anagrams/definition'
import { findFirstLastPositionProblem } from './find-first-last-position/definition'
import { findMinimumRotatedArrayProblem } from './find-minimum-rotated-array/definition'
import { longestConsecutiveProblem } from './longest-consecutive/definition'
import { longestSubstringProblem } from './longest-substring/definition'
import { maximumSubarrayProblem } from './maximum-subarray/definition'
import { mergeIntervalsProblem } from './merge-intervals/definition'
import { maxWaterProblem } from './max-water/definition'
import { minimumWindowSubstringProblem } from './minimum-window-substring/definition'
import { moveZeroesProblem } from './move-zeroes/definition'
import { productExceptSelfProblem } from './product-except-self/definition'
import { rotateArrayProblem } from './rotate-array/definition'
import { search2dMatrixProblem } from './search-2d-matrix/definition'
import { searchInsertPositionProblem } from './search-insert-position/definition'
import { searchRotatedArrayProblem } from './search-rotated-array/definition'
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
  minimumWindowSubstringProblem,
  maximumSubarrayProblem,
  mergeIntervalsProblem,
  rotateArrayProblem,
  productExceptSelfProblem,
  searchInsertPositionProblem,
  search2dMatrixProblem,
  findFirstLastPositionProblem,
  searchRotatedArrayProblem,
  findMinimumRotatedArrayProblem,
]

export function findProblem(slug: string | null): ProblemDefinition | undefined {
  return problems.find((problem) => problem.slug === slug)
}

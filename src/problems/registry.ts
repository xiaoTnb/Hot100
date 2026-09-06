import { groupAnagramsProblem } from './group-anagrams/definition'
import { addTwoNumbersProblem } from './add-two-numbers/definition'
import { copyRandomListProblem } from './copy-random-list/definition'
import { decodeStringProblem } from './decode-string/definition'
import { dailyTemperaturesProblem } from './daily-temperatures/definition'
import { intersectionLinkedListProblem } from './intersection-linked-list/definition'
import { findAnagramsProblem } from './find-anagrams/definition'
import { findFirstLastPositionProblem } from './find-first-last-position/definition'
import { findMinimumRotatedArrayProblem } from './find-minimum-rotated-array/definition'
import { longestConsecutiveProblem } from './longest-consecutive/definition'
import { longestSubstringProblem } from './longest-substring/definition'
import { lruCacheProblem } from './lru-cache/definition'
import { linkedListCycleProblem } from './linked-list-cycle/definition'
import { linkedListCycleIIProblem } from './linked-list-cycle-ii/definition'
import { maximumSubarrayProblem } from './maximum-subarray/definition'
import { mergeIntervalsProblem } from './merge-intervals/definition'
import { mergeTwoSortedListsProblem } from './merge-two-sorted-lists/definition'
import { minStackProblem } from './min-stack/definition'
import { maxWaterProblem } from './max-water/definition'
import { minimumWindowSubstringProblem } from './minimum-window-substring/definition'
import { moveZeroesProblem } from './move-zeroes/definition'
import { palindromeLinkedListProblem } from './palindrome-linked-list/definition'
import { productExceptSelfProblem } from './product-except-self/definition'
import { removeNthNodeProblem } from './remove-nth-node/definition'
import { rotateArrayProblem } from './rotate-array/definition'
import { search2dMatrixProblem } from './search-2d-matrix/definition'
import { searchInsertPositionProblem } from './search-insert-position/definition'
import { searchRotatedArrayProblem } from './search-rotated-array/definition'
import { slidingWindowMaximumProblem } from './sliding-window-maximum/definition'
import { sortListProblem } from './sort-list/definition'
import { subarraySumProblem } from './subarray-sum/definition'
import { swapNodesInPairsProblem } from './swap-nodes-in-pairs/definition'
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
  intersectionLinkedListProblem,
  palindromeLinkedListProblem,
  linkedListCycleProblem,
  linkedListCycleIIProblem,
  mergeTwoSortedListsProblem,
  addTwoNumbersProblem,
  removeNthNodeProblem,
  swapNodesInPairsProblem,
  copyRandomListProblem,
  sortListProblem,
  lruCacheProblem,
  minStackProblem,
  decodeStringProblem,
  dailyTemperaturesProblem,
]

export function findProblem(slug: string | null): ProblemDefinition | undefined {
  return problems.find((problem) => problem.slug === slug)
}

"""
# == == == == == == == == == == == == == == == == == == == == == =
#
# Given an array nums and a target value k, find the maximum length of a subarray that sums to k. If there isn't one, return 0 instead.
#
# Note:
# The sum of the entire nums array is guaranteed to fit within the 32-bit signed integer range.
#
# Example 1:
#
# Input: nums = [1, -1, 5, -2, 3], k = 3
# Output: 4
# Explanation: The subarray [1, -1, 5, -2] sums to 3 and is the longest.
#
# Example 2:
#
# Input: nums = [-2, -1, 2, 1], k = 1
# Output: 2
# Explanation: The subarray [-1, 2] sums to 1 and is the longest.
# == == == == == == == == == == == == == == == == == == == == == =

"""

# time complexity  = O(n)

arr = [1, -1, 5, -2, 3] 

sum(arr[i:j])

1. [5, -2], 2. [1, -1, 5, -2] [3]

pre = [1 , 0, 5, 3, 6]

pre[2] = sum(arr[0:2])

sum(arr[i:j]) = pre[j] - pre[i - 1]
 

{
0: 1
1: -1
2: 5
3: -2
4 : 3 
}




POST [ 6 , 5 , 6 ,1, 3]

 
~    ~
3



for num in nums: 
  [1, -1, 5, -2]



https://leetcode.com/problems/maximum-subarray/
class Solution:
    def maxSubArrayLen(self, nums: List[int], k: int) -> int:


        hm = {0 : -1} ### important initialzation for length ###
        max_len = running_sum = 0

         [1, -1, 5, -2]
        for right, n in enumerate(nums):
            running_sum += n


            if (running_sum - k) in hm:
                left = hm[running_sum - k]
                max_len = max(max_len, right - left)


            hm.setdefault(running_sum, right) # only record first position to get max_len


        return max_len















3
3-1 -1 = 2 





[1, -1, 5, -2]

[-2, -1, 2, 1]


[-2, -1, 2, 1, 1]

[-2, -1, 2, 1, 1, 5, 6, 7] 1


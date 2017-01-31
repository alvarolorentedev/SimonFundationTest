using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

class Solution {
    /*
 * Complete the function below.
 */
    static int iterativeRatings(int[] ratings){
        int solution = 0;
        int index = 0;
        while (index < ratings.Length)
        {
            int current = ratings[index];
            int next =  index < ratings.Length-1 ? ratings[index+1] : 0;
            int secondNext = index < ratings.Length-2 ? ratings[index+2] : 0;
            if(current >=0 || current + secondNext >= next + secondNext){
                solution += current;
                ++index;
            }
            else{
                solution += next;
                index += 2;
            }
        }
        return solution;
    }
 
    static int recursiveRatings(int[] ratings, int index, int maximum, bool isLastTaken){
        if(ratings.Length <= index)
            return maximum;
        int currentValue = ratings[index];
        int nextIndex = ++index;
        int notTaken = Int32.MinValue;
        int taken = Int32.MinValue;
        taken = recursiveRatings(ratings, nextIndex, maximum + currentValue, true);

        if (isLastTaken)
            notTaken = recursiveRatings(ratings, nextIndex, maximum, false);
            
        return taken > notTaken ? taken : notTaken;
    }
 
    static int maximizeRatings(int[] ratings) {
        //return recursiveRatings(ratings, 0, 0, true);
        return iterativeRatings(ratings);
    }

    static void Main(String[] args) {
        string fileName = System.Environment.GetEnvironmentVariable("OUTPUT_PATH");
        TextWriter tw = new StreamWriter(@fileName, true);
        int res;
        
        int _ratings_size = 0;
        _ratings_size = Convert.ToInt32(Console.ReadLine());
        int[] _ratings = new int [_ratings_size];
        int _ratings_item;
        for(int _ratings_i = 0; _ratings_i < _ratings_size; _ratings_i++) {
            _ratings_item = Convert.ToInt32(Console.ReadLine());
            _ratings[_ratings_i] = _ratings_item;
        }
        
        res = maximizeRatings(_ratings);
        tw.WriteLine(res);
        
        tw.Flush();
        tw.Close();
    }
}
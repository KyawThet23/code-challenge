function sum_to_n_a(n: number): number {

    // I am using a for loop to calculate the summation to n.
    // Big O notation of this method is O(n) because we are iterating through all the numbers from 1 to n to calculate the sum.

    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
}

function sum_to_n_b(n: number): number {

    // I am using the formula n(n+1)/2 to calculate the summation to n.
    // Big O notation of this method is O(1) because we are using a constant time operation to calculate the sum.

    return (n * (n + 1)) / 2;
}

function sum_to_n_c(n: number): number {

    // I am using recursion method to calculate the summation to n.
    // Big O notation of this method is O(n) because we are calling the function n times until we reach the base case. 

    if (n === 1) {
        return 1;
    }
    return n + sum_to_n_c(n - 1);
}

export { sum_to_n_a, sum_to_n_b, sum_to_n_c };
let arr1 = [1, 2, 3, 4, 5];

function mapNew(arr, fn) {
    let newArr = [];
    for (let i = 0; i < arr.length; i++) {
        newArr.push(
            fn(arr[i])
        );
    }
    return newArr;
}

function multiplyBy2(num) {
    return num * 2;
}

function multiplyByN(n, item) {
    return item * n;
}

arr2 = mapNew(arr1, multiplyByN.bind(this, 4));
console.log(arr2);
const m = Math;
const pi = m.PI;
const sin = m.sin;
const cos = m.cos;
const tan = m.tan;
const sqrt = m.sqrt;

var stdin = process.openStdin();

stdin.addListener("data", function(d) {
    // note:  d is an object, and when converted to a string it will
    // end with a linefeed.  so we (rather crudely) account for that  
    // with toString() and then trim()
    let raw =  d.toString().trim();
    let e = "";
    let f = "";
    for(let b of raw){
        if(f === b && b >= "a" && b <= "z") {
            e += "*";
        }
        if(f >= "0" && f <= "9" && b >= "a" && b <= "z") {
            e += "*";
        }
        e += b;
        f = b;
    }
    try {
        value = eval(e);
    } catch(error) {
        console.log(error.message);
    }
    console.log(e, " = ", value);
});
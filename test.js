

function test() {
    return new Promise(resolve => { 
        setTimeout(() => {
            console.log(2)
            resolve();
        }, 1000);
    });
}



function warten() {
    console.log(1)
    test().then(() => {
        console.log(3)
    })
}

warten()



























// function test1(){
//     setTimeout(() => {
//         console.log('2')
//     }, 1000);
// }


// console.log('1');
// test1();
// console.log('3');

// asdssadsadasdsd

// async function yolo() {
//     const t1 = console.log('a1'); 
//     const t2 = 'a'+test1();
//     const t3 = console.log('a3');
    

//     await Promise.all([t1, t2, t3]);
// }
// yolo();
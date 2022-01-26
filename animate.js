let canvas = new fabric.Canvas('canvas', {
    width: 800,
    height: 800,
    backgroundColor: '#181a1b',
});

const resetBtn = document.querySelector('#reset');

resetBtn.addEventListener('click', animate)

function animate() {
    rect.animate('left', rect.left === 100 ? 400 : 100, {
        duration: 1000,
        onChange: canvas.renderAll.bind(canvas),
        easing: fabric.util.ease.easeOutBounce
    });
}

let rect = new fabric.Rect({
    top: 100,
    left: 100,
    width: 50,
    height: 50,
})
canvas.add(rect)
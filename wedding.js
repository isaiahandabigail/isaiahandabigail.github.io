const N_IMG = 60;
const background = "#ae98ae"
var CENTER_IDX = 0;

function fixDpi(canvas) {
    const dpi = window.devicePixelRatio;
    const styles = window.getComputedStyle(canvas);

    // create a style object that returns width and height
    const style = {
      height() {
        return +styles.height.slice(0, -2);
      },
      width() {
        return +styles.width.slice(0, -2);
      }
    };

    // set the correct canvas attributes for device dpi
    canvas.setAttribute('width', (style.width() * dpi).toString());
    canvas.setAttribute('height', (style.height() * dpi).toString());
}

// Stolen from
// https://stackoverflow.com/questions/36372692/image-manipulation-add-image-with-corners-in-exact-positions
function render(canvas, ctx, corners, img) {
    var p1, p2, p3, p4, y1c, y2c, y1n, y2n,
    w = img.width - 1,         // -1 to give room for the "next" points
    h = img.height - 1;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(y = 0; y < h; y += WARP_REZ) {
        for(x = 0; x < w; x += WARP_REZ) {
        y1c = lerp(corners[0], corners[3],  y / h);
        y2c = lerp(corners[1], corners[2],  y / h);
        y1n = lerp(corners[0], corners[3], (y + WARP_REZ) / h);
        y2n = lerp(corners[1], corners[2], (y + WARP_REZ) / h);

        // corners of the new sub-divided cell p1 (ul) -> p2 (ur) -> p3 (br) -> p4 (bl)
        p1 = lerp(y1c, y2c,  x / w);
        p2 = lerp(y1c, y2c, (x + WARP_REZ) / w);
        p3 = lerp(y1n, y2n, (x + WARP_REZ) / w);
        p4 = lerp(y1n, y2n,  x / w);

        ctx.drawImage(img, x, y, WARP_REZ, WARP_REZ,  p1.x, p1.y, // get most coverage for w/h:
            Math.ceil(Math.max(WARP_REZ, Math.abs(p2.x - p1.x), Math.abs(p4.x - p3.x))) + 1,
            Math.ceil(Math.max(WARP_REZ, Math.abs(p1.y - p4.y), Math.abs(p2.y - p3.y))) + 1)
        }
    }
}

function lerp(p1, p2, t) {
return {
    x: p1.x + (p2.x - p1.x) * t,
    y: p1.y + (p2.y - p1.y) * t}
}
// </stolen-code>


/* This looks cool, but it's really computationally heavy */
function setLeftWarp(canvas, ctx, idx) {
    ctx.fillStyle = background;

    // Trapazoid
    let corners = [
        {"x": 0, "y": (1/3)*canvas.height},
        {"x": (1/4)*canvas.width, "y": (1/6)*canvas.height},
        {"x": (1/4)*canvas.width, "y": (5/6)*canvas.height},
        {"x": 0, "y": (2/3)*canvas.height},
    ];

    let img = new Image();
    img.src = 'img/wedding/' + idx + '.jpg'

    img.onload = function () {
        render(canvas, ctx, corners, this);
    };
}

function setImg(idx, id) {
    idx += 30; 
    idx %= N_IMG; 

    const img = document.getElementById(id);
    img.src = 'img/wedding/' + idx + '.jpg';
}

function setNum(idx) {
    const input = document.getElementById("imgNumber");
    input.value = idx;
}

function cycleRight() {
    CENTER_IDX += 1;
    CENTER_IDX %= N_IMG
    setPhotos();
}

function cycleLeft() {
    CENTER_IDX += N_IMG-1
    CENTER_IDX %= N_IMG
    setPhotos();
}

function setPhotos() {
    CENTER_IDX = Math.floor(CENTER_IDX);

    //setImg((CENTER_IDX-1+N_IMG) % N_IMG, 'left');
    setImg(CENTER_IDX, 'center');
    //setImg((CENTER_IDX+1) % N_IMG, 'right');

    setNum(CENTER_IDX);
}

function isInt(str) {
    str = str.trim();
    if (!str) {
        return false;
    }
    str = str.replace(/^0+/, "") || "0";
    var n = Math.floor(Number(str));
    return n !== Infinity && String(n) === str && n >= 0;
}

function jumpTo() {
    let idx = document.getElementById('imgNumber').value;
    if (CENTER_IDX == idx) {
        return;
    }

    if (!isInt(idx)){
        if (idx == "easter egg") {
            alert("Congrats! You found the secret message :)");
        } else {
            alert("Please enter a number from 0-59");
        }
        return;
    } else if (idx < 0 || idx > 59) {
        alert("Please enter a number from 0-59");
        return;
    }

    CENTER_IDX = idx;
    setPhotos();
}

function setup() {
    //setImg(49, 'left');
    setImg(0, 'center');
    //setImg(1, 'right');

    // Listener for enter in textbox
    document.onkeydown=function(evt){
        var keyCode = evt ? (evt.which ? evt.which : evt.keyCode) : event.keyCode;
        if(keyCode == 13)
        {
            jumpTo();
        }
    }
}
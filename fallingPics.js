// All file names are /img/{i}.jpg for i in 0-49
const N_PHOTOS = 60;
const LINGER = 1;
const N_PHOTO_BOXES = 3;
const MV_SPEED = 50;

var MV_RATES = Array(N_PHOTOS);
var IMG_COORDS = Array(N_PHOTOS);
var IMG_IDXS = Array(N_PHOTOS);

for (var i=0; i<N_PHOTOS; i++) {
    MV_RATES[i] = Math.floor(Math.random()*MV_SPEED);
}

for (var i=0; i<N_PHOTOS; i++) {
    IMG_IDXS[i] = -1;
}

function select_random_photo(i) {
    let idx = Math.floor(Math.random()*N_PHOTOS)
    for (var j=0; j<N_PHOTOS; j++) {
        if (i != j) {
            // If this idx is the same as some other one, try again
            if (idx == IMG_IDXS[j]) {
                return select_random_photo()
            }
        }
    }

    let photo_str = "img/wedding/" + idx + ".jpg"
    return photo_str
}

/* Converts from uniform distro (Math.random()) to Gaussian */
function box_muller_transform(mean, std) {
    const u = 1 - Math.random();
    const v = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos( 2.0 * Math.PI * v);

    return z * std + mean
}

function get_new_coords(i) {
    x = Math.abs(box_muller_transform(25, 5));
    y = box_muller_transform(10, 10);

    // Decide if left or right
    if (Math.random() > 0.5) {
        x += 50;
    }

    // Decide if top or bottom 
    if (Math.random() > 0.5) {
        y += 400; 
    }

    return [x,y];
}

function moveCycle(el, i) {
    var then = Date.now();
    var now;

    var mv_down = function () {
        now = Date.now();
        if (now - then > MV_RATES[i]) {
            el.style.top = parseInt(el.style.top) + 1;
            then = now;
        }
        requestAnimationFrame(mv_down);
    }

    mv_down();
}

function fadeCycle(el,i) {
    var tickout = function () {
        el.style.opacity = el.style.opacity - 0.01;
        el.style.top = parseInt(el.style.top);// + fall_rate;

        if (el.style.opacity > 0) {
            requestAnimationFrame(tickout)
        }
        else {
            el.src = select_random_photo();
            el.style.opacity -= Math.random();

            left_top = get_new_coords(i);

            el.style.left = String(left_top[0]) + '%';
            el.style.top = String(left_top[1]) + '%';
            //console.log("Top ", el.style.top, "Left", el.style.left);

            MV_RATES[i] = Math.floor(Math.random()*MV_SPEED);
            tickin(i);
        }
    };

    var tickin = function () {
        el.style.opacity = +el.style.opacity + 0.01;
        el.style.top = parseInt(el.style.top);// + fall_rate;

        if (el.style.opacity < 1) {
            requestAnimationFrame(tickin)
        }
        else {
            el.style.opacity = 1; // Hacky way to make it stay alive
            tickout();
        }
    };

    tickin();
}

function photo_cycle() {
    const container = document.getElementById("photobox");

    for (var i=0; i<N_PHOTO_BOXES; i++) {
        setTimeout(
            function() {
                let img = document.createElement('img')
                img.className = 'falling-pics';
                container.append(img);

                img.src = select_random_photo(i);
                left_top = get_new_coords(i);

                img.style.left = String(left_top[0]) + "%";
                img.style.top = String(left_top[1]) + "%";

                img.style.opacity = 0 - Math.random()
                fadeCycle(img,i);
                moveCycle(img,i);
            }, 1000*i
        );
    }
}
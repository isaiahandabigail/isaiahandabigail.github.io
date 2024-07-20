// All file names are /img/{i}.jpg for i in 0-49
const N_PHOTOS = 50;
const LINGER = 2;
const N_PHOTO_BOXES = 3;

function select_random_photo() {
    let idx = Math.floor(Math.random()*N_PHOTOS)
    let photo_str = "img/" + idx + ".jpg"
    return photo_str
}



const delay = ms => new Promise(res => setTimeout(res, ms));

function fadeCycle(el, fall_rate) {
    var tickout = function (fall_rate) {
        el.style.opacity = el.style.opacity - 0.01;
        el.style.top = parseInt(el.style.top);// + fall_rate;

        if (el.style.opacity > 0) {
            (window.requestAnimationFrame && requestAnimationFrame(tickout)) || setTimeout(tickout, 16)
        }
        else {
            el.src = select_random_photo();
            el.style.opacity -= Math.random();

            var h = window.innerHeight;
            var w = window.innerWidth;

            var top = Math.floor(Math.random() * h/4);
            var left = Math.floor(Math.random() * w/1.5);

            el.style.top = top;
            el.style.left = left;

            tickin(Math.random()*0.25);
        }
    };

    var tickin = function (fall_rate) {
        el.style.opacity = +el.style.opacity + 0.01;
        el.style.top = parseInt(el.style.top);// + fall_rate;

        if (el.style.opacity < 1) {
            (window.requestAnimationFrame && requestAnimationFrame(tickin)) || setTimeout(tickin, 16)
        }
        else {
            el.style.opacity = 1+LINGER; // Hacky way to make it stay alive
            tickout();
        }
    };

    tickin(fall_rate);
}

function photo_cycle() {
    const container = document.getElementById("photobox");
    var h = window.innerHeight;
    var w = window.innerWidth;
    var top,left;

    for (var i=0; i<N_PHOTO_BOXES; i++) {
        let img = document.createElement('img')
        img.className = 'gallery';
        container.append(img);

        img.src = select_random_photo();

        top = Math.floor(Math.random() * h/4);
        left = Math.floor(Math.random() * w/1.5);

        img.style.top = top;
        img.style.left = left;

        img.style.opacity = 0 - Math.random()
        fadeCycle(img, Math.random()*0.25);
    }
}
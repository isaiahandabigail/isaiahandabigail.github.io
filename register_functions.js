function registerRadioListeners() {
    let buttons = document.getElementsByName('pcss3t');
    
    for (let i=0; i<buttons.length; i++) {
        buttons[i].addEventListener(
            'click', function (e) {
                if (e.target.id != 'tab1') {
                    document.getElementById('info-container').style.visibility = 'hidden'; 
                } else {
                    document.getElementById('info-container').style.visibility = 'visible';
                }
            }
        ); 
    }
}

function start_everything() {
    photo_cycle(); 
    registerRadioListeners();
}
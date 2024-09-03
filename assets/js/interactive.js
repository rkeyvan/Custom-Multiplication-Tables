/******************************************************************************
* file: interactive.js
*******************************************************************************

* Description:
*   The script only adds or removes classes to the three buttons displayed to the user.
*   These classes are toggled on or off and only serve as visual changes for
*   "My device", "Server", and "Reset" buttons.
*   
*
******************************************************************************/
window.addEventListener("load", function(){
    
    let myDevice = document.getElementById('famtLabelJS');
    let yourServer = document.getElementById('famtLabelPHP');
    let famtInputReset = document.getElementById('famtInputReset');

    myDevice.addEventListener('click', function(ev){
        ev.stopPropagation();
        ev.preventDefault();
        let input = document.getElementById('myDevice');
        if(input.checked === false){
            ev.currentTarget.classList.toggle('js-rdo');
            yourServer.classList.toggle('php-rdo');
            input.checked = true;
        }
    });
    yourServer.addEventListener('click', function(ev){
        ev.stopPropagation();
        ev.preventDefault();
        let input = document.getElementById('yourServer');
        if(input.checked === false){
            myDevice.classList.toggle('js-rdo');
            ev.currentTarget.classList.toggle('php-rdo');
            input.checked = true;
        }
    });
    famtInputReset.addEventListener('click', function(ev){
        myDevice.classList.add('js-rdo');
        yourServer.classList.remove('php-rdo');
    });
});

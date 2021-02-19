/* global windowControl:false mos:false init:false */
'use strict';
mos.mos();

// code here

document.querySelector('#app_max').addEventListener('click', windowControl.maximize);
document.querySelector('#app_min').addEventListener('click', windowControl.minimize);
document.querySelector('#app_close').addEventListener('click', windowControl.close);
window.setTimeout(init.completed, 1000);

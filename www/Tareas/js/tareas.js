window.onload = function () {
    console.log(window.innerHeight-30);
    var valor="height: "+(window.innerHeight-250)+"px;";
    console.log(valor);
    document.getElementById("tabla").setAttribute("style",valor);

}
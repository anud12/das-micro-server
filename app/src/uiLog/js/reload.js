const interval = document.currentScript.getAttribute("interval");
if(!Number.isNaN(Number(interval))) {
    setTimeout(() => location.reload(), interval);
}

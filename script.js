
function actdok(d)
{
    var myDiv = document.getElementById("dokval");
    d=1/d;
    myDiv.value = d;
}

function setdok(d)
{
    var myDiv = document.getElementById("dokl");
    d=1/d;
    myDiv.value = d;
}

function oblcal()
{
    var a = parseFloat(document.getElementById('aval').value);
    var b = parseFloat(document.getElementById('bval').value);
    if(a>=b)
    {
        alert("Niepoprawne Dane");
        return;
    }
    var d = parseFloat(document.getElementById('dokl').value);
    d=(b-a)/d;
    var func = document.getElementById('funkcja').value;
    func=func.replaceAll("^","**");
    func=func.replaceAll("log(","Math.log(");
    func=func.replaceAll("-","-1*");

    var x=a;
    var sum=eval(func);
    x=b;
    sum+=eval(func)
    for (x = a+d; x < b; x += d)
    {
        sum+=2*eval(func);
    }
    sum=sum*(d/2);
    var myDiv = document.getElementById("calval");
    myDiv.innerHTML =sum.toFixed(8).toString();
}

function drow() {
    var myDiv = document.getElementById("wykres");
    myDiv.innerHTML = "<canvas id='canvas'></canvas>";

    var canvas = document.getElementById("canvas");
    clear_canvas(canvas);

    canvas.width = 0.95 * window.innerWidth;
    canvas.height = window.innerHeight;
    var a = parseFloat(document.getElementById('aval').value);
    var b = parseFloat(document.getElementById('bval').value);
    if(a>=b)
    {
        alert("Niepoprawne Dane");
        return;
    }
    var d = parseFloat(document.getElementById('dokl').value);
    d=(b-a)/(d);
    var func = document.getElementById('funkcja').value;
    func=func.replaceAll("^","**");
    func=func.replaceAll("log(","Math.log(");
    func=func.replaceAll("sin(","Math.sin(");
    func=func.replaceAll("cos(","Math.cos(");
    func=func.replaceAll("-","-1*");

    var w = 0.9 * canvas.width;
    var h = 0.9 * canvas.height;

    var x = a;
    var val = eval(func);
    var max = val;
    var min = val;
    for (x = a; x <= b; x += d) {
        val = eval(func);
        if (val < min)
            min = val;
        if (val > max)
            max = val;
    }
    x = b;
    val = eval(func);
    if (val < min)
        min = val;
    if (val > max)
        max = val;
    // console.log(min, max);

    var temp = Math.abs(a);
    if (Math.abs(b) > temp)
        temp = Math.abs(b);
    var xmn = 0;
    while (true) {
        if (temp * 10 ** xmn < 10)
            xmn++;
        else if (temp * 10 ** xmn > 100)
            xmn--;
        else
            break;
    }
    xmn--;
    // console.log(xmn);

    var temp = Math.abs(min);
    if (Math.abs(max) > temp)
        temp = Math.abs(max);
    var ymn = 0;
    while (true) {
        if (temp * 10 ** ymn < 10)
            ymn++;
        else if (temp * 10 ** ymn > 100)
            ymn--;
        else
            break;
    }
    ymn--;
    // console.log(ymn);


    var a2 = Math.floor(a * 10 ** xmn);
    var b2 = Math.floor(b * 10 ** xmn) + 1;
    var min2 = Math.floor(min * 10 ** ymn);
    var max2 = Math.floor(max * 10 ** ymn) + 1;
    // console.log(a2, b2);
    // console.log(min2, max2);

    if (a2 > 0)
        a2 = 0;
    if (b2 < 0)
        b2 = 0;

    xl = b2 - a2;

    if (min2 > 0)
        min2 = 0;
    if (max2 < 0)
        max2 = 0;

    yl = max2 - min2;

    // console.log(a2, b2);
    // console.log(min2, max2);
    // console.log(yl, xl);
    drow_grid(canvas, xl, yl);

    drow_chart_lines(canvas, yl, xl, a2, min2, xmn, ymn);

    drow_func(canvas, func, a, a2 * 10 ** -xmn, b, b2 * 10 ** -xmn, d, min2 * 10 ** -ymn, max2 * 10 ** -ymn);
}

function drow_func(canvas, func, a, a2, b, b2, d, min, max) {
    var context = canvas.getContext("2d");
    var w = 0.9 * canvas.width;
    var h = 0.9 * canvas.height;
    var sposx = 0.05 * canvas.width;
    var sposy = 0.05 * canvas.height;

    context.beginPath();

    var hm = h / (max - min);
    var wm = w / (b2 - a2);
    // console.log(max, min);
    var x = a;
    var xp = sposx;
    var yp = sposy + h - (eval(func) - min) * hm;
    // console.log(max);
    // console.log(min);
    context.moveTo(xp, yp);
    for (x = a2; x <= b2; x += d) {
        xp = sposx + (x - a2) * wm;
        yp = sposy + h - (eval(func) - min) * hm;
        if (x >= a && x <= b)
            context.lineTo(xp, yp);
        else
            context.moveTo(xp, yp);
        // console.log(x,eval(func));
        // console.log(xp, yp);
    }

    context.lineWidth = 3;
    context.strokeStyle = '#ff0000';
    context.stroke();
}

function drow_grid(canvas, xl, yl) {
    var context = canvas.getContext("2d");
    var w = 0.9 * canvas.width;
    var h = 0.9 * canvas.height;
    var sposx = 0.05 * canvas.width;
    var sposy = 0.05 * canvas.height;
    context.beginPath();
    for (var i = 0; i <= w; i += (w / xl)) {
        context.moveTo(sposx + i, sposy + 0);
        context.lineTo(sposx + i, sposy + h);
    }
    for (var i = 0; i <= h; i += (h / yl)) {
        context.moveTo(sposx + 0, sposy + i);
        context.lineTo(sposx + w, sposy + i);
    }
    context.lineWidth = 0.4;
    context.strokeStyle = '#000000';
    context.stroke();
}

function clear_canvas(canvas) {
    var context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function drow_chart_lines(canvas, xl, yl, wmin, hmin, wmn, hmn) {
    var context = canvas.getContext("2d");
    var w = 0.9 * canvas.width;
    var h = 0.9 * canvas.height;
    var sposx = 0.05 * canvas.width;
    var sposy = 0.05 * canvas.height;
    var zpx=-wmin;
    var zpy=-hmin;
    context.beginPath();
    context.moveTo(sposx + w / yl * zpx, sposy + 0);
    context.lineTo(sposx + w / yl * zpx, sposy + h);
    context.moveTo(sposx + 0, sposy + h - h / xl * zpy);
    context.lineTo(sposx + w, sposy + h - h / xl * zpy);

    var dl = (w + h) / (yl + xl) / 10;
    context.font = Math.floor(dl).toString() + 'px serif';

    pzh=(Math.abs(hmn))*0.5*dl+1.1*dl;
    if(sposx-pzh<0)
    pzh=sposx;
    pzw=(Math.abs(wmn))*0.5*dl+1.1*dl;

    context.moveTo(sposx + w / yl * zpx, sposy + 0);
    context.lineTo(sposx + w / yl * zpx - dl, sposy + dl);
    context.moveTo(sposx + w / yl * zpx, sposy + 0);
    context.lineTo(sposx + w / yl * zpx + dl, sposy + dl);
    context.moveTo(sposx + w, sposy + h - h / xl * zpy);
    context.lineTo(sposx + w - dl, sposy + h - h / xl * zpy - dl);
    context.moveTo(sposx + w, sposy + h - h / xl * zpy);
    context.lineTo(sposx + w - dl, sposy + h - h / xl * zpy + dl);
    
    var tfw=wmn<0?0:wmn;
    var tfh=hmn<0?0:hmn;
    // console.log(tfh,tfw);

    for (var i = 0; i < yl; i++) {
        context.moveTo(sposx + i * w / yl, sposy + h - h / xl * zpy - dl);
        context.lineTo(sposx + i * w / yl, sposy + h - h / xl * zpy + dl);
        context.fillText(((wmin + i) * 10 ** -wmn).toFixed(tfw), sposx + i * w / yl - pzw, sposy + h - h / xl * zpy + dl);
    }
    context.fillText(((wmin + yl) * 10 ** -wmn).toFixed(tfw), sposx + yl * w / yl - pzw-dl, sposy + h - h / xl * zpy + dl);
    for (var i = 1; i < xl + 1; i++) {
        context.moveTo(sposx + w / yl * zpx - dl, sposy + i * h / xl);
        context.lineTo(sposx + w / yl * zpx + dl, sposy + i * h / xl);
        context.fillText(((xl + hmin - i) * 10 ** -hmn).toFixed(tfh), sposx + w / yl * zpx - pzh, sposy + i * h / xl + dl);
    }
    context.fillText(((hmin + xl) * 10 ** -hmn).toFixed(tfh), sposx + w / yl * zpx - pzh, sposy + 2 * dl);


    context.lineWidth = 4;
    context.strokeStyle = '#000000';
    context.stroke();
}

function change_tab(value)
{
    document.getElementById('content1').style.display="none";
    document.getElementById('content2').style.display="none";
    document.getElementById('content3').style.display="none";

    document.getElementById(value).style.display="block";
}
let celsius = document.getElementById("unit_switch_C").style;
let fahrenheit = document.getElementById("unit_switch_F").style;

function temp_unit_toggle_F() {
    celsius.backgroundColor = "rgb(45, 45, 55)";
    celsius.color = "rgb(195, 195, 195)";
    fahrenheit.backgroundColor = "rgb(195, 230, 230)";
    fahrenheit.color = "rgb(45, 45, 55)";
}

function temp_unit_toggle_C() {
    fahrenheit.backgroundColor = "rgb(45, 45, 55)";
    fahrenheit.color = "rgb(195, 195, 195)";
    celsius.backgroundColor = "rgb(195, 230, 230)";
    celsius.color = "rgb(45, 45, 55)";
}

function openNavigation() {
    document.getElementById("navSidebar").style.width = "250px";
    document.getElementById("mainSection").style.marginLeft = "250px";
}


$("#menu-toggle").click(function (e) {
    e.preventDefault();
    $("#wrapper").toggle();

    

    // $("#mainSection").toggle(function() {
    //     $("#mainSection").animate({
    //         marginLeft: "300px"
    //     })
    // });

    
// $("#mainSection").toggle().width(500);

    // $("#wrapper").toggleClass("toggled");
});


$(function(){
    $('.navbar-blue .navbar-collapse').on('show.bs.collapse', function(e) {
        $('.navbar-blue .navbar-collapse').not(this).collapse('hide');
    });
});
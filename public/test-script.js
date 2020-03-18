$(document).ready(function() {
    $('form').submit(function(e) {
        e.preventDefault();

        let form = $(this);
        let url = form.attr('action') + form.children('.board').val();

        let method = form.attr('method');
        console.log(form.serialize());
        $.ajax({
            type: method,
            url: url,
            data: form.serialize(),
            success: function(response) {}
        });
    });
});

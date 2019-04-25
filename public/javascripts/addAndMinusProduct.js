$(document).on('click', '#plus', function (e){
    e.preventDefault();
    
    let priceValue = parseFloat($('#priceValue').val());
    let quantity = parseFloat($('#quantity').val());
    priceValue += parseFloat($('#priceHidden').val());
    quantity += 1;

    $('#quantity').val(quantity);
    $('#priceValue').val(priceValue.toFixed(2));
    $('#total').html(quantity);
    
})

$(document).on('click', '#minus', function (e){
    e.preventDefault();    
    var priceValue = parseFloat($('#priceValue').val());
    var quantity = parseFloat($('#quantity').val());
    
    if(quantity > 1){
    priceValue -= parseFloat($('#priceHidden').val());
    quantity -= 1;
    $('#quantity').val(quantity);
    $('#priceValue').val(priceValue.toFixed(2));
    $('#total').html(quantity);
    }else{        
        $('#quantity').val(quantity);
    }
})

// $(document).on('click', '#addCart', function (e){
//     e.preventDefault();    
//     let productInCart = {
//         productName: $('#item').val(),
//         productID: $('#product_id').val(),
//         quantity: $('#quantity').val(),
//         priceValue: parseFloat($('#priceHidden').val())
//     };
    
    
    
// })
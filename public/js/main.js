function changeQuantity(cartId, productId, count) {
    $.ajax({
      url: '/user/cartQuantity',
      data: {
        cart: cartId,
        product: productId,
        count,
      },
      method: 'post',
      success: (res) => {
        // document.getElementById('quantity').innerText = Number(qty) + Number(count);
        location.reload();
        // $('#quantity').load(`${document.URL} #quantity`);
      },
    });
  }
  
  function deleteProduct(cartId, productId) {
    $.ajax({
      url: '/user/deleteProduct',
      data: {
        cart: cartId,
        product: productId,
      },
      method: 'post',
      success: () => {
        Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire(
              'Deleted!',
              'Your file has been deleted.',
              'success',
            );
          }
        }).then(() => {
          location.reload();
        });
      },
    });
  }
  Footer
  
$(document).ready(function () {
  var productList = $(".App_cardBody_1tfYc").find(".listProduct");
  var cartList = $(".App_cardBody_1tfYc").find(".cartProduct"); 

  var cartItems = localStorage.getItem("cartItems");
  if (cartItems) {
    cartItems = JSON.parse(cartItems);
  } else {
    cartItems = [];
  }
  $.ajax({
    url: "shoes.json",
    dataType: "json",
    success: function (data) {

      $.each(data.shoes, function (index, product) {
        var productElement = $("<div>").addClass("App_shopItem_3FgVU");
        var imageElement = $("<div>")
          .addClass("App_shopItemImage_341iU")
          .css("background-color", product.color)
          .append($("<img>").attr("src", product.image));
          var nameElement = $("<div>").addClass("App_shopItemName_1_FJR").text(product.name);
          var descriptionElement = $("<div>").addClass("App_shopItemDescription_1EIVK").text(product.description);
          var priceElement = $("<div>").addClass("App_shopItemPrice_2SLiG").text("$" + product.price);
          var buttonElement = $("<div>").addClass("App_shopItemButton_23FO1").html("<p>ADD TO CART</p>");
          var shopItemBottomElement = $("<div>").addClass("App_shopItemBottom_3401_")
            .append(priceElement, buttonElement); // Thêm priceElement và buttonElement vào App_shopItemBottom_3401_
          productElement.append(imageElement, nameElement, descriptionElement, shopItemBottomElement);
          productList.append(productElement);
          product.inCart=false
          console.log(product)
      });


      let btns = document.querySelectorAll(".App_shopItemButton_23FO1");
      for (let i = 0; i < btns.length; i++) {
        btns[i].addEventListener("click", function (event) {
          add(i); // Truyền ID vào hàm add
          btns[i].classList.add("App_inactive_19f0W"); // Thêm class "App_inactive_19f0W" cho button
          btns[i].innerHTML = '<div class="App_shopItemButtonCover_1bH2R"><div class="App_shopItemButtonCoverCheckIcon_18IzJ"></div></div>'; // Thay đổi nội dung của button
        });
      }

      function add(id) {
        var cartItem = $("<div>").addClass("App_cartItem_lfA9I");
        var cartItemLeft = $("<div>").addClass("App_cartItemLeft_1HqDk cartItemLeft");
        var cartItemImage = $("<div>")
          .addClass("App_cartItemImage_1rLvq cartItemImage")
          .append($("<div>").addClass("App_cartItemImageBlock_wRE4E").append($("<img>").attr("src", data.shoes[id].image)));
        cartItemLeft.append(cartItemImage);
        var cartItemRight = $("<div>").addClass("App_cartItemRight_2LNcC cartItemRight");
        var cartItemName = $("<div>").addClass("App_cartItemName_3he6M cartItemName").text(data.shoes[id].name);
        var cartItemPrice = $("<div>").addClass("App_cartItemPrice_R0sr2 cartItemPrice").text("$" + data.shoes[id].price);
        var cartItemActions = $("<div>").addClass("App_cartItemActions_13kia cartItemActions");
        var cartItemCount = $("<div>").addClass("App_cartItemCount_1GCCN cartItemCount");
        var cartItemCountButtonMinus = $("<div>").addClass("App_cartItemCountButton_Gr8VG").text("-");
        var cartItemCountNumber = $("<div>").addClass("App_cartItemCountNumber_1Evq9").text("1");
        var cartItemCountButtonPlus = $("<div>").addClass("App_cartItemCountButton_Gr8VG").text("+");
        cartItemCount.append(cartItemCountButtonMinus, cartItemCountNumber, cartItemCountButtonPlus);
        var cartItemRemove = $("<div>")
          .addClass("App_cartItemRemove_1GiLR cartItemRemove")
          .append($("<img>").attr("src", "image/trash.png"));
        cartItemActions.append(cartItemCount, cartItemRemove);
        cartItemRight.append(cartItemName, cartItemPrice, cartItemActions);
        cartItem.append(cartItemLeft, cartItemRight);
        // Xóa thông báo giỏ hàng trống (empty cart message) nếu có
        cartList.find(".App_cartEmpty_xgWCN").remove();
        // Thêm sản phẩm vào giỏ hàng
        cartList.append(cartItem);
        data.shoes[id].inCart = true;
        cartItems.push(data.shoes[id]);
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
        var price = parseFloat(data.shoes[id].price);
  if (!isNaN(price)) {
    var currentTotalText = $(".App_cardTitleAmount_17QFR").text();
    var currentTotal = parseFloat(currentTotalText.replace("$", ""));
    
    if (!isNaN(currentTotal)) {
      var newTotal = currentTotal + price;
      var newTotalText = "$" + newTotal.toFixed(2);
      $(".App_cardTitleAmount_17QFR").text(newTotalText);
    }
  }
        console.log(data.shoes[id]);

        // Thêm sự kiện click cho nút trừ (cartItemCountButtonMinus)
      cartList.on("click", ".App_cartItemCountButton_Gr8VG:first-child", function() {
        var cartItem = $(this).closest(".App_cartItem_lfA9I");
        var itemCountElement = cartItem.find(".App_cartItemCountNumber_1Evq9");
        var itemCount = parseInt(itemCountElement.text());

        if (itemCount > 1) {
          itemCount--;
          itemCountElement.text(itemCount);
        }
        var price = parseFloat(cartItem.find(".App_cartItemPrice_R0sr2").text().replace("$", ""));
        if (!isNaN(price)) {
          var currentTotalText = $(".App_cardTitleAmount_17QFR").text();
          var currentTotal = parseFloat(currentTotalText.replace("$", ""));

          if (!isNaN(currentTotal)) {
            var newTotal = currentTotal - price;
            var newTotalText = "$" + newTotal.toFixed(2);
            $(".App_cardTitleAmount_17QFR").text(newTotalText);
          }
        }
      });

      // Thêm sự kiện click cho nút cộng (cartItemCountButtonPlus)
cartList.on("click", ".App_cartItemCountButton_Gr8VG:last-child", function() {
  var cartItem = $(this).closest(".App_cartItem_lfA9I");
  var itemCountElement = cartItem.find(".App_cartItemCountNumber_1Evq9");
  var itemCount = parseInt(itemCountElement.text());

  itemCount++;
  itemCountElement.text(itemCount);

  // Tính toán và cập nhật giá tiền khi số lượng sản phẩm tăng
  var price = parseFloat(cartItem.find(".App_cartItemPrice_R0sr2").text().replace("$", ""));
  if (!isNaN(price)) {
    var currentTotalText = $(".App_cardTitleAmount_17QFR").text();
    var currentTotal = parseFloat(currentTotalText.replace("$", ""));

    if (!isNaN(currentTotal)) {
      var newTotal = currentTotal + price;
      var newTotalText = "$" + newTotal.toFixed(2);
      $(".App_cardTitleAmount_17QFR").text(newTotalText);
    }
  }
});


      // Sự kiện click cho nút xóa (cartItemRemove)
      cartList.on("click", ".App_cartItemRemove_1GiLR", function () {
        var cartItem = $(this).closest(".App_cartItem_lfA9I");
        var itemCount = parseInt(cartItem.find(".App_cartItemCountNumber_1Evq9").text());
        var price = parseFloat(cartItem.find(".App_cartItemPrice_R0sr2").text().replace("$", ""));

        // Xóa sản phẩm khỏi giỏ hàng
        cartItem.remove();

        // Tính toán và cập nhật giá tiền từ sản phẩm bị xóa
        if (!isNaN(price) && !isNaN(itemCount)) {
          var currentTotalText = $(".App_cardTitleAmount_17QFR").text();
          var currentTotal = parseFloat(currentTotalText.replace("$", ""));

          if (!isNaN(currentTotal)) {
            var newTotal = currentTotal - price * itemCount;
            var newTotalText = "$" + newTotal.toFixed(2);
            $(".App_cardTitleAmount_17QFR").text(newTotalText);
          }
        }
      });
        
      }
      
    },
    error: function (xhr, textStatus, error) {
      console.log("Lỗi khi đọc file JSON: " + error);
    }
  });

  function updateCartTotal() {
    var cartItems = $(".App_cardBody_1tfYc").find(".cartProduct .App_cartItemPrice_R0sr2");
    var cartTotal = 0;
    
    cartItems.each(function() {
      var priceText = $(this).text();
      var price = parseFloat(priceText.replace("$", ""));
      
      if (!isNaN(price)) {
        cartTotal += price;
      }
    });
    
    var cartTotalText = "$" + cartTotal.toFixed(2);
    $(".App_cardTitleAmount_17QFR").text(cartTotalText);
  }
});


var kochAppMod = angular.module('kochApp', []);
kochAppMod.controller('homeController', function ($scope, $compile) {
    
    $scope.sorting = "Sort by :";
    $scope.priceFilterText = "Price Filters";
    $scope.applyText = "Apply";
    $scope.lVText = "Min: ";
    $scope.hVText = "Max: ";
    $scope.minValue = 0;
    $scope.maxValue = 10000;
    $scope.cartCounter = 0;
    $scope.sortArr = [
        "Name (Asc.)",
        "Name (Desc.)",
        "Price (HTL)",
        "Price (LTH)"
    ];
    $scope.names = angular.copy($scope.sortArr);
    var lowerSlider = document.querySelector('#lower'),
    upperSlider = document.querySelector('#upper'),
    lowerVal = parseInt(lowerSlider.value);
    upperVal = parseInt(upperSlider.value);
    $scope.minValue = lowerVal;
    $scope.maxValue = upperVal;
    $scope.productAddedToCart = [];

    $.getJSON("data/products.json", function(json) {
        $scope.productListOriginal = angular.copy(json);
        $scope.createProductList(json);
    });

    $scope.createProductList = function(json){
        $scope.finalProductList = angular.copy(json);
        if($("#productDiv").length){
            $("#productDiv").empty();
        }
        $scope.productStr = "";
        for(var i = 0;i < json.length; i++){
            $scope.productStr = $scope.productStr + "<div class='inner' style='width:30%;height:50%;float:left;margin-top:4%;margin-bottom:2%;' id=product-"+i+"><div style='text-align: center;'><img style='height: 70%; width: 90%; margin-top: 2%' src='"+ json[i].img +"'></div><div id='product"+json[i].id+"' style='margin-left: 5%;margin-top: 3%;'>"+json[i].name+"</div><div id='product-price' style='margin-left: 5%;margin-top: 2%;'>Price : "+json[i].price+"</div><div id='addCart' ng-click='addToCart("+json[i].id+")' style='margin-right: 6%;float: right;color: orange; cursor: pointer'>Add</div></div>";
        }
        $scope.htmlProductCompile = $compile($scope.productStr)($scope);
        $("#productDiv").append($scope.htmlProductCompile);
    }

    $scope.addToCart = function(index){
        $scope.productsPresent = true;
        var productAlreadyAdded = false;
        for(var i = 0; i < $scope.productAddedToCart.length; i++){
            if(index == $scope.productAddedToCart[i].id){
                productAlreadyAdded = true;
                $scope.productAddedToCart[i]['quantity'] = $scope.productAddedToCart[i]['quantity'] + 1;
            }
        }
        if(!productAlreadyAdded){
            for(var i = 0; i < $scope.finalProductList.length; i++){
                if(index == $scope.finalProductList[i].id){
                    $scope.productAddedToCart.push($scope.finalProductList[i]);
                    $scope.productAddedToCart[$scope.productAddedToCart.length - 1]['quantity'] = 1;
                }
            }
        }
        $scope.cartCounter++;
    }

    upperSlider.oninput = function () {
        lowerVal = parseInt(lowerSlider.value);
        upperVal = parseInt(upperSlider.value);

        if (upperVal < lowerVal + 900) {
            lowerSlider.value = upperVal - 900;

            if (lowerVal == lowerSlider.min) {
            upperSlider.value = 900;
            }
        }
        $scope.minValue = parseInt(lowerSlider.value);
        $scope.maxValue = parseInt(upperSlider.value);
        $scope.updateAngularBinding();
    };

    lowerSlider.oninput = function () {
        lowerVal = parseInt(lowerSlider.value);
        upperVal = parseInt(upperSlider.value);
        //logic so that upper slider value doesn't become less than lower slider value
        if (lowerVal > upperVal - 900) {
            upperSlider.value = lowerVal + 900;

            if (upperVal == upperSlider.max) {
            lowerSlider.value = parseInt(upperSlider.max) - 900;
            }

        }
        $scope.minValue = parseInt(lowerSlider.value);
        $scope.maxValue = parseInt(upperSlider.value);
        $scope.updateAngularBinding();
    };

    $scope.updateLowerValue = function(min){
        $scope.minValue = parseInt(min);
    }

    $scope.updateHigherValue = function(max){
        $scope.maxValue = parseInt(max);
    }

    $scope.filterProducts = function(){
        $scope.modProductsList = [];
        for(var i = 0; i < $scope.productListOriginal.length; i++){
            if($scope.productListOriginal[i].price >= $scope.minValue && $scope.productListOriginal[i].price <= $scope.maxValue){
                $scope.modProductsList.push($scope.productListOriginal[i]);
            }
        }
        if($scope.selectedName){
            $scope.sortProductList($scope.selectedName, $scope.modProductsList);
        }
        if(!$scope.searchFlag){
            $scope.searchText = "";
        }
        $scope.createProductList($scope.modProductsList);
    }

    $scope.sortProductList = function(i, json){
        switch(i){
            case $scope.sortArr[0]:
                if(json){
                    json.sort(function(a, b){return a.name.localeCompare(b.name)});
                }
                else{
                    $scope.finalProductList.sort(function(a, b){return a.name.localeCompare(b.name)});
                }
                break;
            
            case $scope.sortArr[1]:
                if(json){
                    json.sort(function(a, b){return b.name.localeCompare(a.name)});
                }
                else{
                    $scope.finalProductList.sort(function(a, b){return b.name.localeCompare(a.name)});
                }
                break;

            case $scope.sortArr[2]:
                if(json){
                    json.sort(function(a, b){return b.price - a.price});
                }
                else{    
                    $scope.finalProductList.sort(function(a, b){return b.price - a.price});
                }
                break;

            case $scope.sortArr[3]:
                if(json){
                    json.sort(function(a, b){return a.price - b.price});
                }
                else{    
                    $scope.finalProductList.sort(function(a, b){return a.price - b.price});
                }
                break;

            case null:
                $scope.filterProducts();
                return;
        }
        $scope.createProductList($scope.finalProductList);
    }

    $scope.searchProduct = function(entry){
        $scope.searchFlag = true;
        $scope.filterProducts();
        $scope.searchFlag = false;
        if(entry){
            $scope.searchedProductJson = [];
            for(var i = 0; i < $scope.finalProductList.length; i++){
                if($scope.finalProductList[i].name.toLowerCase().indexOf(entry.toLowerCase())>=0){
                    $scope.searchedProductJson.push($scope.finalProductList[i]);
                }
            }
            $scope.createProductList($scope.searchedProductJson);
        }
    }

    $scope.increaseProductCount = function(productId){
        for(var i = 0; i < $scope.productAddedToCart.length; i++){
            if($scope.productAddedToCart[i].id == productId){
                $scope.productAddedToCart[i].quantity++;
            }
        }
        $scope.cartCounter++;
        $scope.showCheckoutPage();
    }

    $scope.decreaseProductCount = function(productId){
        for(var i = 0; i < $scope.productAddedToCart.length; i++){
            if($scope.productAddedToCart[i].id == productId){
                if(!($scope.productAddedToCart[i].quantity>1)){
                    $scope.productAddedToCart[i].quantity--;
                    $scope.productAddedToCart.splice(i, 1);
                    i--;
                }else{
                    $scope.productAddedToCart[i].quantity--;
                }
                
            }
        }
        $scope.cartCounter--;
        $scope.showCheckoutPage();
    }


    $scope.showCheckoutPage = function(){
        $scope.checkoutPage = true;
        $scope.totalCost = 0;
        if($("#checkoutProductList").length){
            $("#checkoutProductList").empty();
        }

        if($("#billingInfo").length){
            $("#billingInfo").empty();
        }
        if($scope.productAddedToCart.length){
            $scope.productCheckoutStr = "";
            for(var i = 0;i < $scope.productAddedToCart.length; i++){
                $scope.productCheckoutStr = $scope.productCheckoutStr + "<div id = product-"+$scope.productAddedToCart[i].id+" class='product-details-class' style='float: right;margin-top: 2%;border: 1px solid orange;width: 75%; height: 10%;'><span class = 'checkoutProductName' style='overflow: hidden;position: relative;white-space: nowrap;text-overflow: ellipsis;max-width: 40%;padding: 4%;float: left;display: block;' >"+$scope.productAddedToCart[i].name+"</span><div class='productCountInfo' style='float: right;width: 50%;height: 100%;'><ul style='margin-top: 8%; text-align: center'><li class=' ion-ios-minus product-decrease' id='product-decrease-"+ $scope.productAddedToCart[i].id+"' ng-click='decreaseProductCount("+$scope.productAddedToCart[i].id+")' style='display: inline;font-size: 27px;float: left;cursor:pointer;'></li><li style='display:inline-block;margin-top: 2%;'>"+$scope.productAddedToCart[i].quantity+"</li><li class='icon icon ion-android-add-circle' ng-click='increaseProductCount("+$scope.productAddedToCart[i].id+")' style='display: inline;margin-right: 15%;font-size:27px;float:right; cursor: pointer;'></li></ul></div></div>";
                $scope.totalCost = $scope.totalCost + ($scope.productAddedToCart[i].price * $scope.productAddedToCart[i].quantity);
            }
            $scope.htmlProductCheckoutCompile = $compile($scope.productCheckoutStr)($scope);
            $("#checkoutProductList").append($scope.htmlProductCheckoutCompile);

            $scope.subTotalCost = $scope.totalCost - ($scope.totalCost/10);


            
            $scope.productBillStr = "<div style='height: 50%;overflow: auto;margin-top: 3%;'><table id='productBillingList' style='font-family: &quot;Trebuchet MS&quot;, Arial, Helvetica, sans-serif;border-collapse: collapse;width: 100%;'><tbody><tr>";
            for(var i = 0;i < $scope.productAddedToCart.length; i++){
                $scope.productBillStr = $scope.productBillStr + "<td style='padding: 8px;max-width:70px;text-overflow:ellipsis;overflow: hidden;white-space:nowrap;'>"+$scope.productAddedToCart[i].name+"</td><td style='padding: 8px;max-width:70px;text-overflow:ellipsis;overflow: hidden;white-space:nowrap;'>* "+$scope.productAddedToCart[i].quantity+"</td><td style='padding: 8px;max-width:70px;text-overflow:ellipsis;overflow: hidden;white-space:nowrap;'>: "+($scope.productAddedToCart[i].price)*($scope.productAddedToCart[i].quantity)+"</td></tr>";
            }
            $scope.productBillStr = $scope.productBillStr + "</tbody></table></div><div id='totalCostInfo' style='height: 33%;overflow: auto;margin-top: 5%;'><table id='customers2' style='font-family: &quot;Trebuchet MS&quot;, Arial, Helvetica, sans-serif;border-collapse: collapse;width: 100%;'><tbody><tr style='padding: 8px;max-width: 70px;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;'><td style='padding: 8px;max-width: 70px;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;width: 61%;'>Total</td><td style='padding: 8px;max-width: 70px;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;'>: "+$scope.totalCost+"</td></tr><tr style='padding: 8px;max-width: 70px;text-overflow: ellipsis;overflow: hidden;white-space: nowrap; border-bottom:1px solid black; border-top:1px solid black;'><td style='padding: 8px;max-width: 70px;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;width: 61%;'>Discount</td><td style='padding: 8px;max-width: 70px;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;'>: 10%</td></tr><tr style='padding: 8px;max-width: 70px;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;'><td style= 'padding: 8px;max-width: 70px;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;width: 61%;'>SUB TOTAL</td><td style='padding: 8px;max-width: 70px;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;'>: "+$scope.subTotalCost+"</td></tr></tbody></table></div>";
            $scope.htmlProductCheckoutBillCompile = $compile($scope.productBillStr)($scope);
            $("#billingInfo").append($scope.htmlProductCheckoutBillCompile);
        }
        else{
            $scope.productsPresent = false;
        }
        
        
    }

    $scope.displayEmptyProductMessage = function(){
        if(!$scope.productAddedToCart.length && $scope.checkoutPage){
            $("#noProductsId").addClass("noProductsSelected");
            return true;
        }
        return false;
    }

    $scope.showSearchField = function(){
        $scope.searchField = !$scope.searchField;
    }

    $scope.navigateToProductList = function(){
        $scope.checkoutPage = !$scope.checkoutPage;
    }

    $scope.showAlert = function(){
        var alertStr = "Congratulations! You have bought ";
        for(var i = 0;i < $scope.productAddedToCart.length; i++){
            alertStr = alertStr + $scope.productAddedToCart[i].quantity + " " + $scope.productAddedToCart[i].name;
            if(i != $scope.productAddedToCart.length -1){
                alertStr = alertStr  + " , ";
            }
        }
        alert(alertStr);
    }

    $scope.updateAngularBinding = function(){
        $scope.$apply();
    }
});

